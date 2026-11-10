#!/usr/bin/env python3
"""Write a knowledge-candidate report from the working tree and unreported commits."""

from __future__ import annotations

import argparse
from datetime import datetime
import fnmatch
import json
from pathlib import Path
import re
import subprocess
import sys


def format_timestamp(moment: datetime | None = None) -> str:
    current = moment or datetime.now().astimezone()
    tz = current.strftime("%z")
    if len(tz) == 5:
        tz = f"{tz[:3]}:{tz[3:]}"
    return current.strftime("%Y-%m-%d %H:%M:%S ") + tz


def write_utf8(path: Path, lines: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")


def write_json(path: Path, payload: dict) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8", newline="\n")


def ps_eq(left: str, right: str) -> bool:
    return left.casefold() == right.casefold()


def ps_like(value: str, pattern: str) -> bool:
    return fnmatch.fnmatch(value.casefold(), pattern.casefold())


def normalize_path(path: str) -> str:
    return path.replace("\\", "/")


def invoke_git(root: Path, git_args: list[str]) -> list[str]:
    try:
        completed = subprocess.run(
            ["git", "-C", str(root), *git_args],
            check=False,
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,
            text=True,
        )
    except OSError:
        return []
    if completed.returncode != 0:
        return []
    return completed.stdout.splitlines()


def add_unique(items: list[str], value: str) -> None:
    if value.strip() and value not in items:
        items.append(value)


def get_submodule_changed_files(root: Path, relative_path: str) -> list[str]:
    submodule_root = root / relative_path
    if not submodule_root.exists():
        return []
    results: list[str] = []
    for git_args in (
        ["diff", "--name-only"],
        ["diff", "--cached", "--name-only"],
        ["ls-files", "--others", "--exclude-standard"],
    ):
        try:
            completed = subprocess.run(
                ["git", "-C", str(submodule_root), *git_args],
                check=False,
                stdout=subprocess.PIPE,
                stderr=subprocess.DEVNULL,
                text=True,
            )
        except OSError:
            continue
        if completed.returncode != 0:
            continue
        for file in completed.stdout.splitlines():
            if file.strip():
                add_unique(results, f"{relative_path}/{normalize_path(file)}")
    return results


def test_modpack_behavior_change_path(path: str) -> bool:
    normalized = normalize_path(path)
    return (
        bool(
            re.search(
                r"^kubejs/(server_scripts|startup_scripts|client_scripts|config|assets|data)/",
                normalized,
                flags=re.IGNORECASE,
            )
        )
        or bool(re.search(r"^(config|defaultconfigs|hotai)/", normalized, flags=re.IGNORECASE))
        or ps_eq(normalized, "CDC-mod-src")
        or bool(re.search(r"^CDC-mod-src/src/(main|generated)/", normalized, flags=re.IGNORECASE))
    )


def convert_to_target(path: str) -> str:
    normalized = normalize_path(path)
    if ps_eq(normalized, "AGENTS.md"):
        return "AGENTS.md"
    if ps_eq(normalized, "docs/lessons-learned.md"):
        return "docs/lessons-learned.md"
    if ps_like(normalized, ".agents/skills/*"):
        parts = normalized.split("/")
        if len(parts) >= 3 and parts[2].strip():
            return f".agents/skills/{parts[2]}/SKILL.md"
    if ps_eq(normalized, "GettingStarted.md"):
        return "GettingStarted.md"
    if (
        ps_like(normalized, "hotai/*")
        or ps_eq(normalized, "scripts/update-hotai-docs.ps1")
        or ps_eq(normalized, "scripts/update-hotai-docs.py")
        or ps_eq(normalized, "docs/hotai-badiff-details.md")
    ):
        return "docs/dev-knowledge/hotai/badiff-details.md"
    if ps_eq(normalized, "docs/hotai-patch-map.md"):
        return "docs/dev-knowledge/hotai/patch-map.md"
    if ps_like(normalized, "docs/hotai/*"):
        legacy_path = normalized[len("docs/hotai/"):]
        return f"docs/dev-knowledge/hotai/{legacy_path}"
    if ps_like(normalized, "docs/dev-knowledge/*"):
        return normalized
    if ps_eq(normalized, "docs/development.md"):
        return "docs/dev-knowledge/how-to-index.md"
    if ps_like(normalized, "docs/*design*.md") or ps_like(normalized, "docs/*plan.md") or ps_like(normalized, "docs/*strategy.md"):
        return "docs/dev-knowledge/content-map.md"
    if (
        ps_eq(normalized, ".codex/hooks.json")
        or ps_like(normalized, "scripts/*knowledge*")
        or ps_like(normalized, "scripts/add-knowledge-note.ps1")
        or ps_like(normalized, "scripts/resolve-knowledge-candidate.ps1")
    ):
        return ".agents/skills/knowledge-check/SKILL.md"
    if (
        ps_like(normalized, "scripts/sync-packwiz-assets.ps1")
        or ps_like(normalized, "scripts/sync-packwiz-assets.py")
        or ps_like(normalized, "scripts/install-git-hooks.py")
        or ps_like(normalized, "scripts/install-git-hooks.ps1")
        or ps_like(normalized, "scripts/add-packwiz-target.ps1")
        or ps_like(normalized, "scripts/add-packwiz-target.py")
        or ps_like(normalized, "scripts/update-packwiz-meta.ps1")
        or ps_like(normalized, "scripts/update-packwiz-meta.py")
        or ps_like(normalized, "scripts/update-packwiz-target.ps1")
        or ps_like(normalized, "scripts/update-packwiz-target.py")
        or ps_like(normalized, "scripts/update-tacz-packwiz-meta.py")
        or ps_like(normalized, "scripts/update-tacz-packwiz-meta.ps1")
        or ps_like(normalized, "scripts/test-packwiz-files-ref.ps1")
        or ps_like(normalized, "scripts/test-packwiz-files-ref.py")
        or ps_like(normalized, "scripts/packwiz_common.py")
        or ps_like(normalized, "mods/*")
        or ps_like(normalized, "resourcepacks/*")
        or ps_like(normalized, "shaderpacks/*")
        or ps_like(normalized, "tacz/*")
        or ps_like(normalized, "packwiz-files/*")
    ):
        return ".agents/skills/packwiz-assets/SKILL.md"
    if ps_eq(normalized, "modpack.toml"):
        return "AGENTS.md"
    if ps_like(normalized, ".github/workflows/release*") or ps_like(normalized, ".agents/skills/release/*"):
        return ".agents/skills/release/SKILL.md"
    if ps_like(normalized, ".github/*") or ps_like(normalized, "scripts/*"):
        return "AGENTS.md"
    return ""


def convert_to_reason(path: str) -> str:
    normalized = normalize_path(path)
    if ps_like(normalized, ".agents/skills/*"):
        return "Skill instructions changed; verify trigger wording, workflow scope, and AGENTS duplication."
    if ps_eq(normalized, "GettingStarted.md"):
        return "Pre-clone development setup entry changed; keep it self-contained because project skills are unavailable before clone."
    if ps_like(normalized, "hotai/*"):
        return "hotai patch set changed; run python scripts/update-hotai-docs.py and update the manual badiff explanation if behavior changed."
    if (
        ps_like(normalized, "docs/dev-knowledge/hotai/*")
        or ps_like(normalized, "docs/hotai/*")
        or ps_like(normalized, "docs/hotai-*.md")
    ):
        return "hotai development knowledge changed; keep generated status, manual semantics, and domain summary in their assigned files."
    if ps_like(normalized, "docs/dev-knowledge/*"):
        return "Development knowledge index changed; verify entries stay short and point to source files."
    if ps_eq(normalized, "scripts/update-hotai-docs.ps1") or ps_eq(normalized, "scripts/update-hotai-docs.py"):
        return "hotai documentation automation changed; verify validation still checks generated status."
    if ps_eq(normalized, "docs/development.md"):
        return "Development guide changed; check whether a compact how-to entry should be indexed."
    if ps_like(normalized, "docs/*design*.md") or ps_like(normalized, "docs/*plan.md") or ps_like(normalized, "docs/*strategy.md"):
        return "Design or plan doc changed; apply dev-knowledge admission rules before updating content-map. Removal alone does not warrant a new entry."
    if test_modpack_behavior_change_path(normalized):
        return "Path-only candidate: inspect final behavior using dev-knowledge admission rules. Pure removal adds no content-map entry; update an existing stale entry only if needed. Neither ledger may need an update."
    if (
        ps_eq(normalized, ".codex/hooks.json")
        or ps_like(normalized, "scripts/*knowledge*")
        or ps_like(normalized, "scripts/add-knowledge-note.ps1")
        or ps_like(normalized, "scripts/resolve-knowledge-candidate.ps1")
    ):
        return "Knowledge maintenance automation changed; update knowledge-check skill if the prompt or routing changed."
    if (
        ps_like(normalized, "scripts/sync-packwiz-assets.ps1")
        or ps_like(normalized, "scripts/sync-packwiz-assets.py")
        or ps_like(normalized, "scripts/install-git-hooks.py")
        or ps_like(normalized, "scripts/install-git-hooks.ps1")
        or ps_like(normalized, "scripts/add-packwiz-target.ps1")
        or ps_like(normalized, "scripts/add-packwiz-target.py")
        or ps_like(normalized, "scripts/update-packwiz-meta.ps1")
        or ps_like(normalized, "scripts/update-packwiz-meta.py")
        or ps_like(normalized, "scripts/update-packwiz-target.ps1")
        or ps_like(normalized, "scripts/update-packwiz-target.py")
        or ps_like(normalized, "scripts/update-tacz-packwiz-meta.py")
        or ps_like(normalized, "scripts/update-tacz-packwiz-meta.ps1")
        or ps_like(normalized, "scripts/test-packwiz-files-ref.ps1")
        or ps_like(normalized, "scripts/test-packwiz-files-ref.py")
        or ps_like(normalized, "scripts/packwiz_common.py")
    ):
        return "Packwiz asset automation changed; update packwiz-assets skill if the workflow changed."
    if ps_like(normalized, "scripts/*"):
        return "Project automation changed; decide whether this is an always-on AGENTS pointer or a task-specific skill workflow."
    if ps_like(normalized, ".github/*"):
        return "CI/release workflow changed; root knowledge may need an update."
    if (
        ps_like(normalized, "mods/*")
        or ps_like(normalized, "resourcepacks/*")
        or ps_like(normalized, "shaderpacks/*")
        or ps_like(normalized, "tacz/*")
        or ps_like(normalized, "packwiz-files/*")
    ):
        return "Packwiz asset metadata changed; record only reusable workflow changes in packwiz-assets skill."
    if ps_eq(normalized, "modpack.toml"):
        return "Modpack metadata changed; check version rules."
    if ps_like(normalized, "*AGENTS.md") or ps_eq(normalized, "docs/lessons-learned.md"):
        return "Knowledge base changed; run validation and check for duplicate facts."
    return "Changed file may encode a reusable project pattern."


def knowledge_file_paths(root: Path) -> list[str]:
    knowledge_files: list[str] = []
    for file in ("AGENTS.md", "kubejs/AGENTS.md", "CDC-mod-src/AGENTS.md", "docs/lessons-learned.md"):
        add_unique(knowledge_files, file)
    skills_dir = root / ".agents" / "skills"
    if skills_dir.is_dir():
        for skill_file in skills_dir.rglob("SKILL.md"):
            if skill_file.is_file():
                add_unique(knowledge_files, skill_file.resolve().relative_to(root.resolve()).as_posix())
    return knowledge_files


def is_knowledge_file(knowledge_files: list[str], path: str) -> bool:
    normalized = normalize_path(path)
    return any(ps_eq(item, normalized) for item in knowledge_files)


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Write a knowledge-candidate report without editing knowledge files.")
    parser.add_argument("--root", default="", help="Repository root. Defaults to the parent of scripts/.")
    parser.add_argument("--output-path", default="", help="Override report output path.")
    parser.add_argument("--state-path", default="", help="Override last-reported-head state path.")
    parser.add_argument("--notes-path", default="", help="Override process-notes path.")
    parser.add_argument("--decision-path", default="", help="Override decision JSON path.")
    parser.add_argument("--recent-commits", type=int, default=1, help="Fallback commit window when the baseline is missing.")
    return parser.parse_args(argv)


def write_report(
    *,
    root: Path,
    output_path: Path,
    state_path: Path,
    notes_path: Path,
    decision_path: Path,
    recent_commits: int = 1,
    moment: datetime | None = None,
) -> Path:
    dirty_files = invoke_git(root, ["diff", "--name-only"])
    staged_files = invoke_git(root, ["diff", "--cached", "--name-only"])
    untracked_files = invoke_git(root, ["ls-files", "--others", "--exclude-standard"])
    head_rows = invoke_git(root, ["rev-parse", "HEAD"])
    head = head_rows[0] if head_rows else ""

    last_reported_head = ""
    if state_path.is_file():
        try:
            state = json.loads(state_path.read_text(encoding="utf-8-sig"))
            last_reported_head = str(state.get("lastReportedHead") or "")
        except (OSError, json.JSONDecodeError, AttributeError):
            last_reported_head = ""

    recent_files: list[str] = []
    scanned_commits: list[str] = []
    if head:
        last_reported_head_is_ancestor = False
        if last_reported_head.strip():
            ancestor = subprocess.run(
                ["git", "-C", str(root), "merge-base", "--is-ancestor", last_reported_head, head],
                check=False,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
            last_reported_head_is_ancestor = ancestor.returncode == 0
        if last_reported_head_is_ancestor:
            commit_shas = invoke_git(root, ["rev-list", f"{last_reported_head}..{head}"])
        elif recent_commits > 0:
            commit_shas = invoke_git(root, ["rev-list", f"--max-count={recent_commits}", head])
        else:
            commit_shas = []
        for commit in commit_shas:
            scanned_commits.append(commit)
            recent_files.extend(invoke_git(root, ["diff-tree", "--no-commit-id", "--name-only", "-r", commit]))

    all_files: list[str] = []
    submodule_files = get_submodule_changed_files(root, "CDC-mod-src")
    for file in (*dirty_files, *staged_files, *untracked_files, *recent_files, *submodule_files):
        add_unique(all_files, file)

    knowledge_files = knowledge_file_paths(root)
    changed_knowledge: list[str] = []
    targets: list[str] = []
    signals: list[str] = []
    forms: list[str] = []

    for file in all_files:
        if is_knowledge_file(knowledge_files, file):
            add_unique(changed_knowledge, file)

        if test_modpack_behavior_change_path(file):
            targets_for_file = [
                "docs/dev-knowledge/content-map.md",
                "docs/dev-knowledge/compatibility-patches.md",
            ]
        else:
            targets_for_file = [convert_to_target(file)]

        for target in targets_for_file:
            if not target.strip():
                continue
            add_unique(targets, target)
            if ps_like(target, ".agents/skills/*"):
                add_unique(forms, "Skill - procedural workflow, checklist, tool sequence, or task-specific prompt.")
            elif ps_eq(target, "docs/lessons-learned.md"):
                add_unique(forms, "Lesson - historical pitfall, root cause, or non-obvious side effect.")
            elif ps_eq(target, "docs/dev-knowledge/content-map.md"):
                add_unique(forms, "Content map candidate - apply dev-knowledge admission rules; pure removal adds no entry.")
            elif ps_eq(target, "docs/dev-knowledge/compatibility-patches.md"):
                add_unique(forms, "Compatibility candidate - external mod defects or cross-mod incompatibility only; pure removal and ordinary internal fixes do not qualify.")
            elif ps_like(target, "docs/dev-knowledge/hotai/*"):
                add_unique(forms, "Dev knowledge topic - stable hotai reference or generated patch inventory.")
            elif ps_like(target, "docs/dev-knowledge/*"):
                add_unique(forms, "Dev knowledge - content implementation map or lightweight technical how-to index.")
            elif ps_like(target, "*AGENTS.md"):
                add_unique(forms, "AGENTS - always-on constraint, routing pointer, or stable convention.")

        reason = convert_to_reason(file)
        add_unique(signals, f"{file} - {reason}")

    recommendation = "No candidate knowledge update detected."
    has_process_notes = notes_path.exists()
    process_notes = ""
    if has_process_notes:
        process_notes = notes_path.read_text(encoding="utf-8-sig").strip()

    if has_process_notes and process_notes.strip():
        recommendation = "Process notes found; apply dev-knowledge routing, including skills for workflow corrections. Notes do not automatically require a ledger entry."
        add_unique(targets, "docs/lessons-learned.md")
    elif len(all_files) == 0:
        recommendation = "No git changes or recent commit files were found."
    elif len(changed_knowledge) > 0:
        recommendation = "Knowledge files changed; validate structure and avoid duplicate facts."
    elif len(targets) > 0:
        recommendation = "Review whether these changes introduced reusable project-specific knowledge, and route procedural details to skills instead of AGENTS."

    timestamp = format_timestamp(moment)
    output_path.parent.mkdir(parents=True, exist_ok=True)

    decision_status = "none"
    if recommendation not in {
        "No git changes or recent commit files were found.",
        "No candidate knowledge update detected.",
    }:
        decision_status = "pending"
        write_json(
            decision_path,
            {
                "status": "pending",
                "createdAt": timestamp,
                "target": list(targets),
                "recommendation": recommendation,
                "reportPath": str(output_path),
            },
        )

    lines = [
        "# Knowledge Candidate Report",
        "",
        f"- Generated: {timestamp}",
        "- Scope: working tree, index, and unreported recent commits",
    ]
    if scanned_commits:
        for commit in scanned_commits:
            subject_rows = invoke_git(root, ["show", "-s", "--format=%h %s", commit])
            subject = subject_rows[0] if subject_rows else ""
            lines.append(f"- Scanned commit: {subject}")
    lines.extend(
        [
            "- Mode: report only; no knowledge files were edited",
            f"- Decision: {decision_status}",
            "",
            "## Recommendation",
            "",
            recommendation,
            "",
            "## Admission Check",
            "",
            "Targets below are path-based candidates, not admission decisions. Read .agents/skills/dev-knowledge/SKILL.md before editing a ledger. Pure removal or rollback does not add a content-map entry; only correct an existing stale entry when needed. No knowledge update is a valid outcome. Passing structural validation does not prove admission.",
            "",
            "## Suggested Targets",
            "",
        ]
    )
    if not targets:
        lines.append("- none")
    else:
        lines.extend(f"- {target}" for target in targets)
    lines.extend(["", "## Suggested Knowledge Form", ""])
    if not forms:
        lines.append("- none")
    else:
        lines.extend(f"- {form}" for form in forms)
    lines.extend(["", "## Signals", ""])
    if not signals:
        lines.append("- none")
    else:
        lines.extend(f"- {signal}" for signal in signals)
    lines.extend(["", "## Process Notes", ""])
    if not process_notes.strip():
        lines.append("- none")
    else:
        lines.append(process_notes)
    lines.extend(
        [
            "",
            "## Next Step",
            "",
            "If the recommendation is actionable, ask the user to accept it unless the current task explicitly authorized knowledge maintenance.",
            "After applying or rejecting it, run `python scripts/resolve-knowledge-candidate.py --status applied|rejected` to clear temporary notes.",
        ]
    )
    write_utf8(output_path, lines)

    if signals or process_notes.strip():
        archive_dir = output_path.parent / "knowledge-candidate-history"
        archive_dir.mkdir(parents=True, exist_ok=True)
        archive_stamp = (moment or datetime.now().astimezone()).strftime("%Y%m%d-%H%M%S")
        archive_path = archive_dir / f"knowledge-candidate-{archive_stamp}.md"
        write_utf8(archive_path, lines)
        existing_archives = sorted(
            (path for path in archive_dir.glob("knowledge-candidate-*.md") if path.is_file()),
            key=lambda path: path.name,
            reverse=True,
        )
        for stale in existing_archives[50:]:
            stale.unlink(missing_ok=True)

    if head:
        write_json(
            state_path,
            {
                "lastReportedHead": head,
                "lastReportTime": timestamp,
            },
        )

    print(f"Knowledge candidate report written to {output_path.resolve()}")
    if not process_notes.strip():
        print(
            "Reminder: if this task discovered non-obvious knowledge that is not visible in the diff "
            "(dead ends, root causes, constraints), append it with python scripts/add-knowledge-note.py "
            "and re-run this report so it lands in Process Notes."
        )
    return output_path.resolve()


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    root = Path(args.root).resolve() if args.root.strip() else Path(__file__).resolve().parent.parent

    def resolve_override(value: str, default: Path) -> Path:
        if not value.strip():
            return default
        return Path(value)

    output_path = resolve_override(args.output_path, root / "tmp-opencode" / "knowledge-candidate-report.md")
    state_path = resolve_override(args.state_path, root / "tmp-opencode" / "knowledge-candidate-state.json")
    notes_path = resolve_override(args.notes_path, root / "tmp-opencode" / "knowledge-notes.md")
    decision_path = resolve_override(args.decision_path, root / "tmp-opencode" / "knowledge-candidate-decision.json")
    write_report(
        root=root,
        output_path=output_path,
        state_path=state_path,
        notes_path=notes_path,
        decision_path=decision_path,
        recent_commits=args.recent_commits,
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
