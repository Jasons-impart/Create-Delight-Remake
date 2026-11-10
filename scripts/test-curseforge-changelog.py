#!/usr/bin/env python3
"""Offline regression tests for the release workflow's CurseForge changelog."""

import os
from pathlib import Path
import subprocess
import tempfile
import textwrap
import unittest

ROOT = Path(__file__).resolve().parents[1]
WORKFLOW = (ROOT / ".github/workflows/release.yml").read_text(encoding="utf-8")
STEP = WORKFLOW.split("        id: curseforge_changelog\n", 1)[1]
SCRIPT = textwrap.dedent(STEP.split("        run: |\n", 1)[1].split("      - name:", 1)[0])


class CurseForgeChangelogTests(unittest.TestCase):
    def run_step(self, body, gh_status=0):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "body").write_text(body, encoding="utf-8")
            mock = root / "gh"
            mock.write_text(
                '#!/bin/sh\n'
                '[ "$*" = "release view v0.5.0.18 --repo owner/repo --json body --jq .body" ] || exit 99\n'
                '[ "$GH_STATUS" = 0 ] || exit "$GH_STATUS"\n'
                'cat "$FIXTURE_BODY"\n',
                encoding="utf-8",
            )
            mock.chmod(0o755)
            output = root / "output"
            env = dict(os.environ, PATH=f"{root}:{os.environ['PATH']}",
                       FIXTURE_BODY=str(root / "body"), GH_STATUS=str(gh_status),
                       GITHUB_OUTPUT=str(output), GITHUB_REF_NAME="v0.5.0.18",
                       GITHUB_REPOSITORY="owner/repo", GITHUB_SERVER_URL="https://github.com")
            result = subprocess.run(["bash", "-c", SCRIPT], env=env, capture_output=True, text=True)
            return result, output.read_text(encoding="utf-8") if output.exists() else ""

    def assert_changelog(self, body):
        result, output = self.run_step(body)
        self.assertEqual(result.returncode, 0, result.stderr)
        header, payload = output.split("\n", 1)
        delimiter = header.removeprefix("changelog<<")
        expected = body.rstrip("\n") + "\n\nGitHub Release: https://github.com/owner/repo/releases/tag/v0.5.0.18\n"
        self.assertEqual(payload, expected + delimiter + "\n")

    def test_markdown_chinese_and_blank_lines(self):
        self.assert_changelog("## 更新内容\n\n**Bug修复**\n- 修复品质继承 (#2540)\n")

    def test_body_is_data_not_shell_or_output_commands(self):
        self.assert_changelog("```sh\n$(exit 77) `exit 88` $HOME\n```\nEOF\nchangelog=bad\n::warning::text")

    def test_long_body_is_not_truncated_and_url_is_last(self):
        self.assert_changelog("- 更新内容\n" * 10000)

    def test_empty_or_whitespace_body_fails_closed(self):
        for body in ("", "\n \t\n"):
            with self.subTest(body=body):
                result, output = self.run_step(body)
                self.assertNotEqual(result.returncode, 0)
                self.assertIn("body is empty", result.stderr)
                self.assertEqual(output, "")

    def test_gh_failure_does_not_upload_link_only(self):
        result, output = self.run_step("ignored", gh_status=1)
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(output, "")

    def test_upload_keeps_format_display_name_and_skip_conditions(self):
        self.assertIn("changelog: ${{ steps.curseforge_changelog.outputs.changelog }}", WORKFLOW)
        self.assertIn("changelog-format: markdown", WORKFLOW)
        self.assertIn("display-name: ${{ env.MODPACK_NAME }}-${{ env.MODPACK_VERSION }}", WORKFLOW)
        self.assertIn("if: env.IS_STABLE_RELEASE == 'true' && env.CURSEFORGE_TOKEN != ''", STEP)

    def test_notes_are_prepared_before_tag_push_and_ci_wait(self):
        publish = (ROOT / ".agents/skills/release/release-publish.py").read_text(encoding="utf-8")
        notes = publish.index("notes = prepare_player_notes(ctx)")
        draft = publish.index("create_or_update_draft(ctx, notes, title)")
        push = publish.index('["git", "push", "origin", ctx.version]')
        wait = publish.index("wait_for_ci(ctx)")
        self.assertLess(notes, draft)
        self.assertLess(draft, push)
        self.assertLess(push, wait)
        self.assertEqual(publish.count("new_release_notes("), 1)
        self.assertIn("--notes-file", publish)
        self.assertIn("--target", publish)
        self.assertIn("--draft", publish)


if __name__ == "__main__":
    unittest.main()
