#!/usr/bin/env python3
"""Create-Delight Remake modpack release prepare script (pre-merge phase).

Updates modpack.toml version, updates docs/announcement.md for stable
releases, creates a version-bump branch, commits, pushes, and opens a PR
to the target branch.
"""
from __future__ import annotations

import argparse
import os
import re
import subprocess
import sys
from pathlib import Path

if str(Path(__file__).resolve().parent) not in sys.path:
    sys.path.insert(0, str(Path(__file__).resolve().parent))

from release_notes import print_error_and_exit


VERSION_BRANCH_PREFIX = "codex/release-"


def write_utf8_no_bom(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(content.encode("utf-8"))


def run_cmd(args: list[str], discard_stderr: bool = False) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        args,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )


def write_host(message: str) -> None:
    print(message, flush=True)


def write_error(message: str) -> None:
    print(message, file=sys.stderr, flush=True)


class PrepareContext:
    def __init__(self, args: argparse.Namespace) -> None:
        self.version: str = args.version
        self.target_branch: str = args.target_branch
        self.announcement: str = args.announcement or ""
        self.release_type: str = args.release_type
        self.proxy: str = args.proxy or ""
        self.what_if: bool = args.what_if
        self.stashed = False
        self.original_branch = ""
        self.prepare_succeeded = False
        self.version_branch = f"{VERSION_BRANCH_PREFIX}{self.version}"

    def restore_state(self) -> None:
        listed = run_cmd(["git", "branch", "--list", self.version_branch])
        version_branch_exists = bool(listed.stdout.strip())
        if version_branch_exists and not self.prepare_succeeded:
            write_host(f"📦 Cleaning up local branch {self.version_branch}")
            run_cmd(["git", "checkout", self.original_branch])
            run_cmd(["git", "branch", "-D", self.version_branch])
        if self.original_branch:
            write_host(f"📦 Restoring branch: {self.original_branch}")
            run_cmd(["git", "checkout", self.original_branch])
        if self.stashed:
            write_host("📦 Unstashing changes")
            run_cmd(["git", "stash", "pop"])


def test_prerequisites(ctx: PrepareContext) -> bool:
    errors: list[str] = []
    if not Path("modpack.toml").is_file():
        errors.append("modpack.toml not found in current directory")

    if ctx.release_type == "测试":
        expected_pattern = r"^v\d+\.\d+\.\d+\.\d+-test$"
        expected_example = "v0.4.8.10-test"
    else:
        expected_pattern = r"^v\d+\.\d+\.\d+\.\d+$"
        expected_example = "v0.4.8.10"
    if not re.fullmatch(expected_pattern, ctx.version):
        errors.append(
            f"Version format invalid for {ctx.release_type} release: '{ctx.version}'. "
            f"Expected format: {expected_example}"
        )

    from shutil import which

    gh_available = which("gh") is not None
    if not gh_available:
        errors.append("gh CLI not found. Install GitHub CLI first.")

    if gh_available:
        status = run_cmd(["gh", "auth", "status"])
        if status.returncode != 0:
            errors.append("gh CLI not authenticated. Run 'gh auth login' first.")

    if ctx.proxy:
        os.environ["HTTPS_PROXY"] = ctx.proxy
        os.environ["HTTP_PROXY"] = ctx.proxy
        os.environ["ALL_PROXY"] = ctx.proxy

    remote_branch = run_cmd(["git", "ls-remote", "--heads", "origin", ctx.target_branch])
    if not remote_branch.stdout.strip():
        errors.append(f"Target branch '{ctx.target_branch}' not found on remote")

    if gh_available:
        existing = run_cmd(
            [
                "gh",
                "release",
                "view",
                ctx.version,
                "--repo",
                "Jasons-impart/Create-Delight-Remake",
                "--json",
                "tagName",
            ]
        )
        if existing.returncode == 0 and existing.stdout.strip():
            errors.append(f"Release '{ctx.version}' already exists on GitHub")

    if errors:
        write_host("❌ Pre-flight validation failed:")
        for err in errors:
            write_host(f"   - {err}")
        return False

    write_host("✅ Pre-flight validation passed")
    return True


