---
navigation:
  title: 安山样板供应器
  icon: appliedcreate:andesite_pattern_provider
  parent: index.md
  position: 20
item_ids:
  - appliedcreate:andesite_pattern_provider
  - appliedcreate:andesite_pattern_provider_part
---

# 安山样板供应器

<Row gap="20">
<Column>

<ItemImage id="appliedcreate:andesite_pattern_provider" scale="4" />

安山样板供应器是专为机械动力的动力合成器设计的AE2样板供应器。它可以存放最多**9个处理样板**，并自动将材料分配到相邻动力合成器的正确网格位置。

</Column>
</Row>

## 主要特性

- **9个样板槽** — 可存放最多9个AE2处理样板
- **智能网格分配** — 自动根据样板产物匹配对应的合成配方，将每种材料放入正确的动力合成器槽位，同时支持机械动力的动力合成配方和原版有序合成配方
- **滑动放置** — 小于合成器网格的配方会被正确放置；大于网格的配方会被拒绝，避免合成出错误的物品
- **完整AE2集成** — 作为标准AE2网络设备运行，支持阻挡模式、锁定合成、样板管理终端显示、优先级等功能
- **指向模式** — 使用扳手右键切换为指向模式，与标准AE2样板供应器相同
- **线缆子部件** — 可作为线缆附属部件使用，实现紧凑布局
- **可升级** — 可使用 <ItemLink id="appliedcreate:brass_pattern_provider_upgrade" /> 升级为 <ItemLink id="appliedcreate:brass_pattern_provider" />

## 安装设置

### 方块形态

1. **搭建**动力合成器阵列并用扳手连接各个合成器
2. **放置**安山样板供应器在阵列中任意合成器旁边
3. 使用AE2线缆**连接**到ME网络
4. **放入**处理样板到供应器的GUI中

### 线缆子部件形态

<ItemImage id="appliedcreate:andesite_pattern_provider_part" scale="2" />

安山样板供应器也可作为线缆子部件使用。将其放置在紧邻动力合成器阵列的AE2线缆面上，实现更紧凑的布局。

## 创建处理样板

供应器使用**AE2处理样板**工作：

1. 打开AE2样板终端
2. 切换到**处理**模式
3. 将**输入**设置为与合成配方的材料匹配（顺序无关——供应器根据产物匹配配方）
4. 将**输出**设置为配方产物
5. 编码样板并放入供应器

当ME系统收到合成请求时，供应器会：
1. 从ME网络请求所有需要的材料
2. 根据样板的产物匹配对应的配方（动力合成配方或原版有序合成配方）
3. 验证配方是否能放入相邻的动力合成器网格
4. 按照配方布局将每种材料分配到正确的合成器槽位
5. 向合成器发送开始合成的信号

## 升级

对安山样板供应器使用 <ItemLink id="appliedcreate:brass_pattern_provider_upgrade" /> 即可升级为拥有36个样板槽的 <ItemLink id="appliedcreate:brass_pattern_provider" />。升级过程中所有已存放的样板将被保留。
