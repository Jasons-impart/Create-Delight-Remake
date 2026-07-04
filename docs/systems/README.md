# System Documentation

This directory stores landed content-system knowledge: what the modpack currently does, why it works that way, roughly how it is implemented, and where to change it.

Use one file per long-lived gameplay or content system, for example:

- `alex-caves-placement.md`
- `order-system.md`
- `tetra-materials.md`
- `value-and-procurement.md`
- `northstar-progression.md`

## Template

```md
# System Name

## Goal
What player-facing or pack-design problem this system solves.

## Current Behavior
What exists in the pack now, from the player's and maintainer's perspective.

## Implementation Locations
- `path/to/file`
- `path/to/other/file`

## Key Mechanics
- Concise mechanism summary.
- Include important data shape, NBT, loot table, tag, or script flow when relevant.

## Change Entry Points
- To add X, edit `path`.
- To rebalance Y, edit `path`.

## Notes
- Non-obvious constraints that are part of the current design.
- Put historical bugs in `docs/lessons-learned.md` instead of here.
```

## Routing

- Put landed content-system summaries here.
- Put speculative or not-yet-implemented plans in `docs/plans/`.
- Put reusable command workflows in `.agents/skills/`.
- Put recurring pitfalls in `docs/lessons-learned.md`.
