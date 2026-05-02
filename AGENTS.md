# PROJECT KNOWLEDGE BASE

**Generated:** 2026-04-11T12:00:00+08:00
**Commit:** 5abf1f32
**Branch:** main

## OVERVIEW

Create-Delight Remake (齿轮盛宴) - A deep-modded Minecraft 1.20.1 Forge modpack focused on Create + Farmer's Delight with 5000+ custom recipes via KubeJS.

**Core Stack**: Minecraft 1.20.1 | Forge 47.4.10 | KubeJS | Packwiz

## STRUCTURE

```
CD-master-dev/
├── kubejs/           # KubeJS scripts - MAIN DEV AREA
├── CDC-mod-src/      # Custom Java mod source
├── config/           # 50+ mod configs
├── mods/             # Mod files (managed by Packwiz)
├── .github/          # CI/CD workflows
└── pack.toml         # Pack metadata (ONLY version source)
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Modify recipes | `kubejs/server_scripts/{Mod}/` | 90+ mod folders, hot reload with `/kubejs reload` |
| Register items/fluids | `kubejs/startup_scripts/` | Requires game restart |
| Custom textures/models | `kubejs/assets/createdelight/` | Resource pack overlay |
| Custom lang/translations | `kubejs/assets/{namespace}/lang/zh_cn.json` | Resource pack overlay, biome key: `biome.{namespace}.xxx` |
| Custom loot/functions | `kubejs/data/` | Datapack overlay |
| Mod configs | `config/{mod-name}.toml` | 50+ files |
| FTB Quests | `config/ftbquests/quests/` | .snbt format |
| Java mod dev | `CDC-mod-src/src/main/java/` | Forge mod project |
| Version info | `pack.toml` | ONLY source - don't duplicate |

## GLOSSARY

| Term | Meaning |
|------|--------|
| **CD** | Create-Delight 整合包简称 |
| **CDC** | Create Delight Core (custom Java mod) |
| **SNBT** | FTB 任务配置格式 |
| **分液池** | `create:item_drain` (ItemDrainBlockEntity) |
| **AE2** | Applied Energistics 2 |
| **BCC** | Better Compatibility Checker |
| **OEI** | One Enough Item (物品合并配置在 `kubejs/data/oei/replacements/`) |
| **DH** | Distant Horizons |

## CONVENTIONS

**Recipe Development**:
- Recipe ID namespace: `createdelight`
- Use `cutting_2()` for knife recipes (includes tetra module)
- Use `centrifugation()` for centrifuge recipes (handles 3 variants)
- Delete recipes via `remove_recipes_id(e, [...])` - NOT `e.remove()`
- Tag definitions: `server_scripts/{Mod}/tag.js`

**Git Workflow**:
- Branch from `main`: `git checkout main && git pull && git checkout -b feat/xxx`
- Commit format: `[类型] 描述 (#PR号)` - types: `fix`, `feat`, `mod`, `dev`, `conf`
- ❌ Never commit on merged feature branches
- ❌ Never force push to main

**Version Management**:
- Version ONLY in `pack.toml` - CI auto-updates other configs
- Test builds: `test-*` branches → version appended with `-test-build-{n}`
- Releases: `release*` branches

## ANTI-PATTERNS

**File Operations**:
- ❌ `rm -rf`, `del /S /Q` on config/, kubejs/, mods/, hotai/, PCL/
- ❌ Batch delete `*.json`, `*.snbt` in core dirs
- ❌ Overwrite `index.toml`, `ModList*.md`

**Recipe Deletion**:
- ❌ `e.remove()` or `e.removeById()` - use `remove_recipes_id(e, [...])`
- ❌ Duplicate version in other files

## LESSONS LEARNED

### ItemDrain NPE Fix (2026-03)

**Problem**: `heldItem` null → `heldItem.stack` NPE in `continueProcessing()`

**Wrong Fix**:
```java
if (heldItem == null) {
    processingTicks = 0;
    cir.setReturnValue(false);  // ❌ → continuous processing → skipped levels
}
```

**Correct Fix**:
```java
if (heldItem == null) {
    processingTicks = 0;
    cir.setReturnValue(true);   // ✅ → tick() naturally ends → proper flow
}
```

**Lesson**: Mixin state changes must be consistent - return `true` to let original flow end naturally.

### FTB Quest Description Error (2026-03)

**Problem**: Quest claimed stone mill can grind obsidian - actually unsupported

**Lesson**: Quest descriptions must be verified in-game, don't assume mod features.

## UNIQUE STYLES

**KubeJS Utility Functions** (`kubejs/server_scripts/util/`):
- `remove_recipes_id(e, ids)` - proper recipe removal
- `cutting_2(e, input, outputs)` - knife + tetra module
- `fermenting(e, results, inputs)` - basin + bulk fermenting
- `package_item(e, item, block, n)` - storage block conversion
- `crushing_ore(e, input, output, n, stone)` - ore crushing
- `blast_and_smelting(e, input, output, xp, time)` - dual smelting
- `centrifugation(e, results, inputs, time, rpm)` - in `mbd2_recipes/proxy_recipe/`

## COMMANDS

```bash
# Packwiz (modpack management)
packwiz refresh                 # Update index
packwiz curseforge export       # Build modpack
packwiz curseforge detect       # Generate mod metadata

# KubeJS hot reload (in-game)
/kubejs reload server_scripts   # Reload recipes
/reload                         # Reload tags/loot

# CDC mod build
cd CDC-mod-src && ./gradlew build --no-daemon
# Output: build/libs/CDC-mod-src-*.jar (use non-all version)

# Git workflow
git checkout main && git pull && git checkout -b feat/xxx
```

## RELEASE SOP

### 自动发布流程（推荐）

当用户说"发布新版本"或"发布版本 vX.X.X.X"时，自动执行：

1. **确定当前分支和版本号**
   
   **分支判断**:
   - 当前在 `main` 分支 → tag打到main上，需要PR版本改动
   - 当前在 `release-v047x` 等release分支 → tag直接打到该分支
   
   **版本号处理规则**:
   - 如果用户指定版本号 → 使用指定版本
   - 如果用户只说"发布新版本" → 检查最新commit是否修改了 `pack.toml` 版本
     - 已修改 → 使用当前版本
     - 未修改 → 将版本最后一位数字+1（如 v0.4.7.13 → v0.4.7.14）
   
   ```bash
   # 检查版本是否在最新commit中修改
   git log -1 --name-only | grep pack.toml
   ```

2. **统一发布流程（main和release分支均适用）**
   
   **⚠️ 关键**: 修改版本号的分支合并后，在**被合并到的分支**上打tag，不是在修改版本号的分支上打tag
   
   **流程步骤**:
   1. 创建分支修改 `pack.toml` 版本号（如 `release-vX.X.X.X` 或 `feat/release-xxx`）
   2. 提交版本号修改，推送分支
   3. 创建PR到目标分支（main 或 release-v047x 等）
   4. **等待用户合入PR** ← 这是关键步骤
   5. 合入后，切换到目标分支并拉取最新：
      ```bash
      git checkout main  # 或 git checkout release-v047x
      git pull
      ```
   6. 在目标分支上打tag（此时HEAD就是版本修改的commit）：
      ```bash
      git tag vX.X.X.X
      git push origin vX.X.X.X
      ```
   
   **错误做法**:
   - ❌ 在修改版本号的分支上直接打tag然后推送
   - ❌ 打tag后才合入PR
   
   **正确做法**:
   - ✅ 先合入PR → 再在目标分支上打tag

3. **等待GitHub Actions完成** - workflow: "发布版本"，约3分钟

4. **获取最新workflow run的artifacts列表**
   ```bash
   # 获取最新run-id
   gh run list --limit=1 --json databaseId --jq '.[0].databaseId'
   
   # 获取artifacts列表
   gh api repos/Jasons-impart/Create-Delight-Remake/actions/runs/<run-id>/artifacts --jq '.artifacts[] | select(.name | contains("ClickToUse") | not) | {name: .name, id: .id}'
   ```

5. **下载需要的artifacts**（⚠️ 不要下载ClickToUse文件）
   ```bash
   # 如果下载慢，设置代理
   $env:HTTPS_PROXY='http://127.0.0.1:7890'
   
   # 需要下载的文件（保持原名，不重命名）:
   # - [Client]Create-Delight-Remake-vX.X.X.X
   # - [ClientPatch]Create-Delight-Remake-v.prev-to-vX.X.X.X
   # - Server-Create-Delight-Remake-vX.X.X.X
   # - [ServerPatch]Create-Delight-Remake-v.prev-to-vX.X.X.X
   
   gh api repos/Jasons-impart/Create-Delight-Remake/actions/artifacts/<id>/zip > "<artifact_name>.zip"
   ```

7. **生成更新内容**（根据commit messages整理）
   
   **⚠️ 重要**: 更新内容必须根据当前tag到上一个tag之间的commit messages来总结，不能随意填写
   
   ```bash
   # 获取两个tag之间的commit messages
   git log v上一版本..v当前版本 --pretty=format:'%s' | Where-Object { $_ -notmatch '^v.*发布' }
   ```
   
   **分类整理规则**:
   - `[mod]` 开头 → 模组更新
   - `[feat]` 开头 → 新功能
   - `[fix]` 开头 → Bug修复或配方修复
   - `[quest]` 开头 → 任务相关
   - `[conf]` 开头 → 配置调整
   - 其他不带标签的 → 视内容归类（如翻译更新、配方修改等）
   
   **Revert commits**: 如果有多个连续的Revert commits，可合并为一条说明"回滚xxx相关模组"

8. **创建GitHub Release**
   
   **标题格式**:
   - 正式版: `"vX.X.X.X 正式版"`
   - 测试版: `"vX.X.X.X 测试版"`
   
   ```bash
   # 正式版
   gh release create vX.X.X.X --title "vX.X.X.X 正式版" --notes "## 更新内容
   **模组更新**
   - xxx
   
   **新功能**
   - xxx
   
   **Bug修复**
   - xxx" *.zip
   
   # 测试版
   gh release create vX.X.X.X --title "vX.X.X.X 测试版" --prerelease --notes "## 更新内容
   **模组更新**
   - xxx" *.zip
   
   # 如果已有release需要修改notes
   gh release edit vX.X.X.X --notes "新的更新内容..."
   ```

9. **清理临时文件**

### Artifact 筛选规则

**必须下载**（名称前缀匹配）:
- `[Client]Create-Delight-Remake-v`
- `[ClientPatch]Create-Delight-Remake-v`
- `Server-Create-Delight-Remake-v`
- `[ServerPatch]Create-Delight-Remake-v`

**❌ 不要下载**: 名称包含 `ClickToUse` 的文件

**文件大小参考**: Client ~80MB, Server ~600MB, Patch ~200KB-650KB

**⚠️ GitHub方括号替换**: 上传到Release后，artifact名称中的方括号会被替换为点号（如 `[Client]...` → `Client...`）。这是GitHub的行为，无需处理。

### 手动发布流程

1. Edit `pack.toml` → update `version`
2. Create branch: `release-vX.X.X.X` or `test-release-vX.X.X.X`
3. Push → GitHub Actions auto-builds
4. 手动下载artifacts并创建release

**Pre-release Checklist**:
- [ ] Game starts normally
- [ ] New features work
- [ ] Quest flow intact
- [ ] No crashes/lags

### CDC mod 发布流程

CDC mod 位于 `CDC-mod-src/`，独立仓库: `Jasons-impart/Create-Delight-Core`

1. **切换到main分支并拉取最新**
   ```bash
   cd CDC-mod-src
   git checkout 1.20.1 && git pull
   git checkout -b fix/xxx
   ```

2. **修改代码后构建**
   ```bash
   ./gradlew build --no-daemon
   # Output: build/libs/CDC-mod-src-1.20.1-X.X.X.jar
   ```

3. **更新版本号** - 修改 `gradle.properties` 中的 `mod_version`

4. **提交并推送**
   ```bash
   git add -A && git commit -m "[fix] 描述"
   git push -u origin fix/xxx
   gh pr create --base 1.20.1 --title "[fix] 描述" --body "..."
   ```

5. **合并PR后更新CDR的mods目录**
   ```bash
   # 回到CDR项目
   cd ..
   # 删除旧jar，复制新jar
   Remove-Item mods/Create-Delight-Core-*.jar
   Copy-Item CDC-mod-src/build/libs/CDC-mod-src-*.jar mods/Create-Delight-Core-*.jar
   ```

## TODO TRACKING

| ID | Status | Description |
|----|--------|-------------|
| TODO-002 | ✅ Done | CreateLazyTick ItemDrain optimization re-enabled (commit 28f6f489 #1551) |
| TODO-001 | ✅ Done | ItemDrain NPE fixed (temp: disabled LazyTick optimization) |

**Details**: See `config/createlazytick-common.toml` and CDC Mixin `ItemDrainBlockEntityMixin.java`

## LESSONS LEARNED (2026-04)

### OEI 物品合并配置

**位置**: `kubejs/data/oei/replacements/` 目录下的JSON文件

### Terralith 生物群系翻译 (2026-04)

**发现**: Terralith是纯数据包模组，jar内无lang文件，只修改世界生成数据

**翻译位置**: `kubejs/assets/terralith/lang/zh_cn.json`

**翻译键格式**: `biome.terralith.xxx` (如 `biome.terralith.skylands`)

**教训**: 世界生成模组可能不自带翻译，需通过资源包叠加层添加

**文件结构**:
- `default.json` - 通用物品合并（盐、奶酪、黄瓜等）
- `metal.json` - 金属相关（铜线、钨、锌板等）
- `coin.json` - 硬币合并
- `compress.json` - 储物箱/压缩物品
- `squid.json` - 乌贼相关物品

**配置格式**:
```json
{
  "matchItems": ["mod1:item", "mod2:item"],
  "resultItems": "target_mod:item"
}
```

**注意**: `matchItems`列表中的物品会被合并显示为`resultItems`指定的物品。

### 多流体储罐物品ID变更

**问题**: FTB Quest中多流体储罐任务使用了错误的物品ID

**错误ID**: `fluidlogistics:multi_fluid_tank`
**正确ID**: `createfluidstuffs:multi_fluid_tank`

**修复**: 见 PR #1585

### CreateLazyTick 分液池优化已回滚

**时间线**:
- `c8765538` (#1541) - 禁用分液池优化（解决分液基因种子问题）
- `28f6f489` (#1551) - 更新懒惰刻，重新开启分液池优化

**当前状态**: `config/createlazytick-common.toml` 中 `enable_lazy_item_drain = true`

### PowerShell Heredoc 不可用 (2026-04)

**问题**: 在 PowerShell 中使用 bash heredoc语法 `<<'EOF'` 会导致解析错误

**错误示例**:
```powershell
# ❌ 错误 - PowerShell 不支持 heredoc
gh pr create --body "$(cat <<'EOF'
content here
EOF
)"
```

**正确做法**:
```powershell
# ✅ 正确 - 直接传递字符串，用双引号包裹
gh pr create --body "content here
more content"
```

**注意**: PowerShell 使用 `$env:` 设置环境变量，不支持 `export`；管道语法与 bash 不同。

## NOTES

- **AGENTS.md 是本地开发知识库，已加入 .gitignore，不需要推送到远程仓库**
- `pack.toml` is the ONLY version source - CI auto-updates other configs
- Client-only mods → add to `.clientonlymodlist` (server startup required)
- Server-only mods → add to `.serveronlymodlist`
- Language files validated by `.vscode/probe.lang-schema.json`

### 发布流程注意事项 (2026-04)

1. **PR需要用户确认合入**: 发布版本修改的PR后，必须等待用户手动合入PR， 不能自动合并。 合入后才能打tag.
2. **Release notes 格式**: 
   - 标题格式: 正式版 `"vX.X.X.X 正式版"` 或测试版 `"vX.X.X.X 测试版"`
   - 内容最后添加 `(AI自动生成)` 标注避免误导
   - 提供详细更新内容链接: `https://github.com/.../compare/v上一版本...v当前版本`
   - 不要在release notes里声称 "更新内容" 而应该写成"更新内容"
3. **gh 命令注意事项**: 
   - `gh pr create --body`: PowerShell不支持heredoc， 用双引号包裹多行字符串
   - `gh release create --notes`: 内容很长, 文件名有空格, 超时后用代理
   - `gh release create` 后面的 `*.zip` 通配符会 使用 `*.zip` 模式匹配所有下载的zip文件
   - `gh api .../zip`: 下载大文件可能超时, 设置代理 `$env:HTTPS_PROXY='http://127.0.0.1:7890'`
4. **大文件下载**: Client ~90MB, Server ~314MB, 需要足够超时时间
5. **测试版可能不需要详细更新内容**: 简化release notes, 只保留关键改动