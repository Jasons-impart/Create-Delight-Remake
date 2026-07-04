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

Categories of worth-recording knowledge:
- **Bug/pitfall discovered** → `lessons-learned.md`
- **New convention or pattern** → Relevant `AGENTS.md` (root, `kubejs/`, or `CDC-mod-src/`)
- **New utility function or API** → `kubejs/AGENTS.md` UNIQUE STYLES section
- **Config change with side effects** → `lessons-learned.md` or relevant AGENTS.md
- **Implemented content feature** → `docs/dev-knowledge/content-map.md`
- **Lightweight technical how-to** → `docs/dev-knowledge/how-to-index.md`
- **Multi-step operational workflow** → Existing or new `.agents/skills/<name>/SKILL.md`
- **Skill behavior or routing issue** → The affected `.agents/skills/<name>/SKILL.md`

### Step 2: Choose Knowledge Form

Ask whether the knowledge should be always loaded or only loaded for a task:

- Use `AGENTS.md` for stable, always-on constraints, routing pointers, ownership boundaries, and short conventions.
- Use `docs/dev-knowledge/content-map.md` for content-facing changes: what changed, how it roughly works, and where the implementation lives.
- Use `docs/dev-knowledge/how-to-index.md` for compact project-specific "how do I make this kind of change?" notes.
- Use `lessons-learned.md` for historical pitfalls, root causes, and one-off failures that prevent repeated mistakes.
- Use `.agents/skills/<name>/SKILL.md` for procedural workflows, checklists, tool sequences, release/modpack operations, or prompts that only matter for a specific class of tasks.
- Create a new skill only when the workflow has clear triggers and would otherwise bloat AGENTS or be repeatedly rediscovered.

### Step 3: Choose Target File

| Knowledge Type | Target File | When |
|---------------|-------------|------|
| Cross-module convention | Root `AGENTS.md` | Applies to entire project |
| KubeJS recipe/dev pattern | `kubejs/AGENTS.md` | KubeJS-specific |
| Java mod pattern | `CDC-mod-src/AGENTS.md` | CDC-specific |
| Implemented content feature | `docs/dev-knowledge/content-map.md` | Player-facing behavior, rough implementation, code/data/config locations |
| Lightweight technical how-to | `docs/dev-knowledge/how-to-index.md` | Short checklist for a recurring edit type that is not yet a skill |
| Bug fix / pitfall / history | `lessons-learned.md` | Preventive knowledge |
| New utility function | `kubejs/AGENTS.md` UNIQUE STYLES | Developer reference |
| Development knowledge routing | `.agents/skills/dev-knowledge/SKILL.md` | Storage rules for content maps, how-to notes, AGENTS, lessons, and skills |
| Modpack asset workflow | `.agents/skills/packwiz-assets/SKILL.md` | Add/update/remove/sync mods, resourcepacks, shaderpacks, packwiz-files, or CDC packaged jars |
| Release workflow | `.agents/skills/release/SKILL.md` | Version bump, tag, artifacts, GitHub release |
| Repo update workflow | `.agents/skills/repo-sync/SKILL.md` | Pull, merge, rebase, branch update, submodule or Packwiz sync |
| Knowledge maintenance workflow | `.agents/skills/knowledge-check/SKILL.md` | Candidate routing, trigger timing, prompt behavior |

### Step 4: Write Update

**Rules for updating knowledge base files**:

1. **Be concise** - One sentence per fact. No prose.
2. **Include the Why** - Non-obvious rules MUST explain the reason.
3. **No duplication** - If information exists elsewhere, reference it, don't repeat it.
4. **Keep AGENTS.md ≤150 lines** (root) or ≤80 lines (subdirectory). If over limit, prune stale entries.
5. **Lessons-learned entries**: Include Problem, Fix/Lesson, and date.
6. **Skill entries**: Put trigger-critical wording in YAML `description`; keep the body focused on executable workflow.
7. **Dev-knowledge entries**: Use table rows with paths and links; do not copy long design rationale.

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

## Self-Check (MANDATORY before finalizing any knowledge update)

Before saving any edit to AGENTS.md or lessons-learned.md, verify ALL of these:

1. **Line count** — Root AGENTS.md ≤150? Subdirectory AGENTS.md ≤80? If over, prune FIRST.
2. **No duplication** — Does this information already exist in another knowledge file? If yes, reference instead of repeating.
3. **Concise** — Is each entry one sentence? Can any words be cut without losing meaning?
4. **Why included** — For non-obvious rules, did I explain the failure mode/reason?
5. **Stale check** — Am I adding to a file that contains outdated entries? Flag them for removal.
6. **Skill check** — Is this a workflow/checklist/tool sequence that should be a skill instead of always-loaded AGENTS text?
7. **Right file** — Is this in the correct knowledge file per the routing table above? Cross-module → root, domain-specific → subdirectory, content/how-to → dev-knowledge, historical → lessons-learned, procedural → skill.

If any check fails, fix before saving. This self-check is the primary mechanism ensuring knowledge base quality over time.
