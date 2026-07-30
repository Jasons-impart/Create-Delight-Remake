# KUBEJS - Create-Delight Remake

Main development area. 5000+ custom recipes, custom items, fluids, and machines.
For cross-module conventions, see root `AGENTS.md`.

## STRUCTURE

```
server_scripts/     # Recipe definitions (90+ mod folders)
startup_scripts/    # Registry: items, blocks, fluids, machines
assets/             # Resource pack overlay (textures, models, lang)
data/               # Datapack overlay (loot, functions, tags)
client_scripts/     # Client-side logic
config/             # KubeJS config files
```

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Add/modify recipes | `server_scripts/{ModName}/` (e.g., `Create/`, `Farmer Delight/`) |
| Register items/blocks/fluids | `startup_scripts/registry_*.js` |
| Custom textures/models | `assets/createdelight/` |
| Custom loot/tags/functions | `data/{namespace}/` |
| OEI replacements | `data/oei/replacements/` |
| Utility functions | `server_scripts/util/` |

## SEARCH PITFALLS

**KubeJS recipes are in `.js` files, NOT `.json` files!**

- ❌ Searching `kubejs/data/**/*.json` → won't find KubeJS recipes
- ✅ Search `kubejs/server_scripts/**/*.js` for recipe definitions
- ✅ Use: `rg "recipe_id" kubejs/server_scripts -g "*.js"`

**Root cause**: KubeJS generates recipes at runtime from JS scripts, unlike vanilla datapacks.

## CONVENTIONS

- Recipe ID namespace: `createdelight`
- Recipe folders use display names with spaces/apostrophes; quote paths in shell commands.
- Use `cutting_2()` for knife recipes (includes tetra module)
- Use `centrifugation()` for centrifuge recipes (handles 3 variants)
- Delete recipes via `remove_recipes_id(e, [...])` - NOT `e.remove()` or `e.removeById()`
- Tag definitions: `server_scripts/{Mod}/tag.js`
- Hot reload: `/kubejs reload server_scripts` (in-game); LDLib 的 `event.success(root)` 会用 `EventExit` 正常结束事件，不要包进宽泛的 `try/catch`；物品 UI 回调会在服务端和客户端分别构建组件，玩家 `persistentData` 只在服务端有权威内容，客户端只读状态用 `player.sendData()` 写入本地镜像；LDLib 1.0.50 从 `.ui` 反序列化 `SelectorWidget` 会替换其构造器子组件却不重绑 final 内部引用，应在代码中用原位置和尺寸重建原生 Selector，服务端再校验实际状态。
- Registry changes require game restart
- Startup scripts include a legacy misspelling (`registery_*`); search both `registry` and `registery`.
- KJS `Java.loadClass` facades are per script domain (`CDStartupJavaClasses`, `CDServerJavaClasses`, `CDClientJavaClasses`); startup is not a shared replacement for server/client because each domain has distinct load timing and side safety.
- Business scripts should access facade members directly, e.g. `global.CDServerJavaClasses.$ModularItem`; top-level aliases still share Rhino scope and can redeclare across files.
- Alex's Caves placement is split: magnetic caves are in `data/northstar/dimension/moon.json`, toxic caves are in `data/northstar/dimension/venus.json`, abyssal chasm is in `data/northstar/dimension/europa.json`, forlorn hollows is in `data/createdelight/dimension/lunar_farside.json`; only primordial caves and candy cavity remain independent dimensions, and `../config/alexscaves_biome_generation/*.json` is disabled so do not infer placement from it.

## UNIQUE STYLES

**Utility Functions** (`server_scripts/util/recipes.js`):

- `remove_recipes_id(e, ids)` - Remove recipes by ID array
- `remove_recipes_output(e, items)` - Remove by output
- `remove_recipes_input(e, items)` - Remove by input
- `cutting_2(e, input, outputs)` - Knife recipe + tetra module
- `fermenting(e, results, inputs, time, heat)` - Basin + bulk fermenting
- `package_item(e, item, block, n)` - Storage block compression
- `crushing_ore(e, input, output, n, stone)` - Ore crushing with chances
- `blast_and_smelting(e, input, output, xp, time)` - Dual furnace recipes
- `make_cake(e, input, output)` - Cake deploying recipe

**Other Utils**:
- `util/metallurgy.js` - Metallurgy helpers
- `util/ratatouille.js` - Ratatouille integration
- `util/loot.js` - Loot table utilities
- `util/trade.js` - Villager trade modifications
- `mbd2_recipes/proxy_recipe/centrifugation.js` - Centrifugation helper

## COMMANDS

```bash
# Hot reload (in-game)
/kubejs reload server_scripts   # Reload recipes
/reload                         # Reload tags/loot
```
