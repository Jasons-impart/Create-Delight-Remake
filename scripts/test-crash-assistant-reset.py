"""Exercise runtime invalidation in disposable Git repositories (no downloads)."""
import json
import pathlib
import shutil
import subprocess
import tempfile
import unittest


class ResetTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = pathlib.Path(self.temp.name)
        scripts = self.root / "scripts"
        scripts.mkdir()
        for name in ("reset-crash-assistant-modlist.ps1", "sync-packwiz-assets.ps1"):
            shutil.copyfile(pathlib.Path(__file__).parent / name, scripts / name)
        self.baseline = self.root / "config/modpack_defaults/config/crash_assistant/modlist.json"
        self.runtime = self.root / "config/crash_assistant/modlist.json"
        for path in (self.baseline, self.runtime):
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_text('{}', encoding="utf-8")
        self.settings = self.runtime.with_name("config.toml")
        self.settings.write_text("user preferences", encoding="utf-8")

    def run_script(self, name, *args, check=True):
        return subprocess.run(["pwsh", "-NoProfile", "-File", str(self.root / "scripts" / name), *args],
                              cwd=self.root, capture_output=True, text=True, encoding="utf-8", check=check)

    def git(self, *args):
        return subprocess.check_output(["git", *args], cwd=self.root, text=True).strip()

    def baseline_change(self):
        self.git("init", "-q")
        self.git("add", str(self.baseline.relative_to(self.root)))
        self.git("-c", "user.name=Test", "-c", "user.email=test@example.invalid", "commit", "-qm", "before")
        old = self.git("rev-parse", "HEAD")
        self.baseline.write_text(json.dumps({"new.jar": {"modId": "new"}}), encoding="utf-8")
        self.git("add", str(self.baseline.relative_to(self.root)))
        self.git("-c", "user.name=Test", "-c", "user.email=test@example.invalid", "commit", "-qm", "after")
        return old

    def test_reset_preserves_defaults_and_preferences_and_is_repeatable(self):
        for _ in range(2):
            self.run_script("reset-crash-assistant-modlist.ps1")
        self.assertFalse(self.runtime.exists())
        self.assertEqual(self.baseline.read_text(), '{}')
        self.assertEqual(self.settings.read_text(), "user preferences")

    def test_missing_or_invalid_default_preserves_runtime(self):
        self.baseline.unlink()
        self.run_script("reset-crash-assistant-modlist.ps1")
        self.assertTrue(self.runtime.exists())
        self.baseline.write_text("invalid json")
        result = self.run_script("reset-crash-assistant-modlist.ps1", check=False)
        self.assertNotEqual(result.returncode, 0)
        self.assertTrue(self.runtime.exists())

    def test_baseline_only_git_change(self):
        old = self.baseline_change()
        self.run_script("sync-packwiz-assets.ps1", "-IfGitChanged", "-OldRev", old)
        self.assertFalse(self.runtime.exists())

    def test_dry_run_and_server_preserve_runtime(self):
        old = self.baseline_change()
        for args in (("-DryRun",), ("-Side", "server")):
            self.run_script("sync-packwiz-assets.ps1", "-IfGitChanged", "-OldRev", old, *args)
            self.assertTrue(self.runtime.exists())

    def test_unchanged_git_revision_preserves_runtime(self):
        self.baseline_change()
        self.run_script("sync-packwiz-assets.ps1", "-IfGitChanged", "-OldRev", "HEAD")
        self.assertTrue(self.runtime.exists())

    def test_asset_dry_run_preserves_runtime(self):
        old = self.baseline_change()
        mods = self.root / "mods"
        mods.mkdir()
        (mods / "example.pw.toml").write_text('name = "Example"\nfilename = "example.jar"\n')
        self.git("add", "mods")
        self.git("-c", "user.name=Test", "-c", "user.email=test@example.invalid", "commit", "-qm", "asset")
        result = self.run_script("sync-packwiz-assets.ps1", "-IfGitChanged", "-OldRev", old, "-DryRun")
        self.assertIn("Would reset Crash Assistant", result.stdout)
        self.assertTrue(self.runtime.exists())

    def test_failed_sync_preserves_runtime(self):
        # Reject invalid network configuration before any download or cache reset.
        result = self.run_script("sync-packwiz-assets.ps1", "-Proxy", "not-a-proxy", check=False)
        self.assertNotEqual(result.returncode, 0)
        self.assertTrue(self.runtime.exists())


if __name__ == "__main__":
    unittest.main()
