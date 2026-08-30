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
| Custom loot/functions | `data/{namespace}/`（tag 用 server script，见 CONVENTIONS） |
| OEI replacements | `data/oei/replacements/` |
| Utility functions | `server_scripts/util/` |

## SEARCH PITFALLS

**KubeJS recipes are in `.js` files, NOT `.json` files!**

- ❌ Searching `kubejs/data/**/*.json` → won't find KubeJS recipes
- ✅ Search `kubejs/server_scripts/**/*.js` for recipe definitions
- ✅ Use: `rg "recipe_id" kubejs/server_scripts -g "*.js"`

**Root cause**: KubeJS generates recipes at runtime from JS scripts, unlike vanilla datapacks.

## CONVENTIONS

- Recipe ID namespace: `createdelight`; recipe folders use display names with spaces/apostrophes, so quote paths in shell commands.
- **职责边界**：KubeJS 是内容配置层，仅新增或调整配方、标签、战利品表、简单物品移除/隐藏及其必要的兼容数据；可实现无状态的轻量交互（如单次鼠标右键效果）和纯客户端展示（如 tooltip、JEI 信息），不要在此实现新的游戏机制。
- **CDC 优先**：自定义方块/物品的行为、机器或菜单、能力与持久化状态、命令、网络包、服务端/客户端联动、实体/方块交互、tick 逻辑、渲染和跨模组运行时兼容，默认在 `CDC-mod-src/` 的 Create Delight Core 中实现。KubeJS 只引用 CDC 提供的稳定数据或 API 来配置内容。
- **例外处理**：若上游限制使运行时逻辑暂时不能迁入 CDC，必须在 KubeJS 文件中说明原因并关联跟踪 issue；不要新增无迁移计划的事件处理器、Java 反射桥接或客户端网络逻辑。
- Use `cutting_2()` for knife recipes (includes tetra module)
- Use `centrifugation()` for centrifuge recipes (handles 3 variants)
- Delete recipes via `remove_recipes_id(e, [...])` - NOT `e.remove()` or `e.removeById()`
- 移除物品时，优先使用 `StartupEvents.modifyCreativeTab(...).remove(...)` 从对应创造标签移除；仅该方式不生效时才使用 `JEIEvents.hideItems(...)` 隐藏。使用 OEI 合并后原物品的隐藏（创造标签、JEI event）由 OEI 预期处理，一般无需在 kubejs 手动隐藏。
- 标签改动默认用 server script：物品/流体 tag 的增删写在 `ServerEvents.tags("item"/"fluid", ...)`（按模组放在 `server_scripts/{Mod}/tag.js`）；非必要不要用 `kubejs/data/` 数据包 JSON 写 tag，仅当确需数据包语义（如 `replace: true` 清空上游 tag）时才使用并在提交说明中说明理由。
- Hot reload: `/kubejs reload server_scripts` (in-game); LDLib 的 `event.success(root)` 会用 `EventExit` 正常结束事件，不要包进宽泛的 `try/catch`；物品 UI 回调会在服务端和客户端分别构建组件，玩家 `persistentData` 只在服务端有权威内容，客户端只读状态用 `player.sendData()` 写入本地镜像；LDLib 1.0.50 从 `.ui` 反序列化 `SelectorWidget` 会替换其构造器子组件却不重绑 final 内部引用，应在代码中用原位置和尺寸重建原生 Selector，服务端再校验实际状态；服务端世界时间读取用 `level.time`，脚本层没有暴露 `ServerLevel#getGameTime()`。
- Registry changes require game restart; `ServerEvents.commandRegistry` callback changes require restarting the integrated/dedicated server because `/kubejs reload server_scripts` does not rebuild the Brigadier command tree；KubeJS 的 `CommandSourceStack.sendSuccess` 直接接收 `Component`，传箭头函数会被 Rhino 转成 `ArrowFunction` 聊天文本；当前 KubeJS/Rhino 不接受箭头函数参数对象解构（如 `forEach(({ item }) => ...)`），应在回调体内读取 `food.item` 等属性以避免 `SyntaxError: invalid object initializer`；重复调用的 `e.modify` 回调不要声明 `const`/`let` 局部变量，否则 Rhino 可能报重声明，改用无局部变量的链式调用。
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
- `util/metallurgy.js`, `util/ratatouille.js`, `util/loot.js`, `util/trade.js` - metallurgy, Ratatouille integration, loot tables and villager trades
- `mbd2_recipes/proxy_recipe/centrifugation.js` - Centrifugation helper

## COMMANDS

```bash
# Hot reload (in-game)
/kubejs reload server_scripts   # Reload recipes
/reload                         # Reload tags/loot
```
