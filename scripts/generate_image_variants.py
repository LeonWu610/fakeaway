#!/usr/bin/env python3
"""Generate responsive WebP variants for local merchant and product images."""

from __future__ import annotations

import argparse
import base64
import concurrent.futures
import re
import subprocess
import sys
import tempfile
from pathlib import Path

SOURCE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".webp"}
TARGET_SIZES = (320, 640)
DEFAULT_MAX_FILES = 500
CHROME_PATHS = (
    Path('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),
    Path('/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'),
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--overwrite", action="store_true", help="regenerate variants even when they are current")
    parser.add_argument("--dry-run", action="store_true", help="show planned work without writing files")
    parser.add_argument(
        "--max-files",
        type=int,
        default=DEFAULT_MAX_FILES,
        help=f"abort when more than this many source files are found (default: {DEFAULT_MAX_FILES})",
    )
    return parser.parse_args()


def image_dimensions(path: Path) -> tuple[int, int]:
    result = subprocess.run(
        ["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(path)],
        check=True,
        capture_output=True,
        text=True,
    )
    width_match = re.search(r"pixelWidth:\s*(\d+)", result.stdout)
    height_match = re.search(r"pixelHeight:\s*(\d+)", result.stdout)
    if not width_match or not height_match:
        raise RuntimeError(f"could not read image dimensions: {path}")
    return int(width_match.group(1)), int(height_match.group(1))


def sips_writes_webp() -> bool:
    result = subprocess.run(['sips', '--formats'], check=True, capture_output=True, text=True)
    return any('webp' in line.lower() and 'Writable' in line for line in result.stdout.splitlines())


def browser_path() -> Path | None:
    return next((path for path in CHROME_PATHS if path.exists()), None)


def encode_webp_with_browser(png_path: Path, target: Path, browser: Path) -> None:
    image_uri = png_path.as_uri()
    html = (
        '<!doctype html><meta charset="utf-8"><img id="image"><pre id="output">WAIT</pre>'
        '<script>image.onload=()=>{const canvas=document.createElement("canvas");'
        'canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;'
        'canvas.getContext("2d").drawImage(image,0,0);'
        'output.textContent=canvas.toDataURL("image/webp",.82)};'
        f'image.src={image_uri!r}</script>'
    )
    html_path = png_path.with_suffix('.html')
    html_path.write_text(html, encoding='utf-8')
    result = subprocess.run(
        [
            str(browser), '--headless', '--disable-gpu', '--no-sandbox',
            '--allow-file-access-from-files', '--virtual-time-budget=5000',
            '--dump-dom', html_path.as_uri(),
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    match = re.search(r'data:image/webp;base64,([^<]+)', result.stdout)
    if not match:
        raise RuntimeError('browser did not return WebP data')
    target.write_bytes(base64.b64decode(match.group(1)))


def generate_variant(source: Path, target: Path, size: int, direct_webp: bool, browser: Path | None) -> None:
    if direct_webp:
        subprocess.run(
            ['sips', '-s', 'format', 'webp', '-Z', str(size), str(source), '--out', str(target)],
            check=True,
            capture_output=True,
            text=True,
        )
        return

    if browser is None:
        raise RuntimeError('this macOS sips can read but not write WebP, and no supported local browser was found')
    with tempfile.TemporaryDirectory(prefix='fakeaway-variant-') as temporary_directory:
        resized_png = Path(temporary_directory) / 'resized.png'
        subprocess.run(
            ['sips', '-s', 'format', 'png', '-Z', str(size), str(source), '--out', str(resized_png)],
            check=True,
            capture_output=True,
            text=True,
        )
        encode_webp_with_browser(resized_png, target, browser)


def source_images(images_root: Path) -> list[tuple[str, Path]]:
    images: list[tuple[str, Path]] = []
    for kind in ("merchants", "products"):
        source_root = images_root / kind
        if not source_root.exists():
            continue
        for path in source_root.rglob("*"):
            if path.is_file() and path.suffix.lower() in SOURCE_EXTENSIONS and "variants-v1" not in path.parts:
                images.append((kind, path))
    return sorted(images, key=lambda entry: str(entry[1]))


def variant_path(images_root: Path, kind: str, source: Path, size: int) -> Path:
    relative = source.relative_to(images_root / kind).with_suffix(".webp")
    return images_root / "variants-v1" / str(size) / kind / relative


def main() -> int:
    args = parse_args()
    if args.max_files < 1:
        print("error: --max-files must be at least 1", file=sys.stderr)
        return 2

    project_root = Path(__file__).resolve().parent.parent
    images_root = project_root / "public" / "images"
    sources = source_images(images_root)
    if len(sources) > args.max_files:
        print(
            f"error: found {len(sources)} source files, exceeding --max-files={args.max_files}; "
            "raise the threshold explicitly after reviewing the input",
            file=sys.stderr,
        )
        return 2

    direct_webp = sips_writes_webp()
    browser = None if direct_webp else browser_path()
    if not direct_webp:
        if browser is None and not args.dry_run:
            print('error: this macOS sips cannot write WebP and no supported local browser was found', file=sys.stderr)
            return 2
        if browser is not None:
            print(f'note: sips handles resizing; {browser.parent.parent.parent.name} handles WebP encoding because this macOS marks WebP read-only')

    generated = 0
    skipped = 0
    failures = 0
    pending: list[tuple[Path, Path, int]] = []
    for kind, source in sources:
        for size in TARGET_SIZES:
            target = variant_path(images_root, kind, source, size)
            if not args.overwrite and target.exists() and target.stat().st_mtime >= source.stat().st_mtime:
                skipped += 1
                continue
            pending.append((source, target, size))

    if args.dry_run:
        for source, target, _ in pending:
            print(f"would generate {target.relative_to(project_root)} from {source.relative_to(project_root)}")
        generated = len(pending)
    else:
        def process_variant(job: tuple[Path, Path, int]) -> tuple[Path, int, int]:
            source, target, size = job
            target.parent.mkdir(parents=True, exist_ok=True)
            generate_variant(source, target, size, direct_webp, browser)
            width, height = image_dimensions(target)
            if max(width, height) > size or width < 1 or height < 1:
                raise RuntimeError(f"invalid output dimensions {width}x{height}")
            with target.open("rb") as output:
                if output.read(4) != b"RIFF":
                    raise RuntimeError("output is not a readable WebP file")
            return target, width, height

        worker_count = min(8, len(pending))
        with concurrent.futures.ThreadPoolExecutor(max_workers=worker_count) as executor:
            future_jobs = {executor.submit(process_variant, job): job for job in pending}
            for future in concurrent.futures.as_completed(future_jobs):
                source, target, _ = future_jobs[future]
                try:
                    completed_target, width, height = future.result()
                    generated += 1
                    print(f"generated {completed_target.relative_to(project_root)} ({width}x{height})", flush=True)
                except (OSError, subprocess.CalledProcessError, RuntimeError) as error:
                    failures += 1
                    target.unlink(missing_ok=True)
                    print(f"error: {source}: {error}", file=sys.stderr, flush=True)

    action = "planned" if args.dry_run else "generated"
    print(f"sources={len(sources)} {action}={generated} skipped={skipped} failures={failures}")
    return 1 if failures else 0


if __name__ == "__main__":
    raise SystemExit(main())
