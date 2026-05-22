---
navigation:
  title: 黄铜样板供应器
  icon: appliedcreate:brass_pattern_provider
  parent: index.md
  position: 30
item_ids:
  - appliedcreate:brass_pattern_provider
  - appliedcreate:brass_pattern_provider_part
  - appliedcreate:brass_pattern_provider_upgrade
---

# 黄铜样板供应器

<Row gap="20">
<Column>

<ItemImage id="appliedcreate:brass_pattern_provider" scale="4" />

黄铜样板供应器是 <ItemLink id="appliedcreate:andesite_pattern_provider" /> 的升级版本。功能完全相同，但可以存放最多**36个处理样板**，非常适合需要自动化大量不同动力合成配方的场景。

</Column>
</Row>

## 主要特性

- **36个样板槽** — 安山版本的四倍容量
- **智能网格分配** — 自动匹配配方并将材料分配到正确的动力合成器槽位，同时支持动力合成配方和原版有序合成配方
- **滑动放置** — 小于网格的配方会被正确放置；过大的配方会被拒绝
- **完整AE2集成** — 支持阻挡模式、锁定合成、样板管理终端显示、优先级等所有标准AE2样板供应器功能
- **指向模式** — 使用扳手右键切换为指向模式
- **线缆子部件** — 可作为线缆附属部件使用
- **原地升级** — 从安山版本升级时保留所有样板

## 安装设置

1. **搭建**动力合成器阵列并用扳手连接各个合成器
2. **放置**黄铜样板供应器在阵列中任意合成器旁边
3. 使用AE2线缆**连接**到ME网络
4. **放入**最多36个处理样板

### 线缆子部件形态

<ItemImage id="appliedcreate:brass_pattern_provider_part" scale="2" />

同样可作为线缆子部件使用，适合紧凑型设计。

## 获取方式

### 从安山版升级

对已有的 <ItemLink id="appliedcreate:andesite_pattern_provider" /> 使用 <ItemLink id="appliedcreate:brass_pattern_provider_upgrade" /> 即可原地升级。安山版中已存放的所有样板将被保留。

<RecipeFor id="appliedcreate:brass_pattern_provider_upgrade" />

## 提示

- 当需要自动化大量不同的动力合成配方时，使用黄铜样板供应器
- 线缆子部件形态非常适合高密度ME网络布局
- 处理样板的输入顺序无关紧要——供应器根据产物匹配配方
- 可以在同一个动力合成器阵列旁放置多个供应器，获得更多样板容量
