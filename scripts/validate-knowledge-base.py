#!/usr/bin/env python3
"""Validate the Create-Delight Remake knowledge base."""

from __future__ import annotations

import argparse
import os
from pathlib import Path
import re
import shutil
import subprocess
import sys


FAILURES: list[str] = []
WARNINGS: list[str] = []


def add_failure(message: str) -> None:
    FAILURES.append(message)


def add_warning(message: str) -> None:
    WARNINGS.append(message)


def get_rel_path(root: Path, path: Path) -> str:
    try:
        return path.resolve().relative_to(root.resolve()).as_posix()
    except ValueError:
        text = str(path)
        prefix = str(root)
        if text.startswith(prefix):
            return text[len(prefix):].lstrip("\\/")
        return text.replace("\\", "/")


def project_path(root: Path, relative_path: str) -> Path:
    return root / relative_path


def test_project_path(root: Path, relative_path: str) -> bool:
    return project_path(root, relative_path).exists()


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8-sig")


def get_line_count(path: Path) -> int:
    if not path.is_file():
        return 0
    text = read_text(path)
    if text == "":
        return 0
    return len(text.splitlines())


def get_file_text(root: Path, relative_path: str) -> str:
    path = project_path(root, relative_path)
    if not path.is_file():
        return ""
    return read_text(path)


def test_dev_knowledge_chinese_markdown(root: Path, relative_path: str) -> None:
    path = project_path(root, relative_path)
    if not path.is_file():
        return

    in_front_matter = False
    in_code_fence = False
    lines = read_text(path).splitlines()

    for index, raw_line in enumerate(lines):
        line_number = index + 1
        trimmed = raw_line.strip()

        if line_number == 1 and trimmed == "---":
            in_front_matter = True
            continue
        if in_front_matter:
            if line_number > 1 and trimmed == "---":
                in_front_matter = False
            continue

        if re.match(r"^```", trimmed):
            in_code_fence = not in_code_fence
            continue
        if in_code_fence or trimmed == "":
            continue
        if re.match(r"^<!--.*-->$", trimmed):
            continue
        if re.match(r"^\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?$", trimmed):
            continue

        text = re.sub(r"`[^`]*`", "", trimmed)
        text = re.sub(r"\[[^\]]+\]\([^)]+\)", "", text).strip()
        if text == "":
            continue

        if re.search(r"[A-Za-z]", text) and not re.search(r"[\u4e00-\u9fff]", text):
            add_failure(
                f"Dev-knowledge prose must be Chinese-first: {relative_path} line {line_number} has English-only text."
            )


def run_hotai_runtime_check(root: Path) -> None:
    py_script = project_path(root, "scripts/update-hotai-docs.py")
    if py_script.is_file():
        try:
            completed = subprocess.run(
                [
                    sys.executable,
                    str(py_script),
                    "--root",
                    str(root),
                    "--check",
                    "--strict-runtime-status",
                ],
                cwd=root,
                check=False,
            )
        except OSError as exc:
            add_failure(str(exc))
            return
        if completed.returncode != 0:
            add_failure(
                "scripts/update-hotai-docs.py --check --strict-runtime-status "
                f"exited with {completed.returncode}."
            )
        return

    hotai_doc_script = project_path(root, "scripts/update-hotai-docs.ps1")
    if not hotai_doc_script.is_file():
        return

    executable = shutil.which("pwsh")
    if executable is None and os.name == "nt":
        executable = shutil.which("powershell")
    if executable is None:
        add_failure(
            "HotAI runtime status check requires Python (scripts/update-hotai-docs.py) "
            "or PowerShell to run scripts/update-hotai-docs.ps1 -Check -StrictRuntimeStatus. "
            "scripts/check-hotai-docs.sh only verifies that hotai/ changes ship with "
            "docs/dev-knowledge/hotai/ updates in the same commit range; it is not a substitute."
        )
        return

    try:
        completed = subprocess.run(
            [
                executable,
                "-NoLogo",
                "-NoProfile",
                "-ExecutionPolicy",
                "Bypass",
                "-File",
                str(hotai_doc_script),
                "-Root",
                str(root),
                "-Check",
                "-StrictRuntimeStatus",
            ],
            cwd=root,
            check=False,
        )
    except OSError as exc:
        add_failure(str(exc))
        return

    if completed.returncode != 0:
        add_failure(
            f"scripts/update-hotai-docs.ps1 -Check -StrictRuntimeStatus exited with {completed.returncode}."
        )


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Validate the Create-Delight Remake knowledge base."
    )
    parser.add_argument("--root", default="", help="Repository root. Defaults to the parent of scripts/.")
    parser.add_argument(
        "--strict-warnings",
        action="store_true",
        help="Treat warnings as failures, matching -StrictWarnings.",
    )
    parser.add_argument(
        "--check-hotai-runtime-status",
        action="store_true",
        help="Also run update-hotai-docs.py --check --strict-runtime-status when present, otherwise the PowerShell equivalent, matching -CheckHotaiRuntimeStatus.",
    )
    return parser.parse_args(argv)


