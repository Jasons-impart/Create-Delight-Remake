#!/usr/bin/env python3
import argparse
import json
from datetime import datetime, timezone
from pathlib import Path

try:
    import tomllib
except ModuleNotFoundError:
    tomllib = None


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
            raise SystemExit(f"Cannot parse line in {path}: {raw_line}")
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip()
        if value.startswith('"') and value.endswith('"'):
            value = json.loads(value)
        elif value.lower() in {"true", "false"}:
            value = value.lower() == "true"
        section[key] = value

    return data


def repo_relative(repo_root, path):
    return path.resolve().relative_to(repo_root).as_posix()


def sorted_unique(values):
    return sorted({str(value).strip().lower() for value in values if str(value).strip()})


def get_metadata_side(repo_root, metadata_path, metadata):
    side = str(metadata.get("side", "")).strip().lower()
    if side in {"client", "server"}:
        return side

    relative = repo_relative(repo_root, metadata_path).lower()
    if relative.startswith("mods/client/"):
        return "client"
    if relative.startswith("mods/server/"):
        return "server"

    return "common"


def is_release_enabled(metadata):
    value = metadata.get("release", True)
    if isinstance(value, bool):
        return value
    return str(value).strip().lower() not in {"false", "0", "no"}


def get_pack_mod_metadata(repo_root, release=False):
    for metadata_path in sorted((repo_root / "mods").rglob("*.pw.toml")):
        metadata = read_toml(metadata_path)
        if release and not is_release_enabled(metadata):
            continue
        filename = str(metadata.get("filename", "")).strip()
        if not filename:
            continue

        yield {
            "side": get_metadata_side(repo_root, metadata_path, metadata),
            "metadata_path": metadata_path,
            "relative_metadata_path": repo_relative(repo_root, metadata_path),
            "filename": filename,
        }


def comparable_manifest(manifest):
    return {
        "schemaVersion": manifest.get("schemaVersion"),
        "generatedBy": manifest.get("generatedBy"),
        "expectedFiles": manifest.get("expectedFiles"),
        "sources": manifest.get("sources"),
    }


def write_json_if_changed(path, manifest):
    if path.exists():
        try:
            existing = json.loads(path.read_text(encoding="utf-8"))
            if comparable_manifest(existing) == comparable_manifest(manifest):
                print(f"Integrity manifest unchanged: {path.as_posix()}")
                return False
        except (OSError, json.JSONDecodeError):
            pass

    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8", newline="\n")
    print(f"Generated integrity manifest: {path.as_posix()}")
    return True


def new_manifest(repo_root, release=False):
    metadata_entries = list(get_pack_mod_metadata(repo_root, release=release))
    if not metadata_entries:
        raise RuntimeError("No mods/**/*.pw.toml files found; cannot generate integrity manifest.")

    expected_files = {"common": [], "client": [], "server": []}
    sources = []

    for entry in metadata_entries:
        expected_files[entry["side"]].append(entry["filename"])
        sources.append(
            {
                "side": entry["side"],
                "metadata": entry["relative_metadata_path"],
                "filename": entry["filename"],
            }
        )

    return {
        "schemaVersion": 1,
        "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "generatedBy": "scripts/generate-pack-integrity-manifest.py",
        "expectedFiles": {
            "common": sorted_unique(expected_files["common"]),
            "client": sorted_unique(expected_files["client"]),
            "server": sorted_unique(expected_files["server"]),
        },
        "sources": sorted(sources, key=lambda source: (source["side"], source["filename"])),
    }


def main():
    repo_root = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser(description="Generate the Create Delight mod list integrity manifest.")
    parser.add_argument("--repo-root", default=str(repo_root), help="Repository root.")
    parser.add_argument(
        "--output",
        default="kubejs/config/createdelight_pack_integrity_expected.json",
        help="Manifest output path, relative to repo root unless absolute.",
    )
    parser.add_argument("--release", action="store_true", help="Exclude metadata with release = false.")
    args = parser.parse_args()

    repo_root = Path(args.repo_root).resolve()
    output = Path(args.output)
    if not output.is_absolute():
        output = repo_root / output

    manifest = new_manifest(repo_root, release=args.release)
    write_json_if_changed(output, manifest)
    counts = manifest["expectedFiles"]
    print(f"common={len(counts['common'])}, client={len(counts['client'])}, server={len(counts['server'])}")


if __name__ == "__main__":
    main()
