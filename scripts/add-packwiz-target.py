#!/usr/bin/env python3
"""Add one known CurseForge asset to Packwiz metadata.

Python 3.11+ stdlib port of the former add-packwiz-target.ps1 implementation.
Keep CLI names/aliases, messages, and exit codes aligned with that script.
"""
from __future__ import annotations

import argparse
import os
import re
import shutil
import sys
import uuid
from collections.abc import Sequence
from pathlib import Path

if str(Path(__file__).resolve().parent) not in sys.path:
    sys.path.insert(0, str(Path(__file__).resolve().parent))

from packwiz_common import (
    default_packwiz_url,
    default_packwiz_filename,
    ensure_tool,
    hidden_popen_kwargs,
    invoke_with_proxy,
    resolve_python_command,
    write_utf8_no_bom,
)

import subprocess


SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent
GENERATE_PACKWIZ_SCRIPT = SCRIPT_DIR / "generate-packwiz-files.py"
SYNC_PACKWIZ_ASSETS_SCRIPT = SCRIPT_DIR / "sync-packwiz-assets.py"
VALID_CATEGORIES = ("mods", "resourcepacks", "shaderpacks", "tacz")
VALID_SIDES = ("both", "client", "server")
ADDED_PROJECT_PATTERN = re.compile(r'^Project ".+" successfully added! \((.+)\)$')
SIDE_LINE_PATTERN = re.compile(r'(?m)^side\s*=\s*".*"$')
FILENAME_LINE_PATTERN = re.compile(r'(?m)^(filename\s*=\s*".*"\s*)$')
FILENAME_VALUE_PATTERN = re.compile(r'(?m)^filename\s*=\s*"(.+)"\s*$')
SECTION_PATTERN = re.compile(r"^\s*\[([^]]+)\]\s*$")
LOADER_VERSION_PATTERN = re.compile(r"^\s*(forge|neoforge|fabric|quilt|liteloader)\s*=")


def write_status(message: str) -> None:
    print(f"[target-add] {message}", flush=True)


def set_pw_toml_side(content: str, side: str) -> str:
    if SIDE_LINE_PATTERN.search(content):
        return SIDE_LINE_PATTERN.sub(f'side = "{side}"', content, count=1)
    if re.search(r"(?m)^filename\s*=", content):
        return FILENAME_LINE_PATTERN.sub(rf'\1\nside = "{side}"', content, count=1)
    raise RuntimeError("packwiz metadata is missing a filename field.")


def remove_packwiz_loader_versions(pack_file_path: Path) -> None:
    lines = pack_file_path.read_text(encoding="utf-8").splitlines()
    updated: list[str] = []
    in_versions = False
    changed = False
    for line in lines:
        section = SECTION_PATTERN.match(line)
        if section:
            in_versions = section.group(1) == "versions"
            updated.append(line)
            continue
        if in_versions and LOADER_VERSION_PATTERN.match(line):
            changed = True
            continue
        updated.append(line)
    if changed:
        write_utf8_no_bom(pack_file_path, "\n".join(updated) + "\n")


def get_added_project_filename(output: Sequence[str]) -> str | None:
    for line in output:
        match = ADDED_PROJECT_PATTERN.match(str(line))
        if match:
            return match.group(1)
    return None


def get_pw_toml_filename(path: Path) -> str | None:
    content = path.read_text(encoding="utf-8")
    match = FILENAME_VALUE_PATTERN.search(content)
    if match:
        return match.group(1)
    return None


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


def invoke_packwiz(arguments: Sequence[str], working_directory: Path, packwiz_exe: Path, proxy: str | None):
    with invoke_with_proxy(proxy):
        result = subprocess.run(
            [str(packwiz_exe), *arguments],
            cwd=str(working_directory),
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            **hidden_popen_kwargs(),
        )
    combined = result.stdout + result.stderr
    lines = combined.splitlines()
    for line in lines:
        print(line, flush=True)
    if result.returncode != 0:
        raise RuntimeError(f"packwiz {' '.join(arguments)} exited with code {result.returncode}.")
    return result.returncode, lines


def invoke_sync(proxy: str | None) -> None:
    python_exe = resolve_python_command()
    command = [python_exe, str(SYNC_PACKWIZ_ASSETS_SCRIPT)]
    if proxy is not None and str(proxy).strip():
        command.extend(["-Proxy", proxy])
    result = subprocess.run(command, text=True, encoding="utf-8", **hidden_popen_kwargs())
    if result.returncode != 0:
        raise RuntimeError(f"sync-packwiz-assets.py exited with code {result.returncode}.")


