# Technical How-To Index

Use this file for compact "how do I make this kind of change?" notes that are project-specific but not large enough to be a skill.

| Goal | Edit locations | Checklist | Validation | Promote to skill when |
|---|---|---|---|---|
| Modify KubeJS recipes | `kubejs/server_scripts/{Mod}/`, helper functions in `kubejs/server_scripts/util/` | Search `.js` recipe scripts, use existing helpers such as `remove_recipes_id`, `cutting_2`, and `centrifugation`, keep recipe ids in `createdelight`. | `/kubejs reload server_scripts`; use `/reload` when tags or loot changed. | The task needs repeated generation, broad migration, or command-heavy validation. |
| Add custom assets or translations | `kubejs/assets/{namespace}/`, language files under `lang/` | Put models/textures/lang under the owning namespace, use biome lang key format `biome.{namespace}.xxx`, keep custom CD assets under `createdelight` when appropriate. | Resource reload or game restart depending on asset type; schema validates language files. | Asset generation or localization workflow becomes repetitive. |
| Add or update modpack assets | `mods/`, `resourcepacks/`, `shaderpacks/`, `packwiz-files/` | Use the `/packwiz-assets` skill; do not hand-maintain generated Packwiz metadata unless repairing output. | `scripts/sync-packwiz-assets.ps1`; inspect `.pw.toml` and `packwiz-files` diff. | Already promoted to `.agents/skills/packwiz-assets/SKILL.md`. |
| Record implemented content knowledge | `docs/dev-knowledge/content-map.md`, topic docs under `docs/` | Add a short row with player-facing change, implementation sketch, primary paths, related docs, and status. | Check links and run `scripts/validate-knowledge-base.ps1` when routing files changed. | The content area needs its own repeated maintenance workflow. |

## Entry Template

| Goal | Edit locations | Checklist | Validation | Promote to skill when |
|---|---|---|---|---|
| `<task>` | `<paths>` | `<steps>` | `<checks>` | `<promotion trigger>` |
