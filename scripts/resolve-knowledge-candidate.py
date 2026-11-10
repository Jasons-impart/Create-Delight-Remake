#!/usr/bin/env python3
"""Mark a knowledge candidate as accepted, rejected, or applied."""

from __future__ import annotations

import argparse
from datetime import datetime
import json
from pathlib import Path
import sys


def format_timestamp(moment: datetime | None = None) -> str:
    current = moment or datetime.now().astimezone()
    tz = current.strftime("%z")
    if len(tz) == 5:
        tz = f"{tz[:3]}:{tz[3:]}"
    return current.strftime("%Y-%m-%d %H:%M:%S ") + tz


def write_utf8(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8", newline="\n")


def write_json(path: Path, payload: dict) -> None:
    write_utf8(path, json.dumps(payload, indent=2, ensure_ascii=False) + "\n")


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Record a knowledge-candidate decision and clear temporary notes.")
    parser.add_argument(
        "--status",
        choices=("accepted", "rejected", "applied"),
        default="applied",
        help="Decision status. Defaults to applied.",
    )
    parser.add_argument("--reason", default="", help="Optional decision reason.")
    parser.add_argument("--root", default="", help="Repository root. Defaults to the parent of scripts/.")
    parser.add_argument("--decision-path", default="", help="Override path to knowledge-candidate-decision.json.")
    parser.add_argument("--notes-path", default="", help="Override path to knowledge-notes.md.")
    return parser.parse_args(argv)


def resolve_candidate(
    *,
    status: str,
    reason: str = "",
    root: Path | None = None,
    decision_path: Path | None = None,
    notes_path: Path | None = None,
    moment: datetime | None = None,
) -> Path:
    if status not in {"accepted", "rejected", "applied"}:
        raise ValueError(f"Invalid status: {status}")
    if root is None:
        root = Path(__file__).resolve().parent.parent
    if decision_path is None:
        decision_path = root / "tmp-opencode" / "knowledge-candidate-decision.json"
    if notes_path is None:
        notes_path = root / "tmp-opencode" / "knowledge-notes.md"

    timestamp = format_timestamp(moment)
    decision: dict = {
        "status": status,
        "decidedAt": timestamp,
        "reason": reason,
    }
    if decision_path.is_file():
        try:
            existing = json.loads(decision_path.read_text(encoding="utf-8-sig"))
            if isinstance(existing, dict):
                for key, value in existing.items():
                    if key not in decision:
                        decision[key] = value
                decision["status"] = status
                decision["decidedAt"] = timestamp
                decision["reason"] = reason
        except (OSError, json.JSONDecodeError):
            pass

    write_json(decision_path, decision)

    if status in {"rejected", "applied"} and notes_path.exists():
        try:
            notes_path.unlink()
        except OSError:
            write_utf8(notes_path, "\n")

    return decision_path.resolve()


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    root = Path(args.root).resolve() if args.root.strip() else Path(__file__).resolve().parent.parent
    decision_path = Path(args.decision_path) if args.decision_path.strip() else root / "tmp-opencode" / "knowledge-candidate-decision.json"
    notes_path = Path(args.notes_path) if args.notes_path.strip() else root / "tmp-opencode" / "knowledge-notes.md"
    if not decision_path.is_absolute():
        decision_path = Path.cwd() / decision_path
    if not notes_path.is_absolute():
        notes_path = Path.cwd() / notes_path
    resolve_candidate(
        status=args.status,
        reason=args.reason,
        root=root,
        decision_path=decision_path,
        notes_path=notes_path,
    )
    print(f"Knowledge candidate marked as {args.status}.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
