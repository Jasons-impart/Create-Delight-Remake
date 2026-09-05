#!/usr/bin/env python3
"""Regression tests for Packwiz development, testing, and release filtering."""

import importlib.util
import shutil
import subprocess
import sys
import tempfile
import tomllib
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


class PackwizDistributionFilterTests(unittest.TestCase):
    def setUp(self):
        self.tempdir = tempfile.TemporaryDirectory()
        self.root = Path(self.tempdir.name)
        self.write_metadata("mods", "development-client", "development-client.jar", "client", "development")
        self.write_metadata("mods", "testing-client", "testing-client.jar", "client", "testing")
        self.write_metadata("mods", "testing-server", "testing-server.jar", "server", "testing")
        self.write_metadata("mods", "common-release", "common-release.jar", "both")
        self.write_metadata("resourcepacks", "testing-pack", "testing-pack.zip", "both", "testing")
        self.write_metadata("shaderpacks", "testing-shader", "testing-shader.zip", "both", "testing")
        self.write_metadata("tacz", "testing-gun", "testing-gun.zip", "both", "testing")

    def tearDown(self):
        self.tempdir.cleanup()

    def write_metadata(self, category, name, filename, side, distribution="release"):
        metadata = self.root / category / f"{name}.pw.toml"
        metadata.parent.mkdir(parents=True, exist_ok=True)
        distribution_line = "" if distribution == "release" else f'distribution = "{distribution}"\n'
        metadata.write_text(
            f'name = "{name}"\nfilename = "{filename}"\nside = "{side}"\n{distribution_line}',
            encoding="utf-8",
        )

    def write_manual_jar(self, filename, mod_id, version):
        jar = self.root / "packwiz-files" / "mods" / filename
        jar.parent.mkdir(parents=True, exist_ok=True)
        mods_toml = f'[[mods]]\nmodId = "{mod_id}"\nversion = "{version}"\n'
        with zipfile.ZipFile(jar, "w") as archive:
            archive.writestr("META-INF/mods.toml", mods_toml)

    def prune(self, target, distribution="development"):
        command = [
            sys.executable,
            str(REPO_ROOT / "scripts/packwiz-side.py"),
            "prune-metadata",
            "--base",
            str(target),
            "--target",
            "client",
        ]
        command.extend(["--distribution", distribution])
        subprocess.run(command, check=True)

    def test_development_keeps_all_distribution_levels_but_applies_side_filter(self):
        target = self.root / "development"
        shutil.copytree(self.root / "mods", target / "mods")
        shutil.copytree(self.root / "resourcepacks", target / "resourcepacks")
        shutil.copytree(self.root / "shaderpacks", target / "shaderpacks")
        shutil.copytree(self.root / "tacz", target / "tacz")

        self.prune(target)

        self.assertTrue((target / "mods/development-client.pw.toml").is_file())
        self.assertTrue((target / "mods/testing-client.pw.toml").is_file())
        self.assertTrue((target / "mods/common-release.pw.toml").is_file())
        self.assertFalse((target / "mods/testing-server.pw.toml").exists())
        self.assertTrue((target / "resourcepacks/testing-pack.pw.toml").is_file())
        self.assertTrue((target / "shaderpacks/testing-shader.pw.toml").is_file())
        self.assertTrue((target / "tacz/testing-gun.pw.toml").is_file())

    def test_testing_prunes_development_assets_but_keeps_testing_assets(self):
        target = self.root / "testing"
        shutil.copytree(self.root / "mods", target / "mods")
        shutil.copytree(self.root / "resourcepacks", target / "resourcepacks")
        shutil.copytree(self.root / "shaderpacks", target / "shaderpacks")
        shutil.copytree(self.root / "tacz", target / "tacz")

        self.prune(target, distribution="testing")

        self.assertFalse((target / "mods/development-client.pw.toml").exists())
        self.assertTrue((target / "mods/testing-client.pw.toml").is_file())
        self.assertTrue((target / "mods/common-release.pw.toml").is_file())
        self.assertFalse((target / "mods/testing-server.pw.toml").exists())
        self.assertTrue((target / "resourcepacks/testing-pack.pw.toml").is_file())
        self.assertTrue((target / "shaderpacks/testing-shader.pw.toml").is_file())
        self.assertTrue((target / "tacz/testing-gun.pw.toml").is_file())

    def test_release_prunes_development_and_testing_assets(self):
        target = self.root / "release"
        shutil.copytree(self.root / "mods", target / "mods")
        shutil.copytree(self.root / "resourcepacks", target / "resourcepacks")
        shutil.copytree(self.root / "shaderpacks", target / "shaderpacks")
        shutil.copytree(self.root / "tacz", target / "tacz")

        self.prune(target, distribution="release")

        self.assertFalse((target / "mods/development-client.pw.toml").exists())
        self.assertFalse((target / "mods/testing-client.pw.toml").exists())
        self.assertTrue((target / "mods/common-release.pw.toml").is_file())
        self.assertFalse((target / "mods/testing-server.pw.toml").exists())
        self.assertFalse((target / "resourcepacks/testing-pack.pw.toml").exists())
        self.assertFalse((target / "shaderpacks/testing-shader.pw.toml").exists())
        self.assertFalse((target / "tacz/testing-gun.pw.toml").exists())

    def test_crash_assistant_modlist_follows_distribution(self):
        development_modlist = CRASH_ASSISTANT_MODLIST.client_mod_baseline(self.root)
        testing_modlist = CRASH_ASSISTANT_MODLIST.client_mod_baseline(self.root, distribution="testing")
        release_modlist = CRASH_ASSISTANT_MODLIST.client_mod_baseline(self.root, distribution="release")

        self.assertIn("development-client.jar", development_modlist)
        self.assertNotIn("development-client.jar", testing_modlist)
        self.assertIn("testing-client.jar", testing_modlist)
        self.assertNotIn("testing-client.jar", release_modlist)
        self.assertIn("common-release.jar", release_modlist)
        self.assertNotIn("testing-server.jar", development_modlist)
        self.assertEqual(
            {"modId": "development-client", "name": "development-client", "version": "unknown"},
            development_modlist["development-client.jar"],
        )

    def test_patch_selection_follows_distribution(self):
        for asset_dir in ("mods", "resourcepacks", "shaderpacks", "tacz"):
            development_names = {entry[1] for entry in PATCH.metadata_entries(self.root, asset_dir)}
            testing_names = {entry[1] for entry in PATCH.metadata_entries(self.root, asset_dir, distribution="testing")}
            release_names = {entry[1] for entry in PATCH.metadata_entries(self.root, asset_dir, distribution="release")}
            if asset_dir == "mods":
                self.assertGreater(len(development_names), len(testing_names))
            else:
                self.assertEqual(development_names, testing_names)
            self.assertGreater(len(testing_names), len(release_names))
            self.assertNotIn(
                {
                    "mods": "testing-client.jar",
                    "resourcepacks": "testing-pack.zip",
                    "shaderpacks": "testing-shader.zip",
                    "tacz": "testing-gun.zip",
                }[asset_dir],
                release_names,
            )

    def test_project_metadata_uses_the_intended_distribution_levels(self):
        expected = {
            "damage-trace.pw.toml": "development",
            "moddev-mcp.pw.toml": "development",
            "probejs.pw.toml": "development",
            "neruina.pw.toml": "testing",
            "observable.pw.toml": "testing",
        }
        for filename, distribution in expected.items():
            metadata = tomllib.loads((REPO_ROOT / "mods" / filename).read_text(encoding="utf-8"))
            self.assertEqual(distribution, metadata.get("distribution"))
            self.assertNotIn("stable", metadata)
            self.assertNotIn("release", metadata)

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

    def test_release_server_patch_removes_testing_metadata_and_payloads(self):
        patch = self.root / "patch"
        for asset_dir, metadata_name, filename in (
            ("mods", "testing-client.pw.toml", "testing-client.jar"),
            ("resourcepacks", "testing-pack.pw.toml", "testing-pack.zip"),
            ("shaderpacks", "testing-shader.pw.toml", "testing-shader.zip"),
            ("tacz", "testing-gun.pw.toml", "testing-gun.zip"),
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
                "--distribution",
                "release",
            ],
            cwd=self.root,
            check=True,
        )

        for asset_dir, _, filename in (
            ("mods", "testing-client.pw.toml", "testing-client.jar"),
            ("resourcepacks", "testing-pack.pw.toml", "testing-pack.zip"),
            ("shaderpacks", "testing-shader.pw.toml", "testing-shader.zip"),
            ("tacz", "testing-gun.pw.toml", "testing-gun.zip"),
        ):
            self.assertFalse((patch / asset_dir / filename).exists())
            self.assertFalse((patch / "packwiz-files" / asset_dir / filename).exists())
            self.assertFalse(any((patch / asset_dir).glob("*.pw.toml")))

    def test_server_patch_moves_tacz_payload_into_runtime_root(self):
        patch = self.root / "tacz-patch"
        payload = patch / "packwiz-files" / "tacz" / "testing-gun.zip"
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

        self.assertEqual(b"test", (patch / "tacz/testing-gun.zip").read_bytes())
        self.assertFalse((patch / "packwiz-files").exists())


if __name__ == "__main__":
    unittest.main()
