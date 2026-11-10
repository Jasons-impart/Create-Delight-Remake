#!/usr/bin/env python3
"""Unit tests for update-packwiz-meta.py helpers."""
from __future__ import annotations

import importlib.util
import sys
import tempfile
import unittest
from pathlib import Path

SCRIPT = Path(__file__).resolve().parent / "update-packwiz-meta.py"


def load():
    spec = importlib.util.spec_from_file_location("update_packwiz_meta", SCRIPT)
    module = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


meta = load()


class HelperTests(unittest.TestCase):
    def test_remove_version_suffix(self):
        self.assertEqual(meta.remove_filename_version_suffix("Foo (1.20.1)"), "Foo")
        self.assertEqual(meta.remove_filename_version_suffix("Foo [v2.0]"), "Foo")
        self.assertEqual(meta.remove_filename_version_suffix("Foo (MC 1.20)"), "Foo")

    def test_derive_base_name(self):
        self.assertEqual(meta.derive_base_name("Create-Better-Storages-Forge-1.20.1-1.0b.Release.jar"), "create_better_storages")
        self.assertEqual(meta.derive_base_name("AlwaysEat-5.2.jar"), "alwayseat")

    def test_preferred_filename_natural_sort(self):
        self.assertEqual(
            meta.get_preferred_filename(["pref-1.0.0.jar", "pref-2.0.0.jar", "pref-1.10.0.jar"]),
            "pref-2.0.0.jar",
        )
        self.assertEqual(meta.get_preferred_filename(["a-1.jar", "a-2.jar"]), "a-2.jar")

    def test_convert_slug(self):
        self.assertEqual(meta.convert_to_meta_slug("Hello World!"), "hello-world")
        self.assertIsNone(meta.convert_to_meta_slug("   "))

    def test_set_side_and_parse(self):
        src = 'name = "X"\nfilename = "x.jar"\nside = "both"\n'
        self.assertIn('side = "client"', meta.set_pw_toml_side(src, "client"))
        with tempfile.TemporaryDirectory() as tmp:
            path = Path(tmp) / "x.pw.toml"
            path.write_text(src, encoding="utf-8")
            data = meta.parse_pw_toml(path)
            self.assertEqual(data["Name"], "X")
            self.assertEqual(data["Filename"], "x.jar")
            self.assertFalse(data["IsManaged"])

    def test_cidict_case_insensitive(self):
        d = meta.CIDict()
        d["AlwaysEat.jar"] = "/a"
        self.assertIn("alwayseat.jar", d)
        self.assertEqual(d["ALWAYSEAT.JAR"], "/a")

    def test_default_mode_requires_full_reconcile(self):
        code = meta.main([])
        self.assertEqual(code, 1)


if __name__ == "__main__":
    unittest.main(verbosity=2)
