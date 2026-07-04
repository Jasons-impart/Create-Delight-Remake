# Development Knowledge Index

This directory is the stable entry point for project-specific development knowledge that is useful but too detailed for always-loaded `AGENTS.md`.

## Storage Rules

| Knowledge | File |
|---|---|
| Implemented content changes, player-facing behavior, rough implementation, and code locations | `docs/dev-knowledge/content-map.md` |
| Technical "how do I make this kind of change?" notes that are not yet full workflows | `docs/dev-knowledge/how-to-index.md` |
| Long design rationale, plans, and tradeoffs | Topic documents in `docs/` |
| Repeatable command-heavy or failure-prone workflows | `.agents/skills/<name>/SKILL.md` |
| Short always-on constraints and routing pointers | `AGENTS.md` or module `AGENTS.md` |
| Historical pitfalls and root causes | `lessons-learned.md` |

## Entry Rules

- Record content facts as "what changed, how it works, where it lives, status".
- Record how-to facts as "goal, edit locations, checklist, validation".
- Prefer links to long docs over copying paragraphs.
- Promote a how-to into a skill when command order, validation, or trigger wording matters.
