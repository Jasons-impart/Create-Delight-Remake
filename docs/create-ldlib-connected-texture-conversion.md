# Create 与 LDLib 连接纹理互转

本文记录 Create 6.0.8 `OMNIDIRECTIONAL` 与 LDLib 1.0.50 CTM 的纹理格式差异、转换保证和脚本用法。转换工具位于 `scripts/convert-create-ldlib-ct.py`。

## 结论

- **LDLib → Create**：图集数据可以无损展开。脚本会生成 8×8 Create 图集、填充 47 个有效状态，并将其余 17 格保持透明；重新压缩后的 16 个 LDLib 角片必须逐像素一致。
- **Create → LDLib**：不保证无损。Create 可以为 47 个状态分别绘制整张面纹理，LDLib 则要求同一种局部角状态复用同一角片；脚本默认发现差异就以退出码 2 停止，只有显式添加 `--allow-lossy` 才会输出近似结果。
- 上述保证只针对纹理图集。Create 与 LDLib 的连接判定、遮挡和模型重烘焙行为不会随 PNG 一起迁移。

## 两种实现

| 项目 | Create `OMNIDIRECTIONAL` | LDLib CTM |
|---|---|---|
| 图集 | 8×8 完整面纹理；16×16 单格时总图为 128×128 | 基础纹理另存，CTM 为 4×4 半格角片；16×16 基础纹理对应 32×32 CTM，每格 8×8 |
| 状态选择 | `AllCTTypes.OMNIDIRECTIONAL#getTextureIndex` 从 47 个有效索引中选择一张完整 tile | `Connections` 将面拆成四象限，按两条边和一个对角邻居选择角片 |
| 无连接象限 | 使用 8×8 图集第 0 格中的对应区域 | 直接使用基础纹理中的对应象限，不存入 CTM 图集 |
| 运行时判定 | 由 `ConnectedTextureBehaviour` 构建上下文，可自定义跨方块连接、遮挡、镜像和面方向 | 默认 `ICTMPredicate` 比较 Forge appearance 后的 `BlockState` 对象，也可由 Block 或 renderer 自定义 |

Create 只在相邻两条边都连接时暴露对应的对角状态。LDLib 会独立检测八个邻居，但孤立对角不会改变最终角片；因此脚本可以把原始邻接掩码折叠成相同的 47 个渲染等价状态。

## 角片映射

下表给出 LDLib 4×4 图集的行优先索引，以及脚本从 Create 8×8 图集中取样的位置。`TL/TR/BL/BR` 表示完整 Create tile 内的左上、右上、左下、右下象限。

| LDLib 索引 | Create tile/象限 | LDLib 索引 | Create tile/象限 |
|---:|---|---:|---|
| 0 | `12/TL` | 8 | `8/TL` |
| 1 | `20/TR` | 9 | `16/TR` |
| 2 | `1/TL` | 10 | `9/TL` |
| 3 | `1/TR` | 11 | `17/TR` |
| 4 | `13/BL` | 12 | `8/BL` |
| 5 | `21/BR` | 13 | `16/BR` |
| 6 | `2/BL` | 14 | `10/BL` |
| 7 | `2/BR` | 15 | `18/BR` |

LDLib 四象限的内部顺序为 `BL, BR, TR, TL`，基础 offset 为 `4, 5, 1, 0`。两条边和对角全部连接时使用 offset；仅一条边连接时加 2 或 8；两条边连接但缺少对角时加 10。

## 脚本用法

依赖 Python 3.10+ 和 Pillow：

```powershell
python -m pip install Pillow
```

Create 转 LDLib，并复用 MBD2 已有基础纹理：

```powershell
python scripts/convert-create-ldlib-ct.py create-to-ldlib `
  CDC-mod-src/src/main/resources/assets/createdelightcore/textures/block/forge_steel_casing_connected.png `
  ldlib/assets/mbd2/textures/block/forge_steel_casing_ctm.png `
  --base ldlib/assets/mbd2/textures/block/forge_steel_casing.png `
  --write-mcmeta
```

如果没有基础纹理，可从 Create 第 0 格一并提取：

```powershell
python scripts/convert-create-ldlib-ct.py c2l source_connected.png target_ctm.png `
  --extract-base target.png `
  --connection namespace:block/target_ctm `
  --write-mcmeta
