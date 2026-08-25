#!/usr/bin/env python3
"""Build release patch payloads from a Git diff and Packwiz metadata."""

import argparse
import shutil
import subprocess
import sys
from pathlib import Path

try:
    import tomllib
except ModuleNotFoundError as error:
    raise RuntimeError("Python 3.11 or newer is required for TOML support") from error


ASSET_DIRS = ("mods", "resourcepacks", "shaderpacks", "tacz")
SERVER_EXCLUDED_FILES = (
    "ModList0.4a.md",
    "README.md",
    "TODOlist.md",
    "KubeJSStyleGuide.md",
    "GettingStarted.md",
    "modpack.toml",
    "pack.toml",
    "index.toml",
    "index.html",
    "client_jvm_args.example.txt",
    ".gitmodules",
)
OVERLAY_FILES = (
    Path("config/bcc-common.toml"),
    Path("kubejs/config/client.properties"),
    Path("kubejs/config/probejs.json"),
    Path("config/modpack_defaults/config/crash_assistant/modlist.json"),
    Path("config/GeneralFeedback/default.json"),
)


def is_excluded(path):
    return path == ".gitmodules" or path == "CDC-mod-src" or path.startswith("CDC-mod-src/")


def read_toml(path):
    with path.open("rb") as source:
        return tomllib.load(source)


def is_stable_enabled(data):
    return data.get("stable", True) is not False


def metadata_files(root, asset_dir):
    directory = root / asset_dir
    if directory.is_dir():
        yield from sorted(directory.rglob("*.pw.toml"))


def metadata_entries(root, asset_dir, stable=False):
    for metadata_path in metadata_files(root, asset_dir):
        data = read_toml(metadata_path)
        if stable and not is_stable_enabled(data):
            continue
        filename = data.get("filename")
        if not filename:
            print(f"::warning::Missing filename in {metadata_path.as_posix()}")
            continue
        mode = str(data.get("download", {}).get("mode", ""))
        side = str(data.get("side", "both")).lower()
        yield metadata_path, str(filename), mode, side


def git_diff_entries(base):
    result = subprocess.run(
        ["git", "diff", "--name-status", "-z", "--find-renames", "--find-copies", base, "HEAD"],
        check=True,
        stdout=subprocess.PIPE,
    )
    fields = result.stdout.decode("utf-8", errors="surrogateescape").split("\0")
    index = 0
    while index < len(fields) - 1:
        status = fields[index]
        index += 1
        if not status:
            continue
        if status[0] in {"R", "C"}:
            old_path, new_path = fields[index : index + 2]
            index += 2
            yield status[0], old_path, new_path
        else:
            path = fields[index]
            index += 1
            yield status[0], path, path


def copy_file(source, destination):
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, destination)


def write_overlay(output, modpack_name, modpack_version, version_file_relative_dir):
    repo_root = Path.cwd()
    for relative_path in OVERLAY_FILES:
        source = repo_root / relative_path
        if not source.is_file():
            raise FileNotFoundError(f"Required patch overlay is missing: {source}")
        copy_file(source, output / relative_path)

    version_file = output / version_file_relative_dir / "version.md"
    version_file.parent.mkdir(parents=True, exist_ok=True)
    version_file.write_text(
        "|||\n"
        f"{modpack_name} {modpack_version} (patch)\n"
        "MIT License Copyright (c) 2025 JSI Production Team\n"
        "|||\n",
        encoding="utf-8",
        newline="\n",
    )


def command_prepare(args):
    output = Path(args.output)
    output.mkdir(parents=True, exist_ok=True)
    deleted_paths = []

    for status, old_path, new_path in git_diff_entries(args.base):
        if status == "R":
            if not is_excluded(old_path):
                deleted_paths.append(old_path)
            if is_excluded(new_path):
                continue
            changed_path = new_path
        elif status == "D":
            if not is_excluded(old_path):
                deleted_paths.append(old_path)
            continue
        else:
            if is_excluded(new_path):
                continue
            changed_path = new_path

        source = Path(changed_path)
        if source.is_file():
            copy_file(source, output / changed_path)
        else:
            print(f"::warning::Changed file not found at HEAD: {changed_path}")

    Path(args.deleted_list).write_text(
        "".join(f"{path}\n" for path in deleted_paths), encoding="utf-8", newline="\n"
    )
    write_overlay(output, args.modpack_name, args.modpack_version, args.version_file_relative_dir)
    print(f"Prepared {output} with {len(deleted_paths)} deleted file(s).")


def remove_client_mod_payloads(patch, stable=False):
    for _, filename, _, side in metadata_entries(Path.cwd(), "mods", stable=stable):
        if side != "client":
            continue
        for candidate in (
            patch / "mods" / filename,
            patch / "packwiz-files" / "mods" / filename,
        ):
            if candidate.is_file():
                candidate.unlink()
                print(f"Removed client-only server payload: {candidate}")


