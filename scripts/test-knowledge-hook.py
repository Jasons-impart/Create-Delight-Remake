import importlib.util
import io
import json
from pathlib import Path
import unittest
from unittest.mock import patch


SCRIPT = Path(__file__).with_name("run-knowledge-hook.py")
SPEC = importlib.util.spec_from_file_location("knowledge_hook", SCRIPT)
HOOK = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(HOOK)


class KnowledgeHookTests(unittest.TestCase):
    def test_legacy_and_python_names_run_python_scripts(self):
        scenarios = (
            ("validate-knowledge-base.ps1", "validate-knowledge-base.py"),
            ("validate-knowledge-base.py", "validate-knowledge-base.py"),
            ("write-knowledge-candidate-report.ps1", "write-knowledge-candidate-report.py"),
            ("write-knowledge-candidate-report.py", "write-knowledge-candidate-report.py"),
        )
        for requested, expected in scenarios:
            with self.subTest(requested=requested):
                with patch("sys.argv", ["hook", requested]), \
                        patch.object(HOOK.subprocess, "run", return_value=type("R", (), {"returncode": 7})()) as run:
                    self.assertEqual(HOOK.main(), 7)
                    command = run.call_args.args[0]
                    self.assertEqual(command[0], HOOK.sys.executable)
                    self.assertEqual(Path(command[-1]), SCRIPT.with_name(expected))
                    self.assertEqual(run.call_args.kwargs["cwd"], SCRIPT.parent.parent)
                    self.assertIs(run.call_args.kwargs["stdout"], HOOK.sys.stderr)

    def test_success_returns_stop_hook_json(self):
        with patch("sys.argv", ["hook", "validate-knowledge-base.py"]), \
                patch.object(HOOK.subprocess, "run", return_value=type("R", (), {"returncode": 0})()), \
                patch("sys.stdout", new_callable=io.StringIO) as stdout:
            self.assertEqual(HOOK.main(), 0)
            self.assertEqual(json.loads(stdout.getvalue()), {})

    def test_invalid_script_is_rejected(self):
        with patch("sys.argv", ["hook", "unrelated.ps1"]), \
                patch("sys.stderr", new_callable=io.StringIO):
            with self.assertRaises(SystemExit) as error:
                HOOK.main()
            self.assertEqual(error.exception.code, 2)


if __name__ == "__main__":
    unittest.main()