```

LDLib 转 Create：

```powershell
python scripts/convert-create-ldlib-ct.py ldlib-to-create `
  ldlib/assets/mbd2/textures/block/forge_steel_casing.png `
  ldlib/assets/mbd2/textures/block/forge_steel_casing_ctm.png `
  tmp-ct/forge_steel_casing_connected.png
```

常用选项：

| 选项 | 作用 |
|---|---|
| `--check-only` | 只分析和验证，不写文件 |
| `--force` | 允许覆盖内容不同的 PNG；输入和输出指向同一文件仍会拒绝 |
| `--allow-lossy` | Create 转 LDLib 时接受角片化近似 |
| `--write-mcmeta` | 为基础纹理创建或合并 `.png.mcmeta` |
| `--connection namespace:path` | 覆盖根据 `assets/<namespace>/textures/` 自动推导的连接纹理资源位置 |
| `--emissive` | 在 LDLib metadata 中写入 `emissive: true` |

生成的 metadata 形如：

```json
{
  "ldlib": {
    "connection": "mbd2:block/forge_steel_casing_ctm"
  }
}
```

已有 `.png.mcmeta` 会按 JSON object 合并，动画等其他字段会保留；格式错误时脚本会停止，避免覆盖。

## 已验证资源

| Create 输入 | 一致状态 | 累计不同像素 | 结果 |
|---|---:|---:|---|
| `forge_steel_casing_connected.png` | 47/47 | 0 | 无损 |
| `steel_casing_connected.png` | 42/47 | 25 | 默认拒绝，允许近似 |
| `steel_glass_casing_connected.png` | 42/47 | 45 | 默认拒绝，允许近似 |
| `steel_clear_glass_casing_connected.png` | 42/47 | 45 | 默认拒绝，允许近似 |

三个有损样例都只涉及 Create tile `12, 13, 20, 21, 54`。LDLib JAR 自带的 `machine_coil_cupronickel.png` 与 `_ctm.png` 已验证可无损展开，且 `LDLib → Create → LDLib` 的 CTM 像素差为 0。

## 运行时限制

普通 vanilla/Forge baked model 在基础纹理带有 `ldlib.connection` 后，会由 LDLib 的 model bake 流程包装并重建 CTM quad。

当前整合包使用的 MBD2 1.0.38.a 动态 `json_model` 是例外：最外层 `MBDBlockRenderer` 没有覆盖 `IRenderer.reBakeCustomQuads()`，因此继承默认值 `false`。即使 PNG 与 `.mcmeta` 都正确，MBD2 动态机器也可能不会进入 LDLib CTM 重烘焙流程。

若目标是 MBD2 动态机器，需要另做 Java/mixin 兼容补丁；只修改内层 `IModelRenderer` 不足以解决问题。推荐在 `MBDBlockRenderer.renderModel()` 委托当前状态的真实 renderer 得到 quads 后，仅对带 LDLib metadata 的模型直接调用 `CustomBakedModel.reBakeCustomQuads(..., 0.0f)`。不建议简单让外层 `reBakeCustomQuads()` 永远返回 `true`：除了默认 `0.002f` 会使整个面沿法线外移，LDLib 1.0.50 的对应提前返回路径还没有执行后续 ThreadLocal 清理。自适应机壳与 MBD2 CTM 的完整接入方案见 [MBD2 自适应机壳与连接纹理方案](plan/mbd2-adaptive-casing-and-connected-texture-plan.md)。

## 支持边界

- 仅支持 Create `OMNIDIRECTIONAL` 8×8 图集，不支持 `HORIZONTAL`、`VERTICAL`、`ROOF` 等其他 CTType。
- 当前只支持单帧、正方形、偶数单格尺寸；动画纹理和非正方形图集会拒绝。
- `LDLib → Create` 的“无损”指图集像素表达无损，不代表自动复制 Create 的 `ConnectedTextureBehaviour` 或 LDLib 的 `ICTMPredicate`。

## 版本与源码入口

- Create 6.0.8：`AllCTTypes`、`ConnectedTextureBehaviour`、`CTModel`、`CTSpriteShiftEntry`。
- LDLib 1.0.50：`Connections`、`Connection`、`CustomBakedModel`、`ICTMPredicate`、`ClientProxyImpl`。
- MBD2 1.0.38.a：`MBDBlockRenderer`。
