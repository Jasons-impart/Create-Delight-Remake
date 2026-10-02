import argparse
import os
from pathlib import Path
import shutil
import subprocess
import sys


def main():
    parser = argparse.ArgumentParser(description="Run a knowledge hook with an available PowerShell.")
    parser.add_argument(
        "script",
        choices=("validate-knowledge-base.ps1", "write-knowledge-candidate-report.ps1"),
    )
    args = parser.parse_args()
    executable = shutil.which("pwsh")
    if executable is None and os.name == "nt":
        executable = shutil.which("powershell")
    if executable is None:
        print("Knowledge hook requires PowerShell 7 (pwsh) or Windows PowerShell.", file=sys.stderr)
        return 1

    root = Path(__file__).resolve().parent.parent
    command = [
        executable,
        "-NoLogo",
        "-NoProfile",
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        str(root / "scripts" / args.script),
    ]
    result = subprocess.run(command, cwd=root, stdout=sys.stderr)
    if result.returncode == 0:
        print("{}")
    return result.returncode


if __name__ == "__main__":
    sys.exit(main())
