#!/usr/bin/env python3
"""Export commit/PR evidence for the release agent to read and write release notes.

Reads Git and GitHub only. Writes local JSON; never creates tags, branches or Releases.
Use -TargetRef origin/release-v050x before a new tag exists; existing tags default to Version.
"""
from __future__ import annotations

import argparse
import sys
from pathlib import Path

if str(Path(__file__).resolve().parent) not in sys.path:
    sys.path.insert(0, str(Path(__file__).resolve().parent))

from release_notes import (
    DEFAULT_REPOSITORY,
    dump_json,
    get_release_history,
    get_release_notes_input,
    load_release_history_file,
    print_error_and_exit,
    resolve_previous_formal_tag,
)


REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("-Version", "--version", dest="version", required=True)
    parser.add_argument("-OutputFile", "--output-file", dest="output_file", required=True)
    parser.add_argument("-TargetRef", "--target-ref", dest="target_ref", default="")
    parser.add_argument("-PreviousVersion", "--previous-version", dest="previous_version", default="")
    parser.add_argument(
        "-ReleaseType",
        "--release-type",
        dest="release_type",
        choices=("正式", "测试"),
        default="正式",
    )
    parser.add_argument("-ReleaseHistoryFile", "--release-history-file", dest="release_history_file", default="")
    parser.add_argument("-Repository", "--repository", dest="repository", default=DEFAULT_REPOSITORY)
    return parser.parse_args(argv)


def run(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    target_ref = args.target_ref or args.version
    previous_version = args.previous_version
    if args.release_type == "正式":
        history = (
            load_release_history_file(args.release_history_file)
            if args.release_history_file
            else get_release_history(args.repository)
        )
        previous_version = resolve_previous_formal_tag(args.version, history, previous_version)
    elif not previous_version:
        raise RuntimeError("Test-release evidence requires explicit -PreviousVersion from release-plan.py")
    input_data = get_release_notes_input(
        args.version, previous_version, target_ref, REPO_ROOT, args.repository
    )
    output = Path(args.output_file)
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_bytes((dump_json(input_data) + "\n").encode("utf-8"))
    print(
        f"Notes evidence exported: {args.output_file} ({previous_version}..{input_data['targetCommit']})",
        flush=True,
    )
    return 0


def main(argv: list[str] | None = None) -> int:
    try:
        return run(argv)
    except Exception as exc:
        return print_error_and_exit(exc)


if __name__ == "__main__":
    raise SystemExit(main())
