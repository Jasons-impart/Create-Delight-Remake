#!/usr/bin/env python3
"""Package TACZ gun-pack directories into root-content ZIPs and write Packwiz metadata.

Python 3.11+ stdlib port of the former update-tacz-packwiz-meta.ps1 implementation.
Keep CLI names/aliases, messages, and exit codes aligned with that script.
"""
from __future__ import annotations

import argparse
import hashlib
import os
import subprocess
import sys
import zipfile
from collections.abc import Sequence
from pathlib import Path
from urllib.parse import quote

if str(Path(__file__).resolve().parent) not in sys.path:
    sys.path.insert(0, str(Path(__file__).resolve().parent))

from packwiz_common import write_utf8_no_bom


SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent


def get_raw_prefix(explicit_prefix: str | None) -> str:
    if explicit_prefix is not None and str(explicit_prefix).strip():
        return explicit_prefix.rstrip("/") + "/"

    result = subprocess.run(
        ["git", "-C", str(REPO_ROOT), "branch", "--show-current"],
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )
    branch = result.stdout.strip() if result.returncode == 0 else ""
    if not branch or branch != "main":
        branch = "main"
    escaped_branch = quote(branch, safe="/")
    return (
        "https://raw.githubusercontent.com/Jasons-impart/Create-Delight-Remake/"
        f"{escaped_branch}/packwiz-files/"
    )


def get_url_path(value: str) -> str:
    return quote(value, safe="/")


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def escape_toml_string(value: str) -> str:
    return value.replace("\\", "\\\\").replace('"', '\\"')


def zip_directory_contents(source_dir: Path, destination: Path) -> None:
    temporary_path = Path(str(destination) + ".tmp")
    if temporary_path.exists():
        temporary_path.unlink()
    destination.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(temporary_path, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for path in sorted(source_dir.rglob("*")):
            if path.is_file():
                archive.write(path, path.relative_to(source_dir).as_posix())
    temporary_path.replace(destination)


def write_pack_metadata(pack_directory: Path, payload: Path, raw_prefix: str, tacz_root: Path) -> None:
    digest = file_sha256(payload)
    filename = payload.name
    url = raw_prefix + "tacz/" + get_url_path(filename)
    metadata_path = tacz_root / f"{pack_directory.name}.pw.toml"
    content = (
        f'name = "{escape_toml_string(pack_directory.name)}"\n'
        f'filename = "{escape_toml_string(filename)}"\n'
        'side = "both"\n'
        "\n"
        "[download]\n"
        f'url = "{url}"\n'
        'hash-format = "sha256"\n'
        f'hash = "{digest}"\n'
    )
    write_utf8_no_bom(metadata_path, content)


def parse_args(argv: Sequence[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Package TACZ gun-pack directories into root-content ZIPs and write metadata."
    )
    parser.add_argument(
        "-PackwizFilesRawPrefix",
        "--packwiz-files-raw-prefix",
        dest="packwiz_files_raw_prefix",
        default=os.environ.get("PACKWIZ_FILES_RAW_PREFIX"),
    )
    parser.add_argument(
        "-SkipPackaging",
        "--skip-packaging",
        dest="skip_packaging",
        action="store_true",
    )
    return parser.parse_args(argv)


def run(args: argparse.Namespace) -> int:
    tacz_root = REPO_ROOT / "tacz"
    payload_root = REPO_ROOT / "packwiz-files" / "tacz"
    if not tacz_root.is_dir():
        raise RuntimeError(f"TACZ root does not exist: {tacz_root}")
    payload_root.mkdir(parents=True, exist_ok=True)

    pack_directories = [
        path
        for path in tacz_root.iterdir()
        if path.is_dir() and not path.name.lower().startswith(".cache")
    ]
    if not pack_directories:
        metadata_files = list(tacz_root.glob("*.pw.toml"))
        if not metadata_files:
            raise RuntimeError(f"No TACZ gun-pack directories or metadata files found under {tacz_root}.")
        print("TACZ directories are already converted; keeping existing payloads and metadata.", flush=True)
        return 0

    raw_prefix = get_raw_prefix(args.packwiz_files_raw_prefix)
    # Match Get-ChildItem order as closely as possible while remaining deterministic
    # after the name filter; PowerShell enumerates filesystem order.
    for pack_directory in pack_directories:
        payload_path = payload_root / f"{pack_directory.name}.zip"
        if not args.skip_packaging:
            zip_directory_contents(pack_directory, payload_path)
        if not payload_path.is_file():
            raise RuntimeError(f"Missing TACZ payload after packaging: {payload_path}")
        write_pack_metadata(pack_directory, payload_path, raw_prefix, tacz_root)
        print(f"Generated TACZ Packwiz metadata: {pack_directory.name}", flush=True)
    return 0


def main(argv: Sequence[str] | None = None) -> int:
    try:
        args = parse_args(argv)
        return run(args)
    except Exception as exc:  # noqa: BLE001 - match PowerShell script-terminating errors
        print(str(exc), file=sys.stderr, flush=True)
        return 1


if __name__ == "__main__":
    sys.exit(main())
