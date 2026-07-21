#!/usr/bin/env python3
"""Upload generated image assets to an S3-compatible R2 bucket."""

from __future__ import annotations

import argparse
import hashlib
import json
import mimetypes
import os
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from urllib.parse import quote

IMAGE_SUFFIXES = {".png", ".jpg", ".jpeg", ".webp", ".avif"}
DEFAULT_ROOT = Path("public/images")
DEFAULT_WORKERS = 12
MIN_WORKERS = 1
MAX_WORKERS = 32


def worker_count(value: str) -> int:
    try:
        workers = int(value)
    except ValueError as error:
        raise argparse.ArgumentTypeError("--workers must be an integer") from error
    if not MIN_WORKERS <= workers <= MAX_WORKERS:
        raise argparse.ArgumentTypeError(
            f"--workers must be between {MIN_WORKERS} and {MAX_WORKERS}"
        )
    return workers


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", type=Path, default=DEFAULT_ROOT)
    parser.add_argument("--prefix", default="images", help="Remote object key prefix")
    parser.add_argument("--manifest", type=Path, default=Path("scripts/r2_image_manifest.json"))
    parser.add_argument("--max-files", type=int, default=1, help="Upload cost/safety guard")
    parser.add_argument(
        "--workers",
        type=worker_count,
        default=DEFAULT_WORKERS,
        help=f"Concurrent remote operations (default: {DEFAULT_WORKERS}, range: {MIN_WORKERS}-{MAX_WORKERS})",
    )
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--overwrite", action="store_true")
    return parser.parse_args()


def required_env(name: str) -> str:
    value = os.environ.get(name)
    if not value:
        raise RuntimeError(f"{name} is not set")
    return value.rstrip("/") if name in {"R2_ENDPOINT", "R2_PUBLIC_BASE_URL"} else value


def checksum(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def discover(root: Path, prefix: str) -> list[dict[str, object]]:
    jobs = []
    for path in sorted(root.rglob("*")):
        if not path.is_file() or path.suffix.lower() not in IMAGE_SUFFIXES:
            continue
        relative = path.relative_to(root).as_posix()
        key = f"{prefix.strip('/')}/{relative}" if prefix.strip("/") else relative
        jobs.append({"path": path, "key": key, "size": path.stat().st_size, "sha256": checksum(path)})
    return jobs


def public_url(base_url: str, key: str) -> str:
    return f"{base_url}/{quote(key, safe='/')}"


def needs_upload(s3, bucket: str, job: dict[str, object], client_error: type[Exception]) -> bool:
    try:
        remote = s3.head_object(Bucket=bucket, Key=job["key"])
        return remote.get("ContentLength") != job["size"]
    except client_error as error:
        status = error.response.get("ResponseMetadata", {}).get("HTTPStatusCode")
        code = error.response.get("Error", {}).get("Code")
        if status == 404 or code in {"404", "NoSuchKey", "NotFound"}:
            return True
        raise


def upload(s3, bucket: str, job: dict[str, object]) -> str:
    content_type = mimetypes.guess_type(str(job["path"]))[0] or "application/octet-stream"
    s3.upload_file(
        str(job["path"]),
        bucket,
        job["key"],
        ExtraArgs={"ContentType": content_type, "CacheControl": "public, max-age=31536000, immutable"},
    )
    return str(job["key"])


def main() -> int:
    args = parse_args()
    if args.max_files < 1:
        print("--max-files must be at least 1", file=sys.stderr)
        return 2

    bucket = required_env("R2_BUCKET")
    endpoint = required_env("R2_ENDPOINT")
    base_url = required_env("R2_PUBLIC_BASE_URL")
    access_key = required_env("R2_ACCESS_KEY_ID")
    secret_key = required_env("R2_SECRET_ACCESS_KEY")

    from boto3 import client as boto3_client
    from botocore.config import Config
    from botocore.exceptions import ClientError

    s3 = boto3_client(
        "s3",
        endpoint_url=endpoint,
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        region_name="auto",
        config=Config(
            signature_version="s3v4",
            retries={"max_attempts": 4, "mode": "standard"},
            max_pool_connections=args.workers,
        ),
    )
    s3.head_bucket(Bucket=bucket)

    jobs = sorted(discover(args.root, args.prefix), key=lambda job: str(job["key"]))
    if args.overwrite:
        pending = jobs.copy()
    else:
        with ThreadPoolExecutor(max_workers=args.workers) as executor:
            decisions = executor.map(
                lambda job: needs_upload(s3, bucket, job, ClientError),
                jobs,
            )
            pending = [job for job, should_upload in zip(jobs, decisions) if should_upload]

    if len(pending) > args.max_files:
        print(f"Refusing to upload {len(pending)} files: safety guard is {args.max_files}.", file=sys.stderr)
        return 2

    print(f"connected: bucket={bucket}, discovered={len(jobs)}, pending={len(pending)}")
    for job in pending:
        print(f"  upload: {job['path']} -> {job['key']} ({job['size']} bytes)")
    if args.dry_run:
        return 0

    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        uploaded_keys = list(executor.map(lambda job: upload(s3, bucket, job), pending))
    for key in sorted(uploaded_keys):
        print(f"uploaded: {key}")

    records = [
        {
            "key": job["key"],
            "url": public_url(base_url, job["key"]),
            "size": job["size"],
            "sha256": job["sha256"],
        }
        for job in jobs
    ]
    args.manifest.parent.mkdir(parents=True, exist_ok=True)
    args.manifest.write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"manifest: {args.manifest} ({len(records)} objects)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
