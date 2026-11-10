import importlib.util
import io
import json
from pathlib import Path
from types import SimpleNamespace
import unittest
from unittest.mock import patch


SCRIPT = Path(__file__).with_name("run-knowledge-hook.py")
SPEC = importlib.util.spec_from_file_location("knowledge_hook", SCRIPT)
HOOK = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(HOOK)


class KnowledgeHookTests(unittest.TestCase):
    def test_windows_uses_powershell_for_validator(self):
        scenarios = (
            ({"pwsh": "pwsh.exe", "powershell": "powershell.exe"}, "pwsh.exe"),
            ({"powershell": "powershell.exe"}, "powershell.exe"),
        )
        for available, expected in scenarios:
            with self.subTest(expected=expected):
                with patch("sys.argv", ["hook", "validate-knowledge-base.ps1"]), \
                        patch.object(HOOK, "os", SimpleNamespace(name="nt")), \
                        patch.object(HOOK.shutil, "which", side_effect=available.get), \
                        patch.object(HOOK.subprocess, "run", return_value=SimpleNamespace(returncode=7)) as run:
                    self.assertEqual(HOOK.main(), 7)
                    command = run.call_args.args[0]
                    self.assertEqual(command[0], expected)
                    self.assertEqual(Path(command[-1]), SCRIPT.with_name("validate-knowledge-base.ps1"))
                    self.assertEqual(run.call_args.kwargs["cwd"], SCRIPT.parent.parent)
                    self.assertIs(run.call_args.kwargs["stdout"], HOOK.sys.stderr)

    def test_posix_uses_python_validator_even_if_pwsh_exists(self):
        with patch("sys.argv", ["hook", "validate-knowledge-base.ps1"]), \
                patch.object(HOOK, "os", SimpleNamespace(name="posix")), \
                patch.object(HOOK.shutil, "which", return_value="/usr/bin/pwsh"), \
                patch.object(HOOK.subprocess, "run", return_value=SimpleNamespace(returncode=7)) as run:
            self.assertEqual(HOOK.main(), 7)
            command = run.call_args.args[0]
            self.assertEqual(command[0], HOOK.sys.executable)
            self.assertEqual(Path(command[-1]), SCRIPT.with_name("validate-knowledge-base.py"))
            self.assertEqual(run.call_args.kwargs["cwd"], SCRIPT.parent.parent)
            self.assertIs(run.call_args.kwargs["stdout"], HOOK.sys.stderr)

    def test_windows_falls_back_to_python_validator_without_powershell(self):
        with patch("sys.argv", ["hook", "validate-knowledge-base.ps1"]), \
                patch.object(HOOK, "os", SimpleNamespace(name="nt")), \
                patch.object(HOOK.shutil, "which", return_value=None), \
                patch.object(HOOK.subprocess, "run", return_value=SimpleNamespace(returncode=0)) as run:
            self.assertEqual(HOOK.main(), 0)
            command = run.call_args.args[0]
            self.assertEqual(command[0], HOOK.sys.executable)
            self.assertEqual(Path(command[-1]), SCRIPT.with_name("validate-knowledge-base.py"))

    def test_success_returns_stop_hook_json(self):
        with patch("sys.argv", ["hook", "validate-knowledge-base.ps1"]), \
                patch.object(HOOK.shutil, "which", return_value="pwsh"), \
                patch.object(HOOK.subprocess, "run", return_value=SimpleNamespace(returncode=0)), \
                patch("sys.stdout", new_callable=io.StringIO) as stdout:
            self.assertEqual(HOOK.main(), 0)
            self.assertEqual(json.loads(stdout.getvalue()), {})

    def test_missing_interpreter_skips_candidate_report(self):
        with patch("sys.argv", ["hook", "write-knowledge-candidate-report.ps1"]), \
                patch.object(HOOK.shutil, "which", return_value=None), \
                patch.object(HOOK.subprocess, "run") as run, \
                patch("sys.stderr", new_callable=io.StringIO) as stderr, \
                patch("sys.stdout", new_callable=io.StringIO) as stdout:
            self.assertEqual(HOOK.main(), 0)
            self.assertIn("Skipping write-knowledge-candidate-report.ps1", stderr.getvalue())
            self.assertEqual(json.loads(stdout.getvalue()), {})
            run.assert_not_called()

    def test_candidate_report_uses_powershell_when_available(self):
        with patch("sys.argv", ["hook", "write-knowledge-candidate-report.ps1"]), \
                patch.object(HOOK, "os", SimpleNamespace(name="posix")), \
                patch.object(HOOK.shutil, "which", return_value="/usr/bin/pwsh"), \
                patch.object(HOOK.subprocess, "run", return_value=SimpleNamespace(returncode=0)) as run:
            self.assertEqual(HOOK.main(), 0)
            command = run.call_args.args[0]
            self.assertEqual(command[0], "/usr/bin/pwsh")
            self.assertEqual(Path(command[-1]), SCRIPT.with_name("write-knowledge-candidate-report.ps1"))

    def test_invalid_script_is_rejected(self):
        with patch("sys.argv", ["hook", "unrelated.ps1"]), \
                patch("sys.stderr", new_callable=io.StringIO):
            with self.assertRaises(SystemExit) as error:
                HOOK.main()
            self.assertEqual(error.exception.code, 2)

    def test_powershell_scripts_have_utf8_bom(self):
        for name in ("validate-knowledge-base.ps1", "write-knowledge-candidate-report.ps1"):
            with self.subTest(script=name):
                self.assertTrue(SCRIPT.with_name(name).read_bytes().startswith(b"\xef\xbb\xbf"))


if __name__ == "__main__":
    unittest.main()
