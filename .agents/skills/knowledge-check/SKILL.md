---
name: knowledge-check
description: Guides structured knowledge base updates after implementation work
---

# Knowledge Check Skill

Guides the agent through structured knowledge base updates after completing implementation work.

## When to Use

Invoke this skill (via `/knowledge-check`) when:
- You just completed a code change, bug fix, or configuration update
- You discovered a non-obvious project pattern, pitfall, or constraint
- You corrected a mistake that could recur in future sessions

Do NOT invoke for:
- Pure research/exploration tasks with no code changes
- Trivial changes that follow well-documented patterns
- General knowledge not specific to THIS project

## Process

### Step 1: Assess Significance

Ask: "Did I learn anything new about THIS PROJECT that future sessions would benefit from?"

If `tmp-opencode/knowledge-candidate-report.md` exists, read it before deciding; process notes require user acceptance unless the current task explicitly asked to maintain the knowledge base.

Codex Stop hooks run `scripts/validate-knowledge-base.ps1` and write `tmp-opencode/knowledge-candidate-report.md`; the report is advisory and never edits knowledge files.

When a task hits a non-obvious failure or workaround before the final knowledge decision, append a temporary note with `scripts/add-knowledge-note.ps1` so the candidate report can route it here.

Worth-recording knowledge usually falls into one of these groups:
- **Reusable project fact or location** → Route using the Storage Map in `.agents/skills/dev-knowledge/SKILL.md`
- **Bug/pitfall discovered** → Prefer `lessons-learned.md`
- **Knowledge routing or skill behavior changed** → Update the affected skill
- **No reusable project-specific value** → Do not record

### Step 2: Choose Knowledge Form

Read `.agents/skills/dev-knowledge/SKILL.md` and use its Storage Map as the source of truth for where knowledge belongs.

### Step 3: Choose Target File

After applying the dev-knowledge Storage Map, check these overrides:

- Bug fix, root cause, or non-obvious workaround → `lessons-learned.md`
- New KubeJS helper/API reference → `kubejs/AGENTS.md` UNIQUE STYLES if it is short; otherwise a dev-knowledge how-to or skill
- Knowledge-check prompt, candidate routing, or trigger timing → `.agents/skills/knowledge-check/SKILL.md`
- Dev-knowledge storage rules → `.agents/skills/dev-knowledge/SKILL.md`

### Step 4: Write Update

**Rules for updating knowledge base files**:

1. **Be concise** - One sentence per fact. No prose.
2. **Include the Why** - Non-obvious rules MUST explain the reason.
3. **No duplication** - If information exists elsewhere, reference it, don't repeat it.
4. **Keep AGENTS.md ≤150 lines** (root) or ≤80 lines (subdirectory). If over limit, prune stale entries.
5. **Lessons-learned entries**: Include Problem, Fix/Lesson, and date.
6. **Skill entries**: Put trigger-critical wording in YAML `description`; keep the body focused on executable workflow.
7. **Dev-knowledge entries**: Use table rows with paths and links; do not copy long design rationale.
8. **Iterate, don't upfront**: Add rules only after a recurring mistake or concrete discovery; remove rules agents already follow reliably.

**ALLOWED actions** (knowledge update only):
- ✅ Edit `AGENTS.md` files (root, `kubejs/`, `CDC-mod-src/`)
- ✅ Edit `lessons-learned.md`
- ✅ Edit `docs/dev-knowledge/`
- ✅ Edit `.agents/skills/` or `.opencode/plugins/`

**NOT ALLOWED** (when invoked as knowledge check):
- ❌ Modifying code, recipes, configs unrelated to knowledge files
- ❌ Running build/test commands
- ❌ Git operations

### Step 5: Output Summary

If applying or rejecting a candidate report, run `scripts/resolve-knowledge-candidate.ps1 -Status applied|rejected` after the decision so temporary process notes do not repeat.

Output this block at the end:

```
📝 Knowledge Check
- Learned: [1-3 items or "nothing significant"]
- Updated: [file path or "no update needed"]
- Reason: [one sentence]
```

If nothing significant was learned, output ONLY: `📝 Knowledge: no update needed`

## Anti-Patterns

- ❌ Recording general programming knowledge (not project-specific)
- ❌ Duplicating information across multiple AGENTS.md files
- ❌ Adding entries without pruning when files exceed line limits
- ❌ Writing verbose prose instead of concise bullet points
- ❌ Keeping knowledge-maintenance rules in root AGENTS instead of this skill

## Self-Check (MANDATORY before finalizing any knowledge update)

Before saving any edit to AGENTS.md or lessons-learned.md, verify ALL of these:

1. **Line count** — Root AGENTS.md ≤150? Subdirectory AGENTS.md ≤80? If over, prune FIRST.
2. **No duplication** — Does this information already exist in another knowledge file? If yes, reference instead of repeating.
3. **Concise** — Is each entry one sentence? Can any words be cut without losing meaning?
4. **Why included** — For non-obvious rules, did I explain the failure mode/reason?
5. **Stale check** — Am I adding to a file that contains outdated entries? Flag them for removal.
6. **Skill check** — Is this a workflow/checklist/tool sequence that should be a skill instead of always-loaded AGENTS text?
7. **Right file** — Does the target match the dev-knowledge Storage Map plus the overrides in this skill?

If any check fails, fix before saving. This self-check is the primary mechanism ensuring knowledge base quality over time.
