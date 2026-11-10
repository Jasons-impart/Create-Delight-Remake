#!/usr/bin/env python3
"""Append a temporary knowledge process note."""

from __future__ import annotations

import argparse
from datetime import datetime
from pathlib import Path
import sys


def format_timestamp(moment: datetime | None = None) -> str:
    current = moment or datetime.now().astimezone()
    tz = current.strftime("%z")
    if len(tz) == 5:
        tz = f"{tz[:3]}:{tz[3:]}"
    return current.strftime("%Y-%m-%d %H:%M:%S ") + tz


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Append a temporary knowledge process note.")
    parser.add_argument("--summary", required=True, help="Short summary of the note.")
    parser.add_argument("--problem", default="", help="Optional problem description.")
    parser.add_argument("--fix", default="", help="Optional fix or workaround.")
    parser.add_argument("--target", default="docs/lessons-learned.md", help="Suggested knowledge target.")
    parser.add_argument("--root", default="", help="Repository root. Defaults to the parent of scripts/.")
    parser.add_argument("--notes-path", default="", help="Override path to tmp-opencode/knowledge-notes.md.")
    return parser.parse_args(argv)


def append_note(
    *,
    summary: str,
    problem: str = "",
    fix: str = "",
    target: str = "docs/lessons-learned.md",
    root: Path | None = None,
    notes_path: Path | None = None,
    moment: datetime | None = None,
) -> Path:
    if root is None:
        root = Path(__file__).resolve().parent.parent
    if notes_path is None:
        notes_path = root / "tmp-opencode" / "knowledge-notes.md"

    notes_path.parent.mkdir(parents=True, exist_ok=True)
    timestamp = format_timestamp(moment)
    lines = [
        f"## {timestamp}",
        "",
        f"- Target: {target}",
        f"- Summary: {summary}",
    ]
    if problem.strip():
        lines.append(f"- Problem: {problem}")
    if fix.strip():
        lines.append(f"- Fix: {fix}")
    lines.append("")
    with notes_path.open("a", encoding="utf-8", newline="\n") as handle:
        handle.write("\n".join(lines) + "\n")
    return notes_path.resolve()


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    root = Path(args.root).resolve() if args.root.strip() else Path(__file__).resolve().parent.parent
    notes_path = Path(args.notes_path) if args.notes_path.strip() else root / "tmp-opencode" / "knowledge-notes.md"
    if not notes_path.is_absolute():
        notes_path = (Path.cwd() / notes_path)
    written = append_note(
        summary=args.summary,
        problem=args.problem,
        fix=args.fix,
        target=args.target,
        root=root,
        notes_path=notes_path,
    )
    print(f"Knowledge note appended to {written}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
