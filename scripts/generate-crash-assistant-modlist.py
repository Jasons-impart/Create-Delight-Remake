#!/usr/bin/env python3
"""Generate Crash Assistant's client mod-list baseline from Packwiz metadata."""

import argparse
import json
import re
import zipfile
from pathlib import Path


VALID_DISTRIBUTIONS = {"development", "testing", "release"}

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


def distribution_for(metadata):
    return str(metadata.get("distribution", "release")).strip().lower()


def is_allowed_for_distribution(asset_distribution, target_distribution):
    ranks = {"development": 0, "testing": 1, "release": 2}
    return ranks[target_distribution] <= ranks[asset_distribution]


VERSIONED_JAR_PATTERN = re.compile(
    r"^(?P<mod_id>.+?)[-_](?P<version>\d[0-9A-Za-z.+_-]*)\.jar$", re.IGNORECASE
)
MOD_METADATA_PATHS = ("META-INF/mods.toml", "META-INF/neoforge.mods.toml")
UNRESOLVED_VALUE_PATTERN = re.compile(r"\$\{[^}]+\}")


def _parse_mod_metadata(text):
    if tomllib is not None:
        try:
            metadata = tomllib.loads(text)
        except tomllib.TOMLDecodeError:
            metadata = None
        if isinstance(metadata, dict):
            for mod in metadata.get("mods", []):
                if not isinstance(mod, dict):
                    continue
                mod_id = str(mod.get("modId", "")).strip()
                version = str(mod.get("version", "")).strip()
                if mod_id and version:
                    return mod_id, version
        return None

    mods_block = re.search(r"(?ms)^\s*\[\[mods\]\].*?(?=^\s*\[\[|\Z)", text)
    if not mods_block:
        return None
    block = mods_block.group(0)
    values = {}
    for key in ("modId", "version"):
        match = re.search(
            rf"(?m)^\s*{re.escape(key)}\s*=\s*(?:\"([^\"]*)\"|'([^']*)')",
            block,
        )
        if match:
            values[key] = next(value for value in match.groups() if value is not None)
    mod_id = values.get("modId", "").strip()
    version = values.get("version", "").strip()
    if mod_id and version:
        return mod_id, version
    return None


def read_jar_mod_metadata(repo_root, filename):
    """Read a tracked manual JAR's Forge/NeoForge mod id and version."""
    jar_path = repo_root / "packwiz-files" / "mods" / filename
    if not jar_path.is_file():
        return None
    try:
        with zipfile.ZipFile(jar_path) as archive:
            for metadata_path in MOD_METADATA_PATHS:
                try:
                    text = archive.read(metadata_path).decode("utf-8")
                except KeyError:
                    continue
                parsed = _parse_mod_metadata(text)
                if parsed is None:
                    continue
                mod_id, version = parsed
                if UNRESOLVED_VALUE_PATTERN.search(mod_id) or UNRESOLVED_VALUE_PATTERN.search(version):
                    continue
                return {"modId": mod_id.lower(), "version": version}
    except (OSError, UnicodeDecodeError, ValueError, zipfile.BadZipFile):
        return None
    return None


def mod_record(filename, display_name, repo_root=None):
    """Return Crash Assistant metadata inferred from JAR metadata or filename.

    Tracked manual JARs expose Forge's runtime mod id and version in
    ``META-INF/mods.toml``.  Use that metadata when available so renamed
    payloads do not look like version changes.  Packwiz metadata-only entries
    and malformed or unresolved JAR metadata fall back to the stable filename
    prefix and trailing numeric version segment.
    """
    jar_metadata = read_jar_mod_metadata(repo_root, filename) if repo_root is not None else None
    if jar_metadata is not None:
        mod_id = jar_metadata["modId"]
        version = jar_metadata["version"]
        return {
            "modId": mod_id,
            "name": display_name,
            "version": version,
        }

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


def client_mod_baseline(repo_root, distribution="development"):
    records = {}
    for metadata_path in sorted((repo_root / "mods").rglob("*.pw.toml")):
        metadata = read_toml(metadata_path)
        if not is_allowed_for_distribution(distribution_for(metadata), distribution):
            continue
        if str(metadata.get("side", "both")).strip().lower() == "server":
            continue
        filename = str(metadata.get("filename", "")).strip()
        if not filename:
            raise RuntimeError(f"Missing filename in {metadata_path.relative_to(repo_root)}")
        if filename in records:
            raise RuntimeError(f"Duplicate client mod filename: {filename}")
        records[filename] = mod_record(
            filename,
            str(metadata.get("name", filename)),
            repo_root=repo_root,
        )
    if not records:
        raise RuntimeError("No client-compatible mods/**/*.pw.toml files found.")
    return dict(sorted(records.items(), key=lambda item: item[0].casefold()))


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
    parser.add_argument(
        "--distribution",
        choices=sorted(VALID_DISTRIBUTIONS),
        default="development",
        help="Package channel represented by the generated baseline.",
    )
    args = parser.parse_args()

    repo_root = Path(args.repo_root).resolve()
    output = Path(args.output)
    if not output.is_absolute():
        output = repo_root / output
    modlist = client_mod_baseline(repo_root, distribution=args.distribution)
    write_json_if_changed(output, modlist)
    print(f"client-compatible mods={len(modlist)}")


if __name__ == "__main__":
    main()
