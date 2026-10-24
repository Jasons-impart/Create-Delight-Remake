# 分支与正式版维护策略

本文说明 Create-Delight-Remake 的开发分支、`release-vxxxx` 稳定维护分支，以及正式版发布后对 **CDC 版本 / CDC mixin** 与 **HotAI 式修复** 的约束。发布操作步骤见 `.agents/skills/release/SKILL.md`；人工入口见 [development.md](../development.md#版本发布流程)。

## 分支角色

| 分支 | 角色 | 典型改动 |
|---|---|---|
| `main` | 主要开发分支 | 持续合入功能与修复；可 bump CDC 版本，因此可带入依赖新 CDC 载荷的 mixin 修复 |
| `release-vxxxx` | 某一正式稳定线的维护分支 | 尽可能不做功能性更新；正式版发布后以 bug 修复为主 |

命名与发布脚本一致：`.agents/skills/release/release-plan.ps1` 在未指定 `-TargetBranch` 时，由版本号推导 `release-v$major$minor$patch`x（例如 `v0.5.0.*` → `release-v050x`）；若该分支存在则用之，否则回退到 `main`。

历史线示例：`release-v045x` … `release-v048x`、`release-v050x`。

## 生命周期

1. **在 `main` 上开发**  
   持续合入新功能与修复。需要 CDC 侧改动（含新 mixin）时，可更新 CDC 子模块引用与 Packwiz 载荷，再随 `main` 前进。

2. **接近某版本线尾声时切出稳定维护分支**  
   创建 `release-vxxxx`（如 `release-v050x`）。此后该分支尽可能避免功能性更新，以稳定与回归修复为主。

3. **维护分支上开发一段时间后发布正式版**  
   打 tag，并创建 **未** 标记为 prerelease 的 GitHub Release（流程见 release skill）。此前该线上可仍有测试版（`-test` / prerelease）。

4. **正式版发布之后（同一 `release-vxxxx` 线上）**  
   - 非必要禁止功能更新，只做 bug 修复。  
   - **CDC 版本固定，不再改动**：不能再通过 bump CDC / 新增依赖新 CDC 构建的 mixin 来合入修复。  
   - **仍可加入 HotAI 形式的修复**（`hotai/` 二进制补丁等，不依赖更换 CDC jar）。

下一大于当前稳定线的版本线（例如当前正式线为 `0.5.0.x` 时，预期下一线为 `0.5.1.x`）会在 `main` 上继续开发；需要 CDC mixin 的修复应落在那条新线（或仍在 `main` 上尚未切出的开发中），而不是回灌到已冻结 CDC 的旧 `release-vxxxx`。

## CDC mixin 与 HotAI：在哪条分支能加什么

| 手段 | `main` / 未冻结 CDC 的开发 | 已正式发布、CDC 已冻结的 `release-vxxxx` |
|---|---|---|
| 更新 CDC 版本并加入/修改 CDC mixin | 可以 | **不可以**（CDC 固定） |
| HotAI（`.badiff` / 相关 class 补丁） | 可以 | **可以**（维护分支仍允许） |
| KubeJS / 配置等不依赖换 CDC jar 的修复 | 可以 | 可以（仍应避免非必要功能向改动） |

判断「CDC 是否已冻结」：以该维护分支上是否已存在对应子版本的 **正式（非 prerelease）Release** 为准；发布脚本与 skill 亦以 GitHub Release 的 prerelease 标记区分正式/测试，不以 tag 名是否带 `-test` 单独推断。

## 与当前正式线的关系（`0.5.0.x` / `release-v050x`）

- `v0.5.0.15` 起对应稳定维护分支 `release-v050x`；当前正式版已推进到 `v0.5.0.16`（以仓库 tag / GitHub latest release 为准）。
- 该线上 Packwiz 的 CDC 载荷固定在 **2.2.16j** 一代（见 `origin/release-v050x` 的 `mods/create-delight-core.pw.toml` CurseForge hint）；**后续 `0.5.0.x` 补丁不会再 bump CDC**，因此无法再合入「必须换新 CDC jar 才能带上」的 mixin 修复。
- `main` 可持续更新 CDC（例如已含 ExtendedAE 胶带白名单启动空指针相关 mixin，并曾推进到 2.2.16l 及后续载荷），这些修复预期随 **版本号大于 `0.5.0` 的下一版本线**（预期为 `0.5.1.x`）进入正式包，而不是 `0.5.0.x`。
- 若维护分支上急需等价修复且不宜等下一版本线，应评估 **HotAI 形式** 的补丁，而不是在 `release-v050x` 上强行升级 CDC。

具体问题条目见 [compatibility-patches.md](compatibility-patches.md) 中「ExtendedAE 胶带白名单启动空指针」一行。

## 给代理与维护者的短约束

- 文档与知识库更新默认经 PR 合入 **`main`**；不要默认假设必须镜像到 `release-v050x`，除非该知识只对冻结线操作有硬依赖且用户要求。
- 在 `release-vxxxx` 上修 bug 前先确认：该修复是否要求新的 CDC 构建。若是，应改走 `main` / 下一版本线，或改为 HotAI（若可行）。
- 玩家侧临时缓解（如 ExtendedAE 启动偶发 NPE 改用 Java 17）可写在 FAQ / 反馈回复中；本页是开发与发布策略，不替代玩家文档。
