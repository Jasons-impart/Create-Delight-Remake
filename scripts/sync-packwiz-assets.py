#!/usr/bin/env python3
"""Sync Packwiz runtime assets into the local checkout.

Python 3.11+ stdlib port of the former sync-packwiz-assets.ps1 implementation.
Keep CLI names/aliases, messages, and exit codes aligned with that script.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import shutil
import socket
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Iterable, Sequence


PACKWIZ_FILES_RAW_URL_PATTERN = re.compile(
    r"https://raw\.githubusercontent\.com/Jasons-impart/Create-Delight-Remake/.+/packwiz-files/"
)
PACKWIZ_CHANGE_PATTERN = re.compile(
    r"^(mods|resourcepacks|shaderpacks|tacz)/.+\.pw\.toml$",
    re.IGNORECASE,
)
DEFAULT_METADATA_ROOTS = ["mods", "resourcepacks", "shaderpacks", "tacz"]
DEFAULT_INSTALLER_URL = (
    "https://github.com/packwiz/packwiz-installer/releases/latest/download/packwiz-installer.jar"
)
CRASH_ASSISTANT_BASELINE = "config/modpack_defaults/config/crash_assistant/modlist.json"
LOCK_ATTEMPTS = 600
LOCK_WAIT_SECONDS = 0.2
SERVER_READY_ATTEMPTS = 50
SERVER_READY_WAIT_SECONDS = 0.2


@dataclass(frozen=True)
class ProxyConfig:
    absolute_uri: str
    host: str
    port: int


def is_windows_platform() -> bool:
    return sys.platform == "win32" or os.environ.get("OS") == "Windows_NT"


def default_packwiz_filename() -> str:
    return "packwiz.exe" if is_windows_platform() else "packwiz"


def default_packwiz_url() -> str:
    return (
        "https://github.com/Jasons-impart/packwiz/releases/latest/download/"
        + default_packwiz_filename()
    )


def warn(message: str) -> None:
    print(f"WARNING: {message}", file=sys.stderr, flush=True)


def write_status(message: str) -> None:
    print(f"[sync] {message}", flush=True)


def write_utf8_no_bom(path: Path, content: str) -> None:
    path.write_bytes(content.encode("utf-8"))


def normalize_metadata_roots(values: Iterable[str] | None) -> list[str]:
    if not values:
        return list(DEFAULT_METADATA_ROOTS)
    roots: list[str] = []
    for value in values:
        for part in str(value).split(","):
            item = part.strip()
            if item:
                roots.append(item)
    return roots or list(DEFAULT_METADATA_ROOTS)


def metadata_root_key(roots: Sequence[str]) -> str:
    normalized = []
    for root in roots:
        cleaned = re.sub(r"^[\\/]+|[\\/]+$", "", root).lower()
        normalized.append(cleaned)
    return "|".join(sorted(normalized))


def file_sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as handle:
        for chunk in iter(lambda: handle.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def get_sync_state_key(
    commit: str | None,
    side: str,
    metadata_roots: Sequence[str],
    proxy: str | None,
    packwiz_files_ref: str | None,
    packwiz_files_raw_prefix: str | None,
    packwiz_url: str,
    installer_url: str,
    script_hash: str,
) -> str | None:
    if commit is None or not str(commit).strip():
        return None
    proxy_key = "direct" if not (proxy and proxy.strip()) else proxy.strip().lower()
    ref_key = "auto" if not (packwiz_files_ref and packwiz_files_ref.strip()) else packwiz_files_ref.strip()
    prefix_key = (
        "auto"
        if not (packwiz_files_raw_prefix and packwiz_files_raw_prefix.strip())
        else packwiz_files_raw_prefix.strip()
    )
    return (
        f"v4|{commit}|{side}|{metadata_root_key(metadata_roots)}|{proxy_key}|"
        f"{ref_key}|{prefix_key}|{packwiz_url}|{installer_url}|{script_hash}"
    )


def resolve_proxy_uri(proxy_value: str | None) -> ProxyConfig | None:
    if proxy_value is None or not str(proxy_value).strip():
        return None
    raw = str(proxy_value).strip()
    parsed = urllib.parse.urlparse(raw)
    if not parsed.scheme:
        raise ValueError(
            f"Invalid proxy URL '{proxy_value}'. Use an absolute HTTP URL such as http://127.0.0.1:7890."
        )
    if parsed.scheme.lower() not in {"http", "https"} or not parsed.netloc:
        raise ValueError(
            f"Unsupported proxy URL '{proxy_value}'. Use an absolute HTTP or HTTPS proxy URL."
        )
    if parsed.username or parsed.password or not parsed.hostname:
        raise ValueError(
            "Proxy URL must contain only a host and port; proxy credentials are not supported by this sync path."
        )
    if parsed.path not in {"", "/"} or parsed.query or parsed.fragment:
        raise ValueError(
            f"Proxy URL '{proxy_value}' must not contain a path, query, or fragment."
        )
    port = parsed.port
    if port is None:
        port = 443 if parsed.scheme.lower() == "https" else 80
    absolute = f"{parsed.scheme.lower()}://{parsed.hostname}:{port}/"
    return ProxyConfig(absolute_uri=absolute, host=parsed.hostname, port=port)


def replace_packwiz_files_raw_urls(content: str, replacement: str) -> str:
    return PACKWIZ_FILES_RAW_URL_PATTERN.sub(replacement, content)


def is_packwiz_change_path(path: str) -> bool:
    normalized = path.replace("\\", "/")
    return normalized.lower().startswith("packwiz-files/") or bool(
        PACKWIZ_CHANGE_PATTERN.match(normalized)
    )


def paths_contain(paths: Sequence[str], expected: str) -> bool:
    expected_norm = expected.replace("\\", "/").casefold()
    return any(path.replace("\\", "/").casefold() == expected_norm for path in paths)


def get_relative_unix_path(root: Path, path: Path) -> str:
    full_root = root.resolve()
    full_path = path.resolve()
    try:
        relative = full_path.relative_to(full_root)
    except ValueError as exc:
        raise ValueError(f"Path '{path}' is outside repo root '{root}'.") from exc
    return relative.as_posix()


def get_free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as listener:
        listener.bind(("127.0.0.1", 0))
        return int(listener.getsockname()[1])


def resolve_git_commit(repo_root: Path, rev: str | None) -> str | None:
    if rev is None or not str(rev).strip():
        return None
    result = subprocess.run(
        ["git", "-C", str(repo_root), "rev-parse", "--verify", f"{rev}^{{commit}}"],
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    if result.returncode != 0 or not result.stdout.strip():
        return None
    return result.stdout.strip()


def escape_data_string_keep_slash(value: str) -> str:
    return urllib.parse.quote(value, safe="/")


def git_ref_for_packwiz_files(repo_root: Path, packwiz_files_ref: str | None) -> str:
    if packwiz_files_ref and packwiz_files_ref.strip():
        return packwiz_files_ref.strip()
    branch = subprocess.run(
        ["git", "-C", str(repo_root), "branch", "--show-current"],
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    if branch.returncode == 0 and branch.stdout.strip():
        return branch.stdout.strip()
    commit = subprocess.run(
        ["git", "-C", str(repo_root), "rev-parse", "HEAD"],
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    if commit.returncode == 0 and commit.stdout.strip():
        return commit.stdout.strip()
    return "main"


def resolve_packwiz_files_raw_prefix(repo_root: Path, raw_prefix: str | None, files_ref: str | None) -> str:
    if raw_prefix and raw_prefix.strip():
        return raw_prefix.strip().rstrip("/") + "/"
    ref = git_ref_for_packwiz_files(repo_root, files_ref)
    escaped = escape_data_string_keep_slash(ref)
    return f"https://raw.githubusercontent.com/Jasons-impart/Create-Delight-Remake/{escaped}/packwiz-files/"


def is_ms_store_stub(executable: str) -> bool:
    normalized = executable.replace("\\", "/").lower()
    return "/windowsapps/" in normalized


def python_works(command: Sequence[str]) -> bool:
    try:
        result = subprocess.run(
            [*command, "-c", "import sys; raise SystemExit(0 if sys.version_info >= (3, 11) else 1)"],
            capture_output=True,
            text=True,
            encoding="utf-8",
        )
        return result.returncode == 0
    except OSError:
        return False


def look_up_command(name: str) -> str | None:
    path = shutil.which(name)
    return path


def resolve_python_command(preferred: str | None = None) -> str:
    if preferred and Path(preferred).exists() and python_works([preferred]):
        return preferred
    if getattr(sys, "executable", None) and python_works([sys.executable]):
        if not is_ms_store_stub(sys.executable):
            return sys.executable

    python_path = look_up_command("python")
    if python_path and not is_ms_store_stub(python_path) and python_works([python_path]):
        return python_path

    py_path = look_up_command("py")
    if py_path:
        try:
            result = subprocess.run(
                [py_path, "-3", "-c", "import sys; print(sys.executable)"],
                capture_output=True,
                text=True,
                encoding="utf-8",
            )
            resolved = result.stdout.strip()
            if result.returncode == 0 and resolved and python_works([resolved]):
                return resolved
        except OSError:
            pass

    python3_path = look_up_command("python3")
    if python3_path and not is_ms_store_stub(python3_path) and python_works([python3_path]):
        return python3_path

    raise RuntimeError("Python was not found. Install Python so the local static server can run.")


def resolve_java_command(repo_root: Path) -> str:
    java_home = os.environ.get("JAVA_HOME")
    if java_home:
        for name in ("java.exe", "java"):
            candidate = Path(java_home) / "bin" / name
            if candidate.is_file():
                return str(candidate)

    variables_path = repo_root / "variables.txt"
    if variables_path.is_file():
        for raw_line in variables_path.read_text(encoding="utf-8", errors="replace").splitlines():
            match = re.match(r"^\s*JAVA\s*=\s*(.+?)\s*$", raw_line)
            if not match:
                continue
            trimmed = match.group(1).strip().strip('"')
            if trimmed and Path(trimmed).exists():
                return trimmed

    java_cmd = shutil.which("java")
    if java_cmd:
        return java_cmd

    raise RuntimeError(
        "Java 17 was not found. Set JAVA_HOME, install java on PATH, or update variables.txt."
    )


class SyncLock:
    def __init__(self, path: Path) -> None:
        self.path = path
        self._handle = None

    def acquire(self) -> None:
        self.path.parent.mkdir(parents=True, exist_ok=True)
        for _ in range(LOCK_ATTEMPTS):
            handle = None
            try:
                handle = open(self.path, "a+b")
                if sys.platform == "win32":
                    import msvcrt

                    msvcrt.locking(handle.fileno(), msvcrt.LK_NBLCK, 1)
                else:
                    import fcntl

                    fcntl.flock(handle.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
                self._handle = handle
                return
            except OSError:
                if handle is not None:
                    handle.close()
                time.sleep(LOCK_WAIT_SECONDS)
        raise RuntimeError(f"Timed out waiting for another Packwiz sync to finish: {self.path}")

    def release(self) -> None:
        handle = self._handle
        if handle is None:
            return
        try:
            if sys.platform == "win32":
                import msvcrt

                try:
                    msvcrt.locking(handle.fileno(), msvcrt.LK_UNLCK, 1)
                except OSError:
                    pass
            else:
                import fcntl

                fcntl.flock(handle.fileno(), fcntl.LOCK_UN)
        finally:
            handle.close()
            self._handle = None


def parse_args(argv: Sequence[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Sync Packwiz runtime assets into the local checkout."
    )
    parser.add_argument(
        "-MetadataRoots",
        "--metadata-roots",
        nargs="+",
        dest="metadata_roots",
        default=None,
        help="Metadata roots to include (default: mods resourcepacks shaderpacks tacz).",
    )
    parser.add_argument(
        "-Side",
        "--side",
        dest="side",
        default="client",
    )
    parser.add_argument("-PackwizUrl", "--packwiz-url", dest="packwiz_url", default=None)
    parser.add_argument(
        "-InstallerUrl",
        "--installer-url",
        dest="installer_url",
        default=DEFAULT_INSTALLER_URL,
    )
    parser.add_argument(
        "-PackwizFilesRef",
        "--packwiz-files-ref",
        dest="packwiz_files_ref",
        default=os.environ.get("PACKWIZ_FILES_REF"),
    )
    parser.add_argument(
        "-PackwizFilesRawPrefix",
        "--packwiz-files-raw-prefix",
        dest="packwiz_files_raw_prefix",
        default=os.environ.get("PACKWIZ_FILES_RAW_PREFIX"),
    )
    parser.add_argument(
        "-Proxy",
        "--proxy",
        dest="proxy",
        default=os.environ.get("PACKWIZ_PROXY"),
    )
    parser.add_argument("-IfGitChanged", "--if-git-changed", dest="if_git_changed", action="store_true")
    parser.add_argument("-OldRev", "--old-rev", dest="old_rev", default=None)
    parser.add_argument("-NewRev", "--new-rev", dest="new_rev", default="HEAD")
    parser.add_argument("-HookName", "--hook-name", dest="hook_name", default="sync-packwiz-assets")
    parser.add_argument("-Force", "--force", dest="force", action="store_true")
    parser.add_argument("-DryRun", "--dry-run", dest="dry_run", action="store_true")
    args = parser.parse_args(argv)
    side = (args.side or "client").strip().lower()
    if side not in {"client", "server", "all"}:
        parser.error("Side must be one of: client, server, all")
    args.side = side
    return args


def run_checked(command: Sequence[str], *, cwd: Path | None = None, env: dict[str, str] | None = None) -> int:
    result = subprocess.run(list(command), cwd=str(cwd) if cwd else None, env=env)
    return result.returncode


def download_file(url: str, destination: Path, proxy: ProxyConfig | None) -> None:
    destination.parent.mkdir(parents=True, exist_ok=True)
    write_status(f"Downloading {destination.name}...")
    handlers = []
    if proxy is not None:
        handlers.append(
            urllib.request.ProxyHandler({"http": proxy.absolute_uri, "https": proxy.absolute_uri})
        )
    opener = urllib.request.build_opener(*handlers)
    request = urllib.request.Request(url)
    with opener.open(request) as response, destination.open("wb") as handle:
        shutil.copyfileobj(response, handle)


def ensure_tool(url: str, destination: Path, proxy: ProxyConfig | None) -> None:
    if destination.exists():
        return
    download_file(url, destination, proxy)


def wait_for_local_server(pack_url: str) -> bool:
    opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))
    for _ in range(SERVER_READY_ATTEMPTS):
        try:
            with opener.open(pack_url, timeout=1):
                return True
        except (urllib.error.URLError, TimeoutError, OSError):
            time.sleep(SERVER_READY_WAIT_SECONDS)
    return False


def hidden_popen_kwargs() -> dict:
    kwargs: dict = {}
    if sys.platform == "win32":
        kwargs["creationflags"] = getattr(subprocess, "CREATE_NO_WINDOW", 0x08000000)
    return kwargs


def proxy_env(base: dict[str, str] | None, proxy: ProxyConfig | None) -> dict[str, str]:
    env = dict(base if base is not None else os.environ)
    if proxy is not None:
        env["HTTP_PROXY"] = proxy.absolute_uri
        env["HTTPS_PROXY"] = proxy.absolute_uri
        env["ALL_PROXY"] = proxy.absolute_uri
    return env


class PackwizSync:
    def __init__(self, args: argparse.Namespace) -> None:
        self.args = args
        self.repo_root = Path(__file__).resolve().parent.parent
        self.scripts_root = Path(__file__).resolve().parent
        self.work_root = self.repo_root / ".cache" / "packwiz-sync"
        self.tools_root = self.work_root / "tools"
        self.pack_root = self.work_root / "pack"
        self.packwiz_filename = default_packwiz_filename()
        self.packwiz_url = args.packwiz_url or default_packwiz_url()
        self.installer_url = args.installer_url
        self.packwiz_exe = self.tools_root / self.packwiz_filename
        self.installer_jar = self.tools_root / "packwiz-installer.jar"
        self.serve_log = self.work_root / "serve.log"
        self.serve_err_log = self.work_root / "serve.err.log"
        self.sync_state_path = self.work_root / "sync-state.json"
        self.sync_lock_path = self.work_root / "sync.lock"
        self.packwiz_files_root = self.repo_root / "packwiz-files"
        self.static_server_script = self.scripts_root / "packwiz-static-server.py"
        self.generate_script = self.scripts_root / "generate-packwiz-files.py"
        self.side_script = self.scripts_root / "packwiz-side.py"
        self.metadata_roots = normalize_metadata_roots(args.metadata_roots)
        self.input_packwiz_files_ref = args.packwiz_files_ref
        self.input_packwiz_files_raw_prefix = args.packwiz_files_raw_prefix
        self.proxy_value = args.proxy
        self.side = args.side
        self.hook_name = args.hook_name
        self.sync_old_commit: str | None = None
        self.sync_new_commit: str | None = None
        self.crash_assistant_baseline_changed = False
        self.proxy_config: ProxyConfig | None = None
        self.resolved_raw_prefix: str | None = None
        self.lock = SyncLock(self.sync_lock_path)
        self.serve_process: subprocess.Popen | None = None
        self.serve_stdout = None
        self.serve_stderr = None

    def reset_crash_assistant_modlist(self) -> None:
        if self.side == "server":
            return
        baseline = self.repo_root / CRASH_ASSISTANT_BASELINE
        runtime = self.repo_root / "config" / "crash_assistant" / "modlist.json"
        if not baseline.is_file() or not runtime.is_file():
            return
        json.loads(baseline.read_text(encoding="utf-8"))
        if self.args.dry_run:
            print("[sync] Would reset Crash Assistant runtime modlist from managed defaults on next launch.", flush=True)
            return
        runtime.unlink()
        print("[sync] Reset Crash Assistant runtime modlist; managed defaults will be loaded on next launch.", flush=True)

    def test_packwiz_git_changes(self, old: str | None, new: str | None, name: str) -> bool:
        old_commit = resolve_git_commit(self.repo_root, old)
        new_commit = resolve_git_commit(self.repo_root, new)
        if new_commit is None:
            warn(f"[{name}] Could not resolve new revision '{new}'; skipping Packwiz sync.")
            return False
        if old_commit is None:
            warn(f"[{name}] Could not resolve old revision '{old}'; skipping Packwiz sync.")
            return False
        self.sync_old_commit = old_commit
        self.sync_new_commit = new_commit
        if old_commit == new_commit:
            print(f"[{name}] HEAD did not change; Packwiz sync not required.", flush=True)
            return False
        result = subprocess.run(
            [
                "git",
                "-C",
                str(self.repo_root),
                "diff",
                "--name-only",
                old_commit,
                new_commit,
                "--",
                "mods",
                "resourcepacks",
                "shaderpacks",
                "tacz",
                "packwiz-files",
                CRASH_ASSISTANT_BASELINE,
            ],
            capture_output=True,
            text=True,
            encoding="utf-8",
        )
        if result.returncode != 0:
            warn(f"[{name}] Could not diff {old_commit}..{new_commit}; skipping Packwiz sync.")
            return False
        changed_paths = [line for line in result.stdout.splitlines() if line]
        self.crash_assistant_baseline_changed = paths_contain(changed_paths, CRASH_ASSISTANT_BASELINE)
        packwiz_changes = []
        seen = set()
        for path in changed_paths:
            if not is_packwiz_change_path(path):
                continue
            key = path.casefold()
            if key in seen:
                continue
            seen.add(key)
            packwiz_changes.append(path)
        if not packwiz_changes:
            print(f"[{name}] No Packwiz asset changes detected; sync not required.", flush=True)
            return False
        print(f"[{name}] Packwiz asset changes detected; syncing local runtime assets...", flush=True)
        for path in packwiz_changes:
            print(f"  {path}", flush=True)
        return True

    def test_sync_state_completed(self, state_key: str | None) -> bool:
        if not state_key or not self.sync_state_path.is_file():
            return False
        try:
            state = json.loads(self.sync_state_path.read_text(encoding="utf-8"))
            return str(state.get("key", "")) == state_key
        except (OSError, json.JSONDecodeError, TypeError, AttributeError):
            warn("Could not read Packwiz sync state; running a fresh sync.")
            return False

    def write_sync_state(self, state_key: str | None) -> None:
        if not state_key:
            return
        try:
            self.work_root.mkdir(parents=True, exist_ok=True)
            prefix_value = self.resolved_raw_prefix
            if not prefix_value:
                prefix_value = (
                    "auto"
                    if not (self.input_packwiz_files_raw_prefix and self.input_packwiz_files_raw_prefix.strip())
                    else self.input_packwiz_files_raw_prefix.strip()
                )
            state = {
                "schemaVersion": 1,
                "key": state_key,
                "oldCommit": self.sync_old_commit,
                "newCommit": self.sync_new_commit,
                "side": self.side,
                "metadataRoots": list(self.metadata_roots),
                "proxy": "direct" if not (self.proxy_value and str(self.proxy_value).strip()) else str(self.proxy_value).strip(),
                "packwizFilesRef": (
                    "auto"
                    if not (self.input_packwiz_files_ref and self.input_packwiz_files_ref.strip())
                    else self.input_packwiz_files_ref.strip()
                ),
                "packwizFilesRawPrefix": prefix_value,
                "completedAtUtc": datetime.now(timezone.utc).isoformat(timespec="microseconds").replace("+00:00", "Z"),
            }
            write_utf8_no_bom(self.sync_state_path, json.dumps(state, indent=2) + "\n")
        except OSError as exc:
            warn(f"Packwiz sync succeeded, but the duplicate-run state could not be saved: {exc}")

    def collect_metadata_files(self) -> list[Path]:
        files: list[Path] = []
        seen: set[str] = set()
        for root in self.metadata_roots:
            full_root = self.repo_root / root
            if not full_root.exists():
                continue
            for path in full_root.rglob("*"):
                if path.is_file() and path.name.lower().endswith(".pw.toml"):
                    key = str(path.resolve()).casefold()
                    if key in seen:
                        continue
                    seen.add(key)
                    files.append(path)
        files.sort(key=lambda item: str(item).casefold())
        return files

    def run(self) -> int:
        should_sync = True
        if self.args.if_git_changed:
            should_sync = self.test_packwiz_git_changes(
                self.args.old_rev, self.args.new_rev, self.hook_name
            )
            if (not should_sync) and self.args.force and self.sync_new_commit:
                print(
                    f"[{self.hook_name}] Force mode enabled; running Packwiz sync despite Git change detection.",
                    flush=True,
                )
                should_sync = True
        else:
            self.sync_new_commit = resolve_git_commit(self.repo_root, self.args.new_rev)

        if not should_sync:
            if self.crash_assistant_baseline_changed:
                self.reset_crash_assistant_modlist()
            return 0

        self.proxy_config = resolve_proxy_uri(self.proxy_value)
        if self.proxy_config is not None:
            write_status(
                f"Using proxy {self.proxy_config.host}:{self.proxy_config.port} for Packwiz downloads."
            )

        if self.args.dry_run:
            self.reset_crash_assistant_modlist()
            print(f"[{self.hook_name}] Dry run enabled; Packwiz runtime sync was not executed.", flush=True)
            return 0

        script_hash = file_sha256(Path(__file__).resolve())
        sync_state_key = get_sync_state_key(
            self.sync_new_commit,
            self.side,
            self.metadata_roots,
            self.proxy_value,
            self.input_packwiz_files_ref,
            self.input_packwiz_files_raw_prefix,
            self.packwiz_url,
            self.installer_url,
            script_hash,
        )

        try:
            self.lock.acquire()
            if self.args.if_git_changed and not self.args.force and self.test_sync_state_completed(sync_state_key):
                print(
                    f"[{self.hook_name}] Packwiz sync already completed for this revision; skipping duplicate run.",
                    flush=True,
                )
                self.reset_crash_assistant_modlist()
                return 0

            os.chdir(self.repo_root)
            metadata_files = self.collect_metadata_files()
            if not metadata_files:
                write_status("No *.pw.toml files were found. Nothing to sync.")
                return 0

            java_command = resolve_java_command(self.repo_root)
            python_exe = resolve_python_command()
            ensure_tool(self.packwiz_url, self.packwiz_exe, self.proxy_config)
            ensure_tool(self.installer_url, self.installer_jar, self.proxy_config)
            if not is_windows_platform():
                chmod = subprocess.run(["chmod", "+x", str(self.packwiz_exe)])
                if chmod.returncode != 0:
                    raise RuntimeError(
                        f"chmod +x {self.packwiz_exe} exited with code {chmod.returncode}."
                    )

            if self.pack_root.exists():
                shutil.rmtree(self.pack_root)
            self.pack_root.mkdir(parents=True, exist_ok=True)
            packwiz_ignore = self.repo_root / ".packwizignore"
            if packwiz_ignore.exists():
                shutil.copy2(packwiz_ignore, self.pack_root / ".packwizignore")

            generate = subprocess.run(
                [
                    python_exe,
                    str(self.generate_script),
                    "--source",
                    str(self.repo_root / "modpack.toml"),
                    "--output-dir",
                    str(self.pack_root),
                ]
            )
            if generate.returncode != 0:
                raise RuntimeError(f"generate-packwiz-files.py exited with code {generate.returncode}.")

            copied_metadata_paths: list[Path] = []
            for metadata_file in metadata_files:
                relative_path = get_relative_unix_path(self.repo_root, metadata_file)
                destination = self.pack_root / relative_path
                destination.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(metadata_file, destination)
                copied_metadata_paths.append(destination)

            if self.packwiz_files_root.exists():
                shutil.copytree(
                    self.packwiz_files_root,
                    self.pack_root / "packwiz-files",
                    dirs_exist_ok=True,
                )

            port = get_free_port()
            local_prefix = f"http://127.0.0.1:{port}/packwiz-files/"
            self.resolved_raw_prefix = resolve_packwiz_files_raw_prefix(
                self.repo_root,
                self.input_packwiz_files_raw_prefix,
                self.input_packwiz_files_ref,
            )
            for metadata_path in copied_metadata_paths:
                content = metadata_path.read_text(encoding="utf-8")
                if PACKWIZ_FILES_RAW_URL_PATTERN.search(content):
                    write_utf8_no_bom(
                        metadata_path,
                        replace_packwiz_files_raw_urls(content, local_prefix),
                    )

            if self.side != "all":
                write_status(f"Pruning temporary metadata for side: {self.side}")
                prune = subprocess.run(
                    [
                        python_exe,
                        str(self.side_script),
                        "prune-metadata",
                        "--base",
                        str(self.pack_root),
                        "--target",
                        self.side,
                    ]
                )
                if prune.returncode != 0:
                    raise RuntimeError(f"packwiz-side.py prune-metadata exited with code {prune.returncode}.")

            write_status(f"Building temporary packwiz pack from {len(metadata_files)} metadata file(s)...")
            refresh = subprocess.run(
                [str(self.packwiz_exe), "refresh"],
                cwd=self.pack_root,
                env=proxy_env(None, self.proxy_config),
            )
            if refresh.returncode != 0:
                raise RuntimeError(f"packwiz refresh exited with code {refresh.returncode}.")
            index_path = self.pack_root / "index.toml"
            index_text = index_path.read_text(encoding="utf-8") if index_path.is_file() else ""
            if not index_path.is_file() or not re.search(r"^\[\[files\]\]", index_text, re.M):
                raise RuntimeError(f"packwiz refresh produced an empty index ({index_path}).")

            for log_path in (self.serve_log, self.serve_err_log):
                if log_path.exists():
                    log_path.unlink()
            python_exe = resolve_python_command()
            write_status(f"Starting local static server on port {port}...")
            self.serve_stdout = self.serve_log.open("w", encoding="utf-8")
            self.serve_stderr = self.serve_err_log.open("w", encoding="utf-8")
            self.serve_process = subprocess.Popen(
                [python_exe, str(self.static_server_script), str(port), str(self.pack_root)],
                cwd=str(self.pack_root),
                stdout=self.serve_stdout,
                stderr=self.serve_stderr,
                **hidden_popen_kwargs(),
            )

            pack_url = f"http://127.0.0.1:{port}/pack.toml"
            if not wait_for_local_server(pack_url):
                raise RuntimeError(f"Local packwiz server did not start in time. Check {self.serve_err_log}.")

            write_status("Running packwiz-installer...")
            java_arguments = [java_command]
            if self.proxy_config is not None:
                java_arguments.extend(
                    [
                        f"-Dhttp.proxyHost={self.proxy_config.host}",
                        f"-Dhttp.proxyPort={self.proxy_config.port}",
                        f"-Dhttps.proxyHost={self.proxy_config.host}",
                        f"-Dhttps.proxyPort={self.proxy_config.port}",
                        "-Dhttp.nonProxyHosts=localhost|127.*|[::1]",
                        "-Dhttps.nonProxyHosts=localhost|127.*|[::1]",
                    ]
                )
            java_arguments.extend(
                [
                    "-cp",
                    str(self.installer_jar),
                    "link.infra.packwiz.installer.Main",
                    "--bootstrap-no-update",
                    "-g",
                    pack_url,
                ]
            )
            installer = subprocess.run(java_arguments, cwd=self.repo_root)
            if installer.returncode != 0:
                raise RuntimeError(f"packwiz-installer exited with code {installer.returncode}.")

            write_status("Sync finished successfully.")
            self.reset_crash_assistant_modlist()
            self.write_sync_state(sync_state_key)
            return 0
        finally:
            if self.serve_process is not None and self.serve_process.poll() is None:
                self.serve_process.kill()
                try:
                    self.serve_process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    pass
            for handle in (self.serve_stdout, self.serve_stderr):
                if handle is not None:
                    handle.close()
            self.lock.release()


def main(argv: Sequence[str] | None = None) -> int:
    args = parse_args(argv)
    try:
        return PackwizSync(args).run()
    except Exception as exc:  # noqa: BLE001 - match PowerShell script-terminating errors
        print(str(exc), file=sys.stderr, flush=True)
        return 1


if __name__ == "__main__":
    sys.exit(main())
