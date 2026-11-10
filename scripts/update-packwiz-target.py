#!/usr/bin/env python3
"""Update one existing CurseForge Packwiz metadata file.

Python 3.11+ stdlib port of the former update-packwiz-target.ps1 implementation.
Keep CLI names/aliases, messages, and exit codes aligned with that script.
"""
from __future__ import annotations

import argparse
import os
import re
import shutil
import subprocess
import sys
import uuid
from collections.abc import Sequence
from pathlib import Path

if str(Path(__file__).resolve().parent) not in sys.path:
    sys.path.insert(0, str(Path(__file__).resolve().parent))

from packwiz_common import (
    default_packwiz_filename,
    default_packwiz_url,
    ensure_tool,
    hidden_popen_kwargs,
    invoke_with_proxy,
    resolve_python_command,
    write_utf8_no_bom,
)


SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
GENERATE_PACKWIZ_SCRIPT = SCRIPT_DIR / "generate-packwiz-files.py"
SYNC_PACKWIZ_ASSETS_SCRIPT = SCRIPT_DIR / "sync-packwiz-assets.py"
VALID_CATEGORIES = ("mods", "resourcepacks", "shaderpacks", "tacz")
VALID_SIDES = ("both", "client", "server")
CURSEFORGE_UPDATE_SECTION = re.compile(r"(?m)^\[update\.curseforge\]\s*$")
SIDE_LINE_PATTERN = re.compile(r'(?m)^side\s*=\s*".*"$')
FILENAME_LINE_PATTERN = re.compile(r'(?m)^(filename\s*=\s*".*"\s*)$')


def write_status(message: str) -> None:
    print(f"[target-update] {message}", flush=True)


def get_relative_unix_path(root: Path, file_path: Path) -> str:
    full_root = os.path.normpath(os.path.abspath(root))
    full_path = os.path.normpath(os.path.abspath(file_path))
    root_with_slash = full_root.rstrip("\\/") + os.sep
    if os.name == "nt":
        if not full_path.lower().startswith(root_with_slash.lower()):
            raise RuntimeError(f"Path '{file_path}' is outside repo root '{root}'.")
        relative = full_path[len(root_with_slash) :]
    else:
        if not full_path.startswith(root_with_slash):
            raise RuntimeError(f"Path '{file_path}' is outside repo root '{root}'.")
        relative = full_path[len(root_with_slash) :]
    return relative.replace("\\", "/")


def get_pw_toml_value(content: str, key: str) -> str | None:
    pattern = re.compile(rf'(?m)^{re.escape(key)}\s*=\s*"([^"]*)"\s*$')
    match = pattern.search(content)
    if match:
        return match.group(1)
    return None


def normalize_pw_side(side: str | None) -> str:
    if side is None or not str(side).strip():
        return "both"
    normalized = side.strip().lower()
    if normalized in VALID_SIDES:
        return normalized
    return "both"


def set_pw_toml_side(content: str, side: str) -> str:
    side_value = normalize_pw_side(side)
    if SIDE_LINE_PATTERN.search(content):
        return SIDE_LINE_PATTERN.sub(f'side = "{side_value}"', content, count=1)
    if re.search(r"(?m)^filename\s*=", content):
        return FILENAME_LINE_PATTERN.sub(rf'\1\nside = "{side_value}"', content, count=1)
    return f'side = "{side_value}"\n{content}'


def invoke_generate_packwiz_files(output_dir: Path) -> None:
    python_exe = resolve_python_command()
    result = subprocess.run(
        [
            python_exe,
            str(GENERATE_PACKWIZ_SCRIPT),
            "--source",
            str(REPO_ROOT / "modpack.toml"),
            "--output-dir",
            str(output_dir),
        ],
        text=True,
        encoding="utf-8",
        **hidden_popen_kwargs(),
    )
    if result.returncode != 0:
        raise RuntimeError(f"generate-packwiz-files.py exited with code {result.returncode}.")


def invoke_packwiz(arguments: Sequence[str], working_directory: Path, packwiz_exe: Path, proxy: str | None) -> None:
    with invoke_with_proxy(proxy):
        result = subprocess.run(
            [str(packwiz_exe), *arguments],
            cwd=str(working_directory),
            text=True,
            encoding="utf-8",
            errors="replace",
            **hidden_popen_kwargs(),
        )
    if result.returncode != 0:
        raise RuntimeError(f"packwiz {' '.join(arguments)} exited with code {result.returncode}.")


