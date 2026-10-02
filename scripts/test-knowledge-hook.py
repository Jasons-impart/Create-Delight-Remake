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
    def test_interpreter_selection_and_exit_code(self):
        scenarios = (
            ("nt", {"pwsh": "pwsh.exe", "powershell": "powershell.exe"}, "pwsh.exe"),
            ("nt", {"powershell": "powershell.exe"}, "powershell.exe"),
            ("posix", {"pwsh": "/usr/bin/pwsh"}, "/usr/bin/pwsh"),
        )
        for platform, available, expected in scenarios:
            with self.subTest(platform=platform, expected=expected):
                with patch("sys.argv", ["hook", "validate-knowledge-base.ps1"]), \
                        patch.object(HOOK, "os", SimpleNamespace(name=platform)), \
                        patch.object(HOOK.shutil, "which", side_effect=available.get), \
                        patch.object(HOOK.subprocess, "run", return_value=SimpleNamespace(returncode=7)) as run:
                    self.assertEqual(HOOK.main(), 7)
                    command = run.call_args.args[0]
                    self.assertEqual(command[0], expected)
                    self.assertEqual(Path(command[-1]), SCRIPT.with_name("validate-knowledge-base.ps1"))
                    self.assertEqual(run.call_args.kwargs["cwd"], SCRIPT.parent.parent)
                    self.assertIs(run.call_args.kwargs["stdout"], HOOK.sys.stderr)

    def test_success_returns_stop_hook_json(self):
        with patch("sys.argv", ["hook", "validate-knowledge-base.ps1"]), \
                patch.object(HOOK.shutil, "which", return_value="pwsh"), \
                patch.object(HOOK.subprocess, "run", return_value=SimpleNamespace(returncode=0)), \
                patch("sys.stdout", new_callable=io.StringIO) as stdout:
            self.assertEqual(HOOK.main(), 0)
            self.assertEqual(json.loads(stdout.getvalue()), {})

    def test_missing_interpreter_fails_without_running(self):
        with patch("sys.argv", ["hook", "write-knowledge-candidate-report.ps1"]), \
                patch.object(HOOK.shutil, "which", return_value=None), \
                patch.object(HOOK.subprocess, "run") as run, \
                patch("sys.stderr", new_callable=io.StringIO) as stderr:
            self.assertEqual(HOOK.main(), 1)
            self.assertIn("requires PowerShell", stderr.getvalue())
            run.assert_not_called()

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
