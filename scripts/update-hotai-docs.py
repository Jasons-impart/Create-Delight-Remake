#!/usr/bin/env python3
"""Generate or check the HOTAI_STATUS block in hotai details docs.

Python 3.11+ stdlib port of the former update-hotai-docs.ps1 implementation.
JAR scanning uses zipfile instead of System.IO.Compression.
"""
from __future__ import annotations

import argparse
import re
import sys
import zipfile
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, Sequence


STATUS_BEGIN = "<!-- HOTAI_STATUS:BEGIN -->"
STATUS_END = "<!-- HOTAI_STATUS:END -->"
STATUS_BLOCK_PATTERN = re.compile(
    r"<!-- HOTAI_STATUS:BEGIN -->.*?<!-- HOTAI_STATUS:END -->",
    re.S,
)
TABLE_TARGET_PATTERN = re.compile(
    r"(?m)^\|\s*[^|]+\|\s*`([^`]+\.badiff)`\s*\|\s*`([^`]+)`\s*\|"
)
PATCHED_CLASS_PATTERN = re.compile(r"(?m)Patched class:\s+([^\r\n]+)")
INSERTION_HEADING = "## 代码化改动索引"
SCRIPT_REF = "scripts/update-hotai-docs.py"

MODULE_PREFIXES: tuple[tuple[tuple[str, ...], str], ...] = (
    (("com/simibubi/create/",), "Create"),
    (("com/forsteri/createliquidfuel/",), "Create Liquid Fuel"),
    (("com/mrh0/createaddition/",), "Create Addition"),
    (("com/negodya1/vintageimprovements/",), "Vintage Improvements"),
    (("com/oierbravo/create_mechanical_spawner/",), "Create Mechanical Spawner"),
    (("com/tacz/guns/",), "TACZ"),
    (("dev/latvian/mods/kubejs/",), "KubeJS"),
    (("com/mafuyu404/taczaddon/",), "TACZ-addon"),
    (("com/teamabnormals/neapolitan/",), "Neapolitan"),
    (("com/iafdragonfix/",), "IAF Dragon Fix"),
    (("dev/wuffs/bcc/",), "Better Compatibility Checker"),
    (("de/cadentem/quality_food/",), "Quality Food"),
    (("org/antarcticgardens/newage/", "org/antarcticgardens/cna/"), "Create New Age"),
    (("com/renyigesai/bakeries/",), "Bakeries"),
)


@dataclass
class HotaiRow:
    module: str
    badiff_path: str
    internal_name: str
    target_class: str
    jar_name: str = ""
    runtime_patched: bool = False


def warn(message: str) -> None:
    print(f"WARNING: {message}", file=sys.stderr, flush=True)


def get_hotai_module(internal_name: str) -> str:
    lowered = internal_name.replace("\\", "/").casefold()
    for prefixes, module in MODULE_PREFIXES:
        if any(lowered.startswith(prefix.casefold()) for prefix in prefixes):
            return module
    return "Unknown"


def get_relative_path(root: Path, path: Path) -> str:
    root_text = str(root)
    path_text = str(path)
    relative = path_text.replace(root_text, "")
    return relative.lstrip("\\/").replace("\\", "/")


def sort_key(path: Path) -> tuple[str, str]:
    # PowerShell Sort-Object uses a culture comparer that places "$" after "."
    # so Foo.badiff sorts before Foo$1.badiff (anonymous inner classes).
    text = str(path).replace("\\", "/")
    return (text.replace("$", "\uffff").casefold(), text)

def sort_paths(paths: Iterable[Path]) -> list[Path]:
    return sorted(paths, key=sort_key)


def build_generated_block(
    rows: Sequence[HotaiRow],
    static_found_count: int,
    runtime_created_count: int,
    unverified_count: int,
) -> str:
    lines = [
        STATUS_BEGIN,
        f"> 本区块由 `{SCRIPT_REF}` 生成。修改 `hotai/**/*.badiff` 后运行该脚本；人工解释写在区块外。",
        "",
        (
            f"当前扫描到 {len(rows)} 个 `.badiff`；静态 JAR 命中 {static_found_count} 个，"
            f"静态未命中但已由当前启动日志确认动态创建 {runtime_created_count} 个，"
            f"尚未由当前启动日志确认 {unverified_count} 个。"
        ),
        "",
        "| 模组/领域 | 补丁文件 | 目标 class | 静态 JAR / 运行时状态 |",
        "|---|---|---|---|",
    ]
    for row in rows:
        if row.jar_name:
            status = f"静态命中 `{row.jar_name}`"
        elif row.runtime_patched:
            status = "运行时已确认动态创建（静态 JAR 无此 class）"
        else:
            status = "静态 JAR 无此 class；当前启动日志未确认（可能按需加载）"
        lines.append(
            f"| {row.module} | `{row.badiff_path}` | `{row.internal_name}` | {status} |"
        )
    lines.append(STATUS_END)
    return "\n".join(lines)


