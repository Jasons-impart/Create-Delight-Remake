#!/usr/bin/env python3
"""Generate Crash Assistant's client mod-list baseline from Packwiz metadata."""

import argparse
import json
import re
from pathlib import Path

try:
    import tomllib
except ModuleNotFoundError:
    tomllib = None


def read_toml(path):
    if tomllib is not None:
        with path.open("rb") as source:
            return tomllib.load(source)

    metadata = {}
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.split("#", 1)[0].strip()
        if not line or line.startswith("["):
            continue
        if "=" not in line:
            continue
        key, value = (part.strip() for part in line.split("=", 1))
        if value.startswith('"') and value.endswith('"'):
            metadata[key] = json.loads(value)
        elif value.lower() in {"true", "false"}:
            metadata[key] = value.lower() == "true"
    return metadata


def is_stable_enabled(metadata):
    value = metadata.get("stable", True)
    if isinstance(value, bool):
        return value
    return str(value).strip().lower() not in {"false", "0", "no"}


VERSIONED_JAR_PATTERN = re.compile(
    r"^(?P<mod_id>.+?)[-_](?P<version>\d[0-9A-Za-z.+_-]*)\.jar$", re.IGNORECASE
)


def mod_record(filename, display_name):
    """Return Crash Assistant metadata inferred from a Packwiz JAR filename.

    Packwiz metadata does not expose Forge's runtime mod id or version.  The
    stable filename prefix and trailing numeric version segment let the startup
    script pair a removed JAR with its upgraded replacement without storing
    download fingerprints (which would enable recovery actions).
    """
    match = VERSIONED_JAR_PATTERN.match(filename)
    if match:
        mod_id = match.group("mod_id").lower()
        version = match.group("version")
    else:
        mod_id = filename.removesuffix(".jar").lower()
        version = "unknown"
    return {
        "modId": mod_id,
        "name": display_name,
        "version": version,
    }


def client_mod_baseline(repo_root, stable=False):
    records = {}
    for metadata_path in sorted((repo_root / "mods").rglob("*.pw.toml")):
        metadata = read_toml(metadata_path)
        if stable and not is_stable_enabled(metadata):
            continue
        if str(metadata.get("side", "both")).strip().lower() == "server":
            continue
        filename = str(metadata.get("filename", "")).strip()
        if not filename:
            raise RuntimeError(f"Missing filename in {metadata_path.relative_to(repo_root)}")
        if filename in records:
            raise RuntimeError(f"Duplicate client mod filename: {filename}")
        records[filename] = mod_record(filename, str(metadata.get("name", filename)))
    if not records:
        raise RuntimeError("No client-compatible mods/**/*.pw.toml files found.")
    return dict(sorted(records.items(), key=lambda item: item[0].casefold()))


def client_mod_filenames(repo_root, stable=False):
    return list(client_mod_baseline(repo_root, stable=stable))


def write_json_if_changed(path, modlist):
    if path.is_file():
        try:
            if json.loads(path.read_text(encoding="utf-8")) == modlist:
                print(f"Crash Assistant mod list unchanged: {path.as_posix()}")
                return False
        except (OSError, json.JSONDecodeError):
            pass
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(modlist, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(f"Generated Crash Assistant mod list: {path.as_posix()}")
    return True


def main():
    repo_root = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo-root", default=str(repo_root), help="Repository root.")
    parser.add_argument(
        "--output",
        default="config/modpack_defaults/config/crash_assistant/modlist.json",
        help="Output path, relative to repo root unless absolute.",
    )
    parser.add_argument("--stable", action="store_true", help="Exclude metadata with stable = false.")
    args = parser.parse_args()

    repo_root = Path(args.repo_root).resolve()
    output = Path(args.output)
    if not output.is_absolute():
        output = repo_root / output
    modlist = client_mod_baseline(repo_root, stable=args.stable)
    write_json_if_changed(output, modlist)
    print(f"client-compatible mods={len(modlist)}")


if __name__ == "__main__":
    main()
