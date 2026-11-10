#!/usr/bin/env python3
"""Shared helpers for the packwiz target/TACZ Python tools."""
from __future__ import annotations

import contextlib
import os
import shutil
import stat
import subprocess
import sys
import urllib.request
from collections.abc import Iterator, Sequence
from pathlib import Path


def is_windows_platform() -> bool:
    return sys.platform == "win32" or os.environ.get("OS") == "Windows_NT"


def default_packwiz_filename() -> str:
    return "packwiz.exe" if is_windows_platform() else "packwiz"


def default_packwiz_url() -> str:
    return (
        "https://github.com/Jasons-impart/packwiz/releases/latest/download/"
        + default_packwiz_filename()
    )


def write_utf8_no_bom(path: Path, content: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(content.encode("utf-8"))


def hidden_popen_kwargs() -> dict:
    kwargs: dict = {}
    if sys.platform == "win32":
        kwargs["creationflags"] = getattr(subprocess, "CREATE_NO_WINDOW", 0x08000000)
    return kwargs


@contextlib.contextmanager
def invoke_with_proxy(proxy: str | None) -> Iterator[None]:
    if proxy is None or not str(proxy).strip():
        yield
        return
    keys = ("HTTP_PROXY", "HTTPS_PROXY", "ALL_PROXY")
    old = {key: os.environ.get(key) for key in keys}
    try:
        for key in keys:
            os.environ[key] = proxy
        yield
    finally:
        for key, value in old.items():
            if value is None:
                os.environ.pop(key, None)
            else:
                os.environ[key] = value


def download_file(url: str, destination: Path) -> None:
    request = urllib.request.Request(
        url,
        headers={"User-Agent": "Create-Delight-Remake-packwiz-tools"},
    )
    with urllib.request.urlopen(request) as response, destination.open("wb") as handle:
        shutil.copyfileobj(response, handle)


def ensure_tool(url: str, destination: Path, status_fn, proxy: str | None) -> None:
    if destination.exists():
        return
    destination.parent.mkdir(parents=True, exist_ok=True)
    status_fn(f"Downloading {destination.name}...")
    with invoke_with_proxy(proxy):
        download_file(url, destination)
    if not is_windows_platform():
        mode = destination.stat().st_mode
        destination.chmod(mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)


def is_ms_store_stub(executable: str) -> bool:
    return "/windowsapps/" in executable.replace("\\", "/").lower()


def python_works(command: Sequence[str]) -> bool:
    try:
        result = subprocess.run(
            [*command, "-c", "import sys; raise SystemExit(0 if sys.version_info >= (3, 11) else 1)"],
            capture_output=True,
            text=True,
            encoding="utf-8",
            **hidden_popen_kwargs(),
        )
        return result.returncode == 0
    except OSError:
        return False


def resolve_python_command(preferred: str | None = None) -> str:
    if preferred and Path(preferred).exists() and python_works([preferred]):
        return preferred
    if getattr(sys, "executable", None) and python_works([sys.executable]):
        if not is_ms_store_stub(sys.executable):
            return sys.executable

    python_path = shutil.which("python")
    if python_path and not is_ms_store_stub(python_path) and python_works([python_path]):
        return python_path

    py_path = shutil.which("py")
    if py_path:
        try:
            result = subprocess.run(
                [py_path, "-3", "-c", "import sys; print(sys.executable)"],
                capture_output=True,
                text=True,
                encoding="utf-8",
                **hidden_popen_kwargs(),
            )
            resolved = result.stdout.strip()
            if result.returncode == 0 and resolved and python_works([resolved]):
                return resolved
        except OSError:
            pass

    python3_path = shutil.which("python3")
    if python3_path and not is_ms_store_stub(python3_path) and python_works([python3_path]):
        return python3_path

    raise RuntimeError("Python was not found. Install Python so generate-packwiz-files.py can run.")


def run_hidden(
    command: Sequence[str],
    *,
    cwd: Path | str | None = None,
    capture: bool = False,
    check_message: str | None = None,
    env: dict[str, str] | None = None,
) -> subprocess.CompletedProcess[str]:
    result = subprocess.run(
        list(command),
        cwd=str(cwd) if cwd is not None else None,
        capture_output=capture,
        text=True,
        encoding="utf-8",
        errors="replace",
        env=env,
        **hidden_popen_kwargs(),
    )
    if check_message is not None and result.returncode != 0:
        raise RuntimeError(check_message.format(code=result.returncode))
    return result
