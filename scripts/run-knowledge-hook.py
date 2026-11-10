import argparse
from pathlib import Path
import subprocess
import sys


HOOK_SCRIPTS = {
    "validate-knowledge-base.ps1": "validate-knowledge-base.py",
    "validate-knowledge-base.py": "validate-knowledge-base.py",
    "write-knowledge-candidate-report.ps1": "write-knowledge-candidate-report.py",
    "write-knowledge-candidate-report.py": "write-knowledge-candidate-report.py",
}


def resolve_command(script, root):
    python_script = HOOK_SCRIPTS[script]
    return [sys.executable, str(root / "scripts" / python_script)]


def main():
    parser = argparse.ArgumentParser(description="Run a knowledge hook script.")
    parser.add_argument(
        "script",
        choices=tuple(HOOK_SCRIPTS),
        help="Hook script name. Legacy .ps1 names map to the Python implementations.",
    )
    args = parser.parse_args()
    root = Path(__file__).resolve().parent.parent
    command = resolve_command(args.script, root)
    result = subprocess.run(command, cwd=root, stdout=sys.stderr)
    if result.returncode == 0:
        print("{}")
    return result.returncode


if __name__ == "__main__":
    sys.exit(main())
