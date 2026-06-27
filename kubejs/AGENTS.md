# KUBEJS KNOWLEDGE BASE

KubeJS is the main development area for recipes, tags, custom items, fluids, machine recipes, resource overlays, and datapack overlays.

For cross-module conventions, release notes, and safety rules, see root `AGENTS.md`.

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Add or change recipes | `server_scripts/{ModName}/` |
| Remove recipes | `server_scripts/{ModName}/` with `remove_recipes_id()` when IDs are known |
| Add tags | `server_scripts/{ModName}/tags.js` or relevant integration file |
| Register items/blocks/fluids | `startup_scripts/registry_item.js`, `registry_block.js`, `registry_fluid.js` |
| Register machines | `startup_scripts/registry_machine.js` and `ldlib/assets/mbd2/` |
| Custom prices/values | `startup_scripts/custom/value_data.js` and `server_scripts/One Enough Value/` |
| Selling/procurement logic | `startup_scripts/custom/procurement.js` and `server_scripts/mbd2/sell_bin.js` |
| Custom textures/lang/models | `assets/{namespace}/` |
| OEI item replacements | `data/oei/replacements/` |
| Shared helpers | `server_scripts/util/` and `server_scripts/mbd2_recipes/proxy_recipe/` |

## SEARCH PITFALLS

- KubeJS recipes live in `.js` files under `server_scripts/`; generated recipe JSON usually will not exist in the repo.
- Many mod folder names contain spaces and punctuation, so quote paths in PowerShell.
- Some integrations are split by concern: check both `{Mod}/recipe.js` and `{Mod}/tags.js` when changing item availability.
- Machine behavior may be split between KubeJS scripts and `ldlib/assets/mbd2/` definitions.

## CONVENTIONS

- Use 4-space indentation and readable chained calls; existing files are mixed, so match the edited file when touching nearby code.
- Use lowercase resource locations; uppercase letters in IDs are invalid.
- Prefer `const` and `let`; avoid `var`.
- Strings are normally double quoted unless the surrounding file consistently uses single quotes.
- Keep recipe IDs explicit and meaningful; use `createdelight` namespace for project-defined recipes unless compatibility requires another namespace.
- Use `cutting_2(e, input, outputs)` for knife recipes because it also registers tetra modular knife support.
- Use `centrifugation(e, results, ingredients, processingTime, minimalRPM)` when all centrifuge variants should exist.
- Sequence assembly recipes need conflict checks: recipes sharing the same initial item can conflict when steps match.
- Registry script changes require a game restart; ordinary server recipe changes can usually use `/kubejs reload server_scripts`.

## HELPER FUNCTIONS

`server_scripts/util/recipes.js`:

- `remove_recipes_id`, `remove_recipes_output`, `remove_recipes_input`
- `cutting_2`, `fermenting`, `package_item`, `crushing_ore`, `blast_and_smelting`, `make_cake`

Other helpers: `util/metallurgy.js`, `util/ratatouille.js`, `util/loot.js`, `util/trade.js`, `mbd2_recipes/proxy_recipe/centrifugation.js`.

## VALUE SYSTEM

- Base value data is maintained in `startup_scripts/custom/value_data.js`.
- `DefaultFoodIngredientList` entries use `DefaultFoodIngredientValue` unless overridden.
- Explicit values belong in `MaterialWhitelistValueDict` or `FoodIngredientValueDict`.
- Common ingredients should use the `quality_food:material_whitelist` tag when they should be accepted by value and procurement systems.
- `ValueBlackList` excludes items from value assignment; do not use zero value as a substitute for exclusion.
- Client price tooltip logic is in `client_scripts/tool_tip.js`.

## COMMANDS

```text
/kubejs reload server_scripts
/reload
```
