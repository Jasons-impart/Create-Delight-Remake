#!/usr/bin/env python3
"""Audit or retheme Integrated Cataclysm structure templates.

The source of truth is the installed Integrated Cataclysm jar. Generated NBT
files keep the addon's entities, jigsaws and block entities while changing only
palette block states selected by the mapping file.
"""

from __future__ import annotations

import argparse
import gzip
import io
import json
import sys
import zipfile
from collections import Counter
from pathlib import Path

try:
    from nbt.nbt import NBTFile, TAG_Compound, TAG_String
except ImportError as exc:  # pragma: no cover - developer environment guard
    raise SystemExit("Missing Python package 'NBT'. Install it with: python -m pip install NBT") from exc


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_MAPPING = ROOT / "scripts" / "cataclysm-structure-theme-map.json"
DEFAULT_OUTPUT = ROOT / "kubejs" / "data" / "cataclysm" / "structures"
STRUCTURE_PREFIX = "data/cataclysm/structures/"


def find_source_jar() -> Path:
    matches = sorted((ROOT / "mods").glob("integrated_cataclysm_forge-*.jar"))
    if len(matches) != 1:
        raise SystemExit(f"Expected exactly one Integrated Cataclysm jar, found {len(matches)}")
    return matches[0]


def load_mapping(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as handle:
        data = json.load(handle)
    if data.get("source") != "integrated_cataclysm":
        raise SystemExit("Mapping must declare source=integrated_cataclysm")
    return data


def replacement_name(replacement: str | dict) -> str:
    return replacement if isinstance(replacement, str) else replacement["name"]


def validate_replacement_targets(groups: dict) -> None:
    targets = {
        replacement_name(replacement)
        for config in groups.values()
        for replacement in config.get("replacements", {}).values()
    }
    required_assets = {
        f"assets/{name.split(':', 1)[0]}/blockstates/{name.split(':', 1)[1]}.json": name
        for name in targets
        if not name.startswith("minecraft:")
    }
    found = set()
    for jar_path in (ROOT / "mods").glob("*.jar"):
        try:
            with zipfile.ZipFile(jar_path) as archive:
                names = set(archive.namelist())
        except zipfile.BadZipFile:
            continue
        found.update(path for path in required_assets if path in names)
    for path in required_assets:
        if (ROOT / "kubejs" / path).is_file():
            found.add(path)
    missing = [required_assets[path] for path in required_assets if path not in found]
    if missing:
        raise SystemExit("Missing replacement blockstates: " + ", ".join(sorted(missing)))


def group_for(filename: str, groups: dict) -> tuple[str, dict] | None:
    for group_name, config in groups.items():
        if any(filename.startswith(prefix) for prefix in config["structure_prefixes"]):
            return group_name, config
    return None


def read_nbt(payload: bytes) -> NBTFile:
    return NBTFile(buffer=io.BytesIO(gzip.decompress(payload)))


def palette_usage(root: NBTFile) -> Counter:
    palette = root["palette"]
    counts = Counter()
    for block in root["blocks"]:
        state = block["state"].value
        counts[palette[state]["Name"].value] += 1
    return counts


def replace_palette(root: NBTFile, replacements: dict) -> Counter:
    changed = Counter()
    for state in root["palette"]:
        old_name = state["Name"].value
        replacement = replacements.get(old_name)
        if replacement is None:
            continue

        if isinstance(replacement, str):
            new_name = replacement
            preserve_properties = False
            properties = None
        else:
            new_name = replacement["name"]
            preserve_properties = replacement.get("preserve_properties", False)
            properties = replacement.get("properties")

        state["Name"].value = new_name
        if not preserve_properties and "Properties" in state:
            state.tags.remove(state["Properties"])
        if properties is not None:
            if "Properties" in state:
                state.tags.remove(state["Properties"])
            compound = TAG_Compound(name="Properties")
            for key, value in properties.items():
                compound.tags.append(TAG_String(name=key, value=str(value)))
            state.tags.append(compound)
        changed[(old_name, new_name)] += 1
    return changed


def remove_jigsaw_pools(root: NBTFile, pools: list[str]) -> Counter:
    targets = set(pools)
    removed = Counter()
    if not targets:
        return removed
    air_state = next(
        (index for index, state in enumerate(root["palette"]) if state["Name"].value == "minecraft:air"),
        None,
    )
    if air_state is None:
        air = TAG_Compound()
        air.tags.append(TAG_String(name="Name", value="minecraft:air"))
        root["palette"].tags.append(air)
        air_state = len(root["palette"]) - 1
    for block in root["blocks"]:
        if "nbt" not in block:
            continue
        nbt = block["nbt"]
        if "id" not in nbt or nbt["id"].value != "minecraft:jigsaw" or "pool" not in nbt:
            continue
        pool = nbt["pool"].value
        if pool not in targets:
            continue
        block["state"].value = air_state
        block.tags.remove(nbt)
        removed[pool] += 1
    return removed


def serialize_nbt(root: NBTFile) -> bytes:
    raw = io.BytesIO()
    root.write_file(buffer=raw)
    return raw.getvalue()


def write_nbt(root: NBTFile, target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(gzip.compress(serialize_nbt(root), mtime=0))


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--mapping", type=Path, default=DEFAULT_MAPPING)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument("--apply", action="store_true", help="write themed NBT overrides")
    parser.add_argument("--top", type=int, default=40, help="audit rows per structure group")
    parser.add_argument("--group", action="append", help="process only the selected group; may be repeated")
    parser.add_argument("--report-json", type=Path, help="write machine-readable audit results")
    parser.add_argument("--validate-only", action="store_true", help="validate mapping targets without reading NBT files")
    parser.add_argument("--verify-output", action="store_true", help="compare generated files byte-for-byte after decompression")
    parser.add_argument("--clean-output", action="store_true", help="delete generated NBT files for selected groups")
    args = parser.parse_args()

    source_jar = find_source_jar()
    mapping = load_mapping(args.mapping)
    groups = mapping["groups"]
    if args.group:
        selected = set(args.group)
        unknown = selected.difference(groups)
        if unknown:
            raise SystemExit("Unknown structure group: " + ", ".join(sorted(unknown)))
        groups = {name: config for name, config in groups.items() if name in selected}
    validate_replacement_targets(groups)
    if args.clean_output:
        if not args.group:
            raise SystemExit("--clean-output requires at least one --group")
        output_root = args.output.resolve()
        expected_root = DEFAULT_OUTPUT.resolve()
        if output_root != expected_root:
            raise SystemExit(f"Refusing to clean unexpected output directory: {output_root}")
        removed = 0
        for path in output_root.glob("*.nbt"):
            if group_for(path.name, groups) is None:
                continue
            path.unlink()
            removed += 1
        print(f"Removed {removed} generated structure files")
        return 0
    if args.validate_only:
        print(f"Validated {sum(len(config.get('replacements', {})) for config in groups.values())} mappings")
        return 0
    totals: dict[str, Counter] = {name: Counter() for name in groups}
    changed_totals: dict[str, Counter] = {name: Counter() for name in groups}
    removed_jigsaws: dict[str, Counter] = {name: Counter() for name in groups}
    file_counts = Counter()

    with zipfile.ZipFile(source_jar) as archive:
        entries = sorted(
            name for name in archive.namelist()
            if name.startswith(STRUCTURE_PREFIX) and name.endswith(".nbt")
        )
        for entry in entries:
            filename = Path(entry).name
            matched = group_for(filename, groups)
            if matched is None:
                continue
            group_name, config = matched
            root = read_nbt(archive.read(entry))
            totals[group_name].update(palette_usage(root))
            file_counts[group_name] += 1
            changed_totals[group_name].update(replace_palette(root, config.get("replacements", {})))
            removed_jigsaws[group_name].update(remove_jigsaw_pools(root, config.get("remove_jigsaw_pools", [])))
            if args.apply:
                write_nbt(root, args.output / filename)
            if args.verify_output:
                target = args.output / filename
                if not target.is_file():
                    raise SystemExit(f"Missing generated structure: {target.relative_to(ROOT)}")
                actual = gzip.decompress(target.read_bytes())
                expected = serialize_nbt(root)
                if actual != expected:
                    raise SystemExit(f"Generated structure differs from mapping: {target.relative_to(ROOT)}")
                read_nbt(target.read_bytes())

    print(f"Source: {source_jar.relative_to(ROOT)}")
    print(f"Mode: {'apply' if args.apply else 'audit'}")
    if args.verify_output:
        print("Output verification: enabled")
    for group_name, config in groups.items():
        print(f"\n[{group_name}] {config.get('theme', '')} files={file_counts[group_name]}")
        if changed_totals[group_name]:
            print("Planned palette replacements:")
            for (old, new), count in changed_totals[group_name].most_common():
                print(f"  {count:4d} states  {old} -> {new}")
        else:
            print("Planned palette replacements: none")
        if removed_jigsaws[group_name]:
            print("Removed jigsaw pools:")
            for pool, count in removed_jigsaws[group_name].most_common():
                print(f"  {count:4d} connectors  {pool}")
        print("Most-used source blocks:")
        for block, count in totals[group_name].most_common(args.top):
            print(f"  {count:7d}  {block}")

    if args.apply:
        print(f"\nWrote themed structures to: {args.output.relative_to(ROOT)}")
    if args.report_json:
        report = {
            "source": str(source_jar.relative_to(ROOT)),
            "mode": "apply" if args.apply else "audit",
            "groups": {
                name: {
                    "theme": groups[name].get("theme", ""),
                    "files": file_counts[name],
                    "blocks": totals[name].most_common(),
                    "replacements": [
                        {"old": old, "new": new, "palette_states": count}
                        for (old, new), count in changed_totals[name].most_common()
                    ],
                    "removed_jigsaw_pools": dict(removed_jigsaws[name]),
                }
                for name in groups
            },
        }
        args.report_json.parent.mkdir(parents=True, exist_ok=True)
        args.report_json.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return 0


if __name__ == "__main__":
    sys.exit(main())
