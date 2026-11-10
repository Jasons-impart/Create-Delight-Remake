#!/usr/bin/env python3
"""Category-wide Packwiz metadata reconciliation.

Python 3.11+ stdlib port of the former update-packwiz-meta.ps1 implementation.
Keep CLI names/aliases, messages, and exit codes aligned with that script.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import math
import os
import re
import shutil
import socket
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
import uuid
import zipfile
from collections.abc import Iterable, Sequence
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

if str(Path(__file__).resolve().parent) not in sys.path:
    sys.path.insert(0, str(Path(__file__).resolve().parent))

from packwiz_common import (
    default_packwiz_filename,
    default_packwiz_url,
    ensure_tool,
    hidden_popen_kwargs,
    resolve_python_command as shared_resolve_python_command,
    write_utf8_no_bom,
)


VALID_CATEGORIES = ("mods", "resourcepacks", "shaderpacks", "tacz")
VALID_SIDES = ("both", "client", "server")
DEFAULT_INSTALLER_URL = (
    "https://github.com/packwiz/packwiz-installer/releases/latest/download/packwiz-installer.jar"
)
PACKWIZ_FILES_RAW_URL_PATTERN = re.compile(
    r"https://raw\.githubusercontent\.com/Jasons-impart/Create-Delight-Remake/.+/packwiz-files/"
)
PACKWIZ_FILES_RAW_URL_PATTERN_CI = re.compile(
    r"https://raw\.githubusercontent\.com/Jasons-impart/Create-Delight-Remake/.+/packwiz-files/",
    re.IGNORECASE,
)
SIDE_LINE_PATTERN = re.compile(r'(?m)^side\s*=\s*".*"$')
SIDE_LINE_PATTERN_CI = re.compile(r'(?m)^side\s*=\s*".*"$', re.IGNORECASE)
FILENAME_LINE_PATTERN = re.compile(r'(?m)^(filename\s*=\s*".*"\s*)$')
FILENAME_PRESENT_CI = re.compile(r"(?m)^filename\s*=", re.IGNORECASE)
LOADER_VERSION_PATTERN = re.compile(r"^\s*(forge|neoforge|fabric|quilt|liteloader)\s*=")
SECTION_PATTERN = re.compile(r"^\s*\[([^]]+)\]\s*$")
VERSION_SUFFIX_PATTERN = re.compile(r"(?i)\s*[\(\[]\s*(?:mc\s*)?v?\d[^\)\]]*[\)\]]\s*$")
NATURAL_DIGIT_PATTERN = re.compile(r"\d+")
CAMEL_1 = re.compile(r"([a-z0-9])([A-Z])")
CAMEL_2 = re.compile(r"([A-Z]+)([A-Z][a-z])")
SEPARATOR_RUN = re.compile(r"[_\-.]+")
WHITESPACE_RUN = re.compile(r"\s+")
ADDED_PROJECT_PATTERN = re.compile(r'^Project "(.+)" successfully added! \((.+)\)$', re.IGNORECASE)
MANAGED_MODE_PATTERN = re.compile(r'mode\s*=\s*"metadata:(curseforge|modrinth)"', re.IGNORECASE)
MANAGED_UPDATE_PATTERN = re.compile(r"\[update\.(curseforge|modrinth)\]", re.IGNORECASE)
PROJECT_ID_PATTERN = re.compile(r"(?m)^project-id\s*=\s*(\d+)\s*$", re.IGNORECASE)
FILE_ID_PATTERN = re.compile(r"(?m)^file-id\s*=\s*(\d+)\s*$", re.IGNORECASE)
RELEASE_SECTION_PATTERN = re.compile(r"(?ms)\[release\.curseforge\].*", re.IGNORECASE)
RELEASE_SECTION_STRIP_PATTERN = re.compile(
    r"(?ms)\r?\n*\[release\.curseforge\]\s*project-id\s*=\s*\d+\s*file-id\s*=\s*\d+\s*$"
)
RESTRICTED_PATTERN = re.compile(
    r"excluded from the CurseForge API and must be downloaded manually",
    re.IGNORECASE,
)

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parent


class CIDict:
    """PowerShell-like case-insensitive string hashtable."""

    def __init__(self) -> None:
        self._data: dict[str, Any] = {}
        self._keys: dict[str, str] = {}

    def _norm(self, key: str) -> str:
        return str(key).casefold()

    def __setitem__(self, key: str, value: Any) -> None:
        norm = self._norm(key)
        existing = self._keys.get(norm)
        if existing is not None and existing != key:
            del self._data[existing]
        self._keys[norm] = existing if existing is not None else key
        stored = self._keys[norm]
        self._data[stored] = value

    def __getitem__(self, key: str) -> Any:
        return self._data[self._keys[self._norm(key)]]

    def __contains__(self, key: object) -> bool:
        if not isinstance(key, str):
            return False
        return self._norm(key) in self._keys

    def __delitem__(self, key: str) -> None:
        norm = self._norm(key)
        stored = self._keys[norm]
        del self._data[stored]
        del self._keys[norm]

    def get(self, key: str, default: Any = None) -> Any:
        norm = self._norm(key)
        stored = self._keys.get(norm)
        if stored is None:
            return default
        return self._data[stored]

    def keys(self) -> Iterable[str]:
        return self._data.keys()

    def values(self) -> Iterable[Any]:
        return self._data.values()

    def items(self) -> Iterable[tuple[str, Any]]:
        return self._data.items()

    def __len__(self) -> int:
        return len(self._data)


class CISet:
    def __init__(self) -> None:
        self._keys: dict[str, str] = {}

    def add(self, value: str) -> None:
        self._keys[value.casefold()] = value

    def __contains__(self, value: object) -> bool:
        if not isinstance(value, str):
            return False
        return value.casefold() in self._keys


def ps_eq(left: str | None, right: str | None) -> bool:
    if left is None or right is None:
        return left == right
    return left.casefold() == right.casefold()


def write_status(message: str) -> None:
    print(f"[meta] {message}", flush=True)


def write_warn(message: str) -> None:
    print(f"[warn] {message}", flush=True)


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def escape_data_string(value: str) -> str:
    return urllib.parse.quote(value, safe="")


def escape_data_string_keep_slash(value: str) -> str:
    return urllib.parse.quote(value, safe="/")


def escape_toml_string(value: str | None) -> str:
    if value is None:
        return ""
    return value.replace("\\", "\\\\").replace('"', '\\"')


def resolve_python_command() -> str:
    try:
        return shared_resolve_python_command()
    except RuntimeError:
        raise RuntimeError("Python was not found. Install Python so the local static server can run.") from None


def resolve_java_command() -> str:
    java_home = os.environ.get("JAVA_HOME")
    if java_home:
        for name in ("java.exe", "java"):
            candidate = Path(java_home) / "bin" / name
            if candidate.is_file():
                return str(candidate)
    variables_path = REPO_ROOT / "variables.txt"
    if variables_path.is_file():
        for raw_line in variables_path.read_text(encoding="utf-8", errors="replace").splitlines():
            match = re.match(r"^\s*JAVA\s*=\s*(.+?)\s*$", raw_line)
            if not match:
                continue
            trimmed = match.group(1).strip().strip('"')
            if trimmed and Path(trimmed).exists():
                return trimmed
    java_cmd = shutil.which("java")
    if java_cmd:
        return java_cmd
    raise RuntimeError("Java 17 was not found. Set JAVA_HOME, install java on PATH, or update variables.txt.")


def get_free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as listener:
        listener.bind(("127.0.0.1", 0))
        return int(listener.getsockname()[1])


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")




def get_git_ref_for_packwiz_files(explicit_ref: str | None) -> str:
    if explicit_ref is not None and str(explicit_ref).strip():
        return explicit_ref.strip()
    try:
        branch = subprocess.run(
            ["git", "-C", str(REPO_ROOT), "branch", "--show-current"],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            **hidden_popen_kwargs(),
        )
        if branch.returncode == 0 and branch.stdout.strip():
            return branch.stdout.strip()
    except OSError:
        pass
    try:
        commit = subprocess.run(
            ["git", "-C", str(REPO_ROOT), "rev-parse", "HEAD"],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            **hidden_popen_kwargs(),
        )
        if commit.returncode == 0 and commit.stdout.strip():
            return commit.stdout.strip()
    except OSError:
        pass
    return "main"


def resolve_packwiz_files_raw_prefix(explicit_prefix: str | None, explicit_ref: str | None) -> str:
    if explicit_prefix is not None and str(explicit_prefix).strip():
        return explicit_prefix.rstrip("/") + "/"
    ref = get_git_ref_for_packwiz_files(explicit_ref)
    escaped = escape_data_string_keep_slash(ref)
    return f"https://raw.githubusercontent.com/Jasons-impart/Create-Delight-Remake/{escaped}/packwiz-files/"


def test_packwiz_files_raw_url(url: str | None) -> bool:
    return bool(url and str(url).strip() and PACKWIZ_FILES_RAW_URL_PATTERN_CI.search(url))


def normalize_packwiz_files_raw_prefix_in_file(path: Path, replacement: str) -> bool:
    content = read_text(path)
    if not PACKWIZ_FILES_RAW_URL_PATTERN_CI.search(content):
        return False
    # [regex]::Replace is case-sensitive; -notmatch above is case-insensitive.
    new_content = PACKWIZ_FILES_RAW_URL_PATTERN.sub(replacement, content)
    if new_content == content:
        return False
    write_utf8_no_bom(path, new_content)
    return True


def invoke_generate_packwiz_files(output_dir: Path) -> None:
    python_exe = resolve_python_command()
    result = subprocess.run(
        [
            python_exe,
            str(SCRIPT_DIR / "generate-packwiz-files.py"),
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


def get_asset_files(directory: Path, category: str = "mods") -> CIDict:
    files = CIDict()
    if not directory.is_dir():
        return files
    for path in directory.iterdir():
        if not path.is_file():
            continue
        if path.suffix.lower() not in {".jar", ".zip"}:
            continue
        if category == "shaderpacks" and re.search(r"Clrwl", path.name, re.IGNORECASE):
            continue
        files[path.name] = str(path)
    return files


def remove_filename_version_suffix(value: str | None) -> str:
    if not value:
        return ""
    result = value.strip()
    while True:
        match = VERSION_SUFFIX_PATTERN.search(result)
        if not match:
            break
        result = result[: match.start()].rstrip()
    return result


def derive_base_name(filename: str | None) -> str:
    if not filename:
        return ""
    name = remove_filename_version_suffix(Path(filename).stem)
    parts = re.split(r"[-_]", name)
    base_parts: list[str] = []
    for part in parts:
        if re.match(r"^v?\d", part, re.IGNORECASE):
            break
        if re.match(r"^(forge|fabric|neoforge|quilt|mc\d|release|alpha|beta|for|neo)$", part, re.IGNORECASE):
            continue
        base_parts.append(part)
    if not base_parts:
        return name.lower()
    return "_".join(base_parts).lower()


def get_search_stem_from_filename(filename: str | None) -> str:
    if not filename:
        return ""
    name = remove_filename_version_suffix(Path(filename).stem)
    parts = re.split(r"[-_]", name)
    kept: list[str] = []
    for part in parts:
        trimmed = part.strip()
        if not trimmed:
            continue
        if re.match(r"^v?\d", trimmed, re.IGNORECASE):
            break
        if re.match(
            r"^(forge|fabric|neoforge|quilt|release|alpha|beta|snapshot|universal|all)$",
            trimmed,
            re.IGNORECASE,
        ):
            continue
        if re.match(r"^mc\d", trimmed, re.IGNORECASE):
            continue
        kept.append(trimmed)
    if kept:
        return " ".join(kept)
    return name


def get_natural_sort_key(value: str | None) -> str:
    if not value:
        return ""
    return NATURAL_DIGIT_PATTERN.sub(lambda match: match.group(0).rjust(20, "0"), value.lower())


def get_preferred_filename(filenames: Sequence[str] | None) -> str | None:
    candidates: list[str] = []
    seen: set[str] = set()
    for name in filenames or []:
        if name is None or not str(name).strip():
            continue
        if name in seen:
            continue
        seen.add(name)
        candidates.append(name)
    if not candidates:
        return None
    return sorted(candidates, key=get_natural_sort_key)[-1]


def split_identifier_words(text: str | None) -> list[str]:
    if not text:
        return []
    normalized = CAMEL_1.sub(r"\1 \2", text)
    normalized = CAMEL_2.sub(r"\1 \2", normalized)
    normalized = SEPARATOR_RUN.sub(" ", normalized)
    normalized = WHITESPACE_RUN.sub(" ", normalized).strip()
    if not normalized:
        return []
    return normalized.split(" ")


def join_identifier_words(text: str | None, separator: str = " ") -> str | None:
    words = split_identifier_words(text)
    if not words:
        return None
    return separator.join(word.lower() for word in words)


def get_category_display_name(value: str) -> str:
    return {
        "mods": "mod",
        "resourcepacks": "resource pack",
        "shaderpacks": "shaderpack",
        "tacz": "TACZ gun pack",
    }.get(value, "asset")


def get_curseforge_category_slug(value: str) -> str | None:
    return {
        "mods": "mc-mods",
        "resourcepacks": "texture-packs",
        "shaderpacks": "shaders",
        "tacz": "customization",
    }.get(value)


def convert_to_meta_slug(value: str | None) -> str | None:
    if value is None or not str(value).strip():
        return None
    slug = re.sub(r"[^a-z0-9]+", "-", value.strip().lower()).strip("-")
    return slug or None


def parse_pw_toml(path: Path) -> dict[str, Any]:
    content = read_text(path)
    result: dict[str, Any] = {}
    patterns = {
        "Name": re.compile(r'(?m)^name\s*=\s*"(.+)"', re.IGNORECASE),
        "Filename": re.compile(r'(?m)^filename\s*=\s*"(.+)"', re.IGNORECASE),
        "Side": re.compile(r'(?m)^side\s*=\s*"(.+)"', re.IGNORECASE),
        "DownloadUrl": re.compile(r'(?m)^url\s*=\s*"(.+)"', re.IGNORECASE),
        "HashFormat": re.compile(r'(?m)^hash-format\s*=\s*"(.+)"', re.IGNORECASE),
        "Hash": re.compile(r'(?m)^hash\s*=\s*"(.+)"', re.IGNORECASE),
    }
    for key, pattern in patterns.items():
        match = pattern.search(content)
        if match:
            result[key] = match.group(1)
    result["IsManaged"] = bool(MANAGED_MODE_PATTERN.search(content) or MANAGED_UPDATE_PATTERN.search(content))
    return result


def get_toml_val(data: dict[str, Any] | None, key: str) -> Any:
    if data and key in data:
        return data[key]
    return None


def normalize_pw_side(side: str | None) -> str:
    if side is None or not str(side).strip():
        return "both"
    normalized = side.strip().lower()
    if normalized in VALID_SIDES:
        return normalized
    return "both"


def get_default_pw_side_for_category(value: str) -> str:
    if value in {"mods", "tacz"}:
        return "both"
    return "client"


def set_pw_toml_side(content: str, side: str) -> str:
    side_value = normalize_pw_side(side)
    if SIDE_LINE_PATTERN_CI.search(content):
        return SIDE_LINE_PATTERN.sub(f'side = "{side_value}"', content, count=1)
    if FILENAME_PRESENT_CI.search(content):
        return FILENAME_LINE_PATTERN.sub(rf'\1\nside = "{side_value}"', content, count=1)
    return f'side = "{side_value}"\n{content}'


@dataclass
class PwEntry:
    pw_toml_path: Path
    pw_toml_name: str
    slug: str
    filename: str | None
    name: str | None
    side: str
    data: dict[str, Any]
    is_managed: bool


@dataclass
class MetadataState:
    pw_tomls: list[Path]
    pw_entries: list[PwEntry]
    filename_owners: CIDict
    referenced_filenames: CISet


def get_pw_metadata_state(mods_directory: Path) -> MetadataState:
    pw_tomls = [path for path in mods_directory.iterdir() if path.is_file() and path.name.lower().endswith(".pw.toml")]
    pw_entries: list[PwEntry] = []
    filename_owners = CIDict()
    referenced = CISet()
    for pw_toml in pw_tomls:
        data = parse_pw_toml(pw_toml)
        current_filename = get_toml_val(data, "Filename")
        name = get_toml_val(data, "Name")
        slug = Path(pw_toml.name).stem
        if slug.lower().endswith(".pw"):
            slug = slug[:-3]
        entry = PwEntry(
            pw_toml_path=pw_toml,
            pw_toml_name=pw_toml.name,
            slug=slug,
            filename=current_filename,
            name=name,
            side=normalize_pw_side(get_toml_val(data, "Side")),
            data=data,
            is_managed=bool(get_toml_val(data, "IsManaged")),
        )
        pw_entries.append(entry)
        if current_filename:
            referenced.add(current_filename)
            owners = filename_owners.get(current_filename)
            if owners is None:
                filename_owners[current_filename] = [entry]
            else:
                owners.append(entry)
    return MetadataState(pw_tomls, pw_entries, filename_owners, referenced)


@dataclass
class CfIdentity:
    project_id: int
    file_id: int
    cache_key: str


def get_curseforge_metadata_identity(content: str | None) -> CfIdentity | None:
    if not content:
        return None
    project_match = PROJECT_ID_PATTERN.search(content)
    if not project_match:
        return None
    file_match = FILE_ID_PATTERN.search(content)
    if not file_match:
        return None
    project_id = int(project_match.group(1))
    file_id = int(file_match.group(1))
    return CfIdentity(project_id, file_id, f"{project_id}:{file_id}")




class PackwizMetaContext:
    def __init__(self, args: argparse.Namespace) -> None:
        self.category: str = args.category
        self.packwiz_url: str = args.packwiz_url
        self.installer_url: str = args.installer_url
        self.allow_removals: bool = args.allow_removals
        self.packwiz_files_raw_prefix = resolve_packwiz_files_raw_prefix(
            args.packwiz_files_raw_prefix,
            args.packwiz_files_ref,
        )
        self.tools_root = REPO_ROOT / ".cache" / "packwiz-sync" / "tools"
        self.packwiz_exe = self.tools_root / default_packwiz_filename()
        self.installer_jar = self.tools_root / "packwiz-installer.jar"
        self.packwiz_files_root = REPO_ROOT / "packwiz-files"
        self.packwiz_files_category_root = self.packwiz_files_root / self.category
        self.temp_detect_root = REPO_ROOT / ".cache" / "packwiz-sync" / "cf-add"
        self.static_server_script = SCRIPT_DIR / "packwiz-static-server.py"
        self.probe_cache_path = REPO_ROOT / ".cache" / "packwiz-sync" / "cf-downloadability-cache.json"
        self.probe_cache: dict[str, dict[str, Any]] | None = None
        self.probe_tools: dict[str, str] | None = None

    def load_probe_cache(self) -> dict[str, dict[str, Any]]:
        if self.probe_cache is not None:
            return self.probe_cache
        cache: dict[str, dict[str, Any]] = {}
        if self.probe_cache_path.is_file():
            try:
                raw = self.probe_cache_path.read_text(encoding="utf-8")
                if raw.strip():
                    data = json.loads(raw)
                    if isinstance(data, dict):
                        for key, value in data.items():
                            entry: dict[str, Any] = {}
                            if isinstance(value, dict):
                                entry.update(value)
                            cache[str(key)] = entry
            except (OSError, json.JSONDecodeError):
                write_warn("  ! Failed to read CurseForge downloadability cache; rebuilding it this run.")
        self.probe_cache = cache
        return cache

    def save_probe_cache(self) -> None:
        cache = self.load_probe_cache()
        self.probe_cache_path.parent.mkdir(parents=True, exist_ok=True)
        ordered = {key: cache[key] for key in sorted(cache)}
        write_utf8_no_bom(self.probe_cache_path, json.dumps(ordered, indent=2) + "\n")

    def initialize_probe_tools(self) -> dict[str, str]:
        if self.probe_tools:
            return self.probe_tools
        ensure_tool(self.installer_url, self.installer_jar, write_status, None)
        if not self.static_server_script.is_file():
            raise RuntimeError(f"Static server script was not found at '{self.static_server_script}'.")
        self.probe_tools = {
            "JavaCommand": resolve_java_command(),
            "PythonCommand": resolve_python_command(),
        }
        return self.probe_tools


def get_first_meaningful_output_line(lines: Sequence[object]) -> str | None:
    skip = (
        re.compile(r"^\d+\s+mods? to install", re.IGNORECASE),
        re.compile(r"^Loading modpack", re.IGNORECASE),
        re.compile(r"^Refreshing index", re.IGNORECASE),
        re.compile(r"^Updating your files", re.IGNORECASE),
        re.compile(r"^Starting install", re.IGNORECASE),
    )
    for line in lines:
        text = str(line)
        if text is None or not str(text).strip():
            continue
        trimmed = text.strip()
        if any(pattern.search(trimmed) for pattern in skip):
            continue
        return trimmed
    return None


def invoke_packwiz_command(ctx: PackwizMetaContext, arguments: Sequence[str], working_directory: Path | None = None) -> tuple[int, list[str]]:
    cwd = working_directory if working_directory is not None else REPO_ROOT
    result = subprocess.run(
        [str(ctx.packwiz_exe), *arguments],
        cwd=str(cwd),
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
        **hidden_popen_kwargs(),
    )
    combined = (result.stdout or "") + (result.stderr or "")
    return result.returncode, combined.splitlines()


def add_unique_candidate(candidates: list[str], seen: set[str], value: str | None) -> None:
    if value is None or not str(value).strip():
        return
    trimmed = value.strip()
    if len(trimmed) < 2:
        return
    key = trimmed.lower()
    if key not in seen:
        seen.add(key)
        candidates.append(trimmed)


def read_zip_entry_text(archive: zipfile.ZipFile, entry_path: str) -> str | None:
    try:
        with archive.open(entry_path) as handle:
            return handle.read().decode("utf-8", errors="replace")
    except KeyError:
        return None


def get_jar_metadata(path: str | Path) -> dict[str, Any]:
    result: dict[str, Any] = {"DisplayName": None, "ModId": None}
    file_path = Path(path)
    if not file_path.is_file():
        return result
    try:
        with zipfile.ZipFile(file_path) as archive:
            mods_toml = read_zip_entry_text(archive, "META-INF/mods.toml")
            if not mods_toml:
                mods_toml = read_zip_entry_text(archive, "META-INF/neoforge.mods.toml")
            if mods_toml:
                match = re.search(r'(?ms)\[\[mods\]\].*?modId\s*=\s*"([^"]+)"', mods_toml, re.IGNORECASE)
                if match:
                    result["ModId"] = match.group(1)
                match = re.search(r'(?ms)\[\[mods\]\].*?displayName\s*=\s*"([^"]+)"', mods_toml, re.IGNORECASE)
                if match:
                    result["DisplayName"] = match.group(1)
            if not result["DisplayName"] or not result["ModId"]:
                fabric_meta = read_zip_entry_text(archive, "fabric.mod.json")
                if fabric_meta:
                    if not result["ModId"]:
                        match = re.search(r'"id"\s*:\s*"([^"]+)"', fabric_meta, re.IGNORECASE)
                        if match:
                            result["ModId"] = match.group(1)
                    if not result["DisplayName"]:
                        match = re.search(r'"name"\s*:\s*"([^"]+)"', fabric_meta, re.IGNORECASE)
                        if match:
                            result["DisplayName"] = match.group(1)
            if not result["DisplayName"] or not result["ModId"]:
                quilt_meta = read_zip_entry_text(archive, "quilt.mod.json")
                if quilt_meta:
                    if not result["ModId"]:
                        match = re.search(r'"id"\s*:\s*"([^"]+)"', quilt_meta, re.IGNORECASE)
                        if match:
                            result["ModId"] = match.group(1)
                    if not result["DisplayName"]:
                        match = re.search(r'"name"\s*:\s*"([^"]+)"', quilt_meta, re.IGNORECASE)
                        if match:
                            result["DisplayName"] = match.group(1)
    except Exception:
        return result
    return result


def get_display_name_from_source(filename: str, jar_metadata: dict[str, Any]) -> str:
    display_name = get_toml_val(jar_metadata, "DisplayName")
    if display_name:
        return display_name
    search_stem = get_search_stem_from_filename(filename)
    if search_stem:
        words = split_identifier_words(search_stem)
        if words:
            return " ".join(words)
    return Path(filename).stem


def get_curseforge_candidates(filename: str, jar_metadata: dict[str, Any]) -> list[str]:
    candidates: list[str] = []
    seen: set[str] = set()
    full_stem = Path(filename).stem
    search_stem = get_search_stem_from_filename(filename)
    base_name = derive_base_name(filename)
    preferred_values = [
        get_toml_val(jar_metadata, "ModId"),
        base_name,
        base_name.replace("_", "-") if base_name else None,
        full_stem,
        search_stem,
        get_toml_val(jar_metadata, "DisplayName"),
    ]
    for value in preferred_values:
        add_unique_candidate(candidates, seen, join_identifier_words(value, "-"))
        add_unique_candidate(candidates, seen, value)
        add_unique_candidate(candidates, seen, join_identifier_words(value, ""))
        add_unique_candidate(candidates, seen, join_identifier_words(value, " "))
    return candidates




@dataclass
class ProbeWorkspace:
    root: Path
    pack_root: Path
    mods_root: Path
    install_root: Path
    serve_log: Path
    serve_err_log: Path


def new_curseforge_probe_workspace(ctx: PackwizMetaContext) -> ProbeWorkspace:
    root = ctx.temp_detect_root / f"probe-{uuid.uuid4()}"
    pack_root = root / "pack"
    mods_root = pack_root / "mods"
    install_root = root / "install"
    mods_root.mkdir(parents=True, exist_ok=True)
    install_root.mkdir(parents=True, exist_ok=True)
    packwiz_ignore = REPO_ROOT / ".packwizignore"
    if packwiz_ignore.is_file():
        shutil.copy2(packwiz_ignore, pack_root / ".packwizignore")
    invoke_generate_packwiz_files(pack_root)
    return ProbeWorkspace(
        root=root,
        pack_root=pack_root,
        mods_root=mods_root,
        install_root=install_root,
        serve_log=root / "serve.log",
        serve_err_log=root / "serve.err.log",
    )


@dataclass
class Downloadability:
    status: str
    used_cache: bool
    reason: str


def get_curseforge_downloadability(ctx: PackwizMetaContext, content: str, meta_file_name: str | None, name: str | None) -> Downloadability:
    identity = get_curseforge_metadata_identity(content)
    if not identity:
        return Downloadability("unknown", False, "Metadata is missing a CurseForge project-id or file-id.")

    cache = ctx.load_probe_cache()
    if identity.cache_key in cache:
        cached = cache[identity.cache_key]
        cached_status = str(cached.get("status", "") or "")
        if cached_status.lower() in {"downloadable", "restricted"}:
            reason = (
                "Cached as third-party downloadable."
                if cached_status.lower() == "downloadable"
                else "Cached as manual-download only."
            )
            return Downloadability(cached_status.lower(), True, reason)

    try:
        tools = ctx.initialize_probe_tools()
    except Exception as exc:
        return Downloadability("unknown", False, str(exc))

    workspace = new_curseforge_probe_workspace(ctx)
    serve_process = None
    try:
        probe_meta_name = meta_file_name
        if probe_meta_name is None or not str(probe_meta_name).strip():
            probe_meta_name = f"probe-{identity.project_id}-{identity.file_id}.pw.toml"
        write_utf8_no_bom(workspace.mods_root / probe_meta_name, content)

        exit_code, output = invoke_packwiz_command(ctx, ["refresh"], workspace.pack_root)
        if exit_code != 0:
            reason = get_first_meaningful_output_line(output) or f"packwiz refresh exited with code {exit_code}."
            return Downloadability("unknown", False, reason)

        for log_path in (workspace.serve_log, workspace.serve_err_log):
            if log_path.exists():
                log_path.unlink()
        port = get_free_port()
        pack_url = f"http://127.0.0.1:{port}/pack.toml"
        serve_stdout = workspace.serve_log.open("w", encoding="utf-8")
        serve_stderr = workspace.serve_err_log.open("w", encoding="utf-8")
        serve_process = subprocess.Popen(
            [tools["PythonCommand"], str(ctx.static_server_script), str(port), str(workspace.pack_root)],
            cwd=str(workspace.pack_root),
            stdout=serve_stdout,
            stderr=serve_stderr,
            **hidden_popen_kwargs(),
        )
        serve_stdout.close()
        serve_stderr.close()

        server_ready = False
        for _ in range(50):
            try:
                urllib.request.urlopen(pack_url, timeout=1)
                server_ready = True
                break
            except (urllib.error.URLError, TimeoutError, OSError):
                time.sleep(0.2)
        if not server_ready:
            serve_error = ""
            if workspace.serve_err_log.is_file():
                serve_error = workspace.serve_err_log.read_text(encoding="utf-8", errors="replace").strip()
            return Downloadability("unknown", False, serve_error or "Local probe server did not start in time.")

        installer = subprocess.run(
            [
                tools["JavaCommand"],
                "-cp",
                str(ctx.installer_jar),
                "link.infra.packwiz.installer.Main",
                "--bootstrap-no-update",
                "-g",
                pack_url,
            ],
            cwd=str(workspace.install_root),
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            **hidden_popen_kwargs(),
        )
        installer_output = ((installer.stdout or "") + "\n" + (installer.stderr or "")).splitlines()
        installer_text = "\n".join(installer_output)
        if RESTRICTED_PATTERN.search(installer_text):
            cache[identity.cache_key] = {
                "projectId": identity.project_id,
                "fileId": identity.file_id,
                "status": "restricted",
                "name": name,
                "checkedAt": datetime.now(timezone.utc).isoformat(),
            }
            ctx.save_probe_cache()
            return Downloadability("restricted", False, "CurseForge marks this file as manual-download only.")

        if installer.returncode == 0:
            cache[identity.cache_key] = {
                "projectId": identity.project_id,
                "fileId": identity.file_id,
                "status": "downloadable",
                "name": name,
                "checkedAt": datetime.now(timezone.utc).isoformat(),
            }
            ctx.save_probe_cache()
            return Downloadability("downloadable", False, "packwiz-installer completed successfully.")

        reason = get_first_meaningful_output_line(installer_output) or f"packwiz-installer exited with code {installer.returncode}."
        return Downloadability("unknown", False, reason)
    finally:
        if serve_process is not None and serve_process.poll() is None:
            serve_process.kill()
            try:
                serve_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                pass
        shutil.rmtree(workspace.root, ignore_errors=True)


def new_detection_workspace(ctx: PackwizMetaContext, metadata_folder: str = "mods", ignore_mod_loader: bool = False) -> Path:
    workspace = ctx.temp_detect_root / str(uuid.uuid4())
    (workspace / metadata_folder).mkdir(parents=True, exist_ok=True)
    invoke_generate_packwiz_files(workspace)
    if ignore_mod_loader:
        remove_packwiz_loader_versions(workspace / "pack.toml")
    return workspace


@dataclass
class CfMetadata:
    is_exact_match: bool
    candidate: str
    name: str | None
    meta_file_name: str
    content: str
    resolved_filename: str | None


def try_resolve_curseforge_metadata(
    ctx: PackwizMetaContext,
    source_path: str,
    source_filename: str,
    candidates: Sequence[str],
    category: str = "mods",
) -> CfMetadata | None:
    if category == "mods":
        detect_workspace = new_detection_workspace(ctx, "mods")
        try:
            shutil.copy2(source_path, Path(detect_workspace) / "mods" / source_filename)
            exit_code, _output = invoke_packwiz_command(ctx, ["curseforge", "detect", "--yes"], detect_workspace)
            if exit_code == 0:
                mods_dir = detect_workspace / "mods"
                detected = [
                    path for path in mods_dir.iterdir() if path.is_file() and path.name.lower().endswith(".pw.toml")
                ]
                for pw_toml in detected:
                    data = parse_pw_toml(pw_toml)
                    resolved_filename = get_toml_val(data, "Filename")
                    if not ps_eq(resolved_filename, source_filename):
                        continue
                    if not get_toml_val(data, "IsManaged"):
                        continue
                    return CfMetadata(
                        True,
                        "curseforge-detect",
                        get_toml_val(data, "Name"),
                        pw_toml.name,
                        read_text(pw_toml),
                        resolved_filename,
                    )
        finally:
            shutil.rmtree(detect_workspace, ignore_errors=True)

    best_mismatch: CfMetadata | None = None
    cf_category = get_curseforge_category_slug(category)
    for candidate in candidates:
        workspace = new_detection_workspace(ctx, category, ignore_mod_loader=(category != "mods"))
        try:
            arguments = ["curseforge", "add", candidate, "--yes", "--meta-folder", category]
            if cf_category:
                arguments.extend(["--category", cf_category])
            exit_code, output = invoke_packwiz_command(ctx, arguments, workspace)
            if exit_code != 0:
                continue
            main_project_name = None
            main_project_filename = None
            for line in output:
                match = ADDED_PROJECT_PATTERN.match(str(line))
                if match:
                    main_project_name = match.group(1)
                    main_project_filename = match.group(2)
                    break
            if not main_project_filename:
                continue
            generated = [
                path
                for path in (workspace / category).iterdir()
                if path.is_file() and path.name.lower().endswith(".pw.toml")
            ]
            generated_pw_toml = None
            for pw_toml in generated:
                pw_data = parse_pw_toml(pw_toml)
                pw_filename = get_toml_val(pw_data, "Filename")
                if ps_eq(pw_filename, main_project_filename):
                    generated_pw_toml = pw_toml
                    break
            if not generated_pw_toml:
                continue
            data = parse_pw_toml(generated_pw_toml)
            resolved_filename = get_toml_val(data, "Filename")
            if not get_toml_val(data, "IsManaged"):
                continue
            content = read_text(generated_pw_toml)
            display_name = main_project_name if main_project_name else get_toml_val(data, "Name")
            if not ps_eq(resolved_filename, source_filename):
                if best_mismatch is None:
                    best_mismatch = CfMetadata(
                        False,
                        candidate,
                        display_name,
                        generated_pw_toml.name,
                        content,
                        resolved_filename,
                    )
                continue
            return CfMetadata(True, candidate, display_name, generated_pw_toml.name, content, resolved_filename)
        finally:
            shutil.rmtree(workspace, ignore_errors=True)
    return best_mismatch


def get_unique_meta_name(preferred_name: str | None, directory: Path) -> str:
    base_name = convert_to_meta_slug(preferred_name) or "mod"
    candidate = base_name
    suffix = 2
    existing = {path.name.casefold() for path in directory.iterdir() if path.is_file()} if directory.is_dir() else set()
    while f"{candidate}.pw.toml".casefold() in existing:
        candidate = f"{base_name}-{suffix}"
        suffix += 1
    return candidate




def add_packwiz_files_metadata(
    ctx: PackwizMetaContext,
    source_path: str,
    source_filename: str,
    jar_metadata: dict[str, Any],
    mods_directory: Path,
    pw_toml_path: Path | None = None,
    display_name: str | None = None,
    side: str | None = None,
    release_curseforge_content: str | None = None,
) -> tuple[str, Path]:
    ctx.packwiz_files_category_root.mkdir(parents=True, exist_ok=True)
    packwiz_file_path = ctx.packwiz_files_category_root / source_filename
    source_full = os.path.normpath(os.path.abspath(source_path))
    packwiz_full = os.path.normpath(os.path.abspath(packwiz_file_path))
    if source_full.casefold() != packwiz_full.casefold():
        shutil.copy2(source_path, packwiz_file_path)

    if not display_name:
        display_name = get_display_name_from_source(source_filename, jar_metadata)
    if pw_toml_path is None:
        meta_name = get_unique_meta_name(display_name, mods_directory)
        pw_toml_path = mods_directory / f"{meta_name}.pw.toml"

    digest = file_sha256(packwiz_file_path)
    escaped_name = escape_toml_string(display_name)
    escaped_filename = escape_toml_string(source_filename)
    url = ctx.packwiz_files_raw_prefix + ctx.category + "/" + escape_data_string(source_filename)
    if (not side) and pw_toml_path.is_file():
        existing = parse_pw_toml(pw_toml_path)
        side = get_toml_val(existing, "Side")
    if not side:
        side = get_default_pw_side_for_category(ctx.category)
    side_value = normalize_pw_side(side)
    content = (
        f'name = "{escaped_name}"\n'
        f'filename = "{escaped_filename}"\n'
        f'side = "{side_value}"\n'
        "\n"
        "[download]\n"
        f'url = "{url}"\n'
        'hash-format = "sha256"\n'
        f'hash = "{digest}"\n'
    )
    release_identity = get_curseforge_metadata_identity(release_curseforge_content)
    if release_identity:
        content += (
            "\n"
            "[release.curseforge]\n"
            f"project-id = {release_identity.project_id}\n"
            f"file-id = {release_identity.file_id}\n"
        )
    content = content.rstrip() + "\n"
    write_utf8_no_bom(pw_toml_path, content)
    return display_name, pw_toml_path


def set_packwiz_files_release_curseforge_hint(pw_toml_path: Path, release_curseforge_content: str | None) -> bool:
    release_identity = get_curseforge_metadata_identity(release_curseforge_content)
    if not release_identity or not pw_toml_path.is_file():
        return False
    content = read_text(pw_toml_path)
    existing_identity = None
    section_match = RELEASE_SECTION_PATTERN.search(content)
    if section_match:
        existing_identity = get_curseforge_metadata_identity(section_match.group(0))
    if (
        existing_identity
        and existing_identity.project_id == release_identity.project_id
        and existing_identity.file_id == release_identity.file_id
    ):
        return False
    trimmed = RELEASE_SECTION_STRIP_PATTERN.sub("", content)
    new_content = (
        trimmed.rstrip()
        + "\n\n[release.curseforge]\n"
        + f"project-id = {release_identity.project_id}\n"
        + f"file-id = {release_identity.file_id}\n"
    )
    new_content = new_content.rstrip() + "\n"
    write_utf8_no_bom(pw_toml_path, new_content)
    return True


def get_packwiz_files_release_curseforge_content(pw_toml_path: Path) -> str | None:
    if not pw_toml_path.is_file():
        return None
    content = read_text(pw_toml_path)
    match = RELEASE_SECTION_PATTERN.search(content)
    if match:
        return match.group(0)
    return None


def get_local_metadata_hash_refresh(entry: PwEntry, source_files: CIDict, packwiz_files: CIDict) -> str | None:
    if entry.is_managed:
        return None
    filename = entry.filename
    if not filename:
        return None
    download_url = get_toml_val(entry.data, "DownloadUrl")
    if not test_packwiz_files_raw_url(download_url):
        return None
    hash_format = get_toml_val(entry.data, "HashFormat")
    if hash_format and not ps_eq(str(hash_format), "sha256"):
        return None
    existing_hash = get_toml_val(entry.data, "Hash")
    if existing_hash is None or not str(existing_hash).strip():
        return None
    existing_hash = str(existing_hash).lower()
    candidate_paths = []
    if filename in source_files:
        candidate_paths.append(source_files[filename])
    if filename in packwiz_files:
        candidate_paths.append(packwiz_files[filename])
    for candidate_path in candidate_paths:
        actual = file_sha256(Path(candidate_path))
        if actual != existing_hash:
            return candidate_path
    return None


def remove_packwiz_files_asset_if_owned(ctx: PackwizMetaContext, filename: str | None, filename_owners: CIDict) -> None:
    if not filename:
        return
    asset_path = ctx.packwiz_files_category_root / filename
    if not asset_path.exists():
        # case-insensitive lookup on disk
        if ctx.packwiz_files_category_root.is_dir():
            matches = [p for p in ctx.packwiz_files_category_root.iterdir() if p.is_file() and ps_eq(p.name, filename)]
            if not matches:
                return
            asset_path = matches[0]
        else:
            return
    owners = filename_owners.get(filename) or []
    if len(owners) > 1:
        write_warn(f"  ! Local asset '{filename}' is referenced by multiple metadata files; skipping asset deletion.")
        return
    asset_path.unlink()


def get_local_metadata_source_path(entry: PwEntry, source_files: CIDict, packwiz_files: CIDict) -> str | None:
    filename = entry.filename
    if not filename:
        return None
    download_url = get_toml_val(entry.data, "DownloadUrl")
    if test_packwiz_files_raw_url(download_url):
        if filename in packwiz_files:
            return packwiz_files[filename]
    if filename in source_files:
        return source_files[filename]
    if filename in packwiz_files:
        return packwiz_files[filename]
    return None




@dataclass
class PlannedUpdate:
    entry: PwEntry
    old_filename: str
    new_filename: str
    source_path: str


def run(args: argparse.Namespace) -> int:
    if not args.full_reconcile:
        raise RuntimeError(
            "This is a category-wide reconciliation. Re-run with -FullReconcile, or use "
            "add-packwiz-target.py / update-packwiz-target.py for one CurseForge asset."
        )

    ctx = PackwizMetaContext(args)
    ensure_tool(ctx.packwiz_url, ctx.packwiz_exe, write_status, None)
    invoke_generate_packwiz_files(REPO_ROOT)

    category_display_name = get_category_display_name(ctx.category)
    mods_dir = REPO_ROOT / ctx.category
    if not mods_dir.is_dir():
        write_status(f"No '{ctx.category}' directory found.")
        return 0

    write_status(f"Scanning category: {ctx.category}")
    source_files = get_asset_files(mods_dir, ctx.category)
    packwiz_files = get_asset_files(ctx.packwiz_files_category_root, ctx.category)
    metadata_state = get_pw_metadata_state(mods_dir)
    pw_entries = list(metadata_state.pw_entries)
    filename_owners = metadata_state.filename_owners
    referenced_filenames = metadata_state.referenced_filenames
    new_files_by_base: dict[str, list[str]] = {}

    normalized_raw_prefix_count = 0
    for pw_toml in metadata_state.pw_tomls:
        if normalize_packwiz_files_raw_prefix_in_file(pw_toml, ctx.packwiz_files_raw_prefix):
            normalized_raw_prefix_count += 1
    if normalized_raw_prefix_count > 0:
        metadata_state = get_pw_metadata_state(mods_dir)
        pw_entries = list(metadata_state.pw_entries)
        filename_owners = metadata_state.filename_owners
        referenced_filenames = metadata_state.referenced_filenames

    for source_name in source_files.keys():
        base = derive_base_name(source_name)
        if not base:
            continue
        new_files_by_base.setdefault(base, []).append(source_name)

    release_hint_count = 0
    for entry in pw_entries:
        if entry.is_managed:
            continue
        current_filename = entry.filename
        if not current_filename:
            continue
        download_url = get_toml_val(entry.data, "DownloadUrl")
        if not test_packwiz_files_raw_url(download_url):
            continue
        source_path = get_local_metadata_source_path(entry, source_files, packwiz_files)
        if not source_path:
            continue
        jar_metadata = get_jar_metadata(source_path)
        candidates = get_curseforge_candidates(current_filename, jar_metadata)
        if not candidates:
            continue
        cf_metadata = try_resolve_curseforge_metadata(ctx, source_path, current_filename, candidates, ctx.category)
        if not (cf_metadata and cf_metadata.is_exact_match):
            continue
        if set_packwiz_files_release_curseforge_hint(entry.pw_toml_path, cf_metadata.content):
            write_status(f"  ~ Added release CurseForge hint: {entry.name}")
            release_hint_count += 1

    migrated_to_curseforge_count = 0
    if ctx.category == "mods":
        for entry in pw_entries:
            if entry.is_managed:
                continue
            current_filename = entry.filename
            if not current_filename:
                continue
            source_path = get_local_metadata_source_path(entry, source_files, packwiz_files)
            if not source_path:
                continue
            jar_metadata = get_jar_metadata(source_path)
            candidates = get_curseforge_candidates(current_filename, jar_metadata)
            if not candidates:
                continue
            cf_metadata = try_resolve_curseforge_metadata(ctx, source_path, current_filename, candidates, ctx.category)
            if not cf_metadata:
                continue
            if not cf_metadata.is_exact_match:
                write_warn(
                    f"  ! CurseForge project '{cf_metadata.name}' was found for '{current_filename}', "
                    f"but it resolved to '{cf_metadata.resolved_filename}'. Keeping packwiz-files metadata."
                )
                continue
            downloadability = get_curseforge_downloadability(ctx, cf_metadata.content, cf_metadata.meta_file_name, cf_metadata.name)
            if downloadability.status == "restricted":
                write_status(f"  ~ Keeping packwiz-files (CurseForge requires manual download): {cf_metadata.name}")
                continue
            if downloadability.status != "downloadable":
                write_warn(
                    f"  ! Could not verify third-party download for '{cf_metadata.name}'; "
                    f"keeping packwiz-files metadata. {downloadability.reason}"
                )
                continue
            write_utf8_no_bom(entry.pw_toml_path, set_pw_toml_side(cf_metadata.content, entry.side))
            download_url = get_toml_val(entry.data, "DownloadUrl")
            if test_packwiz_files_raw_url(download_url):
                remove_packwiz_files_asset_if_owned(ctx, current_filename, filename_owners)
                if current_filename in packwiz_files:
                    del packwiz_files[current_filename]
            write_status(f"  ~ Migrated to CurseForge: {cf_metadata.name}")
            migrated_to_curseforge_count += 1

    if migrated_to_curseforge_count > 0:
        metadata_state = get_pw_metadata_state(mods_dir)
        pw_entries = list(metadata_state.pw_entries)
        filename_owners = metadata_state.filename_owners
        referenced_filenames = metadata_state.referenced_filenames

    managed_updates: list[PlannedUpdate] = []
    local_updates: list[PlannedUpdate] = []
    removals: list[PwEntry] = []
    for entry in pw_entries:
        current_filename = entry.filename
        if not current_filename:
            continue
        base = derive_base_name(current_filename)
        if not base:
            continue
        new_filename = None
        if base in new_files_by_base:
            new_filename = get_preferred_filename(new_files_by_base[base])
        has_replacement = bool(new_filename) and not ps_eq(new_filename, current_filename)
        if not has_replacement:
            hash_refresh_source = get_local_metadata_hash_refresh(entry, source_files, packwiz_files)
            if hash_refresh_source:
                local_updates.append(PlannedUpdate(entry, current_filename, current_filename, hash_refresh_source))
                continue
            if current_filename in source_files:
                continue
            if current_filename in packwiz_files:
                continue
        if base not in new_files_by_base:
            removals.append(entry)
            continue
        if not new_filename:
            removals.append(entry)
            continue
        update = PlannedUpdate(entry, current_filename, new_filename, source_files[new_filename])
        if entry.is_managed:
            managed_updates.append(update)
        else:
            local_updates.append(update)

    planned_update_filenames = CISet()
    for update in [*managed_updates, *local_updates]:
        planned_update_filenames.add(update.new_filename)

    new_sources = sorted(
        (
            name
            for name in source_files.keys()
            if name not in referenced_filenames and name not in planned_update_filenames
        ),
        key=get_natural_sort_key,
    )

    skip_removals = not ctx.allow_removals
    if removals and ctx.allow_removals:
        if len(source_files) == 0 and len(pw_entries) > 20:
            skip_removals = True
        elif len(removals) > max(10, math.ceil(len(pw_entries) * 0.25)):
            skip_removals = True
    if skip_removals:
        write_warn(
            f"  ! Detected {len(removals)} missing {category_display_name} file(s); automatic removals are disabled. "
            "Remove metadata explicitly or rerun with -AllowRemovals."
        )
        removals = []

    if (
        normalized_raw_prefix_count == 0
        and release_hint_count == 0
        and migrated_to_curseforge_count == 0
        and not managed_updates
        and not local_updates
        and not new_sources
        and not removals
    ):
        write_status("No CurseForge metadata changes detected.")
        return 0

    updated_count = 0
    updated_local_count = 0
    removed_count = 0
    for update in managed_updates:
        entry = update.entry
        original_content = read_text(entry.pw_toml_path)
        source_path = update.source_path
        jar_metadata = get_jar_metadata(source_path)
        candidates = get_curseforge_candidates(update.new_filename, jar_metadata)
        cf_metadata = None
        if candidates:
            cf_metadata = try_resolve_curseforge_metadata(ctx, source_path, update.new_filename, candidates, ctx.category)
        if not (cf_metadata and cf_metadata.is_exact_match):
            resolved = cf_metadata.resolved_filename if cf_metadata else "<not found>"
            write_warn(
                f"  ! Could not resolve exact CurseForge metadata for '{update.new_filename}' "
                f"(resolved: '{resolved}'); keeping existing metadata."
            )
            continue
        updated_name = cf_metadata.name
        downloadability = get_curseforge_downloadability(ctx, cf_metadata.content, cf_metadata.meta_file_name, updated_name)
        if downloadability.status == "restricted":
            add_packwiz_files_metadata(
                ctx,
                source_path,
                update.new_filename,
                jar_metadata,
                mods_dir,
                pw_toml_path=entry.pw_toml_path,
                display_name=updated_name,
                release_curseforge_content=cf_metadata.content,
            )
            write_status(f"  ~ Updated (packwiz-files): {updated_name}")
            updated_local_count += 1
            continue
        if downloadability.status != "downloadable":
            write_utf8_no_bom(entry.pw_toml_path, original_content)
            write_warn(
                f"  ! Could not verify third-party download for '{updated_name}'; "
                f"reverted update. {downloadability.reason}"
            )
            continue
        write_utf8_no_bom(entry.pw_toml_path, set_pw_toml_side(cf_metadata.content, entry.side))
        write_status(f"  ~ Updated (CurseForge): {updated_name}")
        updated_count += 1

    for update in local_updates:
        entry = update.entry
        source_path = update.source_path
        jar_metadata = get_jar_metadata(source_path)
        display_name = entry.name
        if not display_name:
            display_name = get_display_name_from_source(update.new_filename, jar_metadata)
        candidates = get_curseforge_candidates(update.new_filename, jar_metadata)
        cf_metadata = None
        release_curseforge_content = get_packwiz_files_release_curseforge_content(entry.pw_toml_path)
        if candidates:
            cf_metadata = try_resolve_curseforge_metadata(ctx, source_path, update.new_filename, candidates, ctx.category)
        if cf_metadata and cf_metadata.is_exact_match:
            release_curseforge_content = cf_metadata.content
            downloadability = get_curseforge_downloadability(ctx, cf_metadata.content, cf_metadata.meta_file_name, cf_metadata.name)
            if downloadability.status == "downloadable":
                remove_packwiz_files_asset_if_owned(ctx, update.old_filename, filename_owners)
                write_utf8_no_bom(entry.pw_toml_path, set_pw_toml_side(cf_metadata.content, entry.side))
                write_status(f"  ~ Updated (CurseForge): {cf_metadata.name}")
                updated_count += 1
                continue
            if downloadability.status == "restricted":
                write_status(f"  ~ Keeping packwiz-files for update (CurseForge requires manual download): {cf_metadata.name}")
            else:
                write_warn(
                    f"  ! Could not verify third-party download for '{cf_metadata.name}'; "
                    f"keeping packwiz-files metadata. {downloadability.reason}"
                )
        elif cf_metadata and not cf_metadata.is_exact_match:
            write_warn(
                f"  ! CurseForge project '{cf_metadata.name}' was found for '{update.new_filename}', "
                f"but it resolved to '{cf_metadata.resolved_filename}'. Keeping packwiz-files metadata."
            )
        if not ps_eq(update.old_filename, update.new_filename):
            remove_packwiz_files_asset_if_owned(ctx, update.old_filename, filename_owners)
        add_packwiz_files_metadata(
            ctx,
            source_path,
            update.new_filename,
            jar_metadata,
            mods_dir,
            pw_toml_path=entry.pw_toml_path,
            display_name=display_name,
            release_curseforge_content=release_curseforge_content,
        )
        write_status(f"  ~ Updated (packwiz-files): {display_name}")
        updated_local_count += 1

    added_curseforge_count = 0
    added_packwiz_files_count = 0
    for source_name in new_sources:
        source_path = source_files[source_name]
        jar_metadata = get_jar_metadata(source_path)
        candidates = get_curseforge_candidates(source_name, jar_metadata)
        write_status(f"  ~ New {category_display_name} detected: {source_name}")
        cf_metadata = None
        if candidates:
            cf_metadata = try_resolve_curseforge_metadata(ctx, source_path, source_name, candidates, ctx.category)
        if cf_metadata and cf_metadata.is_exact_match:
            downloadability = get_curseforge_downloadability(ctx, cf_metadata.content, cf_metadata.meta_file_name, cf_metadata.name)
            if downloadability.status == "restricted":
                write_status(f"  ~ CurseForge requires manual download, keeping packwiz-files: {cf_metadata.name}")
                local_metadata_name, _path = add_packwiz_files_metadata(
                    ctx, source_path, source_name, jar_metadata, mods_dir, release_curseforge_content=cf_metadata.content
                )
                write_status(f"  ~ Added (packwiz-files): {local_metadata_name}")
                added_packwiz_files_count += 1
                continue
            if downloadability.status != "downloadable":
                write_warn(
                    f"  ! Could not verify third-party download for '{cf_metadata.name}'; "
                    f"falling back to packwiz-files. {downloadability.reason}"
                )
                local_metadata_name, _path = add_packwiz_files_metadata(
                    ctx, source_path, source_name, jar_metadata, mods_dir, release_curseforge_content=cf_metadata.content
                )
                write_status(f"  ~ Added (packwiz-files): {local_metadata_name}")
                added_packwiz_files_count += 1
                continue
            generated_meta_stem = Path(cf_metadata.meta_file_name).stem
            if generated_meta_stem.lower().endswith(".pw"):
                generated_meta_stem = generated_meta_stem[:-3]
            preferred_meta_name = get_toml_val(jar_metadata, "ModId") or generated_meta_stem
            meta_name = get_unique_meta_name(preferred_meta_name, mods_dir)
            pw_toml_path = mods_dir / f"{meta_name}.pw.toml"
            default_side = get_default_pw_side_for_category(ctx.category)
            write_utf8_no_bom(pw_toml_path, set_pw_toml_side(cf_metadata.content, default_side))
            write_status(f"  ~ Added (CurseForge): {cf_metadata.name}")
            added_curseforge_count += 1
            continue
        if cf_metadata and not cf_metadata.is_exact_match:
            write_warn(
                f"  ! CurseForge project '{cf_metadata.name}' was found, but it resolved to "
                f"'{cf_metadata.resolved_filename}' instead of local file '{source_name}'. "
                "Falling back to packwiz-files."
            )
        else:
            write_warn(f"  ! Could not confirm CurseForge metadata for {source_name}, falling back to packwiz-files.")
        local_metadata_name, _path = add_packwiz_files_metadata(ctx, source_path, source_name, jar_metadata, mods_dir)
        write_status(f"  ~ Added (packwiz-files): {local_metadata_name}")
        added_packwiz_files_count += 1

    for entry in removals:
        entry.pw_toml_path.unlink(missing_ok=True)
        if not entry.is_managed:
            remove_packwiz_files_asset_if_owned(ctx, entry.filename, filename_owners)
        display_name = entry.name or entry.slug
        write_status(f"  ~ Removed: {display_name}")
        removed_count += 1

    if (
        normalized_raw_prefix_count == 0
        and release_hint_count == 0
        and migrated_to_curseforge_count == 0
        and updated_count == 0
        and updated_local_count == 0
        and added_curseforge_count == 0
        and added_packwiz_files_count == 0
        and removed_count == 0
    ):
        write_status("No CurseForge metadata changes detected.")
        return 0

    if updated_count > 0:
        write_status(f"Updated: {updated_count}")
    if updated_local_count > 0:
        write_status(f"Updated via packwiz-files: {updated_local_count}")
    if migrated_to_curseforge_count > 0:
        write_status(f"Migrated to CurseForge: {migrated_to_curseforge_count}")
    if normalized_raw_prefix_count > 0:
        write_status(f"Normalized packwiz-files raw URLs: {normalized_raw_prefix_count}")
    if release_hint_count > 0:
        write_status(f"Added release CurseForge hints: {release_hint_count}")
    if added_curseforge_count > 0:
        write_status(f"Added via CurseForge: {added_curseforge_count}")
    if added_packwiz_files_count > 0:
        write_status(f"Added via packwiz-files: {added_packwiz_files_count}")
    if removed_count > 0:
        write_status(f"Removed: {removed_count}")

    write_status("Running packwiz refresh...")
    exit_code, _output = invoke_packwiz_command(ctx, ["refresh"])
    if exit_code != 0:
        raise RuntimeError(f"packwiz refresh exited with code {exit_code}.")
    write_status(f"Done. {ctx.category} pw.toml files refreshed from CurseForge or packwiz-files metadata.")
    return 0


def parse_args(argv: Sequence[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Reconcile Packwiz metadata for one asset category.")
    parser.add_argument("-Category", "--category", dest="category", default="mods", choices=VALID_CATEGORIES)
    parser.add_argument("-PackwizUrl", "--packwiz-url", dest="packwiz_url", default=None)
    parser.add_argument("-InstallerUrl", "--installer-url", dest="installer_url", default=DEFAULT_INSTALLER_URL)
    parser.add_argument(
        "-PackwizFilesRef",
        "--packwiz-files-ref",
        dest="packwiz_files_ref",
        default=os.environ.get("PACKWIZ_FILES_REF"),
    )
    parser.add_argument(
        "-PackwizFilesRawPrefix",
        "--packwiz-files-raw-prefix",
        dest="packwiz_files_raw_prefix",
        default=os.environ.get("PACKWIZ_FILES_RAW_PREFIX"),
    )
    parser.add_argument("-FullReconcile", "--full-reconcile", dest="full_reconcile", action="store_true")
    parser.add_argument("-AllowRemovals", "--allow-removals", dest="allow_removals", action="store_true")
    args = parser.parse_args(argv)
    if args.packwiz_url is None:
        args.packwiz_url = default_packwiz_url()
    return args


def main(argv: Sequence[str] | None = None) -> int:
    try:
        return run(parse_args(argv))
    except Exception as exc:  # noqa: BLE001 - match PowerShell script-terminating errors
        print(str(exc), file=sys.stderr, flush=True)
        return 1


if __name__ == "__main__":
    sys.exit(main())
