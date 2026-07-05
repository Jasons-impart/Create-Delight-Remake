# Tips Mod Resources

## Use When
Add or change player-facing rotating tips shown by the Tips mod.

## Approach
Tips are resource-pack data supplied by KubeJS under `kubejs/assets/<namespace>/tips/*.json`. Each JSON file defines one tip component. The current pack uses translation components that point to keys in `kubejs/assets/<namespace>/lang/zh_cn.json`.

`config/tips.json` controls global display behavior such as cycle time, ignored namespaces, render width, and fallback title. It is not the place to add individual tips.

## Reference Implementations
- `kubejs/assets/createdelight/tips/brass.json`
- `kubejs/assets/createdelight/tips/mechanical_crafter_force_crafting.json`
- `kubejs/assets/createdelight/lang/zh_cn.json`
- `config/tips.json`

## Steps
1. Add `kubejs/assets/createdelight/tips/<tip_id>.json`.
2. Set the tip component to `{"translate": "createdelight.tip.<tip_id>"}`.
3. Add the matching `createdelight.tip.<tip_id>` entry to `kubejs/assets/createdelight/lang/zh_cn.json`.
4. Keep the JSON object valid, including commas between language entries.

## Validation
- Parse the changed JSON files.
- Search for the translation key in both the tip file and lang file.

## Notes
- `config/tips.json` currently ignores the `tipsmod` namespace, but not `createdelight`, so `createdelight` tips are eligible to display.
