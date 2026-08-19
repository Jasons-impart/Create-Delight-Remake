# PROJECT KNOWLEDGE BASE

Create-Delight Remake (齿轮盛宴) - A deep-modded Minecraft 1.20.1 Forge modpack focused on Create + Farmer's Delight with 5000+ custom recipes via KubeJS.

**Core Stack**: Minecraft 1.20.1 | Forge 47.4.16 | KubeJS | Packwiz

> Module-specific details: `kubejs/AGENTS.md`, `CDC-mod-src/AGENTS.md`
> Development knowledge: `docs/dev-knowledge/` (use `/dev-knowledge` for routing)
> Historical lessons: `docs/lessons-learned.md`
> Skills: `.agents/skills/` (OpenCode + Codex compatible; procedural workflows live here)
> Skill routing: knowledge storage/design plan/how-to questions → `/dev-knowledge`; after implementation or non-obvious fixes → `/knowledge-check`

## STRUCTURE

```
CD-master-dev/
├── kubejs/           # KubeJS scripts - MAIN DEV AREA (see kubejs/AGENTS.md)
├── CDC-mod-src/      # Create Delight Core git submodule (Java mod source; not packaged)
├── config/           # 50+ mod configs
├── defaultconfigs/   # First-run defaults copied to config/
├── tacz/             # TACZ gun data: armorer packs & gun config
├── hotai/            # hotai mod data
├── mods/             # Packwiz metadata only (*.pw.toml); no tracked JARs
├── packwiz-files/    # Manually-managed mod JARs (CF-restricted, custom)
├── scripts/          # Utility scripts (sync, update-packwiz-meta)
├── .codex/           # Codex project hooks
├── docs/             # Project documentation and analysis notes
├── .github/          # CI/CD workflows
└── modpack.toml      # Pack metadata (ONLY version source)
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
| Java mod dev | `CDC-mod-src/src/main/java/` | Git submodule; commit source changes in Create-Delight-Core |
| Version info | `modpack.toml` | ONLY source - don't duplicate |
| Dev environment setup | `GettingStarted.md` | Self-contained pre-clone bootstrap |
| Release workflow | `.github/workflows/release.yml` | Use `/release` skill |
| Packwiz asset workflow | `mods/`, `packwiz-files/` | Use `/packwiz-assets` skill |
| Minecraft MCP testing/repair | `.agents/skills/minecraft-mcp/SKILL.md` | Use `/minecraft-mcp`; keep source work in `D:\learnmod` |
| Content/how-to knowledge | `docs/dev-knowledge/` | Use `/dev-knowledge` skill |
| Design plans | `docs/plan/` | Use `/dev-knowledge` for routing |
| Knowledge maintenance | `.agents/skills/knowledge-check/SKILL.md` | Use `/knowledge-check` skill |
| Historical pitfalls | `docs/lessons-learned.md` | Do not duplicate in AGENTS |

## GLOSSARY

| Term | Meaning |
|------|--------|
| **CD** | Create-Delight 整合包简称 |
| **CDC** | Create Delight Core (custom Java mod) |
| **SNBT** | FTB 任务配置格式 |
| **分液池** | `create:item_drain` (ItemDrainBlockEntity) |
| **AE2** | Applied Energistics 2 |
| **BCC** | Better Compatibility Checker |
| **OEI** | One Enough Item |
| **DH** | Distant Horizons |

## CONVENTIONS

**Player-facing text**:
- UI、tooltip、JEI、聊天提示、任务和物品说明只描述当前规则、条件、结果和操作；不得展示版本改动、迁移说明、设计理由或开发自述。
- 任务文案优先回答“要做什么、怎么做、会得到什么”；只保留玩家必须识别的物品、方块和规则名，避免使用 Score、闭环、临时缺口、候选小类、市场机会等内部术语或平衡分析。

**Git Workflow**:
- Branch from `main`: `git checkout main && git pull && git checkout -b feat/xxx`
- Run `scripts/install-git-hooks.ps1` after clone to install local `.git/hooks` shims that call tracked `scripts/.githooks`; agents should confirm this before Git update workflows.
- 阅读、检索和核对 GitHub 上的 Issue、PR、评论、提交、Release、Actions 等信息必须使用 `gh` CLI，不要通过浏览器读取；只有用户明确要求浏览器操作时才例外。
- Commit format: `[类型] 描述 (#PR号)` - types: `fix`, `feat`, `mod`, `dev`, `conf`
- Commit messages must include a body; prefer Markdown-style structure in the body, such as short paragraphs, bullet lists, affected scope, and verification notes.
- PR title/body use Chinese by default because reviewers and release notes are Chinese-first.
- For multiline PR bodies from PowerShell, use a here-string or `--body-file`; `\n` is literal and renders broken Markdown on GitHub.
- ❌ Never commit directly on `main`; create a feature branch and merge through PR because remote `main` is protected.
- ❌ Never merge PRs yourself (`gh pr merge`, GitHub web/API merge, or auto-merge). Create PRs and wait for the user to manually merge unless the user explicitly asks you in the current conversation to merge a specific PR.
- ❌ Never commit on merged feature branches
- ❌ Never force push to main

**Version Management**:
- Version ONLY in `modpack.toml` - CI auto-updates other configs
- Test builds: `test-*` branches → version appended with `-test-build-{n}`
- Releases: `release*` branches

**Mod Management (Packwiz)**:
- `mods/`, `resourcepacks/`, `shaderpacks/` contain `.pw.toml` metadata; no `mods/*.jar` files are tracked
- CF-restricted/custom JARs/zip live in `packwiz-files/{mods,resourcepacks,shaderpacks}/`
- For add/update/remove/sync/CDC artifact details, use `.agents/skills/packwiz-assets/SKILL.md` because the workflow is procedural and changes together.
- `scripts/update-packwiz-meta.ps1 -FullReconcile` is category-wide local-asset reconciliation, not the default for one known CurseForge asset; use `scripts/add-packwiz-target.ps1` to add one and `scripts/update-packwiz-target.ps1` to update one.
- Do not run `scripts/update-packwiz-meta.ps1 -FullReconcile` on short-lived feature branches: it may rewrite `packwiz-files` raw URLs to the current branch. Use it on `main` or a long-lived LTS/release-maintenance branch, or explicitly preserve `main` raw URLs.
- After any pull/rebase/merge, compare pre-update target commit..new HEAD; if `mods|resourcepacks|shaderpacks/**/*.pw.toml` or `packwiz-files/**` changed, run `scripts/sync-packwiz-assets.ps1` because runtime JARs are local.
- `pack.toml`/`index.toml` are generated from `modpack.toml`; don't commit them
- `CDC-mod-src/` is a git submodule and must stay out of Packwiz artifacts because packages ship pack files, not Java source trees
- GitHub Pages mod classification data (`docs/mods-data.js`) is expensive to refresh; do not update it during ordinary mod changes unless the user explicitly asks for a manual refresh.

## ANTI-PATTERNS

- ❌ `rm -rf`, `del /S /Q` on config/, kubejs/, mods/, hotai/, PCL/
- ❌ Batch delete `*.json`, `*.snbt` in core dirs
- ❌ Overwrite `ModList*.md`
- ❌ `e.remove()` or `e.removeById()` - use `remove_recipes_id(e, [...])`
- ❌ Duplicate version in other files
- ❌ Treat runtime dirs (`logs/`, `crash-reports/`, `saves/`, `screenshots/`, `simplebackups/`, `tmp-*`) as source

## NOTES

- **AGENTS.local.md 存放个人/机器特有配置，默认忽略，不提交**
- **`.agents/skills/` 存放技能文件，OpenCode 和 Codex 都能自动发现**
- Default client options source is `.options.txt`; release packaging renames it to `options.txt`, so do not rely on ignored runtime `options.txt` for pack defaults.
- Client-only mods → set `side = "client"` in the corresponding `mods/*.pw.toml`
- Server-only mods → set `side = "server"` in the corresponding `mods/*.pw.toml`
- Language files validated by `.vscode/probe.lang-schema.json`
