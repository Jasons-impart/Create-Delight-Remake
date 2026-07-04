---
name: dev-knowledge
description: Find, record, and organize Create-Delight Remake development knowledge. Use when handling content-facing implementation notes, implemented feature summaries, code locations, design-document pointers, technical how-to notes, or decisions about whether knowledge belongs in docs, AGENTS, lessons-learned, or a project skill.
---

# Dev Knowledge

Use this skill when the task is about where development knowledge lives, how to find existing implementation context, or how to record new knowledge after a feature or investigation.

## Storage Map

| Knowledge | Target | Use when |
|---|---|---|
| Always-on constraints and routing | `AGENTS.md`, `kubejs/AGENTS.md`, `CDC-mod-src/AGENTS.md` | Agents need the fact in every relevant task. |
| Implemented content changes | `docs/dev-knowledge/content-map.md` | Record what changed in the pack, how it works at a high level, and where the implementation lives. |
| Lightweight technical how-to | `docs/dev-knowledge/how-to-index.md` | Record how to do a type of change when it is useful but not complex enough for a skill. |
| Repeatable or fragile workflow | `.agents/skills/<name>/SKILL.md` | A task needs steps, command order, validation rules, or trigger wording. |
| Historical failure or workaround | `lessons-learned.md` | The main value is avoiding a repeated mistake. |
| Long design rationale | Topic file under `docs/` | A feature needs narrative design, tradeoffs, or future plans. |

## Content Map Entries

Add or update `docs/dev-knowledge/content-map.md` when a feature becomes real enough that future agents should know:

- player-facing change
- rough implementation approach
- primary code/data/config locations
- related design docs
- current status and validation notes

Keep entries short. Link to long design docs instead of copying rationale.

## How-To Entries

Add or update `docs/dev-knowledge/how-to-index.md` when future work will ask "how do I make this kind of change?"

- Keep each entry to a compact checklist.
- Prefer concrete paths and existing helper names.
- Promote the entry into `.agents/skills/<name>/SKILL.md` once it becomes a multi-step workflow with repeated commands or sharp failure modes.

## Update Routine

1. Search `docs/dev-knowledge/`, `AGENTS.md`, relevant module `AGENTS.md`, `.agents/skills/`, and `lessons-learned.md`.
2. Choose the smallest durable target from the storage map.
3. Add one fact in one place; link instead of duplicating.
4. Run `scripts/validate-knowledge-base.ps1` after changing AGENTS, skills, or dev-knowledge indexes.
