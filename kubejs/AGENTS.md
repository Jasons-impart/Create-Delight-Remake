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
- **例外处理**：若上游限制使运行时逻辑暂时不能迁入 CDC / HotAI，必须在对应 KubeJS 文件中说明原因并关联跟踪 issue，**同时**记入下文「KubeJS 运行时例外表」（原因 + 跟踪 issue + 迁出条件）；不要新增无迁移计划、无例外表条目的事件处理器、Java 反射桥接或客户端网络逻辑。
- **防再犯 / PR 分流检查**（动机：[#2504](https://github.com/Jasons-impart/Create-Delight-Remake/pull/2504) 等曾把巧克力品质继承的 tick / `persistentData` / 跨模运行时逻辑堆进 `server_scripts`，违反上文职责边界）：
  1. **强制分流清单**：触及 tick、事件处理器、NBT / `persistentData`、反射、网络包、跨模组运行时行为 → 默认进 **CDC**（`main`）或 **HotAI**（`release-v050x` 上 CDC 已冻结时）；KubeJS **仅**允许配方、标签、战利品、移除/隐藏、无状态一次性右键、纯客户端 UI。
  2. **禁止「贴着已有 .js 修」当理由**：目标文件已在 `server_scripts` **不等于**新运行时逻辑也该进 KubeJS。新增运行时分支须先走 CDC / HotAI；KubeJS 侧最多留标签、数据补丁或白名单。
  3. **正式例外须可审计**：临时写进 KubeJS 的运行时逻辑，除脚本内注释外必须上表；**无例外表条目的 event / tick 一律不合并**。历史越界不因「已经合过」而自动获得例外资格，应迁出或补表。
  4. **分层默认路径**：`main` → 优先 CDC mixin（对齐既有 Quality Food / CDC 路径）；`release-v050x` → CDC 冻结则走 HotAI，**禁止**用 KubeJS tick「顶替」CDC / HotAI。
  5. **评审口径一句话**：**造/补游戏机制 → 出 KubeJS；配内容 → 才进 KubeJS。**
  6. **敏感 API**：`server_scripts` 中新增 `LevelEvents.tick`、`persistentData`、`Java.loadClass` 等敏感用法时，PR 须附例外表条目，或明确说明属于已批准白名单文件；否则按越界处理。

  **PR 自检（KubeJS 相关）**：
  - [ ] 本次是否只含配方 / 标签 / 战利品 / 移除隐藏 / 无状态右键 / 纯客户端 UI？
  - [ ] 若含 tick / 事件 / 持久状态 / 反射 / 网络 / 跨模运行时：是否已走 CDC（`main`）或 HotAI（`release-v050x`）？
  - [ ] 是否未以「文件已在 `server_scripts`」为由把机制写进 KubeJS？
  - [ ] 临时例外是否已写入「KubeJS 运行时例外表」，并含原因 + 跟踪 issue + 迁出条件？

### KubeJS 运行时例外表

| 路径/范围 | 原因 | 跟踪 issue | 迁出条件 |
|-----------|------|------------|----------|
| （目前无正式条目） | — | — | — |
- Use `cutting_2()` for knife recipes (includes tetra module)
- Use `centrifugation()` for centrifuge recipes (handles 3 variants)
- Delete recipes via `remove_recipes_id(e, [...])` - NOT `e.remove()` or `e.removeById()`
- 移除/隐藏优先级：物品先用 `StartupEvents.modifyCreativeTab(...).remove(...)` 从创造标签移除，不生效才用 `JEIEvents.hideItems(...)`；无物品形态的流体（如 Create `VirtualFluid` 气体：无方块、无桶、无任何 ItemStack）没有创造标签条目，优先加入 `c:hidden_from_recipe_viewers` 流体 tag 隐藏（JEI 官方机制）；运行时动态隐藏才用 `JEIEvents.hideFluids(...)`。使用 OEI 合并后原物品的隐藏（创造标签、JEI event）由 OEI 预期处理，一般无需在 kubejs 手动隐藏。
- 标签改动默认用 server script：物品/流体 tag 的增删写在 `ServerEvents.tags("item"/"fluid", ...)`（按模组放在 `server_scripts/{Mod}/tag.js`）；非必要不要用 `kubejs/data/` 数据包 JSON 写 tag，仅当确需数据包语义（如 `replace: true` 清空上游 tag）时才使用并在提交说明中说明理由。
- Hot reload: `/kubejs reload server_scripts` (in-game); LDLib 的 `event.success(root)` 会用 `EventExit` 正常结束事件，不要包进宽泛的 `try/catch`；物品 UI 回调会在服务端和客户端分别构建组件，玩家 `persistentData` 只在服务端有权威内容，客户端只读状态用 `player.sendData()` 写入本地镜像；LDLib 1.0.50 从 `.ui` 反序列化 `SelectorWidget` 会替换其构造器子组件却不重绑 final 内部引用，应在代码中用原位置和尺寸重建原生 Selector，服务端再校验实际状态；服务端世界时间读取用 `level.time`，脚本层没有暴露 `ServerLevel#getGameTime()`。
- Registry changes require game restart; `ServerEvents.commandRegistry` callback changes require restarting the integrated/dedicated server because `/kubejs reload server_scripts` does not rebuild the Brigadier command tree；KubeJS 的 `CommandSourceStack.sendSuccess` 直接接收 `Component`，传箭头函数会被 Rhino 转成 `ArrowFunction` 聊天文本；当前 KubeJS/Rhino 不接受箭头函数参数对象解构（如 `forEach(({ item }) => ...)`），应在回调体内读取 `food.item` 等属性以避免 `SyntaxError: invalid object initializer`；重复调用的 `e.modify` 回调不要声明 `const`/`let` 局部变量，否则 Rhino 可能报重声明，改用无局部变量的链式调用。
- Startup scripts include a legacy misspelling (`registery_*`); search both `registry` and `registery`.
- KJS `Java.loadClass` facades are per script domain (`CDStartupJavaClasses`, `CDServerJavaClasses`, `CDClientJavaClasses`); startup is not a shared replacement for server/client because each domain has distinct load timing and side safety.
- Business scripts should access facade members directly, e.g. `global.CDServerJavaClasses.$ModularItem`; top-level aliases still share Rhino scope and can redeclare across files.
- Alex's Caves placement is split: magnetic caves (`northstar:moon`), toxic caves (`northstar:venus`), abyssal chasm (`northstar:europa`) and forlorn hollows (`createdelight:lunar_farside`) are direct entries in their dimension `multi_noise` sources; their `../config/alexscaves_biome_generation/*.json` files stay disabled. Alex's Caves only expands the possible-biome list for `minecraft:overworld`, so a non-Overworld generation config can load without making `/locate biome` succeed. Keep each direct entry disjoint from the planet's other cave climate bands; magnetic caves reserve the continuous `continentalness: 0.76..0.78`, `depth: 1.5..2` band. Do not narrow further with another climate axis: that fragments individual cave regions. Only primordial caves and candy cavity remain independent dimensions.

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
