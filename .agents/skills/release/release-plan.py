#!/usr/bin/env python3
"""Resolve a read-only Create-Delight Remake release plan.

Derives the release version, target branch, previous release tag, and
first-stable candidate without changing Git state or remote state.
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from collections import OrderedDict
from pathlib import Path
from typing import Any

if str(Path(__file__).resolve().parent) not in sys.path:
    sys.path.insert(0, str(Path(__file__).resolve().parent))

from release_notes import (
    get_release_history,
    invoke_gh,
    parse_version_number,
    print_error_and_exit,
    resolve_previous_formal_tag,
    run_git,
)


REPO_ROOT = Path(__file__).resolve().parent.parent.parent.parent
GITHUB_REPO = "Jasons-impart/Create-Delight-Remake"
VERSION_PATTERN = re.compile(r"^v(\d+)\.(\d+)\.(\d+)\.(\d+)(-test)?$")


def invoke_git_readonly(*arguments: str) -> list[str]:
    result = run_git(REPO_ROOT, *arguments)
    if result.returncode != 0:
        return []
    return [line for line in result.stdout.splitlines() if line]


def invoke_gh_json(arguments: list[str]) -> Any:
    from shutil import which

    try:
        code, output = invoke_gh(arguments)
    except FileNotFoundError:
        raise RuntimeError("gh CLI is required to resolve the latest GitHub release") from None
    if code != 0 or not output.strip():
        if which("gh") is None:
            raise RuntimeError("gh CLI is required to resolve the latest GitHub release")
        raise RuntimeError("Could not query GitHub releases")
    try:
        return json.loads(output)
    except json.JSONDecodeError:
        raise RuntimeError("GitHub release query returned invalid JSON") from None


def get_modpack_version() -> str:
    modpack_path = REPO_ROOT / "modpack.toml"
    if not modpack_path.is_file():
        raise RuntimeError(f"modpack.toml not found: {modpack_path}")
    content = modpack_path.read_text(encoding="utf-8")
    match = re.search(r'(?m)^version\s*=\s*"([^"]+)"\s*$', content)
    if not match:
        raise RuntimeError("Cannot read version from modpack.toml")
    return match.group(1)


def test_head_changed_modpack() -> bool:
    changed_paths = invoke_git_readonly("diff-tree", "--no-commit-id", "--name-only", "-r", "HEAD")
    return any(path.casefold() == "modpack.toml".casefold() for path in changed_paths)


def get_latest_published_release() -> dict[str, Any]:
    releases = invoke_gh_json(
        [
            "release",
            "list",
            "--repo",
            GITHUB_REPO,
            "--limit",
            "1",
            "--exclude-drafts",
            "--json",
            "tagName,publishedAt,isPrerelease",
        ]
    )
    if not isinstance(releases, list) or not releases or not releases[0].get("tagName"):
        raise RuntimeError("No published GitHub release was found")
    return releases[0]


def get_latest_published_release_tag() -> str:
    release = get_latest_published_release()
    tag_name = str(release["tagName"])
    if not VERSION_PATTERN.fullmatch(tag_name):
        raise RuntimeError(f"Latest published GitHub release has invalid tag: {tag_name}")
    return tag_name


def get_incremented_version(base_version: str, release_type: str) -> str:
    match = VERSION_PATTERN.fullmatch(base_version)
    if not match:
        raise RuntimeError(f"Cannot increment invalid version: {base_version}")
    major, minor, patch = match.group(1), match.group(2), match.group(3)
    build = int(match.group(4)) + 1
    suffix = "-test" if release_type == "测试" else ""
    return f"v{major}.{minor}.{patch}.{build}{suffix}"


def test_branch_exists(branch: str) -> bool:
    remote = invoke_git_readonly("ls-remote", "--heads", "origin", branch)
    if remote:
        return True
    result = run_git(REPO_ROOT, "show-ref", "--verify", "--quiet", f"refs/remotes/origin/{branch}")
    return result.returncode == 0


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("-Version", "--version", dest="version", default="")
    parser.add_argument("-TargetBranch", "--target-branch", dest="target_branch", default="")
    parser.add_argument("-ReleaseType", "--release-type", dest="release_type", default="")
    parser.add_argument("-PreviousVersion", "--previous-version", dest="previous_version", default="")
    parser.add_argument("-AsJson", "--as-json", dest="as_json", action="store_true")
    return parser.parse_args(argv)


def build_plan(args: argparse.Namespace) -> OrderedDict[str, Any]:
    if args.release_type and args.release_type not in ("正式", "测试"):
        raise RuntimeError(
            f'Cannot validate argument on parameter \'ReleaseType\'. The argument "{args.release_type}" '
            'does not belong to the set "正式,测试" specified by the ValidateSet attribute. '
            "Supply an argument that is in the set and then try the command again."
        )
    current_modpack_version = get_modpack_version()
    version = args.version
    release_type = args.release_type
    target_branch = args.target_branch
    previous_version_arg = args.previous_version

    if version:
        if not VERSION_PATTERN.fullmatch(version):
            raise RuntimeError(f"Invalid version: {version}")
    elif test_head_changed_modpack():
        version = current_modpack_version
    else:
        effective_type = release_type if release_type else "正式"
        version = get_incremented_version(get_latest_published_release_tag(), effective_type)

    inferred_type = "测试" if version.endswith("-test") else "正式"
    if release_type and release_type != inferred_type:
        raise RuntimeError(f"ReleaseType '{release_type}' conflicts with version '{version}'")
    release_type = inferred_type

    match = VERSION_PATTERN.fullmatch(version)
    if not match:
        raise RuntimeError(f"Invalid resolved version: {version}")
    major, minor, patch = match.group(1), match.group(2), match.group(3)
    sub_version = f"{major}.{minor}.{patch}"

    if not target_branch:
        release_branch = f"release-v{major}{minor}{patch}x"
        target_branch = release_branch if test_branch_exists(release_branch) else "main"

    history = get_release_history(GITHUB_REPO)
    if release_type == "正式":
        previous_version = resolve_previous_formal_tag(version, history, previous_version_arg)
    elif previous_version_arg:
        previous_version = previous_version_arg
    else:
        previous_version = get_latest_published_release_tag()

    target_number = parse_version_number(version)
    matching_stable_tags = []
    pattern = re.compile(rf"^v{re.escape(sub_version)}\.\d+$")
    for item in history:
        tag_name = str(item.get("tagName") or "")
        if (
            (not item.get("isDraft"))
            and item.get("publishedAt")
            and (not item.get("isPrerelease"))
            and pattern.match(tag_name)
            and parse_version_number(tag_name) < target_number
        ):
            matching_stable_tags.append(tag_name)
    first_stable_candidate = release_type == "正式" and len(matching_stable_tags) == 0

    commit_range = f"{previous_version}..HEAD"
    commit_subjects = invoke_git_readonly("log", commit_range, "--pretty=format:%s")
    return OrderedDict(
        [
            ("version", version),
            ("releaseType", release_type),
            ("targetBranch", target_branch),
            ("previousVersion", previous_version),
            ("currentModpackVersion", current_modpack_version),
            ("headChangedModpack", test_head_changed_modpack()),
            ("firstStableCandidate", first_stable_candidate),
            ("updateSummaryPath", f"docs/update-summary-{version}.md"),
            ("announcementRequired", release_type == "正式"),
            ("commitRange", commit_range),
            ("commitSubjects", commit_subjects),
        ]
    )


def run(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    plan = build_plan(args)
    if args.as_json:
        print(json.dumps(plan, ensure_ascii=False, indent=4))
        return 0
    print(f"Version: {plan['version']}")
    print(f"Release type: {plan['releaseType']}")
    print(f"Target branch: {plan['targetBranch']}")
    print(f"Previous stable version: {plan['previousVersion']}")
    print(f"HEAD changed modpack.toml: {plan['headChangedModpack']}")
    print(f"First stable candidate: {plan['firstStableCandidate']}")
    print(f"Update summary path: {plan['updateSummaryPath']}")
    print(f"Commit range: {plan['commitRange']}")
    print(f"Commit subjects: {len(plan['commitSubjects'])}")
    return 0


def main(argv: list[str] | None = None) -> int:
    try:
        return run(argv)
    except Exception as exc:
        return print_error_and_exit(exc)


if __name__ == "__main__":
    raise SystemExit(main())