def collect_rows(root: Path) -> list[HotaiRow]:
    hotai_path = root / "hotai"
    if not hotai_path.exists():
        raise RuntimeError(f"hotai directory not found: {hotai_path}")

    badiff_files = sort_paths(path for path in hotai_path.rglob("*.badiff") if path.is_file())
    rows: list[HotaiRow] = []
    target_to_row: dict[str, HotaiRow] = {}
    internal_name_to_row: dict[str, HotaiRow] = {}

    for file in badiff_files:
        relative_path = get_relative_path(root, file)
        if not relative_path.startswith("hotai/") or not relative_path.endswith(".badiff"):
            continue
        internal_name = relative_path[len("hotai/") : -len(".badiff")]
        target_class = f"{internal_name}.class"
        row = HotaiRow(
            module=get_hotai_module(internal_name),
            badiff_path=relative_path,
            internal_name=internal_name,
            target_class=target_class,
        )
        rows.append(row)
        target_to_row[target_class] = row
        internal_name_to_row[internal_name] = row

    jar_files: list[Path] = []
    for jar_root in (root / "mods", root / "packwiz-files" / "mods"):
        if jar_root.exists():
            jar_files.extend(path for path in jar_root.iterdir() if path.is_file() and path.suffix.lower() == ".jar")
    for jar in sort_paths(jar_files):
        try:
            with zipfile.ZipFile(jar) as archive:
                for entry_name in archive.namelist():
                    row = target_to_row.get(entry_name)
                    if row is not None and not row.jar_name:
                        row.jar_name = jar.name
        except (OSError, zipfile.BadZipFile) as exc:
            warn(f"Cannot scan jar '{jar}': {exc}")

    latest_log_path = root / "logs" / "latest.log"
    if latest_log_path.is_file():
        latest_log_text = latest_log_path.read_text(encoding="utf-8", errors="replace")
        for match in PATCHED_CLASS_PATTERN.finditer(latest_log_text):
            internal_name = match.group(1).strip()
            row = internal_name_to_row.get(internal_name)
            if row is not None:
                row.runtime_patched = True

    return rows


def apply_generated_block(details_text: str, generated_block: str, details_path: Path) -> str:
    if STATUS_BEGIN in details_text and STATUS_END in details_text:
        return STATUS_BLOCK_PATTERN.sub(generated_block, details_text, count=1)
    if INSERTION_HEADING not in details_text:
        raise RuntimeError(f"Cannot find insertion point '{INSERTION_HEADING}' in {details_path}")
    return details_text.replace(INSERTION_HEADING, f"{generated_block}\n\n{INSERTION_HEADING}", 1)


def documented_targets(status_block: str) -> list[str]:
    return sorted(
        f"{match.group(1)}|{match.group(2)}"
        for match in TABLE_TARGET_PATTERN.finditer(status_block)
    )


def expected_targets(rows: Sequence[HotaiRow]) -> list[str]:
    return sorted(f"{row.badiff_path}|{row.internal_name}" for row in rows)


def compare_targets(expected: Sequence[str], documented: Sequence[str]) -> str:
    expected_set = set(expected)
    documented_set = set(documented)
    only_expected = [item for item in expected if item not in documented_set]
    only_documented = [item for item in documented if item not in expected_set]
    return ", ".join(only_expected + only_documented)


def write_utf8_no_bom(path: Path, content: str) -> None:
    path.write_bytes(content.encode("utf-8"))


def parse_args(argv: Sequence[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate or check the HOTAI_STATUS documentation block.")
    parser.add_argument("-Root", "--root", dest="root", default="")
    parser.add_argument("-DetailsPath", "--details-path", dest="details_path", default="")
    parser.add_argument("-Check", "--check", dest="check", action="store_true")
    parser.add_argument(
        "-StrictRuntimeStatus",
        "--strict-runtime-status",
        dest="strict_runtime_status",
        action="store_true",
    )
    return parser.parse_args(argv)


def run(args: argparse.Namespace) -> int:
    root = Path(args.root).resolve() if str(args.root).strip() else Path(__file__).resolve().parent.parent
    details_path = (
        Path(args.details_path).resolve()
        if str(args.details_path).strip()
        else root / "docs" / "dev-knowledge" / "hotai" / "badiff-details.md"
    )
    if not details_path.exists():
        raise RuntimeError(f"hotai details document not found: {details_path}")

    rows = collect_rows(root)
    static_found_count = sum(1 for row in rows if row.jar_name)
    runtime_created_count = sum(1 for row in rows if not row.jar_name and row.runtime_patched)
    unverified_count = sum(1 for row in rows if not row.jar_name and not row.runtime_patched)
    generated_block = build_generated_block(rows, static_found_count, runtime_created_count, unverified_count)

    details_text = details_path.read_text(encoding="utf-8-sig")
    updated_text = apply_generated_block(details_text, generated_block, details_path)

    if args.check:
        if args.strict_runtime_status:
            if updated_text != details_text:
                raise RuntimeError(
                    "hotai runtime status is out of date for the current local JARs and logs. "
                    f"Run {SCRIPT_REF} from the reference runtime."
                )
            print("hotai patch map and current runtime status are up to date.", flush=True)
            return 0

        status_match = STATUS_BLOCK_PATTERN.search(details_text)
        if not status_match:
            raise RuntimeError(f"hotai status block is missing from {details_path}. Run {SCRIPT_REF}.")

        diff_text = compare_targets(expected_targets(rows), documented_targets(status_match.group(0)))
        if diff_text:
            raise RuntimeError(f"hotai patch map is out of date: {diff_text}. Run {SCRIPT_REF}.")

        print("hotai patch map is up to date; local runtime status was not compared.", flush=True)
        return 0

    write_utf8_no_bom(details_path, updated_text)
    print(f"Updated hotai generated documentation in {get_relative_path(root, details_path)}", flush=True)
    return 0


def main(argv: Sequence[str] | None = None) -> int:
    try:
        return run(parse_args(argv))
    except Exception as exc:  # noqa: BLE001 - match PowerShell script-terminating errors
        print(str(exc), file=sys.stderr, flush=True)
        return 1


if __name__ == "__main__":
    sys.exit(main())
