#!/usr/bin/env python3
import argparse
import io
import json
import sys
import zipfile
from datetime import datetime, timezone
from pathlib import Path

try:
    import tomllib
except ModuleNotFoundError:
    tomllib = None


NON_RUNTIME_EMBEDDED_MOD_IDS = {"mixinsquared"}


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
        section[key] = value

    return data


def repo_relative(repo_root, path):
    return path.resolve().relative_to(repo_root).as_posix()


def normalize_mod_id(mod_id):
    return str(mod_id).strip().lower().replace("-", "_")


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


def get_pack_mod_metadata(repo_root):
    for metadata_path in sorted((repo_root / "mods").rglob("*.pw.toml")):
        metadata = read_toml(metadata_path)
        filename = str(metadata.get("filename", "")).strip()
        if not filename:
            continue

        yield {
            "side": get_metadata_side(repo_root, metadata_path, metadata),
            "metadata_path": metadata_path,
            "relative_metadata_path": repo_relative(repo_root, metadata_path),
            "filename": filename,
            "jar_path": repo_root / "mods" / filename,
        }


def zip_entry_text(zip_file, entry_name):
    try:
        with zip_file.open(entry_name) as f:
            return f.read().decode("utf-8")
    except KeyError:
        return None


def get_mod_ids_from_toml_text(text):
    ids = []
    in_mod_block = False
    for raw_line in text.splitlines():
        line = raw_line.split("#", 1)[0].strip()
        if line == "[[mods]]":
            in_mod_block = True
            continue
        if line.startswith("[[") or line.startswith("["):
            in_mod_block = False
            continue
        if not in_mod_block or not line.startswith("modId"):
            continue
        key, separator, value = line.partition("=")
        if key.strip() != "modId" or not separator:
            continue
        value = value.strip()
        if value.startswith('"') and value.endswith('"'):
            mod_id = value[1:-1].strip().lower()
            if mod_id and mod_id not in ids:
                ids.append(mod_id)
    return ids


def get_fabric_mod_ids(text):
    metadata = json.loads(text)
    ids = []
    mod_id = metadata.get("id")
    if mod_id:
        ids.append(normalize_mod_id(mod_id))
    for provided in metadata.get("provides") or []:
        mod_id = normalize_mod_id(provided)
        if mod_id and mod_id not in ids:
            ids.append(mod_id)
    return ids


def get_mod_ids_from_zip(zip_file):
    for entry_name in ("META-INF/neoforge.mods.toml", "META-INF/mods.toml"):
        toml = zip_entry_text(zip_file, entry_name)
        if toml:
            return get_mod_ids_from_toml_text(toml)

    fabric_json = zip_entry_text(zip_file, "fabric.mod.json")
    if fabric_json:
        return get_fabric_mod_ids(fabric_json)

    return []


def get_nested_mod_ids_from_entry(zip_file, entry, depth=0):
    with zip_file.open(entry) as source:
        data = source.read()

    ids = []
    with zipfile.ZipFile(io.BytesIO(data)) as nested_zip:
        for mod_id in get_mod_ids_from_zip(nested_zip):
            if mod_id not in ids:
                ids.append(mod_id)

        if depth >= 4:
            return ids

        for inner_entry in nested_zip.infolist():
            if not inner_entry.filename.lower().endswith(".jar"):
                continue
            for mod_id in get_nested_mod_ids_from_entry(nested_zip, inner_entry, depth + 1):
                if mod_id not in ids:
                    ids.append(mod_id)

    return ids


def get_mod_ids_from_jar(jar_path):
    ids = []
    with zipfile.ZipFile(jar_path) as jar:
        for mod_id in get_mod_ids_from_zip(jar):
            if mod_id not in ids:
                ids.append(mod_id)

        for entry in jar.infolist():
            if not entry.filename.lower().endswith(".jar"):
                continue
            for mod_id in get_nested_mod_ids_from_entry(jar, entry):
                if mod_id in NON_RUNTIME_EMBEDDED_MOD_IDS:
                    continue
                if mod_id not in ids:
                    ids.append(mod_id)

    return ids


