# Tetra Insight 整合与发布记录

## 目标

用可公开分发的客户端附属替代未上架 CurseForge 的 TetraClip，在保持 Tetra/mutil 美术与交互风格的前提下，解决页面入口、材料换算、筛选溢出、改进与打磨信息隐藏等问题。

## 当前实现

- 加工台常驻显示详情、合成与调整入口，并为不可用页面提供原因提示。
- 单材料合成页提供明确的材料信息入口，视觉槽位与容器实际点击区域同步移动。
- 全息球材料页增加材料影响面板，显示作者定义或依据实际 `extract` 推测的材料换算。
- 效果/属性筛选支持搜索、分页、删除筛选文字与显式取消排序；自动筛选项只来自当前模块实际材料换算。
- 模块详情显式提供协同加成和模块特性入口。
- 改进与打磨支持分页、模块归属过滤、明确选中状态和链级互斥。
- 材料型改进复用模块选材风格；按住 Shift 查看耗材；固定耗材与附魔使用紧凑汇总。
- 缺失材料定义的候选不会渲染，但附魔等自定义 Java schematic 不按空预览材料误删。

独立源码与公开 Alpha：

- 源码：<https://github.com/SSWTLZZ69/TetraInsight>
- Alpha 1：<https://github.com/SSWTLZZ69/TetraInsight/releases/tag/v0.1.0-alpha.1>
- 目标版本：Minecraft 1.20.1、Forge 47.4.10、Tetra 6.9.x、mutil 6.2.0+

## CDR 接入

- 删除 TetraClip 的 Packwiz 元数据和手动托管 JAR，避免两个附属同时分页 `HoloSortPopover`。
- Tetra Insight CurseForge 项目等待审核期间，暂以 `packwiz-files/mods/tetra_insight-0.1.0-alpha.1.jar` 分发，并在 `mods/tetra-insight.pw.toml` 标记为客户端模组。
- CurseForge 文件过审后，将手动托管元数据替换为 CurseForge 更新元数据，再移除 `packwiz-files` 临时载荷。

## Biomancy 联动清理

CDR 未安装 Biomancy，但 MMT 的部分根级固定耗材改进没有 `forge:mod_loaded` 条件，会泄漏进改进列表；同时旧覆盖对 Tetra 数组型 Store 使用了错误的对象格式。

- `ImprovementStore` 与 `SynergyStore` 覆盖为 `[]`。
- 缺少条件保护的两个 module 使用有效类型、不可达槽位和空 variants。
- 原本已有 `forge:mod_loaded` 的镰刀 schematic 覆盖删除，让上游条件直接跳过。
- 7 个缺少条件的根级固定耗材 schematic 使用 `forge:false` 禁用。
- 不再使用字段不完整的假 `MaterialData`，避免 `MaterialImprovementData.combineWrap` 空指针阻止世界加载。

## 验证状态

- Tetra Insight `0.1.0-alpha.1` 已通过本地 `test build` 与 GitHub Actions 构建。
- 已在 CDR 真实环境回归加工台、全息球、材料影响、筛选、改进、打磨、附魔、协同和模块特性。
- 已确认移除 TetraClip 后筛选分页正常，Biomancy `material.primary` 空指针不再出现。
- Packwiz 资产需校验元数据 SHA-256 与托管 JAR 一致，并确认本地同步后旧 dev/TetraClip JAR 不残留。

## 后续

- 等待 CurseForge 审核并切换正式项目元数据。
- 继续补 GUI Scale 2/3/4、英文宽度和更多第三方 Tetra 附属回归。
- 后续版本可增加当前材料与候选材料的最终结果差值比较。