def validate(root: Path, *, strict_warnings: bool, check_hotai_runtime_status: bool) -> int:
    FAILURES.clear()
    WARNINGS.clear()

    knowledge_files = [
        {"path": "AGENTS.md", "max_lines": 150, "required": True},
        {"path": "kubejs/AGENTS.md", "max_lines": 80, "required": True},
        {"path": "CDC-mod-src/AGENTS.md", "max_lines": 80, "required": True},
    ]

    for file in knowledge_files:
        path = project_path(root, file["path"])
        if not path.is_file():
            if file["required"]:
                add_failure(f"Missing knowledge file: {file['path']}")
            continue

        line_count = get_line_count(path)
        if line_count > file["max_lines"]:
            add_failure(f"{file['path']} has {line_count} lines; limit is {file['max_lines']}.")

    required_paths = [
        "AGENTS.md",
        "kubejs/AGENTS.md",
        "CDC-mod-src/AGENTS.md",
        "docs/lessons-learned.md",
        "docs/dev-knowledge/index.md",
        "docs/dev-knowledge/content-map.md",
        "docs/dev-knowledge/compatibility-patches.md",
        "docs/dev-knowledge/how-to-index.md",
        ".agents/skills/knowledge-check/SKILL.md",
        ".agents/skills/dev-knowledge/SKILL.md",
        ".agents/skills/packwiz-assets/SKILL.md",
        ".github/workflows/release.yml",
        ".codex/hooks.json",
        "scripts/sync-packwiz-assets.ps1",
        "scripts/sync-packwiz-assets.py",
        "scripts/install-git-hooks.py",
        "scripts/update-packwiz-meta.ps1",
        (
            "scripts/update-hotai-docs.py"
            if project_path(root, "scripts/update-hotai-docs.py").is_file()
            else "scripts/update-hotai-docs.ps1"
        ),
        "docs/dev-knowledge/hotai/README.md",
        "docs/dev-knowledge/hotai/patch-map.md",
        "docs/dev-knowledge/hotai/badiff-details.md",
        "scripts/add-packwiz-target.ps1",
        "scripts/update-packwiz-target.ps1",
        "kubejs/data/oei/replacements",
        "modpack.toml",
    ]

    for relative_path in required_paths:
        if not test_project_path(root, relative_path):
            add_failure(f"Documented path does not exist: {relative_path}")

    test_dev_knowledge_chinese_markdown(root, ".agents/skills/dev-knowledge/SKILL.md")

    dev_knowledge_docs_path = project_path(root, "docs/dev-knowledge")
    if dev_knowledge_docs_path.is_dir():
        markdown_files = sorted(
            (path for path in dev_knowledge_docs_path.rglob("*.md") if path.is_file()),
            key=lambda path: get_rel_path(root, path),
        )
        for markdown_file in markdown_files:
            test_dev_knowledge_chinese_markdown(root, get_rel_path(root, markdown_file))

    if check_hotai_runtime_status:
        run_hotai_runtime_check(root)

    all_agents_text = "\n".join(get_file_text(root, file["path"]) for file in knowledge_files)
    duplicate_checks = [
        {
            "name": "modpack.toml version source",
            "pattern": r"modpack\.toml.*ONLY version source|Version ONLY in `modpack\.toml`",
            "max": 2,
        },
        {
            "name": "release workflow guidance",
            "pattern": r"Use `/release` skill",
            "max": 3,
        },
        {
            "name": "lessons-learned routing",
            "pattern": r"lessons-learned\.md",
            "max": 5,
        },
    ]

    for check in duplicate_checks:
        matches = re.findall(check["pattern"], all_agents_text, flags=re.IGNORECASE)
        if len(matches) > check["max"]:
            add_warning(
                f"Possible duplicated knowledge: {check['name']} appears {len(matches)} times; expected <= {check['max']}."
            )

    anti_patterns = [
        {
            "pattern": r"e\.remove\(\) or e\.removeById\(\).*e\.remove\(\) or e\.removeById\(\)",
            "message": "Recipe removal anti-pattern appears duplicated.",
        },
        {
            "pattern": r"PowerShell.*backtick.*AGENTS\.md",
            "message": "Long historical lesson appears to be in AGENTS.md; move history to docs/lessons-learned.md.",
        },
    ]

    for anti_pattern in anti_patterns:
        if re.search(anti_pattern["pattern"], all_agents_text, flags=re.IGNORECASE):
            add_warning(anti_pattern["message"])

    lessons_path = project_path(root, "docs/lessons-learned.md")
    if lessons_path.is_file():
        lessons_text = read_text(lessons_path)
        sections = [section for section in re.split(r"(?m)^##\s+", lessons_text) if section.strip()]
        for section in sections:
            first_line = re.split(r"\r?\n", section, maxsplit=1)[0].strip()
            if first_line == "# Lessons Learned":
                continue
            if not re.search(r"\d{4}-\d{2}-\d{2}", section):
                add_warning(f"Lesson '{first_line}' has no YYYY-MM-DD date.")
            if not re.search(r"(?i)(Problem|Fix|Lesson|场景|根因|正确做法|规则)", section):
                add_warning(f"Lesson '{first_line}' may lack problem/fix structure.")

    if WARNINGS:
        print("Knowledge base validation warnings:")
        for warning in WARNINGS:
            print(f"WARN: {warning}")

    if FAILURES:
        print("Knowledge base validation failed:")
        for failure in FAILURES:
            print(f"FAIL: {failure}")
        return 1

    if strict_warnings and WARNINGS:
        print("Knowledge base validation failed because -StrictWarnings was set.")
        return 1

    print("Knowledge base validation passed.")
    return 0


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    if args.root.strip():
        root = Path(args.root).resolve()
    else:
        root = Path(__file__).resolve().parent.parent
    return validate(
        root,
        strict_warnings=args.strict_warnings,
        check_hotai_runtime_status=args.check_hotai_runtime_status,
    )


if __name__ == "__main__":
    sys.exit(main())