def build_announcement_lines(ctx: PrepareContext) -> list[str]:
    lines: list[str] = []
    if ctx.announcement and ctx.announcement.strip():
        for item in ctx.announcement.split(","):
            item = item.strip()
            if item:
                lines.append(f"- {item}")
    else:
        last = run_cmd(["git", "log", "-1", "--pretty=format:%s"])
        last_msg = last.stdout if last.returncode == 0 else ""
        # format:%s has no trailing newline typically; keep as-is
        if last_msg:
            lines.append(f"- {last_msg}")
    return lines


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("-Version", "--version", dest="version", required=True)
    parser.add_argument("-TargetBranch", "--target-branch", dest="target_branch", required=True)
    parser.add_argument("-Announcement", "--announcement", dest="announcement", default="")
    parser.add_argument(
        "-ReleaseType",
        "--release-type",
        dest="release_type",
        choices=("正式", "测试"),
        default="正式",
    )
    parser.add_argument("-Proxy", "--proxy", dest="proxy", default="")
    parser.add_argument("-WhatIf", "--what-if", dest="what_if", action="store_true")
    return parser.parse_args(argv)


def run(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    ctx = PrepareContext(args)

    os.environ["CI"] = "true"
    os.environ["GIT_TERMINAL_PROMPT"] = "0"
    os.environ["GCM_INTERACTIVE"] = "never"
    os.environ["GIT_EDITOR"] = ":"
    os.environ["EDITOR"] = ":"
    os.environ["GIT_PAGER"] = "cat"

    if not test_prerequisites(ctx):
        return 1

    if ctx.what_if:
        write_host("🔍 DRY RUN - No changes will be made")
        write_host(f"   Version: {ctx.version}")
        write_host(f"   TargetBranch: {ctx.target_branch}")
        write_host(f"   ReleaseType: {ctx.release_type}")
        write_host(f"   Announcement: {ctx.announcement}")
        write_host(f"   Proxy: {ctx.proxy if ctx.proxy else '(none)'}")
        write_host("")
        write_host("   Would:")
        write_host(f"   1. Create branch {ctx.version_branch} from {ctx.target_branch}")
        write_host(f"   2. Update modpack.toml version to {ctx.version}")
        if ctx.release_type == "正式":
            write_host("   3. Update docs/announcement.md")
            write_host("   4. Auto-stage the exact update-summary file (if present)")
        else:
            write_host("   3. Skip docs/announcement.md for test release")
            write_host("   4. Skip update-summary auto-stage for test release")
        write_host("   5. Commit and push")
        write_host(f"   6. Create PR to {ctx.target_branch}")
        return 0

    if ctx.proxy:
        os.environ["HTTPS_PROXY"] = ctx.proxy
        os.environ["HTTP_PROXY"] = ctx.proxy
        os.environ["ALL_PROXY"] = ctx.proxy
        write_host(f"📦 Proxy set: {ctx.proxy}")

    branch_result = run_cmd(["git", "rev-parse", "--abbrev-ref", "HEAD"])
    original = branch_result.stdout.strip() if branch_result.returncode == 0 else ""
    if not original:
        head_result = run_cmd(["git", "rev-parse", "HEAD"])
        original = head_result.stdout.strip() if head_result.returncode == 0 else ""
    ctx.original_branch = original
    write_host(f"📦 Current branch: {ctx.original_branch}")

    status = run_cmd(["git", "status", "--porcelain"])
    if status.stdout.strip():
        write_host("📦 Stashing uncommitted changes")
        stash = run_cmd(["git", "stash"])
        if stash.returncode != 0:
            write_error("Failed to stash changes")
            return 1
        ctx.stashed = True

    write_host("📦 Fetching remote branches")
    fetched = run_cmd(["git", "fetch", "origin"])
    if fetched.returncode != 0:
        write_host("⚠️ git fetch failed, continuing anyway")

    write_host(f"📦 Creating branch {ctx.version_branch} from {ctx.target_branch}")

    existing_local = run_cmd(["git", "branch", "--list", ctx.version_branch])
    if existing_local.stdout.strip():
        write_host(f"⚠️ Branch {ctx.version_branch} already exists locally, deleting")
        run_cmd(["git", "branch", "-D", ctx.version_branch])

    existing_remote = run_cmd(["git", "ls-remote", "--heads", "origin", ctx.version_branch])
    if existing_remote.stdout.strip():
        write_host(f"⚠️ Branch {ctx.version_branch} already exists remotely, deleting")
        run_cmd(["git", "push", "origin", "--delete", ctx.version_branch])

    created = run_cmd(["git", "checkout", "-b", ctx.version_branch, ctx.target_branch])
    if created.returncode != 0:
        write_error(f"Failed to create branch {ctx.version_branch}")
        ctx.restore_state()
        return 1

    write_host(f"📦 Updating modpack.toml version to {ctx.version}")
    try:
        content = Path("modpack.toml").read_text(encoding="utf-8")
        new_content = re.sub(
            r'version = "v[\d.]+(?:-test)?"',
            f'version = "{ctx.version}"',
            content,
        )
        if new_content == content:
            write_error("Failed to update version in modpack.toml - pattern not matched")
            ctx.restore_state()
            return 1
        write_utf8_no_bom(Path("modpack.toml").resolve(), new_content)
        write_host("✅ modpack.toml updated")
    except Exception as exc:
        write_error(f"Failed to update modpack.toml: {exc}")
        ctx.restore_state()
        return 1

    write_host("📦 Building release summary")
    ann_lines = build_announcement_lines(ctx)
    ann_content = f"### {ctx.version} 已发布"
    if ann_lines:
        ann_content += "\n" + "\n".join(ann_lines)

    ann_path = Path("docs/announcement.md")
    if ctx.release_type == "正式":
        write_utf8_no_bom(ann_path.resolve(), ann_content)
        write_host("✅ announcement.md updated")
    else:
        write_host("ℹ️ Test release: skipping announcement.md update")

    write_host("📦 Staging and committing")
    add_modpack = run_cmd(["git", "add", "modpack.toml"])
    if add_modpack.returncode != 0:
        write_error("Failed to stage files")
        ctx.restore_state()
        return 1

    if ctx.release_type == "正式":
        add_ann = run_cmd(["git", "add", str(ann_path)])
        if add_ann.returncode != 0:
            write_error(f"Failed to stage {ann_path}")
            ctx.restore_state()
            return 1

    if ctx.release_type == "正式":
        summary_path = f"docs/update-summary-{ctx.version}.md"
        if Path(summary_path).is_file():
            write_host(f"📦 Auto-staging update summary: {summary_path}")
            staged = run_cmd(["git", "add", summary_path])
            if staged.returncode == 0:
                write_host(f"✅ Staged {summary_path}")
    else:
        write_host("ℹ️ Test release: skipping update-summary auto-stage")

    kind = "正式版" if ctx.release_type == "正式" else "测试版"
    # Match the original script: git commit/push stdout is visible; push stderr is discarded.
    commit = subprocess.run(
        ["git", "commit", "-m", f"[feat] {ctx.version} {kind}版本更新"]
    )
    if commit.returncode != 0:
        write_error("Failed to commit")
        ctx.restore_state()
        return 1
    write_host("✅ Committed")

    write_host("📦 Pushing to origin")
    pushed = subprocess.run(
        ["git", "push", "-u", "origin", ctx.version_branch],
        stderr=subprocess.DEVNULL,
    )
    if pushed.returncode != 0:
        write_error(f"Failed to push branch {ctx.version_branch}")
        ctx.restore_state()
        return 1
    write_host("✅ Pushed")

    write_host("📦 Creating PR")
    existing_pr = run_cmd(
        [
            "gh",
            "pr",
            "list",
            "--repo",
            "Jasons-impart/Create-Delight-Remake",
            "--head",
            ctx.version_branch,
            "--base",
            ctx.target_branch,
            "--json",
            "url",
            "--jq",
            ".[0].url",
        ]
    )
    if existing_pr.returncode == 0 and existing_pr.stdout.strip():
        existing_url = existing_pr.stdout.strip()
        write_host(f"✅ PR already exists: {existing_url}")
        ctx.prepare_succeeded = True
        ctx.restore_state()
        write_host(f"✅ Done! PR already exists: {existing_url}")
        print(existing_url)
        return 0

    ann_text = [re.sub(r"^- ", "", line) for line in ann_lines]
    pr_body = f"版本号更新: → {ctx.version}\n\n**更新内容**:\n- " + "\n- ".join(ann_text)
    temp_root = Path(os.environ.get("TEMP") or os.environ.get("TMP") or "/tmp")
    pr_body_file = temp_root / "opencode" / f"pr-body-{ctx.version}.md"
    write_utf8_no_bom(pr_body_file, pr_body)
    created_pr = run_cmd(
        [
            "gh",
            "pr",
            "create",
            "--base",
            ctx.target_branch,
            "--head",
            ctx.version_branch,
            "--title",
            f"[feat] {ctx.version} 版本更新",
            "--body-file",
            str(pr_body_file),
        ]
    )
    try:
        pr_body_file.unlink(missing_ok=True)
    except OSError:
        pass
    if created_pr.returncode != 0:
        write_error("Failed to create PR")
        ctx.restore_state()
        return 1
    write_host("✅ PR created")

    ctx.prepare_succeeded = True
    ctx.restore_state()
    pr_url = created_pr.stdout.strip()
    write_host(f"✅ Done! PR URL: {pr_url}")
    print(pr_url)
    return 0


def main(argv: list[str] | None = None) -> int:
    try:
        return run(argv)
    except Exception as exc:
        return print_error_and_exit(exc)


if __name__ == "__main__":
    raise SystemExit(main())
