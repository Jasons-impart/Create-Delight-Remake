#!/usr/bin/env python3
import argparse
import shutil
import sys
from pathlib import Path

try:
    import tomllib
except ModuleNotFoundError:
    tomllib = None


VALID_SIDES = {"both", "client", "server"}
DEFAULT_ROOTS = ("mods", "resourcepacks", "shaderpacks")


def read_toml(path):
    if tomllib is not None:
        with path.open("rb") as f:
            return tomllib.load(f)

    data = {}
    section = data
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.split("#", 1)[0].strip()
        if not line:
            continue
        if line.startswith("[") and line.endswith("]"):
            section_name = line[1:-1].strip()
            section = data.setdefault(section_name, {})
            continue
        if "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip()
        if value.startswith('"') and value.endswith('"'):
            value = value[1:-1]
        section[key] = value
    return data


def metadata_files(base, roots):
    for root in roots:
        path = base / root
        if path.exists():
            yield from sorted(path.rglob("*.pw.toml"))


def side_for(data):
    return str(data.get("side", "both")).strip().lower()


def is_allowed(side, target):
    if target == "all":
        return True
    if target == "client":
        return side in {"both", "client"}
    if target == "server":
        return side in {"both", "server"}
    raise ValueError(f"Unknown target side: {target}")


def cmd_filenames(args):
    base = Path(args.base).resolve()
    failed = False
    for meta in metadata_files(base, args.roots):
        data = read_toml(meta)
        side = side_for(data)
        filename = data.get("filename")
        if side == args.side:
            if not filename:
                print(f"{meta}: missing filename", file=sys.stderr)
                failed = True
                continue
            print(filename)
    return 1 if failed else 0


def cmd_prune_metadata(args):
    base = Path(args.base).resolve()
    backup_dir = Path(args.backup_dir).resolve() if args.backup_dir else None
    count = 0
    for meta in metadata_files(base, args.roots):
        data = read_toml(meta)
        side = side_for(data)
        if is_allowed(side, args.target):
            continue
        if backup_dir is not None:
            rel = meta.relative_to(base)
            dest = backup_dir / rel
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(meta, dest)
        meta.unlink()
        count += 1
        if args.verbose:
            print(f"removed metadata for {args.target}: {meta.relative_to(base).as_posix()}")
    if args.verbose:
        print(f"removed {count} metadata file(s)")
    return 0


def cmd_restore_metadata(args):
    base = Path(args.base).resolve()
    backup_dir = Path(args.backup_dir).resolve()
    if not backup_dir.exists():
        return 0
    for src in sorted(backup_dir.rglob("*.pw.toml")):
        rel = src.relative_to(backup_dir)
        dest = base / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(src, dest)
    return 0


def cmd_delete_payloads(args):
    metadata_base = Path(args.metadata_base).resolve()
    payload_base = Path(args.payload_base).resolve()
    failed = False
    for meta in metadata_files(metadata_base, ["mods"]):
        data = read_toml(meta)
        if side_for(data) != args.side:
            continue
        filename = data.get("filename")
        if not filename:
            print(f"{meta}: missing filename", file=sys.stderr)
            failed = True
            continue
        candidates = [
            payload_base / "mods" / filename,
            payload_base / "packwiz-files" / "mods" / filename,
        ]
        for candidate in candidates:
            if candidate.exists():
                candidate.unlink()
                if args.verbose:
                    print(f"deleted {candidate}")
    return 1 if failed else 0


def cmd_validate(args):
    base = Path(args.base).resolve()
    failed = False
    for meta in metadata_files(base, args.roots):
        data = read_toml(meta)
        rel = meta.relative_to(base).as_posix()
        side = side_for(data)
        if side not in VALID_SIDES:
            print(f"{rel}: invalid side '{side}'", file=sys.stderr)
            failed = True
        if not data.get("filename"):
            print(f"{rel}: missing filename", file=sys.stderr)
            failed = True
        if "side" not in data:
            print(f"{rel}: missing side", file=sys.stderr)
            failed = True
    return 1 if failed else 0


def main():
    parser = argparse.ArgumentParser(description="Utilities for packwiz side metadata.")
    subparsers = parser.add_subparsers(dest="command", required=True)

    filenames = subparsers.add_parser("filenames", help="Print filenames with an exact side.")
    filenames.add_argument("--base", default=".")
    filenames.add_argument("--roots", nargs="+", default=list(DEFAULT_ROOTS))
    filenames.add_argument("--side", choices=sorted(VALID_SIDES), required=True)
    filenames.set_defaults(func=cmd_filenames)

    prune = subparsers.add_parser("prune-metadata", help="Remove metadata not allowed for target side.")
    prune.add_argument("--base", default=".")
    prune.add_argument("--roots", nargs="+", default=list(DEFAULT_ROOTS))
    prune.add_argument("--target", choices=["client", "server", "all"], required=True)
    prune.add_argument("--backup-dir")
    prune.add_argument("--verbose", action="store_true")
    prune.set_defaults(func=cmd_prune_metadata)

    restore = subparsers.add_parser("restore-metadata", help="Restore metadata backed up by prune-metadata.")
    restore.add_argument("--base", default=".")
    restore.add_argument("--backup-dir", required=True)
    restore.set_defaults(func=cmd_restore_metadata)

    delete_payloads = subparsers.add_parser("delete-payloads", help="Delete mod payloads for an exact side.")
    delete_payloads.add_argument("--metadata-base", default=".")
    delete_payloads.add_argument("--payload-base", default=".")
    delete_payloads.add_argument("--side", choices=sorted(VALID_SIDES), required=True)
    delete_payloads.add_argument("--verbose", action="store_true")
    delete_payloads.set_defaults(func=cmd_delete_payloads)

    validate = subparsers.add_parser("validate", help="Validate side and filename metadata.")
    validate.add_argument("--base", default=".")
    validate.add_argument("--roots", nargs="+", default=list(DEFAULT_ROOTS))
    validate.set_defaults(func=cmd_validate)

    args = parser.parse_args()
    raise SystemExit(args.func(args))


if __name__ == "__main__":
    main()
