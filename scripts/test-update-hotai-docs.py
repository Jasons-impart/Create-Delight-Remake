"""Unit tests for update-hotai-docs.py helpers."""
from __future__ import annotations

import importlib.util
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path


def load_module():
    path = Path(__file__).resolve().parent / "update-hotai-docs.py"
    spec = importlib.util.spec_from_file_location("update_hotai_docs", path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


hotai = load_module()


class HelperTests(unittest.TestCase):
    def test_module_mapping(self):
        self.assertEqual(hotai.get_hotai_module("com/simibubi/create/content/Foo"), "Create")
        self.assertEqual(hotai.get_hotai_module("com/mrh0/createaddition/energy/IWireNode"), "Create Addition")
        self.assertEqual(hotai.get_hotai_module("org/antarcticgardens/cna/content/ponders/CNAPonders"), "Create New Age")
        self.assertEqual(hotai.get_hotai_module("org/antarcticgardens/newage/Foo"), "Create New Age")
        self.assertEqual(hotai.get_hotai_module("com/inolia_zaicek/more_mod_tetra/Modular/ModularMMTBow"), "Unknown")

    def test_generated_block_contains_markers_and_statuses(self):
        rows = [
            hotai.HotaiRow("Create", "hotai/a.badiff", "a", "a.class", jar_name="create.jar"),
            hotai.HotaiRow("Create Addition", "hotai/b.badiff", "b", "b.class", runtime_patched=True),
            hotai.HotaiRow("Unknown", "hotai/c.badiff", "c", "c.class"),
        ]
        block = hotai.build_generated_block(rows, 1, 1, 1)
        self.assertTrue(block.startswith(hotai.STATUS_BEGIN))
        self.assertTrue(block.endswith(hotai.STATUS_END))
        self.assertIn("`scripts/update-hotai-docs.py`", block)
        self.assertIn("当前扫描到 3 个 `.badiff`；静态 JAR 命中 1 个", block)
        self.assertIn("静态命中 `create.jar`", block)
        self.assertIn("运行时已确认动态创建（静态 JAR 无此 class）", block)
        self.assertIn("当前启动日志未确认（可能按需加载）", block)
        self.assertNotIn("\r", block)

    def test_compare_targets_order(self):
        expected = ["a|A", "b|B", "c|C"]
        documented = ["a|A", "c|C", "d|D"]
        self.assertEqual(hotai.compare_targets(expected, documented), "b|B, d|D")

    def test_collect_rows_uses_jar_and_log(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            badiff = root / "hotai/com/simibubi/create/content/Foo.badiff"
            badiff.parent.mkdir(parents=True)
            badiff.write_bytes(b"x")
            other = root / "hotai/com/mrh0/createaddition/blocks/Missing.badiff"
            other.parent.mkdir(parents=True)
            other.write_bytes(b"x")
            mods = root / "mods"
            mods.mkdir()
            jar = mods / "create-test.jar"
            with zipfile.ZipFile(jar, "w") as archive:
                archive.writestr("com/simibubi/create/content/Foo.class", b"class")
            log = root / "logs/latest.log"
            log.parent.mkdir()
            log.write_text("Patched class: com/mrh0/createaddition/blocks/Missing\n", encoding="utf-8")
            rows = hotai.collect_rows(root)
            by_name = {row.internal_name: row for row in rows}
            self.assertEqual(by_name["com/simibubi/create/content/Foo"].module, "Create")
            self.assertEqual(by_name["com/simibubi/create/content/Foo"].jar_name, "create-test.jar")
            self.assertEqual(by_name["com/mrh0/createaddition/blocks/Missing"].jar_name, "")
            self.assertTrue(by_name["com/mrh0/createaddition/blocks/Missing"].runtime_patched)

    def test_parse_args_aliases(self):
        args = hotai.parse_args(["-Root", "/tmp/repo", "-Check", "-StrictRuntimeStatus"])
        self.assertEqual(args.root, "/tmp/repo")
        self.assertTrue(args.check)
        self.assertTrue(args.strict_runtime_status)
        args = hotai.parse_args(["--root", "/tmp/repo", "--check", "--details-path", "x.md"])
        self.assertTrue(args.check)
        self.assertEqual(args.details_path, "x.md")


if __name__ == "__main__":
    unittest.main()
