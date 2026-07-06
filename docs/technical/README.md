# Technical References

This directory records how to implement specific kinds of changes in this modpack and where to look for working examples.

Use one file per implementation topic, for example:

- `kubejs-recipe-edits.md`
- `ftb-quest-edits.md`
- `tetra-material-edits.md`
- `custom-loot-and-tags.md`
- `resource-overlays.md`
- `worldgen-structure-edits.md`

## Template

```md
# Implementation Topic

## Use When
What kind of requested change this reference helps implement.

## Approach
The project-specific implementation pattern, not generic programming advice.

## Reference Implementations
- `path/to/example`
- `path/to/related/helper`

## Steps
1. Project-specific step.
2. Project-specific check.

## Validation
- Reload command, schema check, game check, or file diff to inspect.

## Notes
- Branch-specific constraints, helper APIs, and edge cases.
```

## Routing

- Put technical how-to references here.
- Put current content behavior and code locations in `docs/content/`.
- Put command-heavy workflows in `.agents/skills/`.
- Put recurring pitfalls in `docs/lessons-learned.md`.
