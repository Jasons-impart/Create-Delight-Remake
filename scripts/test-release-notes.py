#!/usr/bin/env python3
"""Offline regression tests for release_notes.py.

No network, gh auth, or real release writes are required for the library tests.
Publish CLI checks invoke release-publish.py with -WhatIf so notes are validated
before any tag is created.
"""
from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RELEASE_DIR = ROOT / ".agents" / "skills" / "release"
if str(RELEASE_DIR) not in sys.path:
    sys.path.insert(0, str(RELEASE_DIR))

import release_notes as rn  # noqa: E402


PUBLISH = RELEASE_DIR / "release-publish.py"


def release(tag: str, pre: bool = False, draft: bool = False) -> dict:
    return {
        "tagName": tag,
        "isPrerelease": pre,
        "isDraft": draft,
        "publishedAt": "2026-11-01T00:00:00Z",
    }


def commit(subject: str, paths=None, sha=None) -> dict:
    return {
        "Subject": subject,
        "Paths": paths if paths is not None else ["kubejs/server_scripts/recipe.js"],
        "Sha": sha or ("a" * 40),
    }


HISTORY = [
    release("v0.5.0.9"),
    release("v0.5.0.15"),
    release("v0.5.0.17"),
    release("v0.5.1.99"),
    release("v0.5.0.99", pre=True),
    release("v0.5.0.98", draft=True),
    release("v0.5.0.16"),
    release("v0.5.0.16-test"),
    release("v0.5.0.18"),
]


