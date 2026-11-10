import argparse
import os
from pathlib import Path
import shutil
import subprocess
import sys


VALIDATOR_PS1 = "validate-knowledge-base.ps1"
VALIDATOR_PY = "validate-knowledge-base.py"
CANDIDATE_REPORT_PS1 = "write-knowledge-candidate-report.ps1"


def find_powershell():
    executable = shutil.which("pwsh")
    if executable is None and os.name == "nt":
        executable = shutil.which("powershell")
    return executable


def powershell_command(executable, root, script):
    return [
        executable,
        "-NoLogo",
        "-NoProfile",
        "-ExecutionPolicy",
        "Bypass",
        "-File",
        str(root / "scripts" / script),
    ]


def resolve_command(script, root):
    if script == VALIDATOR_PS1:
        if os.name == "nt":
            executable = find_powershell()
            if executable is not None:
                return powershell_command(executable, root, script)
        return [sys.executable, str(root / "scripts" / VALIDATOR_PY)]

    executable = find_powershell()
    if executable is None:
        return None
    return powershell_command(executable, root, script)


def main():
    parser = argparse.ArgumentParser(description="Run a knowledge hook with an OS-appropriate interpreter.")
    parser.add_argument(
        "script",
        choices=(VALIDATOR_PS1, CANDIDATE_REPORT_PS1),
    )
    args = parser.parse_args()
    root = Path(__file__).resolve().parent.parent
    command = resolve_command(args.script, root)
    if command is None:
        print(
            "Skipping write-knowledge-candidate-report.ps1 because PowerShell is not available; "
            "this report is advisory only and will not be generated on this system.",
            file=sys.stderr,
        )
        print("{}")
        return 0

    result = subprocess.run(command, cwd=root, stdout=sys.stderr)
    if result.returncode == 0:
        print("{}")
    return result.returncode


if __name__ == "__main__":
    sys.exit(main())
