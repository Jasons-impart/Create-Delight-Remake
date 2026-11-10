#!/usr/bin/env python3
"""Read-only release-note preview, including already-published tags. Never invokes publish."""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

if str(Path(__file__).resolve().parent) not in sys.path:
    sys.path.insert(0, str(Path(__file__).resolve().parent))

from release_notes import (
    DEFAULT_REPOSITORY,
    assert_release_range,
    get_release_commits,
    get_release_history,
    load_release_history_file,
    new_release_notes,
    print_error_and_exit,
    resolve_previous_formal_tag,
)


REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("-Version", "--version", dest="version", required=True)
    parser.add_argument("-PreviousVersion", "--previous-version", dest="previous_version", default="")
    parser.add_argument(
        "-ReleaseType",
        "--release-type",
        dest="release_type",
        choices=("正式", "测试"),
        default="正式",
    )
    parser.add_argument("-NotesFile", "--notes-file", dest="notes_file", default="")
    parser.add_argument("-ReleaseHistoryFile", "--release-history-file", dest="release_history_file", default="")
    parser.add_argument("-Repository", "--repository", dest="repository", default=DEFAULT_REPOSITORY)
    return parser.parse_args(argv)


def run(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    previous_version = args.previous_version
    if args.release_type == "正式":
        history = (
            load_release_history_file(args.release_history_file)
            if args.release_history_file
            else get_release_history(args.repository)
        )
        previous_version = resolve_previous_formal_tag(args.version, history, previous_version)
    elif not previous_version:
        raise RuntimeError("Preview of a test release requires explicit -PreviousVersion")
    assert_release_range(args.version, previous_version, REPO_ROOT)
    notes_file = args.notes_file
    default_notes = REPO_ROOT / f"docs/release-notes-{args.version}.md"
    if not notes_file and default_notes.is_file():
        notes_file = str(default_notes)
    curated = ""
    if notes_file:
        curated = Path(notes_file).read_text(encoding="utf-8")
        if not curated.strip():
            raise RuntimeError(f"Curated notes file is empty: {notes_file}")
    commits = get_release_commits(previous_version, args.version, REPO_ROOT)
    notes = new_release_notes(
        args.version,
        previous_version,
        args.release_type,
        args.repository,
        commits,
        curated,
    )
    # Write-Output adds a trailing newline after the already-terminated string.
    print(notes)
    return 0


def main(argv: list[str] | None = None) -> int:
    try:
        return run(argv)
    except Exception as exc:
        return print_error_and_exit(exc)


if __name__ == "__main__":
    raise SystemExit(main())
