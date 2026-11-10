#!/usr/bin/env python3
"""Create-Delight Remake post-merge release workflow script.

Handles the full release pipeline after PR merge:
- Tags the target branch locally
- Generates release notes and writes the draft before pushing the tag
- Waits for GitHub Actions CI to build and upload release assets
- Publishes the GitHub Release
- Verifies all assets uploaded
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
import sys
import time
from pathlib import Path
from typing import Any

if str(Path(__file__).resolve().parent) not in sys.path:
    sys.path.insert(0, str(Path(__file__).resolve().parent))

from release_notes import (
    DEFAULT_REPOSITORY,
    assert_curated_notes,
    assert_release_range,
    get_release_commits,
    get_release_history,
    new_release_notes,
    parse_version_number,
    print_error_and_exit,
    resolve_previous_formal_tag,
)


GITHUB_REPO = DEFAULT_REPOSITORY
WORKFLOW_NAME = "发布版本"
PREVIOUS_VERSION_PATTERN = re.compile(r"^v\d+\.\d+\.\d+\.\d+(-test)?$")


class PublishContext:
    def __init__(self, args: argparse.Namespace) -> None:
        self.version: str = args.version
        self.target_branch: str = args.target_branch
        self.previous_version: str = args.previous_version or ""
        self.release_type: str = args.release_type
        self.notes_file: str = args.notes_file or ""
        self.proxy: str = args.proxy or ""
        self.ci_poll_interval_seconds: int = args.ci_poll_interval_seconds
        self.ci_timeout_minutes: int = args.ci_timeout_minutes
        self.what_if: bool = args.what_if
        self.original_branch: str | None = None
        self.stashed = False
        self.curated_content = ""
        self.commit_sha = ""
        self.release_history: list[dict[str, Any]] = []


def write_host(message: str = "") -> None:
    print(message, flush=True)


def write_error(message: str) -> None:
    print(message, file=sys.stderr, flush=True)


def write_utf8_no_bom(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(content.encode("utf-8"))


def temp_dir() -> Path:
    return Path(os.environ.get("TEMP") or os.environ.get("TMP") or "/tmp")


def run_cmd(
    args: list[str],
    *,
    discard_stderr: bool = False,
    check_stdout: bool = True,
) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        args,
        stdout=subprocess.PIPE,
        stderr=subprocess.DEVNULL if discard_stderr else subprocess.PIPE,
        text=True,
        encoding="utf-8",
    )


def restore_state(ctx: PublishContext) -> None:
    if ctx.original_branch and ctx.original_branch != ctx.target_branch:
        write_host(f"🔄 Restoring original branch: {ctx.original_branch}")
        run_cmd(["git", "checkout", ctx.original_branch], discard_stderr=True)
    if ctx.stashed:
        write_host("🔄 Restoring stashed changes")
        run_cmd(["git", "stash", "pop"], discard_stderr=True)


def fail(ctx: PublishContext, message: str) -> None:
    write_host(f"❌ {message}")
    restore_state(ctx)
    write_error(message)
    raise SystemExit(1)


def get_latest_published_release_tag(ctx: PublishContext) -> str:
    result = run_cmd(
        [
            "gh",
            "release",
            "list",
            "--repo",
            GITHUB_REPO,
            "--limit",
            "1",
            "--exclude-drafts",
            "--json",
            "tagName,publishedAt,isPrerelease",
        ],
        discard_stderr=True,
    )
    if result.returncode != 0 or not result.stdout.strip():
        fail(ctx, "Cannot query the latest published GitHub release")
    try:
        releases = json.loads(result.stdout)
        if not isinstance(releases, list):
            releases = [releases]
    except json.JSONDecodeError:
        fail(ctx, "GitHub release list returned invalid JSON")
    if not releases or not releases[0].get("tagName"):
        fail(ctx, "No published GitHub release was found")
    return str(releases[0]["tagName"])


def test_prerequisites(ctx: PublishContext) -> bool:
    errors: list[str] = []
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

    if not Path("modpack.toml").is_file():
        errors.append("modpack.toml not found in current directory")

    from shutil import which

    gh_available = which("gh") is not None
    if not gh_available:
        errors.append("gh CLI not found. Install GitHub CLI first.")
    if gh_available:
        try:
            status = run_cmd(["gh", "auth", "status"], discard_stderr=True)
            if status.returncode != 0:
                errors.append("gh CLI not authenticated. Run 'gh auth login' first.")
        except FileNotFoundError:
            errors.append("gh CLI not authenticated. Run 'gh auth login' first.")

    if ctx.proxy:
        os.environ["HTTPS_PROXY"] = ctx.proxy
        os.environ["HTTP_PROXY"] = ctx.proxy
        os.environ["ALL_PROXY"] = ctx.proxy

    remote_branch = ""
    try:
        listed = run_cmd(["git", "ls-remote", "--heads", "origin", ctx.target_branch], discard_stderr=True)
        remote_branch = listed.stdout.strip()
    except OSError:
        remote_branch = ""
    if not remote_branch:
        fallback = run_cmd(
            ["git", "show-ref", "--verify", "--quiet", f"refs/remotes/origin/{ctx.target_branch}"]
        )
        if fallback.returncode == 0:
            remote_branch = f"refs/remotes/origin/{ctx.target_branch}"
            write_host(f"⚠️ Remote branch check used local origin/{ctx.target_branch} fallback")
    if not remote_branch:
        errors.append(f"Target branch '{ctx.target_branch}' not found on remote")

    if gh_available:
        try:
            existing = run_cmd(
                [
                    "gh",
                    "release",
                    "view",
                    ctx.version,
                    "--repo",
                    GITHUB_REPO,
                    "--json",
                    "tagName,isDraft",
                ],
                discard_stderr=True,
            )
            if existing.returncode == 0 and existing.stdout.strip():
                try:
                    obj = json.loads(existing.stdout)
                except json.JSONDecodeError:
                    obj = None
                if obj and obj.get("isDraft"):
                    write_host(
                        f"⚠️ Draft release '{ctx.version}' already exists; publish will resume uploads"
                    )
                elif obj:
                    errors.append(
                        f"Release '{ctx.version}' already exists on GitHub. Cannot recreate a release."
                    )
        except OSError:
            pass

    if errors:
        write_host("❌ Pre-flight validation failed:")
        for err in errors:
            write_host(f"   - {err}")
        return False
    write_host("✅ Pre-flight validation passed")
    return True


def load_notes(ctx: PublishContext) -> None:
    notes_file = ctx.notes_file
    default_path = Path(f"docs/release-notes-{ctx.version}.md")
    if not notes_file and default_path.is_file():
        notes_file = str(default_path)
        ctx.notes_file = notes_file
    if not notes_file:
        raise RuntimeError(
            "Release agent must write docs/release-notes-{Version}.md or supply -NotesFile before Publish"
        )
    path = Path(notes_file)
    if not path.is_file():
        raise RuntimeError(f"Cannot find path '{path}' because it does not exist.")
    ctx.curated_content = path.read_text(encoding="utf-8")
    # Validate curated notes before any local tag creation.
    assert_curated_notes(ctx.curated_content, GITHUB_REPO)


def resolve_baseline(ctx: PublishContext) -> None:
    try:
        if ctx.release_type == "正式":
            ctx.release_history = get_release_history(GITHUB_REPO)
            ctx.previous_version = resolve_previous_formal_tag(
                ctx.version, ctx.release_history, ctx.previous_version
            )
        elif not ctx.previous_version:
            ctx.previous_version = get_latest_published_release_tag(ctx)
        write_host(f"   ✅ PreviousVersion: {ctx.previous_version}")
    except SystemExit:
        raise
    except Exception as exc:
        fail(ctx, f"Cannot resolve release baseline: {exc}")

    if not PREVIOUS_VERSION_PATTERN.fullmatch(ctx.previous_version):
        fail(
            ctx,
            f"PreviousVersion format invalid: '{ctx.previous_version}'. "
            "Expected format: v0.4.7.15 or v0.4.7.15-test",
        )
    listed = run_cmd(["git", "tag", "-l", ctx.previous_version], discard_stderr=True)
    if not listed.stdout.strip():
        available = run_cmd(["git", "tag", "-l", "v*"], discard_stderr=True)
        last_five = " ".join(available.stdout.splitlines()[-5:])
        fail(
            ctx,
            f"PreviousVersion tag '{ctx.previous_version}' not found locally. "
            f"Available tags: {last_five}",
        )


def print_what_if(ctx: PublishContext) -> int:
    write_host("")
    write_host("🔍 DRY RUN - No changes will be made")
    write_host(f"   Version: {ctx.version}")
    write_host(f"   TargetBranch: {ctx.target_branch}")
    write_host(f"   PreviousVersion: {ctx.previous_version}")
    write_host(f"   ReleaseType: {ctx.release_type}")
    write_host("")
    write_host("   Would:")
    write_host(f"   A. Create local tag {ctx.version} on {ctx.target_branch}")
    write_host(
        f"   B. Generate release notes from {ctx.previous_version}..{ctx.version} and prepare the draft"
    )
    write_host(
        f"   C. Push tag and wait for CI to prepare and upload release assets "
        f"(timeout: {ctx.ci_timeout_minutes} min)"
    )
    write_host("   D. Publish the draft release")
    write_host("   E. Verify assets")
    if ctx.release_type == "正式":
        write_host("   F. Create announcement PR to main")
    return 0


def prepare_player_notes(ctx: PublishContext) -> str:
    write_host("📝 Phase A.1: Generating release notes")
    sub_version_prefix = ""
    match = re.match(r"^(v\d+\.\d+\.\d+)", ctx.version)
    if match:
        sub_version_prefix = match.group(1)
    is_first_stable = False
    if sub_version_prefix and ctx.release_type == "正式":
        target_number = parse_version_number(ctx.version)
        pattern = re.compile("^" + re.escape(sub_version_prefix) + r"\.\d+$")
        prior_formals = [
            item
            for item in ctx.release_history
            if (not item.get("isDraft"))
            and (not item.get("isPrerelease"))
            and item.get("publishedAt")
            and pattern.match(str(item.get("tagName") or ""))
            and parse_version_number(str(item["tagName"])) < target_number
        ]
        is_first_stable = len(prior_formals) == 0
        if is_first_stable:
            write_host(f"   🎉 This is the first formal release of {sub_version_prefix}")
        else:
            write_host(
                f"   Summary check: not the first formal release; notes baseline remains {ctx.previous_version}"
            )

    summary_content = ""
    if is_first_stable:
        summary_file_path = f"docs/update-summary-{ctx.version}.md"
        if Path(summary_file_path).is_file():
            summary_content = Path(summary_file_path).read_text(encoding="utf-8")
            write_host(f"   📄 Found update summary: {summary_file_path}")
        else:
            fail(ctx, f"First stable release requires update summary: docs/update-summary-{ctx.version}.md")

    try:
        assert_release_range(ctx.version, ctx.previous_version, Path.cwd())
        commits = get_release_commits(ctx.previous_version, ctx.version, Path.cwd())
        # $ReleaseNotes = New-ReleaseNotes
        return new_release_notes(
            ctx.version,
            ctx.previous_version,
            ctx.release_type,
            GITHUB_REPO,
            commits,
            ctx.curated_content,
            summary_content,
        )
    except Exception as exc:
        fail(ctx, f"Cannot prepare player-facing release notes: {exc}")
        raise  # unreachable, keeps type checkers happy


def create_or_update_draft(ctx: PublishContext, notes: str, title: str) -> None:
    write_host("🚀 Phase A.2: Preparing draft GitHub Release")
    draft_notes_file = temp_dir() / "opencode" / f"release-notes-{ctx.version}.md"
    write_utf8_no_bom(draft_notes_file, notes)
    view = run_cmd(
        ["gh", "release", "view", ctx.version, "--repo", GITHUB_REPO, "--json", "isDraft"],
        discard_stderr=True,
    )
    if view.returncode == 0 and view.stdout.strip():
        try:
            obj = json.loads(view.stdout)
        except json.JSONDecodeError:
            obj = None
        if obj and not obj.get("isDraft"):
            draft_notes_file.unlink(missing_ok=True)
            fail(ctx, f"Release {ctx.version} already exists and is not a draft")
        write_host(f"   Draft release {ctx.version} already exists, resuming uploads")
        edited = run_cmd(
            [
                "gh",
                "release",
                "edit",
                ctx.version,
                "--repo",
                GITHUB_REPO,
                "--title",
                title,
                "--notes-file",
                str(draft_notes_file),
            ]
        )
        if edited.returncode != 0:
            draft_notes_file.unlink(missing_ok=True)
            fail(ctx, "Failed to update draft release metadata")
    else:
        create_args = [
            "gh",
            "release",
            "create",
            ctx.version,
            "--repo",
            GITHUB_REPO,
            "--title",
            title,
        ]
        if ctx.release_type != "正式":
            create_args.append("--prerelease")
        create_args.extend(
            ["--notes-file", str(draft_notes_file), "--target", ctx.commit_sha, "--draft"]
        )
        created = run_cmd(create_args)
        if created.returncode != 0:
            draft_notes_file.unlink(missing_ok=True)
            fail(ctx, "Failed to create draft GitHub release")
    draft_notes_file.unlink(missing_ok=True)
    write_host(f"✅ Draft release ready: {title}")


def wait_for_ci(ctx: PublishContext) -> None:
    write_host("⏳ Phase B: Waiting for GitHub Actions CI")
    timeout = ctx.ci_timeout_minutes * 60
    started = time.monotonic()
    run_id = None
    while time.monotonic() - started < timeout:
        listed = run_cmd(
            [
                "gh",
                "run",
                "list",
                "--repo",
                GITHUB_REPO,
                "--limit",
                "10",
                "--json",
                "databaseId,status,conclusion,name,headBranch,headSha",
            ],
            discard_stderr=True,
        )
        if listed.returncode == 0 and listed.stdout.strip():
            try:
                runs = json.loads(listed.stdout)
            except json.JSONDecodeError:
                runs = []
            if isinstance(runs, list):
                for item in runs:
                    if (
                        item.get("name") == WORKFLOW_NAME
                        and item.get("headBranch") == ctx.version
                        and item.get("headSha") == ctx.commit_sha
                        and item.get("databaseId")
                    ):
                        run_id = item["databaseId"]
                        break
        if run_id:
            break
        write_host(f"   Waiting for workflow run (SHA {ctx.commit_sha}) to appear...")
        time.sleep(ctx.ci_poll_interval_seconds)
    if not run_id:
        fail(ctx, f"CI workflow run not found within {ctx.ci_timeout_minutes} minutes")
    write_host(f"   Found workflow run: {run_id}")

    started = time.monotonic()
    while time.monotonic() - started < timeout:
        status_json = run_cmd(
            ["gh", "run", "view", str(run_id), "--repo", GITHUB_REPO, "--json", "status,conclusion"],
            discard_stderr=True,
        )
        if status_json.returncode != 0:
            write_host("   Cannot query CI run status, retrying...")
            time.sleep(ctx.ci_poll_interval_seconds)
            continue
        try:
            run_status = json.loads(status_json.stdout)
        except json.JSONDecodeError:
            run_status = {}
        status = run_status.get("status")
        conclusion = run_status.get("conclusion")
        if status == "completed":
            if conclusion == "success":
                write_host(f"✅ CI completed successfully (run {run_id})")
                return
            run_url = f"https://github.com/{GITHUB_REPO}/actions/runs/{run_id}"
            fail(ctx, f"CI failed with conclusion: {conclusion}. See: {run_url}")
        elapsed = int(time.monotonic() - started)
        write_host(f"   CI status: {status} (elapsed: {elapsed // 60:02d}:{elapsed % 60:02d})")
        time.sleep(ctx.ci_poll_interval_seconds)
    fail(ctx, f"CI timed out after {ctx.ci_timeout_minutes} minutes")


def verify_assets(ctx: PublishContext) -> None:
    write_host("🔍 Phase H: Verifying uploaded assets")
    viewed = run_cmd(
        ["gh", "release", "view", ctx.version, "--repo", GITHUB_REPO, "--json", "assets"],
        discard_stderr=True,
    )
    if viewed.returncode != 0:
        fail(ctx, "Cannot verify release assets")
    try:
        release_view = json.loads(viewed.stdout) if viewed.stdout.strip() else {}
    except json.JSONDecodeError:
        release_view = {}
    uploaded_assets = []
    if release_view and release_view.get("assets"):
        uploaded_assets = [asset.get("name") for asset in release_view["assets"]]
    asset_count = len(uploaded_assets)
    expected_count = 4 if ctx.release_type == "正式" else 2
    write_host(f"   Uploaded assets ({asset_count}/{expected_count}):")
    for asset in uploaded_assets:
        write_host(f"     - {asset}")
    if asset_count != expected_count:
        expected_assets = [
            f"Client-Create-Delight-Remake-{ctx.version}.zip",
            f"Server-Create-Delight-Remake-{ctx.version}.zip",
        ]
        if ctx.release_type == "正式":
            expected_assets.extend(
                [
                    f"ClientPatch-Create-Delight-Remake-{ctx.previous_version}-to-{ctx.version}.zip",
                    f"ServerPatch-Create-Delight-Remake-{ctx.previous_version}-to-{ctx.version}.zip",
                ]
            )
        missing = [name for name in expected_assets if name not in uploaded_assets]
        fail(
            ctx,
            f"Asset count mismatch: expected {expected_count}, got {asset_count}. "
            f"Missing: {', '.join(missing)}",
        )
    write_host(f"✅ All {asset_count} assets verified")


def create_announcement_pr(ctx: PublishContext) -> str:
    announcement_pr_url = ""
    if ctx.release_type != "正式":
        write_host("📢 Phase I: Skipped (测试版 does not need announcement PR)")
        return announcement_pr_url
    write_host("📢 Phase I: Creating announcement PR to main")
    try:
        current = run_cmd(["git", "branch", "--show-current"], discard_stderr=True).stdout.strip()
        if current != ctx.target_branch:
            write_host(f"   Ensuring we're on {ctx.target_branch} before reading announcement")
            run_cmd(["git", "checkout", ctx.target_branch], discard_stderr=True)
        shown = run_cmd(["git", "show", f"{ctx.version}:docs/announcement.md"], discard_stderr=True)
        if shown.returncode != 0 or not shown.stdout:
            write_host(f"   ⚠️ Cannot read docs/announcement.md from tag {ctx.version}, skipping announcement PR")
            return announcement_pr_url
        ann_from_tag = shown.stdout
        ann_branch = f"announcement/{ctx.version}"
        run_cmd(["git", "fetch", "origin", "main"], discard_stderr=True)
        created = run_cmd(["git", "checkout", "-b", ann_branch, "origin/main"], discard_stderr=True)
        if created.returncode != 0:
            write_host(f"   ⚠️ Cannot create branch {ann_branch} from origin/main, skipping announcement PR")
            return announcement_pr_url
        Path("docs").mkdir(exist_ok=True)
        write_utf8_no_bom(Path("docs/announcement.md").resolve(), ann_from_tag)
        run_cmd(["git", "add", "docs/announcement.md"])
        committed = run_cmd(["git", "commit", "-m", f"[docs] 更新公告至{ctx.version}版本"], discard_stderr=True)
        if committed.returncode == 0:
            pushed = run_cmd(["git", "push", "-u", "origin", ann_branch], discard_stderr=True)
            if pushed.returncode == 0:
                pr_body = f"自动更新 docs/announcement.md 至 {ctx.version} 正式版。"
                pr_body_file = temp_dir() / "opencode" / f"ann-pr-body-{ctx.version}.md"
                write_utf8_no_bom(pr_body_file, pr_body)
                created_pr = run_cmd(
                    [
                        "gh",
                        "pr",
                        "create",
                        "--base",
                        "main",
                        "--head",
                        ann_branch,
                        "--title",
                        f"[docs] 更新公告至{ctx.version}版本",
                        "--body-file",
                        str(pr_body_file),
                    ],
                    discard_stderr=True,
                )
                pr_body_file.unlink(missing_ok=True)
                if created_pr.returncode == 0:
                    announcement_pr_url = created_pr.stdout.strip()
                    write_host(f"   ✅ Announcement PR created: {announcement_pr_url}")
                else:
                    write_host("   ⚠️ Failed to create announcement PR (gh pr create failed)")
            else:
                write_host("   ⚠️ Failed to push announcement branch")
        else:
            write_host("   ⚠️ No changes to commit (announcement.md may be unchanged on main)")
        run_cmd(["git", "checkout", ctx.target_branch], discard_stderr=True)
    except Exception as exc:
        write_host(f"   ⚠️ Announcement PR failed: {exc}")
    finally:
        current_branch = run_cmd(["git", "branch", "--show-current"], discard_stderr=True).stdout.strip()
        if current_branch != ctx.target_branch:
            write_host(f"   Restoring branch to {ctx.target_branch}")
            run_cmd(["git", "checkout", ctx.target_branch], discard_stderr=True)
    return announcement_pr_url


def run_publish(ctx: PublishContext) -> int:
    # Phase A: Local tag and draft
    write_host(f"🏷️ Phase A: Preparing local tag and draft {ctx.version}")
    if ctx.proxy:
        os.environ["HTTPS_PROXY"] = ctx.proxy
        os.environ["HTTP_PROXY"] = ctx.proxy
        os.environ["ALL_PROXY"] = ctx.proxy
        write_host(f"🌐 Proxy set: {ctx.proxy}")

    os.environ["CI"] = "true"
    os.environ["GIT_TERMINAL_PROMPT"] = "0"
    os.environ["GCM_INTERACTIVE"] = "never"
    os.environ["GIT_EDITOR"] = ":"
    os.environ["EDITOR"] = ":"
    os.environ["GIT_PAGER"] = "cat"

    branch = run_cmd(["git", "branch", "--show-current"])
    if branch.returncode != 0:
        fail(ctx, "Cannot determine current branch")
    ctx.original_branch = branch.stdout.strip()

    dirty = run_cmd(["git", "status", "--porcelain"])
    if dirty.stdout.strip():
        write_host("📦 Stashing uncommitted changes")
        stashed = run_cmd(["git", "stash"])
        if stashed.returncode != 0:
            fail(ctx, "git stash failed")
        ctx.stashed = True

    checked = run_cmd(["git", "checkout", ctx.target_branch])
    if checked.returncode != 0:
        fail(ctx, f"Cannot checkout branch {ctx.target_branch}")

    pulled = run_cmd(["git", "pull", "--ff-only", "origin", ctx.target_branch])
    if pulled.returncode != 0:
        head_sha = run_cmd(["git", "rev-parse", "HEAD"]).stdout.strip()
        origin_sha = run_cmd(["git", "rev-parse", f"origin/{ctx.target_branch}"]).stdout.strip()
        if head_sha == origin_sha:
            write_host(
                f"⚠️ git pull failed, but HEAD already matches origin/{ctx.target_branch}; continuing"
            )
        else:
            fail(ctx, f"git pull failed on {ctx.target_branch}")

    if ctx.stashed:
        popped = run_cmd(["git", "stash", "pop"], discard_stderr=True)
        if popped.returncode != 0:
            write_host("⚠️ stash pop had conflicts, continuing anyway")
        ctx.stashed = False

    sha = run_cmd(["git", "rev-parse", "HEAD"])
    if sha.returncode != 0:
        fail(ctx, "Cannot determine HEAD commit SHA")
    ctx.commit_sha = sha.stdout.strip()
    write_host(f"   Commit SHA: {ctx.commit_sha}")

    existing_tag = run_cmd(["git", "rev-list", "-n", "1", ctx.version], discard_stderr=True)
    if existing_tag.returncode == 0 and existing_tag.stdout.strip():
        existing_tag_commit = existing_tag.stdout.strip()
        if existing_tag_commit == ctx.commit_sha:
            write_host(f"   Tag {ctx.version} already exists on current commit, skipping tag creation")
        else:
            fail(
                ctx,
                f"Tag {ctx.version} already exists on different commit ({existing_tag_commit}). "
                f"Current commit is {ctx.commit_sha}. Delete the tag first or use a different version.",
            )
    else:
        tagged = run_cmd(["git", "tag", ctx.version])
        if tagged.returncode != 0:
            fail(ctx, f"Cannot create tag {ctx.version}")

    notes = prepare_player_notes(ctx)
    write_host("📝 Release notes generated")
    title = f"{ctx.version} 正式版" if ctx.release_type == "正式" else f"{ctx.version} 测试版"
    create_or_update_draft(ctx, notes, title)

    # git push origin $Version  (after draft notes exist)
    pushed = run_cmd(["git", "push", "origin", ctx.version])
    if pushed.returncode != 0:
        fail(ctx, f"Cannot push tag {ctx.version}")
    write_host(f"✅ Tag {ctx.version} pushed")

    wait_for_ci(ctx)

    # Legacy artifact download/upload lived here and was moved to the release-assets CI job.
    write_host("📦 Phase C: Release assets are prepared and uploaded by GitHub Actions")

    if ctx.release_type == "正式":
        published = run_cmd(
            [
                "gh",
                "release",
                "edit",
                ctx.version,
                "--repo",
                GITHUB_REPO,
                "--draft=false",
                "--prerelease=false",
            ]
        )
    else:
        published = run_cmd(
            [
                "gh",
                "release",
                "edit",
                ctx.version,
                "--repo",
                GITHUB_REPO,
                "--draft=false",
                "--prerelease=true",
            ]
        )
    if published.returncode != 0:
        fail(ctx, "Failed to publish draft release")
    write_host(f"✅ Release published: {title}")

    verify_assets(ctx)
    announcement_pr_url = create_announcement_pr(ctx)

    write_host("🧹 Phase J: Cleanup")
    restore_state(ctx)

    release_url = ""
    url_json = run_cmd(
        ["gh", "release", "view", ctx.version, "--repo", GITHUB_REPO, "--json", "url"],
        discard_stderr=True,
    )
    if url_json.returncode == 0 and url_json.stdout.strip():
        try:
            release_url = str(json.loads(url_json.stdout).get("url") or "")
        except json.JSONDecodeError:
            release_url = ""
    if not release_url:
        release_url = f"https://github.com/{GITHUB_REPO}/releases/tag/{ctx.version}"
    write_host("")
    write_host("🎉 Release published successfully!")
    write_host(f"🔗 {release_url}")
    if announcement_pr_url:
        write_host(f"📢 Announcement PR: {announcement_pr_url}")
    return 0


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("-Version", "--version", dest="version", required=True)
    parser.add_argument("-TargetBranch", "--target-branch", dest="target_branch", required=True)
    parser.add_argument("-PreviousVersion", "--previous-version", dest="previous_version", default="")
    parser.add_argument(
        "-ReleaseType",
        "--release-type",
        dest="release_type",
        choices=("正式", "测试"),
        default="正式",
    )
    parser.add_argument("-NotesFile", "--notes-file", dest="notes_file", default="")
    parser.add_argument("-Proxy", "--proxy", dest="proxy", default="")
    parser.add_argument(
        "-CIPollIntervalSeconds",
        "--ci-poll-interval-seconds",
        dest="ci_poll_interval_seconds",
        type=int,
        default=30,
    )
    parser.add_argument(
        "-CITimeoutMinutes",
        "--ci-timeout-minutes",
        dest="ci_timeout_minutes",
        type=int,
        default=15,
    )
    parser.add_argument("-WhatIf", "--what-if", dest="what_if", action="store_true")
    return parser.parse_args(argv)


def run(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    ctx = PublishContext(args)
    load_notes(ctx)
    if not test_prerequisites(ctx):
        return 1
    resolve_baseline(ctx)
    if ctx.what_if:
        return print_what_if(ctx)
    return run_publish(ctx)


def main(argv: list[str] | None = None) -> int:
    try:
        return run(argv)
    except SystemExit as exc:
        code = exc.code
        return code if isinstance(code, int) else 1
    except Exception as exc:
        return print_error_and_exit(exc)


if __name__ == "__main__":
    raise SystemExit(main())
