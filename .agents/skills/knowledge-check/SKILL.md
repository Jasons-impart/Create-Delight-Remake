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

### Step 2: Choose Target File

| Knowledge Type | Target File | When |
|---------------|-------------|------|
| Cross-module convention | Root `AGENTS.md` | Applies to entire project |
| KubeJS recipe/dev pattern | `kubejs/AGENTS.md` | KubeJS-specific |
| Java mod pattern | `CDC-mod-src/AGENTS.md` | CDC-specific |
| Bug fix / pitfall / history | `lessons-learned.md` | Preventive knowledge |
| New utility function | `kubejs/AGENTS.md` UNIQUE STYLES | Developer reference |

### Step 3: Write Update

**Rules for updating knowledge base files**:

1. **Be concise** - One sentence per fact. No prose.
2. **Include the Why** - Non-obvious rules MUST explain the reason.
3. **No duplication** - If information exists elsewhere, reference it, don't repeat it.
4. **Keep AGENTS.md ≤150 lines** (root) or ≤80 lines (subdirectory). If over limit, prune stale entries.
5. **Lessons-learned entries**: Include Problem, Fix/Lesson, and date.

**ALLOWED actions** (knowledge update only):
- ✅ Edit `AGENTS.md` files (root, `kubejs/`, `CDC-mod-src/`)
- ✅ Edit `lessons-learned.md`
- ✅ Edit `.agents/skills/` or `.opencode/plugins/`

**NOT ALLOWED** (when invoked as knowledge check):
- ❌ Modifying code, recipes, configs unrelated to knowledge files
- ❌ Running build/test commands
- ❌ Git operations

### Step 4: Output Summary

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
6. **Right file** — Is this in the correct knowledge file per the routing table above? Cross-module → root, domain-specific → subdirectory, historical → lessons-learned.

If any check fails, fix before saving. This self-check is the primary mechanism ensuring knowledge base quality over time.
