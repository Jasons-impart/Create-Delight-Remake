#!/usr/bin/env python3
"""Warn when CurseForge client overrides bundle mods outside the approved list."""

from __future__ import annotations

import argparse
import io
import re
import sys
import tomllib
import urllib.request
import xml.etree.ElementTree as ET
import zipfile
from pathlib import Path


ALLOWLIST_XLSX_URL = (
    "https://docs.google.com/spreadsheets/d/"
    "176Wv-PZUo9hFxy6oC6N8tWdquBLPRtSuLbNK-r0_byM/export?format=xlsx"
)
MAIN_NS = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
REL_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"


def normalize(value: str) -> str:
    """Normalize display names without conflating different words."""
    return re.sub(r"\s+", " ", value.strip()).casefold()


def text_from_shared_string(element: ET.Element) -> str:
    return "".join(node.text or "" for node in element.iter(f"{{{MAIN_NS}}}t"))


def xlsx_cell_texts(data: bytes) -> tuple[set[str], int]:
    """Return every non-empty cell value from every worksheet in an XLSX export."""
    with zipfile.ZipFile(io.BytesIO(data)) as workbook:
        shared_strings: list[str] = []
        if "xl/sharedStrings.xml" in workbook.namelist():
            root = ET.fromstring(workbook.read("xl/sharedStrings.xml"))
            shared_strings = [text_from_shared_string(item) for item in root]

        relationships = ET.fromstring(workbook.read("xl/_rels/workbook.xml.rels"))
        targets = {relation.attrib["Id"]: relation.attrib["Target"] for relation in relationships}
        sheets = ET.fromstring(workbook.read("xl/workbook.xml")).findall(
            f".//{{{MAIN_NS}}}sheet"
        )
        values: set[str] = set()
        for sheet in sheets:
            relationship_id = sheet.attrib[f"{{{REL_NS}}}id"]
            target = targets[relationship_id].lstrip("/")
            path = target if target.startswith("xl/") else f"xl/{target}"
            root = ET.fromstring(workbook.read(path))
            for cell in root.findall(f".//{{{MAIN_NS}}}c"):
                value = cell.find(f"{{{MAIN_NS}}}v")
                if value is None or not value.text:
                    continue
                text = value.text
                if cell.attrib.get("t") == "s":
                    text = shared_strings[int(text)]
                if normalized := normalize(text):
                    values.add(normalized)
        return values, len(sheets)


def read_allowlist(url: str, local_path: Path | None) -> tuple[set[str], int]:
    if local_path:
        return xlsx_cell_texts(local_path.read_bytes())

    request = urllib.request.Request(url, headers={"User-Agent": "CreateDelightRemake-release-audit"})
    with urllib.request.urlopen(request, timeout=30) as response:
        return xlsx_cell_texts(response.read())


def jar_mod_details(path: Path) -> tuple[str, str]:
    """Return a human-readable display name and mod id, falling back to the filename."""
    try:
        with zipfile.ZipFile(path) as archive:
            with archive.open("META-INF/mods.toml") as metadata_file:
                metadata = tomllib.load(metadata_file)
        mods = metadata.get("mods", [])
        if mods:
            mod = mods[0]
            return str(mod.get("displayName") or mod.get("modId") or path.stem), str(
                mod.get("modId") or "unknown"
            )
    except (KeyError, OSError, tomllib.TOMLDecodeError, zipfile.BadZipFile):
        pass
    return path.stem, "unknown"


def bundled_mod_jars(client_dir: Path) -> list[Path]:
    """Find JARs physically included in the exported CurseForge client package."""
    candidates = (client_dir / "overrides" / "mods", client_dir / "mods")
    return sorted({jar.resolve() for directory in candidates if directory.is_dir() for jar in directory.glob("*.jar")})


def audit(client_dir: Path, allowlist: set[str]) -> list[tuple[Path, str, str]]:
    findings = []
    for jar in bundled_mod_jars(client_dir):
        display_name, mod_id = jar_mod_details(jar)
        if normalize(display_name) not in allowlist:
            findings.append((jar, display_name, mod_id))
    return findings


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--client-dir", required=True, type=Path)
    parser.add_argument("--allowlist-url", default=ALLOWLIST_XLSX_URL)
    parser.add_argument("--allowlist-xlsx", type=Path)
    args = parser.parse_args()

    if not args.client_dir.is_dir():
        print(f"Client artifact directory not found: {args.client_dir}", file=sys.stderr)
        return 2

    try:
        allowlist, sheet_count = read_allowlist(args.allowlist_url, args.allowlist_xlsx)
    except Exception as error:  # A workflow-level continue-on-error keeps release publishing unblocked.
        print(f"Unable to load CurseForge approved-mod list: {error}", file=sys.stderr)
        return 2

    jars = bundled_mod_jars(args.client_dir)
    print(
        f"::notice::Loaded {len(allowlist)} values from {sheet_count} CurseForge allowlist worksheet(s); "
        f"auditing {len(jars)} bundled mod JAR(s)."
    )
    for jar, display_name, mod_id in audit(args.client_dir, allowlist):
        relative = jar.relative_to(args.client_dir.resolve())
        print(
            f"::warning file={relative.as_posix()}::Bundled mod is not in the CurseForge approved "
            f"non-CurseForge list: {display_name} (mod id: {mod_id})"
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
