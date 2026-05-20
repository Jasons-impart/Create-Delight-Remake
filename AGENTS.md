# PROJECT KNOWLEDGE BASE

Create-Delight Remake (齿轮盛宴) - A deep-modded Minecraft 1.20.1 Forge modpack focused on Create + Farmer's Delight with 5000+ custom recipes via KubeJS.

**Core Stack**: Minecraft 1.20.1 | Forge 47.4.10 | KubeJS | Packwiz

> Module-specific details: `kubejs/AGENTS.md`, `CDC-mod-src/AGENTS.md`
> Historical lessons: `lessons-learned.md`
> Skills: `.agents/skills/` (OpenCode + Codex compatible)

## STRUCTURE

```
CD-master-dev/
├── kubejs/           # KubeJS scripts - MAIN DEV AREA (see kubejs/AGENTS.md)
├── CDC-mod-src/      # Custom Java mod (see CDC-mod-src/AGENTS.md)
├── config/           # 50+ mod configs
├── defaultconfigs/   # First-run defaults copied to config/
├── tacz/             # TACZ gun data: armorer packs & gun config
├── hotai/            # HotAI mod data
├── mods/             # Packwiz metadata (*.pw.toml), NOT mod JARs
├── packwiz-files/    # Manually-managed mod JARs (CF-restricted, custom)
├── scripts/          # Utility scripts (sync, update-packwiz-meta)
├── .github/          # CI/CD workflows
└── pack.toml         # Pack metadata (ONLY version source)
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Modify recipes | `kubejs/server_scripts/{Mod}/` | 90+ mod folders, `/kubejs reload` |
| Register items/fluids | `kubejs/startup_scripts/` | Requires game restart |
| Custom textures/models | `kubejs/assets/createdelight/` | Resource pack overlay |
| Custom lang/translations | `kubejs/assets/{namespace}/lang/zh_cn.json` | biome key: `biome.{namespace}.xxx` |
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
| **OEI** | One Enough Item (config: `kubejs/data/oei/replacements/`) |
| **DH** | Distant Horizons |

## CONVENTIONS

**Git Workflow**:
- Branch from `main`: `git checkout main && git pull && git checkout -b feat/xxx`
- Commit format: `[类型] 描述 (#PR号)` - types: `fix`, `feat`, `mod`, `dev`, `conf`
- ❌ Never commit on merged feature branches
- ❌ Never force push to main

**Version Management**:
- Version ONLY in `pack.toml` - CI auto-updates other configs
- Test builds: `test-*` branches → version appended with `-test-build-{n}`
- Releases: `release*` branches

**Mod Management (Packwiz)**:
- `mods/`, `resourcepacks/`, `shaderpacks/` contain only `.pw.toml` metadata, NOT JARs/zip
- CF-restricted/custom JARs/zip live in `packwiz-files/{mods,resourcepacks,shaderpacks}/`
- `.pw.toml` for packwiz-files assets reference GitHub raw URLs pointing to `packwiz-files/`
- To add/update/remove mods: use `scripts/update-packwiz-meta.ps1` (NOT manual JAR placement)
- To sync all mod JARs locally for development: use `scripts/sync-packwiz-assets.ps1`

## ANTI-PATTERNS

- ❌ `rm -rf`, `del /S /Q` on config/, kubejs/, mods/, hotai/, PCL/
- ❌ Batch delete `*.json`, `*.snbt` in core dirs
- ❌ Overwrite `index.toml`, `ModList*.md`
- ❌ `e.remove()` or `e.removeById()` - use `remove_recipes_id(e, [...])`
- ❌ Duplicate version in other files

## COMMANDS

```bash
# Packwiz
packwiz refresh                 # Update index
packwiz curseforge export       # Build modpack

# Update packwiz metadata after manually changing mod JARs
./update-packwiz-meta.bat       # Windows wrapper
./scripts/update-packwiz-meta.ps1 -Proxy "http://127.0.0.1:7890"  # Direct PS1

# Sync all mod JARs locally for development
./scripts/sync-packwiz-assets.ps1

# KubeJS hot reload (in-game)
/kubejs reload server_scripts
/reload                         # Reload tags/loot

# CDC mod build
cd CDC-mod-src && ./gradlew build --no-daemon
# Output: build/libs/CDC-mod-src-*.jar (use non-all version)
```

**发布流程**: Use `/release` skill for version bump, tag, and GitHub release workflow.

## KNOWLEDGE BASE MAINTENANCE

These rules ensure this knowledge base stays effective. Violating them degrades agent performance.

- **Root AGENTS.md ≤150 lines** — If over limit, prune stale entries or move content to subdirectory files
- **Subdirectory AGENTS.md ≤80 lines** — Keep focused on that domain only
- **No duplication** — Each fact exists in exactly ONE file. Others reference it. Duplicate information = conflicting information
- **Concise > verbose** — One sentence per fact. No prose. Agents ignore buried instructions
- **Include the Why** — Non-obvious rules must explain the reason (agents follow rules better when they understand the failure mode)
- **Stale > harmful** — Outdated instructions are worse than no instructions. Update when architecture changes, prune aggressively
- **Iterate, don't upfront** — Add rules only when agent makes a repeated mistake. Remove rules agent always follows correctly
- **Lessons go to `lessons-learned.md`** — Never inline long historical entries in AGENTS.md
- **After fixing a non-obvious bug** — Add entry to `lessons-learned.md` (use `/knowledge-check` skill for guidance)

## NOTES

- **AGENTS.md 是本地开发知识库，已加入 .gitignore，不需要推送到远程仓库**
- **`.agents/skills/` 存放技能文件，OpenCode 和 Codex 都能自动发现**
- `pack.toml` is the ONLY version source - CI auto-updates other configs
- Client-only mods → add to `.clientonlymodlist` (server startup required)
- Server-only mods → add to `.serveronlymodlist`
- Language files validated by `.vscode/probe.lang-schema.json`