def test_known_non_runtime_jar(jar_path):
    with zipfile.ZipFile(jar_path) as jar:
        return "META-INF/services/cpw.mods.modlauncher.api.ITransformationService" in set(jar.namelist())


def test_known_non_mod_jar(jar_path):
    service_entries = {
        "META-INF/services/net.neoforged.neoforgespi.earlywindow.GraphicsBootstrapper",
        "META-INF/services/net.neoforged.neoforgespi.earlywindow.ImmediateWindowProvider",
    }
    with zipfile.ZipFile(jar_path) as jar:
        names = set(jar.namelist())
        return any(entry in names for entry in service_entries)


def comparable_manifest(manifest):
    return {
        "schemaVersion": manifest.get("schemaVersion"),
        "generatedBy": manifest.get("generatedBy"),
        "expectedModIds": manifest.get("expectedModIds"),
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


def new_manifest(repo_root):
    metadata_entries = list(get_pack_mod_metadata(repo_root))
    if not metadata_entries:
        raise RuntimeError("No mods/**/*.pw.toml files found; cannot generate integrity manifest.")

    missing = [entry for entry in metadata_entries if not entry["jar_path"].is_file()]
    if missing:
        print("Missing managed mod jar(s); synchronize files first:", file=sys.stderr)
        for entry in missing:
            print(f"  mods/{entry['filename']} ({entry['relative_metadata_path']})", file=sys.stderr)
        raise RuntimeError("Integrity manifest generation failed: missing managed mod jar(s).")

    expected = {"common": [], "client": [], "server": []}
    sources = []
    unresolved = []

    for entry in metadata_entries:
        jar_path = entry["jar_path"]
        try:
            mod_ids = get_mod_ids_from_jar(jar_path)
        except (OSError, zipfile.BadZipFile, json.JSONDecodeError) as exc:
            raise RuntimeError(f"Failed to parse {jar_path}: {exc}") from exc

        if not mod_ids:
            if not test_known_non_mod_jar(jar_path):
                unresolved.append(entry)
                continue
            sources.append(
                {
                    "side": entry["side"],
                    "metadata": entry["relative_metadata_path"],
                    "filename": entry["filename"],
                    "modIds": [],
                    "nonModFile": True,
                }
            )
            continue

        sorted_mod_ids = sorted_unique(mod_ids)
        if test_known_non_runtime_jar(jar_path):
            sources.append(
                {
                    "side": entry["side"],
                    "metadata": entry["relative_metadata_path"],
                    "filename": entry["filename"],
                    "modIds": sorted_mod_ids,
                    "nonRuntimeMod": True,
                }
            )
            continue

        expected[entry["side"]].extend(sorted_mod_ids)
        sources.append(
            {
                "side": entry["side"],
                "metadata": entry["relative_metadata_path"],
                "filename": entry["filename"],
                "modIds": sorted_mod_ids,
            }
        )

    if unresolved:
        print("Could not resolve mod id(s) from managed jar(s):", file=sys.stderr)
        for entry in unresolved:
            print(f"  mods/{entry['filename']} ({entry['relative_metadata_path']})", file=sys.stderr)
        raise RuntimeError("Integrity manifest generation failed: unresolved managed mod jar(s).")

    return {
        "schemaVersion": 1,
        "generatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "generatedBy": "scripts/generate-pack-integrity-manifest.py",
        "expectedModIds": {
            "common": sorted_unique(expected["common"]),
            "client": sorted_unique(expected["client"]),
            "server": sorted_unique(expected["server"]),
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
    args = parser.parse_args()

    repo_root = Path(args.repo_root).resolve()
    output = Path(args.output)
    if not output.is_absolute():
        output = repo_root / output

    manifest = new_manifest(repo_root)
    write_json_if_changed(output, manifest)
    counts = manifest["expectedModIds"]
    print(f"common={len(counts['common'])}, client={len(counts['client'])}, server={len(counts['server'])}")


if __name__ == "__main__":
    main()
