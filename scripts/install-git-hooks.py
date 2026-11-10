#!/usr/bin/env python3
"""Install managed Git hook shims into .git/hooks.

Python 3.11+ stdlib port of the former install-git-hooks.ps1 implementation.
Generated shim text is LF-only so `sh` can execute it on every platform.
"""
from __future__ import annotations

import argparse
import os
import subprocess
import sys
from datetime import datetime
from pathlib import Path
from typing import Sequence


HOOK_NAMES = ("pre-commit", "post-merge", "post-checkout", "post-rewrite")
MARKER = "Create-Delight managed hook shim"


def is_windows_platform() -> bool:
    if "IsWindows" in os.environ and os.environ["IsWindows"]:
        # Not used; Python has no $IsWindows variable. Prefer platform.
        pass
    return sys.platform == "win32"


def write_install_message(message: str, quiet: bool) -> None:
    if not quiet:
        print(message, flush=True)


def build_hook_shim(name: str) -> str:
    # Keep this text byte-identical to the PowerShell here-string after CRLF→LF.
    return (
        "#!/bin/sh\n"
        f"# {MARKER}. Edit scripts/.githooks/{name} for project behavior.\n"
        'hook_dir=$(dirname "$0")\n'
        f'for local_hook in "$hook_dir/{name}.local" "$hook_dir/{name}.local."*; do\n'
        '  [ -e "$local_hook" ] || continue\n'
        '  if [ -x "$local_hook" ]; then\n'
        '    "$local_hook" "$@" || exit $?\n'
        '  elif [ -f "$local_hook" ]; then\n'
        '    sh "$local_hook" "$@" || exit $?\n'
        "  fi\n"
        "done\n"
        "\n"
        'repo_root=$(git rev-parse --show-toplevel 2>/dev/null) || exit 0\n'
        f'tracked_hook="$repo_root/scripts/.githooks/{name}"\n'
        'if [ -x "$tracked_hook" ]; then\n'
        '  "$tracked_hook" "$@"\n'
        'elif [ -f "$tracked_hook" ]; then\n'
        '  sh "$tracked_hook" "$@"\n'
        "fi"
    )


def run_git(args: Sequence[str], cwd: Path | None = None) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        ["git", *args],
        cwd=str(cwd) if cwd else None,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )


def resolve_repo_root() -> Path:
    result = run_git(["rev-parse", "--show-toplevel"])
    if result.returncode != 0 or not result.stdout.strip():
        raise RuntimeError("Not inside a Git worktree.")
    return Path(result.stdout.strip())


def resolve_git_common_dir(repo_root: Path) -> Path:
    result = run_git(["rev-parse", "--git-common-dir"], cwd=repo_root)
    if result.returncode != 0 or not result.stdout.strip():
        raise RuntimeError("Could not resolve Git common directory.")
    git_common_dir = Path(result.stdout.strip())
    if not git_common_dir.is_absolute():
        git_common_dir = repo_root / git_common_dir
    return git_common_dir


def get_local_hooks_path(repo_root: Path) -> str:
    result = run_git(["config", "--local", "--get", "core.hooksPath"], cwd=repo_root)
    if result.returncode != 0:
        return ""
    return (result.stdout or "").strip()


def read_text_raw(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except OSError:
        return ""


def contains_marker(text: str) -> bool:
    return MARKER.casefold() in text.casefold()


def needs_install(git_hooks_path: Path) -> bool:
    for hook_name in HOOK_NAMES:
        target = git_hooks_path / hook_name
        if not target.exists():
            return True
        existing = read_text_raw(target)
        if not contains_marker(existing):
            return True
    return False


def next_backup_path(git_hooks_path: Path, name: str) -> Path:
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    backup = git_hooks_path / f"{name}.local.{timestamp}"
    suffix = 1
    while backup.exists():
        backup = git_hooks_path / f"{name}.local.{timestamp}.{suffix}"
        suffix += 1
    return backup


def install_hook_shim(hooks_path: Path, git_hooks_path: Path, name: str, quiet: bool) -> None:
    tracked_hook = hooks_path / name
    if not tracked_hook.exists():
        raise RuntimeError(f"Missing tracked hook: {tracked_hook}")

    target_hook = git_hooks_path / name
    local_hook = git_hooks_path / f"{name}.local"
    shim = build_hook_shim(name)
    if "\r" in shim:
        raise RuntimeError("Generated hook shim unexpectedly contains CR characters.")

    if target_hook.exists():
        existing = read_text_raw(target_hook)
        if existing == shim:
            return
        if not contains_marker(existing):
            if local_hook.exists():
                backup_hook = next_backup_path(git_hooks_path, name)
                target_hook.replace(backup_hook)
                write_install_message(f"Preserved existing {name} as {backup_hook.name}", quiet)
            else:
                target_hook.replace(local_hook)
                write_install_message(f"Preserved existing {name} as {name}.local", quiet)

    target_hook.write_bytes(shim.encode("utf-8"))


def parse_args(argv: Sequence[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Install managed Git hook shims into .git/hooks.")
    parser.add_argument("-IfUnset", "--if-unset", dest="if_unset", action="store_true")
    parser.add_argument("-Quiet", "--quiet", dest="quiet", action="store_true")
    return parser.parse_args(argv)


def install_git_hooks(if_unset: bool = False, quiet: bool = False) -> int:
    repo_root = resolve_repo_root()
    hooks_path = repo_root / "scripts" / ".githooks"
    git_common_dir = resolve_git_common_dir(repo_root)
    git_hooks_path = git_common_dir / "hooks"

    current_hooks_path = get_local_hooks_path(repo_root)
    if current_hooks_path.casefold() == ".githooks".casefold():
        unset = run_git(["config", "--local", "--unset", "core.hooksPath"], cwd=repo_root)
        if unset.returncode != 0:
            raise RuntimeError("Failed to migrate core.hooksPath from .githooks to .git/hooks shims.")
        current_hooks_path = ""

    if current_hooks_path:
        write_install_message(f"Git hooks already configured: core.hooksPath={current_hooks_path}", quiet)
        write_install_message(
            "Skipped installing .git/hooks shims because a custom hooksPath would ignore them.",
            quiet,
        )
        return 0

    if not hooks_path.exists():
        raise RuntimeError(f"Missing tracked hooks directory: {hooks_path}")

    if if_unset and not needs_install(git_hooks_path):
        return 0

    git_hooks_path.mkdir(parents=True, exist_ok=True)
    for hook_name in HOOK_NAMES:
        install_hook_shim(hooks_path, git_hooks_path, hook_name, quiet)

    if not is_windows_platform():
        for hook_name in HOOK_NAMES:
            target = git_hooks_path / hook_name
            if target.is_file():
                mode = target.stat().st_mode
                target.chmod(mode | 0o111)

    write_install_message("Git hooks installed in .git/hooks", quiet)
    write_install_message(
        "Packwiz assets will sync automatically after relevant merge, rebase, or branch checkout changes.",
        quiet,
    )
    return 0


def main(argv: Sequence[str] | None = None) -> int:
    args = parse_args(argv)
    try:
        return install_git_hooks(if_unset=args.if_unset, quiet=args.quiet)
    except Exception as exc:  # noqa: BLE001 - match PowerShell script-terminating errors
        print(str(exc), file=sys.stderr, flush=True)
        return 1


if __name__ == "__main__":
    sys.exit(main())