def move_packwiz_payloads(patch):
    extensions = {"mods": ".jar", "resourcepacks": ".zip", "shaderpacks": ".zip", "tacz": ".zip"}
    for asset_dir, extension in extensions.items():
        source_dir = patch / "packwiz-files" / asset_dir
        if not source_dir.is_dir():
            continue
        destination_dir = patch / asset_dir
        destination_dir.mkdir(parents=True, exist_ok=True)
        for source in source_dir.glob(f"*{extension}"):
            shutil.move(str(source), destination_dir / source.name)
    shutil.rmtree(patch / "packwiz-files", ignore_errors=True)


def remove_stable_disabled_payloads(patch):
    for asset_dir in ASSET_DIRS:
        for metadata_path in metadata_files(Path.cwd(), asset_dir):
            data = read_toml(metadata_path)
            if is_stable_enabled(data):
                continue
            filename = data.get("filename")
            if filename:
                for candidate in (
                    patch / asset_dir / str(filename),
                    patch / "packwiz-files" / asset_dir / str(filename),
                ):
                    if candidate.is_file():
                        candidate.unlink()
                        print(f"Removed stable-disabled payload: {candidate}")
            metadata_candidate = patch / metadata_path.relative_to(Path.cwd())
            if metadata_candidate.is_file():
                metadata_candidate.unlink()
                print(f"Removed stable-disabled metadata: {metadata_candidate}")


def command_server(args):
    patch = Path(args.patch)
    if args.stable:
        remove_stable_disabled_payloads(patch)
    remove_client_mod_payloads(patch, stable=args.stable)
    for relative_path in SERVER_EXCLUDED_FILES:
        target = patch / relative_path
        if target.is_file() or target.is_symlink():
            target.unlink()
    for relative_path in ("CDC-mod-src", "docs"):
        shutil.rmtree(patch / relative_path, ignore_errors=True)
    move_packwiz_payloads(patch)


def command_purge_curseforge(args):
    patch = Path(args.patch)
    metadata_root = Path(args.metadata_root)
    for asset_dir in ASSET_DIRS:
        for _, filename, mode, _ in metadata_entries(metadata_root, asset_dir, stable=args.stable):
            if mode != "metadata:curseforge":
                continue
            payload = patch / asset_dir / filename
            if payload.is_file():
                payload.unlink()
                print(f"Removed CurseForge manifest payload: {payload}")
        patch_asset_dir = patch / asset_dir
        if patch_asset_dir.is_dir():
            for metadata_path in patch_asset_dir.rglob("*.pw.toml"):
                metadata_path.unlink()


def command_client(args):
    patch = Path(args.patch)
    metadata_root = Path(args.metadata_root)
    for asset_dir in ASSET_DIRS:
        destination = patch / asset_dir
        shutil.rmtree(destination, ignore_errors=True)
        curseforge_filenames = {
            filename
            for _, filename, mode, _ in metadata_entries(metadata_root, asset_dir, stable=args.stable)
            if mode == "metadata:curseforge"
        }
        for metadata_path, filename, _, _ in metadata_entries(metadata_root, asset_dir, stable=args.stable):
            if filename in curseforge_filenames:
                print(f"Skipping CurseForge manifest payload: {asset_dir}/{filename}")
                continue
            source = metadata_path.parent / filename
            if not source.is_file():
                print(f"::warning::Missing non-CurseForge payload referenced by {metadata_path}: {source}")
                continue
            copy_file(source, destination / filename)
    shutil.rmtree(patch / "packwiz-files", ignore_errors=True)
    manifest = Path(args.manifest)
    if not manifest.is_file():
        raise FileNotFoundError(f"Manifest file not found: {manifest}")
    shutil.move(str(manifest), patch / manifest.name)


def main():
    parser = argparse.ArgumentParser(description="Build client and server release patches.")
    commands = parser.add_subparsers(dest="command", required=True)

    prepare = commands.add_parser("prepare", help="Copy changed files and write shared patch overlays.")
    prepare.add_argument("--base", required=True)
    prepare.add_argument("--output", default="patch")
    prepare.add_argument("--deleted-list", default="deleted_files.txt")
    prepare.add_argument("--modpack-name", required=True)
    prepare.add_argument("--modpack-version", required=True)
    prepare.add_argument("--version-file-relative-dir", required=True)
    prepare.set_defaults(func=command_prepare)

    server = commands.add_parser("server", help="Convert a shared patch into a server patch.")
    server.add_argument("--patch", default="patch")
    server.add_argument("--stable", action="store_true", help="Exclude assets with stable = false.")
    server.set_defaults(func=command_server)

    purge = commands.add_parser("purge-curseforge", help="Remove payloads represented by CurseForge metadata.")
    purge.add_argument("--patch", default="patch")
    purge.add_argument("--metadata-root", default=".")
    purge.add_argument("--stable", action="store_true", help="Exclude assets with stable = false.")
    purge.set_defaults(func=command_purge_curseforge)

    client = commands.add_parser("client", help="Populate a patch with non-CurseForge client payloads.")
    client.add_argument("--patch", default="patch")
    client.add_argument("--metadata-root", default=".")
    client.add_argument("--manifest", required=True)
    client.add_argument("--stable", action="store_true", help="Exclude assets with stable = false.")
    client.set_defaults(func=command_client)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    try:
        main()
    except (FileNotFoundError, subprocess.CalledProcessError, RuntimeError) as error:
        print(f"::error::{error}", file=sys.stderr)
        raise SystemExit(1)
