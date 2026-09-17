#!/usr/bin/env python3
import importlib.util
import contextlib
import io
import tempfile
import unittest
from unittest.mock import patch
import zipfile
from pathlib import Path


SCRIPT = Path(__file__).with_name("audit_client_bundled_mods.py")
SPEC = importlib.util.spec_from_file_location("audit_client_bundled_mods", SCRIPT)
AUDIT = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(AUDIT)


class ClientBundledModAuditTests(unittest.TestCase):
    def test_cli_logs_inventory_and_both_match_results(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            self.write_mod_jar(root, "allowed.jar", "Allowed Mod", "allowed")
            self.write_mod_jar(root, "blocked.jar", "Blocked Mod", "blocked")
            output = io.StringIO()
            with patch("sys.argv", [str(SCRIPT), "--client-dir", directory]), \
                    patch.object(AUDIT, "read_allowlist", return_value=({"allowed mod"}, 2)), \
                    contextlib.redirect_stdout(output):
                self.assertEqual(AUDIT.main(), 0)
            log = output.getvalue()
            self.assertIn("BUNDLED | overrides/mods/allowed.jar | Allowed Mod | allowed", log)
            self.assertIn("BUNDLED | overrides/mods/blocked.jar | Blocked Mod | blocked", log)
            self.assertIn("APPROVED | overrides/mods/allowed.jar", log)
            self.assertIn("::warning file=overrides/mods/blocked.jar", log)
            self.assertIn("Audit result: UNMATCHED; total=2; approved=1; unmatched=1", log)

    def test_cli_preserves_inventory_when_allowlist_is_unavailable(self):
        with tempfile.TemporaryDirectory() as directory:
            self.write_mod_jar(Path(directory), "allowed.jar", "Allowed Mod", "allowed")
            output = io.StringIO()
            with patch("sys.argv", [str(SCRIPT), "--client-dir", directory]), \
                    patch.object(AUDIT, "read_allowlist", side_effect=OSError("offline")), \
                    contextlib.redirect_stdout(output), contextlib.redirect_stderr(io.StringIO()):
                self.assertEqual(AUDIT.main(), 2)
            self.assertIn("BUNDLED | overrides/mods/allowed.jar", output.getvalue())
            self.assertIn("Audit result: UNVERIFIED", output.getvalue())
            self.assertNotIn("Audit result: PASS", output.getvalue())

    def write_mod_jar(self, root, filename, display_name, mod_id):
        jar = root / "overrides" / "mods" / filename
        jar.parent.mkdir(parents=True, exist_ok=True)
        with zipfile.ZipFile(jar, "w") as archive:
            archive.writestr(
                "META-INF/mods.toml",
                f'[[mods]]\nmodId = "{mod_id}"\ndisplayName = "{display_name}"\n',
            )
        return jar

    def test_audit_uses_mod_display_name_from_client_overrides(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            allowed = self.write_mod_jar(root, "allowed.jar", "Allowed Mod", "allowed")
            blocked = self.write_mod_jar(root, "blocked.jar", "Blocked Mod", "blocked")

            findings = AUDIT.audit(root, {AUDIT.normalize("Allowed Mod")})

            self.assertEqual(findings, [(blocked.resolve(), "Blocked Mod", "blocked")])
            self.assertEqual(AUDIT.bundled_mod_jars(root), [allowed.resolve(), blocked.resolve()])

    def test_xlsx_reader_combines_all_worksheets(self):
        # XLSX files use shared strings; construct the smallest valid two-sheet export.
        with tempfile.TemporaryDirectory() as directory:
            workbook = Path(directory) / "allowlist.xlsx"
            with zipfile.ZipFile(workbook, "w") as archive:
                archive.writestr(
                    "xl/workbook.xml",
                    '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" '
                    'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">'
                    '<sheets><sheet name="A-E" sheetId="1" r:id="rId1"/>'
                    '<sheet name="U-Z" sheetId="2" r:id="rId2"/></sheets></workbook>',
                )
                archive.writestr(
                    "xl/_rels/workbook.xml.rels",
                    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
                    '<Relationship Id="rId1" Target="worksheets/sheet1.xml" Type="x"/>'
                    '<Relationship Id="rId2" Target="worksheets/sheet2.xml" Type="x"/>'
                    '</Relationships>',
                )
                archive.writestr(
                    "xl/sharedStrings.xml",
                    '<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
                    '<si><t>First Mod</t></si><si><t>VVAddon</t></si></sst>',
                )
                for number, string_index in ((1, 0), (2, 1)):
                    archive.writestr(
                        f"xl/worksheets/sheet{number}.xml",
                        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">'
                        f'<sheetData><row r="1"><c r="A1" t="s"><v>{string_index}</v></c></row>'
                        '</sheetData></worksheet>',
                    )

            values, sheet_count = AUDIT.xlsx_cell_texts(workbook.read_bytes())

            self.assertEqual(sheet_count, 2)
            self.assertEqual(values, {"first mod", "vvaddon"})


if __name__ == "__main__":
    unittest.main()
