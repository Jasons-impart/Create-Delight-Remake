# PROJECT KNOWLEDGE BASE

Create-Delight Remake (齿轮盛宴) is a deep-modded Minecraft 1.20.1 Forge modpack focused on Create, Farmer's Delight, exploration, food systems, and KubeJS-driven progression.

**Core Stack**: Minecraft 1.20.1 | Forge 47.4.10 | KubeJS | Packwiz

> KubeJS details: `kubejs/AGENTS.md`
> Historical lessons: `docs/lessons-learned.md`
> Developer notes: `DevGuide.md`
> OpenCode skills: `.opencode/skills/release/`, `.opencode/skills/knowledge-check/`

## STRUCTURE

```
CD-master-dev-048x/
├── kubejs/           # KubeJS scripts, assets, datapack overlay, ProbeJS data
├── config/           # Runtime mod configs
├── defaultconfigs/   # First-run server/client defaults
├── docs/             # Project notes, announcements, update summaries, lessons
├── tacz/             # TACZ gunpacks and gun data
├── hotai/            # HotAI patch data
├── ldlib/            # Multiblocked/LDLib assets and machine definitions
├── mods/             # Mod jars managed by packwiz/release process
├── resourcepacks/    # Bundled resource packs
├── shaderpacks/      # Bundled shader packs
├── .github/          # Release workflows and helper scripts
├── pack.toml         # Pack metadata and only version source
└── index.toml        # Packwiz generated index
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Modify recipes | `kubejs/server_scripts/{Mod}/` | KubeJS JS files, not generated JSON |
| Register items/blocks/fluids | `kubejs/startup_scripts/registry_*.js` | Registry changes require game restart |
| Custom textures/models | `kubejs/assets/` | Resource pack overlay |
| Custom lang/translations | `kubejs/assets/{namespace}/lang/zh_cn.json` | Biome key format: `biome.{namespace}.xxx` |
| Custom loot/functions/tags | `kubejs/data/` | Datapack overlay |
| MBD2 machines/recipes | `ldlib/assets/mbd2/` and `kubejs/server_scripts/mbd2*` | Check both data and scripts |
| FTB Quests | `config/ftbquests/quests/` | SNBT format |
| Runtime configs | `config/` | User-facing current config |
| New-world defaults | `defaultconfigs/` | Copied by Minecraft/mods on first run |
| Version info | `pack.toml` | Do not duplicate version elsewhere |

## GLOSSARY

| Term | Meaning |
|------|---------|
| **CD/CDR** | Create-Delight Remake / 齿轮盛宴 |
| **SNBT** | FTB Quests config format |
| **AE2** | Applied Energistics 2 |
| **OEI** | One Enough Item, replacement configs in `kubejs/data/oei/replacements/` |
| **OEV** | One Enough Value, value scripts in `kubejs/server_scripts/One Enough Value/` |
| **MBD2** | Multiblocked 2, custom machine and multiblock system |
| **TACZ** | Timeless and Classics Zero gun data under `tacz/` |

## CONVENTIONS

- Keep recipe IDs meaningful; project recipe namespace is usually `createdelight`.
- Use `remove_recipes_id(e, [...])` for batch recipe removals because it documents exact removed IDs.
- Use `cutting_2()` for knife recipes because it also adds tetra modular knife support.
- Use `centrifugation()` when a recipe should cover Vintage Improvements plus small and big centrifuges.
- Add client-only mods to `.clientonlymodlist`; add server-only mods to `.serveronlymodlist`.
- Pack version belongs only in `pack.toml`; release automation derives other versioned files.
- Default option changes belong in `.options.txt`, which is copied into release defaults.
- JVM release defaults belong in `variables.txt` after `JAVA_ARGS=`.

## GIT AND RELEASE

- Commit style follows Conventional Commits loosely: `[fix]`, `[feat]`, `[mod]`, `[dev]`, `[conf]`, `[quest]`.
- PR titles and descriptions should be written in Chinese unless the user explicitly requests another language.
- Formal release flow is documented in `DevGuide.md`; GitHub Actions build test artifacts from `test-client`, `test-server`, and `test-patch`.
- Do not overwrite `index.toml`; run `packwiz refresh` after tracked file changes that need index updates.
- Avoid destructive bulk deletes in `config/`, `defaultconfigs/`, `kubejs/`, `mods/`, `hotai/`, `ldlib/`, `PCL/`, and `tacz/`.

## COMMANDS

```powershell
# Packwiz
.\packwiz.exe refresh
.\packwiz.exe curseforge export

# OpenCode skills
/knowledge-check
/release

# KubeJS hot reload, run in game
/kubejs reload server_scripts
/reload
```

## KNOWLEDGE BASE MAINTENANCE

- Root `AGENTS.md` should stay short enough to scan; move long history to `docs/lessons-learned.md`.
- `kubejs/AGENTS.md` should contain only KubeJS-specific rules, paths, and helper APIs.
- Record non-obvious bugs, release pitfalls, and recurring agent mistakes in `docs/lessons-learned.md`.
- Avoid duplicating facts between files; cross-link instead.
- Update these docs when architecture or workflow changes, because stale agent instructions are worse than missing instructions.

## NOTES

- `AGENTS.md` is local agent knowledge; the root `.gitignore` currently does not whitelist it.
- This repo currently does not include `CDC-mod-src`; Java mod instructions from the reference repo are intentionally omitted.