def parse_args(argv: Sequence[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Add one known CurseForge asset to Packwiz metadata.")
    parser.add_argument("-CurseForgeUrl", "--curseforge-url", dest="curseforge_url", default=None)
    parser.add_argument(
        "-CurseForgeProjectId",
        "--curseforge-project-id",
        dest="curseforge_project_id",
        type=int,
        default=None,
    )
    parser.add_argument(
        "-CurseForgeFileId",
        "--curseforge-file-id",
        dest="curseforge_file_id",
        type=int,
        default=None,
    )
    parser.add_argument(
        "-Category",
        "--category",
        dest="category",
        default="mods",
        choices=VALID_CATEGORIES,
    )
    parser.add_argument("-Side", "--side", dest="side", required=True, choices=VALID_SIDES)
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

    has_url = bool(args.curseforge_url)
    has_project = args.curseforge_project_id is not None
    if has_url == has_project:
        raise RuntimeError("Specify either -CurseForgeUrl or -CurseForgeProjectId.")
    if args.curseforge_file_id is not None and not has_project:
        raise RuntimeError("-CurseForgeFileId can only be used with -CurseForgeProjectId.")
    if args.packwiz_url is None:
        args.packwiz_url = default_packwiz_url()
    return args



def _find_existing_metadata(category_dir: Path, filename: str) -> Path | None:
    """Case-insensitive match so Linux does not add a second file beside AlwaysEat.pw.toml."""
    if category_dir.is_dir():
        wanted = filename.casefold()
        for candidate in category_dir.glob("*.pw.toml"):
            if candidate.name.casefold() == wanted:
                return candidate
    exact = category_dir / filename
    return exact if exact.exists() else None


def run(args: argparse.Namespace) -> int:
    work_root = REPO_ROOT / ".cache" / "packwiz-sync" / "target-add" / uuid.uuid4().hex
    tools_root = REPO_ROOT / ".cache" / "packwiz-sync" / "tools"
    packwiz_exe = tools_root / default_packwiz_filename()
    should_sync = False
    work_root.mkdir(parents=True, exist_ok=True)
    try:
        write_status("Generating temporary packwiz pack...")
        invoke_generate_packwiz_files(work_root)
        if args.category != "mods":
            write_status(f"Removing mod-loader filters from the temporary {args.category} pack...")
            remove_packwiz_loader_versions(work_root / "pack.toml")
        ensure_tool(args.packwiz_url, packwiz_exe, write_status, args.proxy)

        write_status("Adding the requested CurseForge file in the temporary pack...")
        add_arguments = ["curseforge", "add"]
        if args.curseforge_project_id is not None:
            add_arguments.extend(["--addon-id", str(args.curseforge_project_id)])
            if args.curseforge_file_id is not None:
                add_arguments.extend(["--file-id", str(args.curseforge_file_id)])
        else:
            add_arguments.append(args.curseforge_url)
        add_arguments.extend(["--meta-folder", args.category, "--meta-folder-base", ".", "--yes"])
        _exit_code, output = invoke_packwiz(add_arguments, work_root, packwiz_exe, args.proxy)

        temp_category_root = work_root / args.category
        generated_metadata = sorted(temp_category_root.glob("*.pw.toml")) if temp_category_root.is_dir() else []
        main_project_filename = get_added_project_filename(output)
        if not main_project_filename:
            raise RuntimeError("Packwiz did not report the requested project's generated filename.")

        target_metadata = [
            path for path in generated_metadata if get_pw_toml_filename(path) == main_project_filename
        ]
        if len(target_metadata) != 1:
            raise RuntimeError(
                f"Expected exactly one metadata file for '{main_project_filename}', found {len(target_metadata)}."
            )

        temp_target_path = target_metadata[0]
        content = temp_target_path.read_text(encoding="utf-8")
        content = set_pw_toml_side(content, args.side)
        write_utf8_no_bom(temp_target_path, content)

        write_status("Refreshing the temporary pack...")
        invoke_packwiz(["refresh"], work_root, packwiz_exe, args.proxy)

        target_path = REPO_ROOT / args.category / target_metadata[0].name
        existing_path = _find_existing_metadata(REPO_ROOT / args.category, target_metadata[0].name)
        if existing_path is not None:
            if args.dry_run:
                write_status(
                    f"Dry run: metadata is valid, but {existing_path} already exists and would not be replaced."
                )
                return 0
            raise RuntimeError(
                f"Refusing to replace existing metadata: {existing_path}. "
                "Use update-packwiz-target.py for existing CurseForge metadata."
            )

        if args.dry_run:
            write_status(f'Dry run: would add {target_metadata[0].name} with side = "{args.side}".')
            return 0

        write_utf8_no_bom(target_path, content)
        write_status(f'Added {args.category}/{target_metadata[0].name} with side = "{args.side}".')
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
