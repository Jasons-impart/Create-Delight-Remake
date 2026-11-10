import importlib.util
import json
from pathlib import Path
import tempfile
import unittest


def load(name):
    path = Path(__file__).with_name(name)
    spec = importlib.util.spec_from_file_location(name.replace(".py", ""), path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


ADD = load("add-knowledge-note.py")
RESOLVE = load("resolve-knowledge-candidate.py")
REPORT = load("write-knowledge-candidate-report.py")


class KnowledgeScriptTests(unittest.TestCase):
    def test_convert_to_target_routes(self):
        self.assertEqual(REPORT.convert_to_target("AGENTS.md"), "AGENTS.md")
        self.assertEqual(REPORT.convert_to_target(".agents/skills/hotai/SKILL.md"), ".agents/skills/hotai/SKILL.md")
        self.assertEqual(REPORT.convert_to_target("scripts/add-knowledge-note.py"), ".agents/skills/knowledge-check/SKILL.md")
        self.assertEqual(REPORT.convert_to_target("scripts/validate-knowledge-base.py"), ".agents/skills/knowledge-check/SKILL.md")
        self.assertEqual(REPORT.convert_to_target("scripts/update-hotai-docs.ps1"), "docs/dev-knowledge/hotai/badiff-details.md")
        self.assertEqual(REPORT.convert_to_target("scripts/update-hotai-docs.py"), "docs/dev-knowledge/hotai/badiff-details.md")
        self.assertEqual(REPORT.convert_to_target("mods/foo.pw.toml"), ".agents/skills/packwiz-assets/SKILL.md")
        self.assertEqual(REPORT.convert_to_target("unknown.bin"), "")

    def test_modpack_paths_use_both_ledgers(self):
        self.assertTrue(REPORT.test_modpack_behavior_change_path("kubejs/server_scripts/Foo/recipe.js"))
        self.assertTrue(REPORT.test_modpack_behavior_change_path("hotai/a/b.badiff"))
        self.assertFalse(REPORT.test_modpack_behavior_change_path("scripts/validate-knowledge-base.py"))

    def test_add_note_appends_expected_fields(self):
        with tempfile.TemporaryDirectory() as tmp:
            notes = Path(tmp) / "notes.md"
            ADD.append_note(
                summary="summary text",
                problem="problem text",
                fix="fix text",
                target="docs/lessons-learned.md",
                notes_path=notes,
            )
            ADD.append_note(summary="second", notes_path=notes)
            text = notes.read_text(encoding="utf-8")
            self.assertIn("- Target: docs/lessons-learned.md\n- Summary: summary text\n- Problem: problem text\n- Fix: fix text\n", text)
            self.assertIn("- Summary: second\n", text)
            self.assertFalse(text.startswith("\ufeff"))
            self.assertTrue(text.endswith("\n"))

    def test_resolve_merges_and_clears_notes(self):
        with tempfile.TemporaryDirectory() as tmp:
            decision = Path(tmp) / "decision.json"
            notes = Path(tmp) / "notes.md"
            decision.write_text(json.dumps({"status": "pending", "extra": 1, "createdAt": "old"}), encoding="utf-8")
            notes.write_text("keep or clear\n", encoding="utf-8")
            RESOLVE.resolve_candidate(status="applied", reason="done", decision_path=decision, notes_path=notes)
            payload = json.loads(decision.read_text(encoding="utf-8"))
            self.assertEqual(payload["status"], "applied")
            self.assertEqual(payload["reason"], "done")
            self.assertEqual(payload["extra"], 1)
            self.assertEqual(payload["createdAt"], "old")
            self.assertIn("decidedAt", payload)
            self.assertFalse(notes.exists())

    def test_resolve_accepted_keeps_notes(self):
        with tempfile.TemporaryDirectory() as tmp:
            decision = Path(tmp) / "decision.json"
            notes = Path(tmp) / "notes.md"
            notes.write_text("stay\n", encoding="utf-8")
            RESOLVE.resolve_candidate(status="accepted", reason="", decision_path=decision, notes_path=notes)
            self.assertTrue(notes.exists())
            self.assertEqual(json.loads(decision.read_text(encoding="utf-8"))["status"], "accepted")


if __name__ == "__main__":
    unittest.main()
