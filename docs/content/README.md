# Content Knowledge

This directory records what content changes currently exist in the modpack, why they exist, how they are roughly implemented, and where to edit them.

Use one file per gameplay/content area, for example:

- `alex-caves-placement.md`
- `order-system.md`
- `tetra-materials.md`
- `value-and-procurement.md`
- `northstar-progression.md`

## Template

```md
# Content Area

## What Exists
Player-facing content, progression changes, balance changes, integrations, or removed/hidden content currently present in the pack.

## Design Intent
Why the pack changes this content and what player experience or balance goal it serves.

## Implementation
- `path/to/script-or-data`
- `path/to/assets-or-config`

## How It Works
- Concise implementation flow.
- Mention important recipe IDs, tags, loot tables, NBT, config keys, or helper functions.

## Where to Change It
- To adjust X, edit `path`.
- To add Y, follow the nearby pattern in `path`.

## Notes
- Current constraints and cross-system dependencies.
- Put recurring bugs or pitfalls in `docs/lessons-learned.md` instead.
```

## Routing

- Put current modpack content knowledge here.
- Put implementation how-to references in `docs/technical/`.
- Put repeatable command workflows in `.agents/skills/`.
- Put recurring pitfalls in `docs/lessons-learned.md`.