class ReleaseNotesTests(unittest.TestCase):
    def test_same_line_numeric_predecessor(self):
        self.assertEqual(rn.resolve_previous_formal_tag("v0.5.0.17", HISTORY), "v0.5.0.16")

    def test_historical_regeneration_ignores_global_latest(self):
        self.assertEqual(rn.resolve_previous_formal_tag("v0.5.0.16", HISTORY), "v0.5.0.15")

    def test_explicit_older_same_line_baseline_rejected(self):
        with self.assertRaisesRegex(RuntimeError, "Formal baseline must be"):
            rn.resolve_previous_formal_tag("v0.5.0.17", HISTORY, previous_version="v0.5.0.15")

    def test_first_formal_on_new_line_requires_explicit_baseline(self):
        self.assertEqual(
            rn.resolve_previous_formal_tag("v0.6.0.1", HISTORY, previous_version="v0.5.0.18"),
            "v0.5.0.18",
        )
        with self.assertRaisesRegex(RuntimeError, "specify -PreviousVersion"):
            rn.resolve_previous_formal_tag("v0.6.0.1", HISTORY)

    def test_invalid_version(self):
        with self.assertRaisesRegex(RuntimeError, "Invalid version"):
            rn.resolve_previous_formal_tag("bad", HISTORY)

    def test_release_history_pagination_without_network(self):
        seen = {}

        def fake_gh(args):
            joined = " ".join(args)
            self.assertRegex(
                joined,
                r"api --paginate --slurp repos/owner/repo/releases\?per_page=100",
            )
            payload = (
                '[[{"tag_name":"v0.5.0.16","draft":false,"prerelease":false,'
                '"published_at":"2026-11-01T00:00:00Z"}],'
                '[{"tag_name":"v0.5.0.15","draft":false,"prerelease":false,'
                '"published_at":"2026-10-01T00:00:00Z"}]]'
            )
            seen["called"] = True
            return 0, payload

        original = rn.gh_command
        rn.gh_command = fake_gh
        try:
            api_history = rn.get_release_history("owner/repo")
            self.assertEqual(len(api_history), 2)
            self.assertEqual(rn.resolve_previous_formal_tag("v0.5.0.17", api_history), "v0.5.0.16")
            self.assertTrue(seen.get("called"))
        finally:
            rn.gh_command = original

    def test_only_final_squash_suffix_is_current_pr(self):
        self.assertEqual(
            rn.get_commit_pull_request_number("[fix] 修复另一个问题 (#2446) (#5)"),
            5,
        )
        self.assertIsNone(rn.get_commit_pull_request_number("修复任务书错字"))

    def _sample_commits_and_body(self):
        commits = [
            commit("[fix] 修复配方冲突 (#2)"),
            commit("[fix] 修复另一个问题 (#2446) (#5)"),
            commit("修复任务书错字", ["config/ftbquests/quests/a.snbt"], "b" * 40),
        ]
        body = (
            "**问题修复**\n"
            "- 修复配方冲突（[#2](https://github.com/owner/repo/pull/2)、"
            "[#5](https://github.com/owner/repo/pull/5)）\n\n"
            "**任务书与文本**\n"
            f"- 修复任务书错字（[提交 bbbbbbb](https://github.com/owner/repo/commit/{'b' * 40})）"
        )
        return commits, body

    def test_new_release_notes_preserves_agent_wording(self):
        commits, body = self._sample_commits_and_body()
        notes = rn.new_release_notes(
            "v0.5.0.17",
            "v0.5.0.16",
            repository="owner/repo",
            commits=commits,
            curated_content=body,
        )
        self.assertIn("AI自动生成", notes)
        self.assertIn("compare/v0.5.0.16...v0.5.0.17", notes)
        self.assertIn("从 v0.5.0.16 更新", notes)
        self.assertIn(body, notes)

    def test_new_release_notes_requires_content_and_commits(self):
        commits, body = self._sample_commits_and_body()
        with self.assertRaisesRegex(RuntimeError, "required"):
            rn.new_release_notes(commits=commits, version="v0.5.0.17", previous_version="v0.5.0.16")
        with self.assertRaisesRegex(RuntimeError, "No commits"):
            rn.new_release_notes(
                version="v0.5.0.17",
                previous_version="v0.5.0.16",
                repository="owner/repo",
                curated_content=body,
            )

    def test_assert_curated_notes_rules(self):
        commits, body = self._sample_commits_and_body()
        with self.assertRaisesRegex(RuntimeError, "only repository"):
            rn.assert_curated_notes(
                body + " [#99](https://github.com/other/repo/pull/99)",
                "owner/repo",
                commits,
            )
        with self.assertRaisesRegex(RuntimeError, "required"):
            rn.assert_curated_notes("", "owner/repo")
        with self.assertRaisesRegex(RuntimeError, "required"):
            rn.assert_curated_notes("   ", "owner/repo")
        with self.assertRaisesRegex(RuntimeError, "Invalid or duplicate"):
            rn.assert_curated_notes("**其他**", "owner/repo")
        with self.assertRaisesRegex(RuntimeError, "internal jargon"):
            rn.assert_curated_notes("**问题修复**\n- 修复HotAI问题", "owner/repo")
        with self.assertRaisesRegex(RuntimeError, "Untranslated"):
            rn.assert_curated_notes(
                "**问题修复**\n- fix recipe ([提交](https://github.com/owner/repo/pull/2))",
                "owner/repo",
            )
        with self.assertRaisesRegex(RuntimeError, "needs a repository"):
            rn.assert_curated_notes("**问题修复**\n- 修复配方", "owner/repo")
        with self.assertRaisesRegex(RuntimeError, "outside the release range"):
            rn.assert_curated_notes(
                "**问题修复**\n- 修复配方（[#99](https://github.com/owner/repo/pull/99)）",
                "owner/repo",
                commits,
            )
        with self.assertRaisesRegex(RuntimeError, "non-empty"):
            rn.assert_curated_notes(body + "\n**模组与光影更新**", "owner/repo")
        with self.assertRaisesRegex(RuntimeError, "Invalid or duplicate"):
            rn.assert_curated_notes(body + "\n**增量更新**", "owner/repo")
        with self.assertRaisesRegex(RuntimeError, "Invalid or duplicate"):
            rn.assert_curated_notes(body + "\n**问题修复**", "owner/repo")
        with self.assertRaisesRegex(RuntimeError, "Malformed"):
            rn.assert_curated_notes("## 更新内容\n" + body, "owner/repo")

    def test_prerelease_has_no_incremental_artifacts(self):
        commits, body = self._sample_commits_and_body()
        test_notes = rn.new_release_notes(
            version="v0.5.0.17-test",
            previous_version="v0.5.0.16",
            release_type="测试",
            repository="owner/repo",
            curated_content=body,
            commits=commits,
        )
        self.assertRegex(test_notes, "测试版不提供 Patch")

    def test_git_fixture_range_and_input(self):
        with tempfile.TemporaryDirectory(prefix="release-notes-test-") as temp:
            temp_path = Path(temp)
            if PUBLISH.is_file():
                missing = subprocess.run(
                    [
                        sys.executable,
                        str(PUBLISH),
                        "-Version",
                        "v9.9.9.1",
                        "-TargetBranch",
                        "invalid",
                        "-NotesFile",
                        str(temp_path / "missing.md"),
                        "-WhatIf",
                    ],
                    capture_output=True,
                    text=True,
                    encoding="utf-8",
                )
                self.assertNotEqual(missing.returncode, 0)
                self.assertRegex(missing.stderr + missing.stdout, "Cannot find path")

                invalid = temp_path / "invalid.md"
                invalid.write_text("# raw titles are not release notes", encoding="utf-8")
                malformed = subprocess.run(
                    [
                        sys.executable,
                        str(PUBLISH),
                        "-Version",
                        "v9.9.9.1",
                        "-TargetBranch",
                        "invalid",
                        "-NotesFile",
                        str(invalid),
                        "-WhatIf",
                    ],
                    capture_output=True,
                    text=True,
                    encoding="utf-8",
                )
                self.assertNotEqual(malformed.returncode, 0)
                self.assertRegex(malformed.stderr + malformed.stdout, "Malformed notes")
                invalid.unlink()

            subprocess.run(["git", "-C", temp, "init", "-q"], check=True)
            subprocess.run(["git", "-C", temp, "config", "user.name", "Offline Test"], check=True)
            subprocess.run(
                ["git", "-C", temp, "config", "user.email", "test@example.invalid"],
                check=True,
            )
            (temp_path / "file.txt").write_text("before", encoding="utf-8")
            subprocess.run(["git", "-C", temp, "add", "."], check=True)
            subprocess.run(["git", "-C", temp, "commit", "-qm", "旧版内容 (#1)"], check=True)
            subprocess.run(["git", "-C", temp, "tag", "v0.5.0.16"], check=True)
            (temp_path / "file.txt").write_text("after", encoding="utf-8")
            subprocess.run(
                ["git", "-C", temp, "commit", "-qam", "修复新版问题 (#2)\n\n完整提交说明"],
                check=True,
            )
            subprocess.run(["git", "-C", temp, "tag", "v0.5.0.17"], check=True)

            rn.assert_release_range("v0.5.0.17", "v0.5.0.16", temp)
            range_commits = rn.get_release_commits("v0.5.0.16", "v0.5.0.17", temp)
            self.assertEqual(len(range_commits), 1)
            self.assertEqual(range_commits[0]["Subject"], "修复新版问题 (#2)")
            self.assertIn("file.txt", range_commits[0]["Paths"])
            self.assertRegex(range_commits[0]["Message"], "完整提交说明")

            with self.assertRaisesRegex(RuntimeError, "not an ancestor"):
                rn.assert_release_range("v0.5.0.16", "v0.5.0.17", temp)
            with self.assertRaisesRegex(RuntimeError, "Target ref not found"):
                rn.assert_release_range("v0.5.0.18", "v0.5.0.16", temp)

            def fake_gh(args):
                if args[0] == "pr":
                    self.assertRegex(" ".join(args), r"pr view 2 --repo owner/repo")
                    return (
                        0,
                        json.dumps(
                            {
                                "number": 2,
                                "title": "修复新版问题",
                                "body": "完整 PR 说明",
                                "labels": [{"name": "fix"}],
                                "url": "https://github.com/owner/repo/pull/2",
                                "state": "MERGED",
                            }
                        ),
                    )
                if args[0] == "api":
                    self.assertRegex(" ".join(args), "--paginate --slurp")
                    return (
                        0,
                        json.dumps(
                            [
                                [
                                    {
                                        "filename": "a.txt",
                                        "status": "modified",
                                        "additions": 2,
                                        "deletions": 1,
                                    }
                                ],
                                [
                                    {
                                        "filename": "b.txt",
                                        "status": "added",
                                        "additions": 1,
                                        "deletions": 0,
                                    }
                                ],
                            ]
                        ),
                    )
                raise AssertionError("Unexpected external query")

            original = rn.gh_command
            rn.gh_command = fake_gh
            try:
                input_data = rn.get_release_notes_input(
                    "v0.5.0.18",
                    "v0.5.0.16",
                    "HEAD",
                    temp,
                    "owner/repo",
                )
                self.assertEqual(len(input_data["pullRequests"]), 1)
                self.assertEqual(input_data["pullRequests"][0]["body"], "完整 PR 说明")
                self.assertEqual(input_data["pullRequests"][0]["labels"][0]["name"], "fix")
                self.assertEqual(len(input_data["pullRequests"][0]["changedFiles"]), 2)
                self.assertEqual(input_data["targetCommit"], range_commits[0]["Sha"])

                rn.gh_command = lambda args: (1, "")
                with self.assertRaisesRegex(RuntimeError, "refusing incomplete"):
                    rn.get_release_notes_input(
                        "v0.5.0.17",
                        "v0.5.0.16",
                        "HEAD",
                        temp,
                        "owner/repo",
                    )
            finally:
                rn.gh_command = original

    def test_publish_script_still_validates_before_tags(self):
        publish = PUBLISH.read_text(encoding="utf-8")
        self.assertLess(
            publish.index("assert_curated_notes(ctx.curated_content, GITHUB_REPO)"),
            publish.index('["git", "tag", ctx.version]'),
        )
        self.assertLess(
            publish.index("new_release_notes("),
            publish.index('["git", "push", "origin", ctx.version]'),
        )
        self.assertIsNone(re_search_none(publish, r"ConvertTo-PlayerNote|\$grouped =|\$categories ="))
        self.assertNotRegex(publish, r"ConvertTo-PlayerNote")


def re_search_none(text: str, pattern: str):
    import re

    match = re.search(pattern, text)
    return match


if __name__ == "__main__":
    unittest.main(verbosity=2)
