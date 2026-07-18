# Tetra Insight 整合与发布记录

## 目标

用可公开分发的客户端附属替代未上架 CurseForge 的 TetraClip，在保持 Tetra/mutil 美术与交互风格的前提下，解决页面入口、材料换算、筛选溢出、改进与打磨信息隐藏等问题。

## 当前实现

- 加工台常驻显示详情、合成与调整入口，并为不可用页面提供原因提示。
- 单材料合成页提供明确的材料信息入口，视觉槽位与容器实际点击区域同步移动。
- 全息球材料页增加材料影响面板，显示作者定义或依据实际 `extract` 推测的材料换算。
- 效果/属性筛选支持搜索、分页、删除筛选文字与显式取消排序；自动筛选项只来自当前模块实际材料换算。
- 模块详情显式提供协同加成和模块特性入口。
- 改进查询拆分为紧凑总览与单项详情；总览只显示名称、状态与摘要，点击后再显示等级、耗材、工具、经验和完整效果。
- 改进与打磨支持分页、模块归属过滤、明确选中状态和链级互斥；页面切换只使用短淡入和极小位移，避免大量内容同时运动。
- 同键前置的打磨与材料型改进会折叠为改进链；无有效材料物品的等级在总览与详情中均不显示，紧凑等级按钮悬停时显示完整方案名称。
- 改进属性支持“基础 → 已选改进”“基础 → 悬停预览”“已选改进 → 悬停预览”比较；组合从基础物品重建，并在普通改进与打磨之后应用附魔。
- 材料型改进复用模块选材风格；按住 Shift 查看耗材；固定耗材与附魔使用紧凑汇总。
- 全息球与加工台的动态属性 Bar 分别按 14/18 项分页，并支持箭头与鼠标滚轮切页，避免第四行或额外横列覆盖相邻界面。
- 缺失材料定义的候选不会渲染，但附魔等自定义 Java schematic 不按空预览材料误删。

独立源码与正式版本：

- 源码：<https://github.com/SSWTLZZ69/TetraInsight>
- 0.1.0 源码 PR：<https://github.com/SSWTLZZ69/TetraInsight/pull/1>
- CurseForge：<https://www.curseforge.com/minecraft/mc-mods/tetra-insight>
- 目标版本：Minecraft 1.20.1、Forge 47.4.10、Tetra 6.9.x、mutil 6.2.0+

## CDR 接入

- 删除 TetraClip 的 Packwiz 元数据和手动托管 JAR，避免两个附属同时分页 `HoloSortPopover`。
- Tetra Insight 项目与首个 `0.1.0` 文件已通过 CurseForge 审核；包含本轮空材料等级热修的修订文件 `8456389` 已上传等待审核，过审前暂以 `packwiz-files/mods/tetra_insight-0.1.0.jar` 分发，并在 `mods/tetra-insight.pw.toml` 标记为客户端模组。
- CurseForge 文件过审后，将手动托管元数据替换为 CurseForge 更新元数据，再移除 `packwiz-files` 临时载荷。

## Biomancy 联动清理

CDR 未安装 Biomancy，但 MMT 的部分根级固定耗材改进没有 `forge:mod_loaded` 条件，会泄漏进改进列表；同时旧覆盖对 Tetra 数组型 Store 使用了错误的对象格式。

- `ImprovementStore` 与 `SynergyStore` 覆盖为 `[]`。
- 缺少条件保护的两个 module 使用有效类型、不可达槽位和空 variants。
- 原本已有 `forge:mod_loaded` 的镰刀 schematic 覆盖删除，让上游条件直接跳过。
- 7 个缺少条件的根级固定耗材 schematic 使用 `forge:false` 禁用。
- 不再使用字段不完整的假 `MaterialData`，避免 `MaterialImprovementData.combineWrap` 空指针阻止世界加载。

## 验证状态

- Tetra Insight `0.1.0` 已通过本地 `test build`；其功能代码与 CDR 托管 JAR 一致。
- 已回归普通改进、打磨与附魔的组合顺序、选择/取消状态、悬停属性预测，以及三行属性 Bar 与详情返回入口的布局。
- 已在 CDR 真实环境回归加工台、全息球、材料影响、筛选、改进、打磨、附魔、协同和模块特性。
- 已确认移除 TetraClip 后筛选分页正常，Biomancy `material.primary` 空指针不再出现。
- Packwiz 资产需校验元数据 SHA-256 与托管 JAR 一致，并确认本地同步后旧 dev/TetraClip JAR 不残留。

## 后续

- CurseForge 修订文件 `8456389` 通过审核后，切换为 CurseForge 更新元数据。
- 继续补 GUI Scale 2/3/4、英文宽度和更多第三方 Tetra 附属回归。
- 后续版本可增加当前材料与候选材料的最终结果差值比较。