def invoke_sync(proxy: str | None) -> None:
    python_exe = resolve_python_command()
    command = [python_exe, str(SYNC_PACKWIZ_ASSETS_SCRIPT)]
    if proxy is not None and str(proxy).strip():
        command.extend(["-Proxy", proxy])
    result = subprocess.run(command, text=True, encoding="utf-8", **hidden_popen_kwargs())
    if result.returncode != 0:
        raise RuntimeError(f"sync-packwiz-assets.py exited with code {result.returncode}.")


def resolve_target_path(args: argparse.Namespace) -> Path:
    if args.path:
        candidate = Path(args.path)
        if not candidate.is_absolute():
            candidate = REPO_ROOT / args.path
        if not candidate.is_file():
            raise RuntimeError(f"Target metadata file was not found: {candidate}")
        return candidate.resolve()

    category_root = REPO_ROOT / args.category
    candidate = category_root / args.slug
    if not str(candidate).lower().endswith(".pw.toml"):
        candidate = category_root / f"{args.slug}.pw.toml"
    if not candidate.is_file():
        raise RuntimeError(f"Target metadata file was not found: {candidate}")
    return candidate.resolve()


def parse_args(argv: Sequence[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Update one existing CurseForge Packwiz metadata file.")
    parser.add_argument(
        "-Category",
        "--category",
        dest="category",
        default="mods",
        choices=VALID_CATEGORIES,
    )
    parser.add_argument("-Slug", "--slug", dest="slug", default=None)
    parser.add_argument("-Path", "--path", dest="path", default=None)
    parser.add_argument("-PackwizUrl", "--packwiz-url", dest="packwiz_url", default=None)
    parser.add_argument(
        "-Proxy",
        "--proxy",
        dest="proxy",
        default=os.environ.get("PACKWIZ_PROXY"),
    )
    parser.add_argument("-SkipSync", "--skip-sync", dest="skip_sync", action="store_true")
    parser.add_argument("-DryRun", "--dry-run", dest="dry_run", action="store_true")
    args = parser.parse_args(argv)
    if bool(args.slug) == bool(args.path):
        raise RuntimeError("Specify either -Slug or -Path.")
    if args.packwiz_url is None:
        args.packwiz_url = default_packwiz_url()
    return args


def run(args: argparse.Namespace) -> int:
    target_path = resolve_target_path(args)
    relative_target_path = get_relative_unix_path(REPO_ROOT, target_path)
    original_content = target_path.read_text(encoding="utf-8")
    original_side = normalize_pw_side(get_pw_toml_value(original_content, "side"))
    update_slug = Path(Path(target_path.name).stem).stem

    if not CURSEFORGE_UPDATE_SECTION.search(original_content):
        raise RuntimeError(f"Target metadata is not a CurseForge-managed .pw.toml: {relative_target_path}")

    work_root = REPO_ROOT / ".cache" / "packwiz-sync" / "target-update" / uuid.uuid4().hex
    tools_root = REPO_ROOT / ".cache" / "packwiz-sync" / "tools"
    packwiz_exe = tools_root / default_packwiz_filename()
    should_sync = False
    work_root.mkdir(parents=True, exist_ok=True)
    try:
        write_status("Generating temporary packwiz pack...")
        invoke_generate_packwiz_files(work_root)

        temp_target_path = work_root / relative_target_path
        temp_target_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(target_path, temp_target_path)

        if args.dry_run:
            write_status(
                f'Dry run: would update {relative_target_path} and preserve side = "{original_side}".'
            )
            return 0

        ensure_tool(args.packwiz_url, packwiz_exe, write_status, args.proxy)

        write_status("Refreshing temporary pack...")
        invoke_packwiz(["refresh"], work_root, packwiz_exe, args.proxy)

        write_status(f"Updating {update_slug}...")
        invoke_packwiz(["update", update_slug, "--yes"], work_root, packwiz_exe, args.proxy)

        if not temp_target_path.is_file():
            raise RuntimeError(
                f"packwiz update did not leave the expected target metadata file: {relative_target_path}"
            )

        updated_content = temp_target_path.read_text(encoding="utf-8")
        updated_content = set_pw_toml_side(updated_content, original_side)
        updated_side = normalize_pw_side(get_pw_toml_value(updated_content, "side"))
        if updated_side != original_side:
            raise RuntimeError(
                f"Refusing to write {relative_target_path} because side changed from "
                f"'{original_side}' to '{updated_side}'."
            )

        write_utf8_no_bom(target_path, updated_content)
        write_status(f'Updated {relative_target_path} and preserved side = "{original_side}".')
        should_sync = True
    finally:
        if work_root.exists():
            shutil.rmtree(work_root, ignore_errors=True)

    if should_sync and not args.skip_sync:
        write_status("Syncing local Packwiz assets...")
        invoke_sync(args.proxy)
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
