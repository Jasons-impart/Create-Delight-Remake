"""Unit tests for install-git-hooks.py helpers and installer behavior."""
from __future__ import annotations

import importlib.util
import os
import stat
import subprocess
import tempfile
import unittest
from pathlib import Path


def load_module():
    path = Path(__file__).resolve().parent / "install-git-hooks.py"
    spec = importlib.util.spec_from_file_location("install_git_hooks", path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


INSTALL = load_module()
REPO_HOOKS = Path(__file__).resolve().parent / ".githooks"


class ShimTests(unittest.TestCase):
    def test_shim_is_lf_and_contains_marker(self):
        shim = INSTALL.build_hook_shim("post-checkout")
        self.assertTrue(shim.startswith("#!/bin/sh\n"))
        self.assertNotIn("\r", shim)
        self.assertIn(INSTALL.MARKER, shim)
        self.assertIn("scripts/.githooks/post-checkout", shim)
        self.assertTrue(shim.endswith("fi"))

    def test_parse_args_aliases(self):
        args = INSTALL.parse_args(["-IfUnset", "-Quiet"])
        self.assertTrue(args.if_unset)
        self.assertTrue(args.quiet)
        args = INSTALL.parse_args(["--if-unset", "--quiet"])
        self.assertTrue(args.if_unset)
        self.assertTrue(args.quiet)


class InstallerTests(unittest.TestCase):
    def git(self, *args, cwd):
        return subprocess.check_output(["git", *args], cwd=cwd, text=True).strip()

    def make_repo(self):
        temp = tempfile.TemporaryDirectory()
        self.addCleanup(temp.cleanup)
        root = Path(temp.name)
        subprocess.check_call(["git", "init", "-q"], cwd=root)
        subprocess.check_call(["git", "config", "user.name", "Test"], cwd=root)
        subprocess.check_call(["git", "config", "user.email", "test@example.invalid"], cwd=root)
        hooks = root / "scripts" / ".githooks"
        hooks.mkdir(parents=True)
        for name in INSTALL.HOOK_NAMES:
            source = REPO_HOOKS / name
            if source.exists():
                (hooks / name).write_bytes(source.read_bytes())
            else:
                (hooks / name).write_text("#!/bin/sh\n", encoding="utf-8")
        (root / "README").write_text("ok\n", encoding="utf-8")
        subprocess.check_call(["git", "add", "README", "scripts"], cwd=root)
        subprocess.check_call(["git", "commit", "-qm", "init"], cwd=root)
        return root

    def test_install_writes_executable_shims_and_preserves_unmanaged(self):
        root = self.make_repo()
        git_hooks = root / ".git" / "hooks"
        git_hooks.mkdir(parents=True, exist_ok=True)
        unmanaged = git_hooks / "pre-commit"
        unmanaged.write_text("#!/bin/sh\necho unmanaged\n", encoding="utf-8")

        result = subprocess.run(
            ["python3", str(Path(__file__).resolve().parent / "install-git-hooks.py")],
            cwd=root,
            capture_output=True,
            text=True,
            encoding="utf-8",
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("Git hooks installed in .git/hooks", result.stdout)
        self.assertIn("Preserved existing pre-commit as pre-commit.local", result.stdout)
        self.assertEqual((git_hooks / "pre-commit.local").read_text(encoding="utf-8"), "#!/bin/sh\necho unmanaged\n")

        for name in INSTALL.HOOK_NAMES:
            target = git_hooks / name
            content = target.read_bytes()
            self.assertNotIn(b"\r", content)
            self.assertIn(INSTALL.MARKER.encode("utf-8"), content)
            self.assertTrue(target.stat().st_mode & stat.S_IXUSR)

        second = subprocess.run(
            ["python3", str(Path(__file__).resolve().parent / "install-git-hooks.py"), "-IfUnset", "-Quiet"],
            cwd=root,
            capture_output=True,
            text=True,
            encoding="utf-8",
        )
        self.assertEqual(second.returncode, 0, second.stderr)
        self.assertEqual(second.stdout, "")

    def test_custom_hooks_path_is_left_alone(self):
        root = self.make_repo()
        subprocess.check_call(["git", "config", "--local", "core.hooksPath", "custom-hooks"], cwd=root)
        result = subprocess.run(
            ["python3", str(Path(__file__).resolve().parent / "install-git-hooks.py")],
            cwd=root,
            capture_output=True,
            text=True,
            encoding="utf-8",
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("core.hooksPath=custom-hooks", result.stdout)
        self.assertFalse((root / ".git" / "hooks" / "post-checkout").exists())


if __name__ == "__main__":
    unittest.main()
