#!/usr/bin/env python3
"""Regression tests for test-release versus formal-release Packwiz filtering."""

import importlib.util
import shutil
import subprocess
import sys
import tempfile
import unittest
import zipfile
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
        self.write_metadata("tacz", "test-gun", "test-gun.zip", "both", stable=False)

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

    def write_manual_jar(self, filename, mod_id, version):
        jar = self.root / "packwiz-files" / "mods" / filename
        jar.parent.mkdir(parents=True, exist_ok=True)
        mods_toml = f'[[mods]]\nmodId = "{mod_id}"\nversion = "{version}"\n'
        with zipfile.ZipFile(jar, "w") as archive:
            archive.writestr("META-INF/mods.toml", mods_toml)

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
        shutil.copytree(self.root / "tacz", target / "tacz")

        self.prune(target)

        self.assertTrue((target / "mods/client-test.pw.toml").is_file())
        self.assertTrue((target / "mods/common-stable.pw.toml").is_file())
        self.assertFalse((target / "mods/server-test.pw.toml").exists())
        self.assertTrue((target / "resourcepacks/test-pack.pw.toml").is_file())
        self.assertTrue((target / "shaderpacks/test-shader.pw.toml").is_file())
        self.assertTrue((target / "tacz/test-gun.pw.toml").is_file())

    def test_formal_release_prunes_stable_disabled_assets(self):
        target = self.root / "formal-release"
        shutil.copytree(self.root / "mods", target / "mods")
        shutil.copytree(self.root / "resourcepacks", target / "resourcepacks")
        shutil.copytree(self.root / "shaderpacks", target / "shaderpacks")
        shutil.copytree(self.root / "tacz", target / "tacz")

        self.prune(target, stable=True)

        self.assertFalse((target / "mods/client-test.pw.toml").exists())
        self.assertTrue((target / "mods/common-stable.pw.toml").is_file())
        self.assertFalse((target / "mods/server-test.pw.toml").exists())
        self.assertFalse((target / "resourcepacks/test-pack.pw.toml").exists())
        self.assertFalse((target / "shaderpacks/test-shader.pw.toml").exists())
        self.assertFalse((target / "tacz/test-gun.pw.toml").exists())

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

    def test_patch_selection_follow_stable_mode(self):
        for asset_dir in ("mods", "resourcepacks", "shaderpacks", "tacz"):
            test_names = {entry[1] for entry in PATCH.metadata_entries(self.root, asset_dir)}
            formal_names = {entry[1] for entry in PATCH.metadata_entries(self.root, asset_dir, stable=True)}
            self.assertGreater(len(test_names), len(formal_names))
            self.assertNotIn(
                {
                    "mods": "client-test.jar",
                    "resourcepacks": "test-pack.zip",
                    "shaderpacks": "test-shader.zip",
                    "tacz": "test-gun.zip",
                }[asset_dir],
                formal_names,
            )

    def test_crash_assistant_modlist_extracts_tail_version(self):
        self.assertEqual(
            {"modId": "example-forge", "name": "Example", "version": "1.20.1-2.3.4"},
            CRASH_ASSISTANT_MODLIST.mod_record("Example-forge-1.20.1-2.3.4.jar", "Example"),
        )

    def test_crash_assistant_modlist_prefers_forge_jar_metadata(self):
        filename = "taczaddon-1.20.1-1.1.8-hotfix2-for-new-soph.jar"
        self.write_metadata("mods", "taczaddon", filename, "both")
        self.write_manual_jar(filename, "taczaddon", "1.1.8")

        modlist = CRASH_ASSISTANT_MODLIST.client_mod_baseline(self.root)

        self.assertEqual(
            {"modId": "taczaddon", "name": "taczaddon", "version": "1.1.8"},
            modlist[filename],
        )

    def test_crash_assistant_modlist_falls_back_for_unresolved_jar_metadata(self):
        filename = "beefix-1.20-1.0.7.jar"
        self.write_metadata("mods", "beefix", filename, "both")
        self.write_manual_jar(filename, "beefix", "${file.jarVersion}")

        modlist = CRASH_ASSISTANT_MODLIST.client_mod_baseline(self.root)

        self.assertEqual(
            {"modId": "beefix", "name": "beefix", "version": "1.20-1.0.7"},
            modlist[filename],
        )

    def test_formal_server_patch_removes_stable_disabled_metadata_and_payloads(self):
        patch = self.root / "patch"
        for asset_dir, metadata_name, filename in (
            ("mods", "client-test.pw.toml", "client-test.jar"),
            ("resourcepacks", "test-pack.pw.toml", "test-pack.zip"),
            ("shaderpacks", "test-shader.pw.toml", "test-shader.zip"),
            ("tacz", "test-gun.pw.toml", "test-gun.zip"),
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
            ("tacz", "test-gun.pw.toml", "test-gun.zip"),
        ):
            self.assertFalse((patch / asset_dir / filename).exists())
            self.assertFalse((patch / "packwiz-files" / asset_dir / filename).exists())
            self.assertFalse(any((patch / asset_dir).glob("*.pw.toml")))

    def test_server_patch_moves_tacz_payload_into_runtime_root(self):
        patch = self.root / "tacz-patch"
        payload = patch / "packwiz-files" / "tacz" / "test-gun.zip"
        payload.parent.mkdir(parents=True, exist_ok=True)
        payload.write_bytes(b"test")

        subprocess.run(
            [
                sys.executable,
                str(REPO_ROOT / "scripts/build-release-patch.py"),
                "server",
                "--patch",
                str(patch),
            ],
            cwd=self.root,
            check=True,
        )

        self.assertEqual(b"test", (patch / "tacz/test-gun.zip").read_bytes())
        self.assertFalse((patch / "packwiz-files").exists())


if __name__ == "__main__":
    unittest.main()
