#!/usr/bin/env python3
"""Regression tests for test-release versus formal-release Packwiz filtering."""

import importlib.util
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[1]


def load_module(name, relative_path):
    spec = importlib.util.spec_from_file_location(name, REPO_ROOT / relative_path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


CRASH_ASSISTANT_MODLIST = load_module("crash_assistant_modlist", "scripts/generate-crash-assistant-modlist.py")
PATCH = load_module("release_patch", "scripts/build-release-patch.py")


class PackwizStableFilterTests(unittest.TestCase):
    def setUp(self):
        self.tempdir = tempfile.TemporaryDirectory()
        self.root = Path(self.tempdir.name)
        self.write_metadata("mods", "client-test", "client-test.jar", "client", stable=False)
        self.write_metadata("mods", "server-test", "server-test.jar", "server", stable=False)
        self.write_metadata("mods", "common-stable", "common-stable.jar", "both")
        self.write_metadata("resourcepacks", "test-pack", "test-pack.zip", "both", stable=False)
        self.write_metadata("shaderpacks", "test-shader", "test-shader.zip", "both", stable=False)

    def tearDown(self):
        self.tempdir.cleanup()

    def write_metadata(self, category, name, filename, side, stable=True):
        metadata = self.root / category / f"{name}.pw.toml"
        metadata.parent.mkdir(parents=True, exist_ok=True)
        stable_line = "stable = false\n" if not stable else ""
        metadata.write_text(
            f'name = "{name}"\nfilename = "{filename}"\nside = "{side}"\n{stable_line}',
            encoding="utf-8",
        )

    def prune(self, target, stable=False):
        command = [
            sys.executable,
            str(REPO_ROOT / "scripts/packwiz-side.py"),
            "prune-metadata",
            "--base",
            str(target),
            "--target",
            "client",
        ]
        if stable:
            command.append("--stable")
        subprocess.run(command, check=True)

    def test_test_release_keeps_stable_disabled_assets_but_applies_side_filter(self):
        target = self.root / "test-release"
        shutil.copytree(self.root / "mods", target / "mods")
        shutil.copytree(self.root / "resourcepacks", target / "resourcepacks")
        shutil.copytree(self.root / "shaderpacks", target / "shaderpacks")

        self.prune(target)

        self.assertTrue((target / "mods/client-test.pw.toml").is_file())
        self.assertTrue((target / "mods/common-stable.pw.toml").is_file())
        self.assertFalse((target / "mods/server-test.pw.toml").exists())
        self.assertTrue((target / "resourcepacks/test-pack.pw.toml").is_file())
        self.assertTrue((target / "shaderpacks/test-shader.pw.toml").is_file())

    def test_formal_release_prunes_stable_disabled_assets(self):
        target = self.root / "formal-release"
        shutil.copytree(self.root / "mods", target / "mods")
        shutil.copytree(self.root / "resourcepacks", target / "resourcepacks")
        shutil.copytree(self.root / "shaderpacks", target / "shaderpacks")

        self.prune(target, stable=True)

        self.assertFalse((target / "mods/client-test.pw.toml").exists())
        self.assertTrue((target / "mods/common-stable.pw.toml").is_file())
        self.assertFalse((target / "mods/server-test.pw.toml").exists())
        self.assertFalse((target / "resourcepacks/test-pack.pw.toml").exists())
        self.assertFalse((target / "shaderpacks/test-shader.pw.toml").exists())

    def test_crash_assistant_modlist_and_patch_selection_follow_stable_mode(self):
        test_modlist = CRASH_ASSISTANT_MODLIST.client_mod_baseline(self.root)
        formal_modlist = CRASH_ASSISTANT_MODLIST.client_mod_baseline(self.root, stable=True)

        self.assertIn("client-test.jar", test_modlist)
        self.assertNotIn("client-test.jar", formal_modlist)
        self.assertIn("common-stable.jar", formal_modlist)
        self.assertNotIn("server-test.jar", test_modlist)
        self.assertEqual(
            {"modId": "client-test", "name": "client-test", "version": "unknown"},
            test_modlist["client-test.jar"],
        )

    def test_crash_assistant_modlist_extracts_tail_version(self):
        self.assertEqual(
            {"modId": "example-forge", "name": "Example", "version": "1.20.1-2.3.4"},
            CRASH_ASSISTANT_MODLIST.mod_record("Example-forge-1.20.1-2.3.4.jar", "Example"),
        )

        for asset_dir in ("mods", "resourcepacks", "shaderpacks"):
            test_names = {entry[1] for entry in PATCH.metadata_entries(self.root, asset_dir)}
            formal_names = {entry[1] for entry in PATCH.metadata_entries(self.root, asset_dir, stable=True)}
            self.assertGreater(len(test_names), len(formal_names))
            self.assertNotIn(
                {"mods": "client-test.jar", "resourcepacks": "test-pack.zip", "shaderpacks": "test-shader.zip"}[asset_dir],
                formal_names,
            )

    def test_formal_server_patch_removes_stable_disabled_metadata_and_payloads(self):
        patch = self.root / "patch"
        for asset_dir, metadata_name, filename in (
            ("mods", "client-test.pw.toml", "client-test.jar"),
            ("resourcepacks", "test-pack.pw.toml", "test-pack.zip"),
            ("shaderpacks", "test-shader.pw.toml", "test-shader.zip"),
        ):
            source_metadata = self.root / asset_dir / metadata_name
            target_metadata = patch / asset_dir / metadata_name
            target_metadata.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source_metadata, target_metadata)
            (patch / asset_dir / filename).write_bytes(b"test")
            manual_payload = patch / "packwiz-files" / asset_dir / filename
            manual_payload.parent.mkdir(parents=True, exist_ok=True)
            manual_payload.write_bytes(b"test")

        subprocess.run(
            [
                sys.executable,
                str(REPO_ROOT / "scripts/build-release-patch.py"),
                "server",
                "--patch",
                str(patch),
                "--stable",
            ],
            cwd=self.root,
            check=True,
        )

        for asset_dir, _, filename in (
            ("mods", "client-test.pw.toml", "client-test.jar"),
            ("resourcepacks", "test-pack.pw.toml", "test-pack.zip"),
            ("shaderpacks", "test-shader.pw.toml", "test-shader.zip"),
        ):
            self.assertFalse((patch / asset_dir / filename).exists())
            self.assertFalse((patch / "packwiz-files" / asset_dir / filename).exists())
            self.assertFalse(any((patch / asset_dir).glob("*.pw.toml")))


if __name__ == "__main__":
    unittest.main()
