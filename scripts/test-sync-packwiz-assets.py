"""Unit tests for pure helpers in sync-packwiz-assets.py."""
from __future__ import annotations

import importlib.util
import tempfile
import unittest
from pathlib import Path


def load_module():
    path = Path(__file__).resolve().parent / "sync-packwiz-assets.py"
    spec = importlib.util.spec_from_file_location("sync_packwiz_assets", path)
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    import sys
    sys.modules[spec.name] = module
    spec.loader.exec_module(module)
    return module


SYNC = load_module()


class ProxyTests(unittest.TestCase):
    def test_empty_is_none(self):
        self.assertIsNone(SYNC.resolve_proxy_uri(None))
        self.assertIsNone(SYNC.resolve_proxy_uri("   "))

    def test_valid_http_proxy(self):
        cfg = SYNC.resolve_proxy_uri("http://127.0.0.1:7890")
        self.assertEqual(cfg.host, "127.0.0.1")
        self.assertEqual(cfg.port, 7890)
        self.assertEqual(cfg.absolute_uri, "http://127.0.0.1:7890/")

    def test_invalid_relative_url(self):
        with self.assertRaises(ValueError) as ctx:
            SYNC.resolve_proxy_uri("not-a-proxy")
        self.assertIn("Invalid proxy URL", str(ctx.exception))

    def test_unsupported_scheme(self):
        with self.assertRaises(ValueError) as ctx:
            SYNC.resolve_proxy_uri("ftp://127.0.0.1:7890")
        self.assertIn("Unsupported proxy URL", str(ctx.exception))

    def test_rejects_credentials(self):
        with self.assertRaises(ValueError) as ctx:
            SYNC.resolve_proxy_uri("http://user:pass@127.0.0.1:7890")
        self.assertIn("credentials", str(ctx.exception))

    def test_rejects_path_query_fragment(self):
        with self.assertRaises(ValueError) as ctx:
            SYNC.resolve_proxy_uri("http://127.0.0.1:7890/proxy")
        self.assertIn("must not contain a path", str(ctx.exception))
        with self.assertRaises(ValueError):
            SYNC.resolve_proxy_uri("http://127.0.0.1:7890?x=1")
        with self.assertRaises(ValueError):
            SYNC.resolve_proxy_uri("http://127.0.0.1:7890#frag")


class PathHelperTests(unittest.TestCase):
    def test_packwiz_change_paths(self):
        self.assertTrue(SYNC.is_packwiz_change_path("mods/example.pw.toml"))
        self.assertTrue(SYNC.is_packwiz_change_path("TACZ/Guns/pack.pw.toml"))
        self.assertTrue(SYNC.is_packwiz_change_path("packwiz-files/mods/foo.jar"))
        self.assertFalse(SYNC.is_packwiz_change_path("mods/example.jar"))
        self.assertFalse(SYNC.is_packwiz_change_path("kubejs/server_scripts/foo.js"))

    def test_paths_contain_is_case_insensitive(self):
        self.assertTrue(
            SYNC.paths_contain(
                ["Config/Modpack_Defaults/config/crash_assistant/modlist.json"],
                "config/modpack_defaults/config/crash_assistant/modlist.json",
            )
        )

    def test_relative_unix_path(self):
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            target = root / "mods" / "example.pw.toml"
            target.parent.mkdir()
            target.write_text("x", encoding="utf-8")
            self.assertEqual(SYNC.get_relative_unix_path(root, target), "mods/example.pw.toml")
            outside = Path(tmp).resolve().parent / "outside.txt"
            with self.assertRaises(ValueError):
                SYNC.get_relative_unix_path(root, outside)

    def test_replace_packwiz_files_raw_urls(self):
        content = (
            'url = "https://raw.githubusercontent.com/Jasons-impart/Create-Delight-Remake/'
            'main/packwiz-files/mods/BeeFix-1.20-1.0.7.jar"\n'
        )
        replaced = SYNC.replace_packwiz_files_raw_urls(content, "http://127.0.0.1:9/packwiz-files/")
        self.assertIn("http://127.0.0.1:9/packwiz-files/mods/BeeFix-1.20-1.0.7.jar", replaced)
        self.assertNotIn("raw.githubusercontent.com", replaced)

    def test_metadata_root_key_normalizes_and_sorts(self):
        self.assertEqual(
            SYNC.metadata_root_key(["/TACZ/", "mods", "ResourcePacks"]),
            "mods|resourcepacks|tacz",
        )

    def test_sync_state_key_uses_v4_and_auto_defaults(self):
        key = SYNC.get_sync_state_key(
            "abc123",
            "client",
            ["mods", "resourcepacks"],
            None,
            None,
            None,
            "https://example.invalid/packwiz",
            "https://example.invalid/installer.jar",
            "deadbeef",
        )
        self.assertEqual(
            key,
            "v4|abc123|client|mods|resourcepacks|direct|auto|auto|"
            "https://example.invalid/packwiz|https://example.invalid/installer.jar|deadbeef",
        )
        self.assertIsNone(SYNC.get_sync_state_key(None, "client", ["mods"], None, None, None, "u", "i", "h"))

    def test_parse_args_aliases(self):
        args = SYNC.parse_args(["-IfGitChanged", "-Side", "server", "-DryRun", "-HookName", "post-checkout"])
        self.assertTrue(args.if_git_changed)
        self.assertEqual(args.side, "server")
        self.assertTrue(args.dry_run)
        self.assertEqual(args.hook_name, "post-checkout")
        args = SYNC.parse_args(["--if-git-changed", "--side", "all", "--dry-run"])
        self.assertTrue(args.if_git_changed)
        self.assertEqual(args.side, "all")
        self.assertTrue(args.dry_run)


if __name__ == "__main__":
    unittest.main()
