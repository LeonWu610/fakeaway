#!/usr/bin/env python3
"""Generate project images through Volcengine Ark's OpenAI-compatible API."""

from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.request
from pathlib import Path

from openai import OpenAI

BASE_URL = "https://ark.cn-beijing.volces.com/api/v3"
DEFAULT_MODEL = "doubao-seedream-5-0-lite-260128"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    source = parser.add_mutually_exclusive_group(required=True)
    source.add_argument("--prompt", help="Prompt for one image")
    source.add_argument("--manifest", type=Path, help="JSON array containing prompt/output entries")
    parser.add_argument("--output", type=Path, help="Output path when using --prompt")
    parser.add_argument("--size", default="2K")
    parser.add_argument("--max-images", type=int, default=1, help="Cost guard for manifest mode")
    parser.add_argument("--overwrite", action="store_true")
    return parser.parse_args()


def download(url: str, output: Path) -> Path:
    output.parent.mkdir(parents=True, exist_ok=True)
    temporary = output.with_suffix(output.suffix + ".part")
    request = urllib.request.Request(url, headers={"User-Agent": "fakeaway-image-pipeline/1.0"})
    try:
        with urllib.request.urlopen(request, timeout=120) as response, temporary.open("wb") as target:
            target.write(response.read())
        if temporary.stat().st_size < 10_000:
            raise RuntimeError("Downloaded image is unexpectedly small")

        header = temporary.read_bytes()[:12]
        suffix = ".jpg" if header.startswith(b"\xff\xd8\xff") else ".png" if header.startswith(b"\x89PNG") else ".webp" if header[:4] == b"RIFF" and header[8:12] == b"WEBP" else output.suffix
        actual_output = output.with_suffix(suffix)
        temporary.replace(actual_output)
        return actual_output
    finally:
        temporary.unlink(missing_ok=True)


def generate(client: OpenAI, model: str, prompt: str, output: Path, size: str, overwrite: bool) -> bool:
    if output.exists() and not overwrite:
        print(f"skip existing: {output}")
        return False

    response = client.images.generate(
        model=model,
        prompt=prompt,
        size=size,
        response_format="url",
        extra_body={"output_format": "png", "watermark": False},
    )
    if not response.data or not response.data[0].url:
        raise RuntimeError("Image API returned no downloadable URL")
    actual_output = download(response.data[0].url, output)
    print(f"saved: {actual_output} ({actual_output.stat().st_size} bytes)")
    return True


def load_jobs(args: argparse.Namespace) -> list[dict[str, str]]:
    if args.prompt:
        if not args.output:
            raise ValueError("--output is required with --prompt")
        return [{"prompt": args.prompt, "output": str(args.output)}]

    jobs = json.loads(args.manifest.read_text(encoding="utf-8"))
    if not isinstance(jobs, list) or any(not isinstance(job, dict) for job in jobs):
        raise ValueError("Manifest must be a JSON array of objects")
    return jobs


def main() -> int:
    args = parse_args()
    api_key = os.environ.get("ARK_API_KEY")
    model = os.environ.get("ARK_IMAGE_MODEL", DEFAULT_MODEL)
    if not api_key:
        print("ARK_API_KEY is not set", file=sys.stderr)
        return 2
    if args.max_images < 1:
        print("--max-images must be at least 1", file=sys.stderr)
        return 2

    jobs = load_jobs(args)
    pending = 0
    for job in jobs:
        if not job.get("prompt") or not job.get("output"):
            raise ValueError("Every job requires prompt and output")
        if args.overwrite or not Path(job["output"]).exists():
            pending += 1
    if pending > args.max_images:
        print(
            f"Refusing to generate {pending} images: cost guard is {args.max_images}. "
            "Pass --max-images with the intended limit.",
            file=sys.stderr,
        )
        return 2

    client = OpenAI(base_url=BASE_URL, api_key=api_key)
    for job in jobs:
        generate(client, model, job["prompt"], Path(job["output"]), args.size, args.overwrite)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
