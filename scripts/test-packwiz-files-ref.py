#!/usr/bin/env python3
"""Unit tests ported from test-packwiz-files-ref.ps1."""
from __future__ import annotations

import re
import sys
import unittest
from urllib.parse import quote


RAW_URL_PATTERN = re.compile(
    r"https://raw\.githubusercontent\.com/Jasons-impart/Create-Delight-Remake/.+/packwiz-files/"
)


def resolve_test_raw_prefix(ref: str, raw_prefix: str) -> str:
    if raw_prefix is not None and str(raw_prefix).strip():
        return raw_prefix.rstrip("/") + "/"
    if ref is None or not str(ref).strip():
        ref = "main"
    escaped_ref = quote(ref, safe="/")
    return (
        "https://raw.githubusercontent.com/Jasons-impart/Create-Delight-Remake/"
        f"{escaped_ref}/packwiz-files/"
    )


def replace_test_raw_urls(content: str, replacement: str) -> str:
    return RAW_URL_PATTERN.sub(replacement, content)


class PackwizFilesRefTests(unittest.TestCase):
    def test_branch_ref_keeps_slash(self) -> None:
        self.assertEqual(
            resolve_test_raw_prefix("release/stable", ""),
            "https://raw.githubusercontent.com/Jasons-impart/Create-Delight-Remake/release/stable/packwiz-files/",
        )

    def test_ref_escapes_spaces(self) -> None:
        self.assertEqual(
            resolve_test_raw_prefix("test branch", ""),
            "https://raw.githubusercontent.com/Jasons-impart/Create-Delight-Remake/test%20branch/packwiz-files/",
        )

    def test_explicit_raw_prefix_wins_and_adds_slash(self) -> None:
        self.assertEqual(
            resolve_test_raw_prefix("ignored", "https://example.invalid/raw"),
            "https://example.invalid/raw/",
        )

    def test_replace_repository_raw_urls_only(self) -> None:
        input_content = (
            'url = "https://raw.githubusercontent.com/Jasons-impart/Create-Delight-Remake/main/packwiz-files/mods/A.jar"\n'
            'url = "https://raw.githubusercontent.com/Jasons-impart/Create-Delight-Remake/release/stable/packwiz-files/resourcepacks/B.zip"\n'
            'url = "https://example.invalid/Create-Delight-Remake/main/packwiz-files/mods/C.jar"\n'
        )
        expected_content = (
            'url = "http://127.0.0.1:8080/packwiz-files/mods/A.jar"\n'
            'url = "http://127.0.0.1:8080/packwiz-files/resourcepacks/B.zip"\n'
            'url = "https://example.invalid/Create-Delight-Remake/main/packwiz-files/mods/C.jar"\n'
        )
        self.assertEqual(
            replace_test_raw_urls(input_content, "http://127.0.0.1:8080/packwiz-files/"),
            expected_content,
        )


if __name__ == "__main__":
    suite = unittest.defaultTestLoader.loadTestsFromModule(sys.modules[__name__])
    result = unittest.TextTestRunner(verbosity=2).run(suite)
    if result.wasSuccessful():
        print("packwiz-files ref tests passed")
        sys.exit(0)
    sys.exit(1)
