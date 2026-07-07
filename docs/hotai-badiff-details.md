# HotAI badiff 逐文件明细

本文逐个记录 `hotai/**/*.badiff` 的补丁内容。已还原条目基于当前 `mods/*.jar` 中的目标 class、HotAI 对 class 的 ASM 归一化方式、以及补丁后 class 的反编译 diff；未还原条目单独标注目标 class 在当前 JAR 扫描中缺失。

代码块是“等价改动摘要”，不是完整反编译源码。它们用于表达字段、方法、条件和注册项的变化，避免把第三方模组源码整段复制进仓库。

`HOTAI_STATUS` 区块由 `scripts/update-hotai-docs.ps1` 维护，只记录当前补丁清单和目标 class 是否能在 JAR 中命中；方法级语义、历史提交依据和迁移建议仍写在人工维护区。

## 当前生效性核查（2026-07-05）

核查方法：逐个读取当前 `hotai/**/*.badiff`，从当前 `mods/*.jar` 查找同名目标 class，并按 HotAI 的 ASM 归一化方式实际应用 badiff；能生成可解析 class 记为“可应用”。目标 class 不存在则本补丁本身不会被 HotAI 命中，但如果其他已应用补丁引用该缺失 class，则仍可能启动崩溃。

| 对应模组 | 当前 JAR / 状态 | 补丁结果 | 结论 |
|---|---|---|---|
| HotAI | `mods/hotai-1.0.jar` 存在 | 补丁加载器存在。 | HotAI 本体可用。 |
| Create | `create-1.20.1-6.0.8.jar` | 4/4 可应用：`FluidManipulationBehaviour`、`FluidDrainingBehaviour`、`ItemDrainCategory`、`CTSpriteShifter`。 | 当前可生效。 |
| Create Liquid Fuel | `createliquidfuel-2.1.1-1.20.1.jar` | 2/2 可应用：`BurnerStomachHandler`、`MixinBlazeBurnerTileEntity`。 | 当前可生效。 |
| Create Addition | `createaddition-1.20.1-1.3.3.jar` | 10/13 可应用；`SuperconductingConnectorBlock`、`SuperconductingConnectorBlockEntity`、`SuperconductingConnectorBlockEntity$1` 目标 class 缺失。 | 部分可应用，但超导连接器整体当前不完整；`CABlocks`/`CABlockEntities` 补丁后会引用缺失的 `SuperconductingConnectorBlock*`，属于高风险。 |
| Vintage Improvements | `vintageimprovements-1.20.1-0.3.7.3.jar` | 2/2 可应用：`VintagePonderScene`、`VintagePonderTag`。 | 当前可生效。 |
| Create Mechanical Spawner | `create_mechanical_spawner-1.20.1-0.1.7-6.0.6.jar` | 1/1 可应用：`LivingEntityHelper`。 | 当前可生效。 |
| TACZ | `tacz-1.20.1-1.1.4-hotfix-all.jar` | 1/1 可应用：`ModCreativeTabs`。 | 当前可生效。 |
| Neapolitan | `neapolitan-1.20.1-5.1.0.jar` | 1/1 可应用：`Neapolitan`。 | 当前可生效。 |
| Better Compatibility Checker | `BetterCompatibilityChecker-3.0.1-build.58+mc1.20.jar` | 1/1 可应用：`ServerStatusPingerMixin`。 | 当前可生效。 |
| Quality Food | `quality_food-1.20.1-2.3.2-all.jar` | 1/1 可应用：`BlockMixin`。 | 当前可生效。 |
| Create New Age | `create-new-age-1.2.0+forge-mc1.20.1.jar` | 0/1；目标 `org/antarcticgardens/newage/CreateNewAgePonders` 缺失，当前 JAR 中相近类为 `org/antarcticgardens/cna/content/ponders/CNAPonders`；旧 badiff 可读常量指向旧 `newage` 包的 `PonderPlugin`、`registerScenes`、`registerTags`、`NewAgeBlocks`、`NewAgeItems` 和若干 `content/*Ponder` 类。 | 当前不生效；当前 `CNAPonders` 是语义上的新入口，但包名、字段和注册项已重构，旧补丁不能直接应用。该补丁来自提交 `e11d47f206c1e9cb28bdf506698c824586f9b00c`（`删除cna中无用的ponder (#649)`），应按“移除无用 Ponder”理解。 |
| Bakeries | `bakeries-1.20.1-forge-1.2.5.jar` | 0/1；目标 `com/renyigesai/bakeries/api/block/properties/ModIntegerProperty` 缺失；旧 badiff 可读常量显示它是 `Property<Integer>`，含 `create(String, int, int)`、`getName(Integer)` / 解析整数值等语义。当前只找到 `com/renyigesai/bakeries/block/state/BakeriesEnumProperty`，它是 `StringRepresentable` 枚举。 | 当前不生效；未找到语义匹配的新目标，不能迁移到 `BakeriesEnumProperty`。该补丁与提交 `3f499561ab68a1262b14e777f2f1d30dcaa4e2aa`（`开启dynamic_resources (#715)`）同提交出现，推测用于适配 ModernFix dynamic resources。 |

总计：清理已移除模组的遗留补丁后，当前 26 个 `.badiff` 中 21 个可应用，5 个当前找不到目标 class。真正需要优先处理的是 Create Addition 超导连接器 3 个缺失目标，因为其余 Create Addition 补丁仍会注册并引用这些缺失类；Create New Age 和 Bakeries 两项当前更像不会被命中的旧版本补丁，且未找到可直接迁移的新目标。

<!-- HOTAI_STATUS:BEGIN -->
> 本区块由 `scripts/update-hotai-docs.ps1` 生成。修改 `hotai/**/*.badiff` 后运行该脚本；人工解释写在区块外。

当前扫描到 26 个 `.badiff`；目标 class 命中 21 个，未命中 5 个。

| 模组/领域 | 补丁文件 | 目标 class | 当前目标 class |
|---|---|---|---|
| Create Liquid Fuel | `hotai/com/forsteri/createliquidfuel/core/BurnerStomachHandler.badiff` | `com/forsteri/createliquidfuel/core/BurnerStomachHandler` | 命中 `createliquidfuel-2.1.1-1.20.1.jar` |
| Create Liquid Fuel | `hotai/com/forsteri/createliquidfuel/mixin/MixinBlazeBurnerTileEntity.badiff` | `com/forsteri/createliquidfuel/mixin/MixinBlazeBurnerTileEntity` | 命中 `createliquidfuel-2.1.1-1.20.1.jar` |
| Create Addition | `hotai/com/mrh0/createaddition/blocks/connector/ConnectorType.badiff` | `com/mrh0/createaddition/blocks/connector/ConnectorType` | 命中 `createaddition-1.20.1-1.3.3.jar` |
| Create Addition | `hotai/com/mrh0/createaddition/blocks/connector/SuperconductingConnectorBlock.badiff` | `com/mrh0/createaddition/blocks/connector/SuperconductingConnectorBlock` | 未命中当前 JAR |
| Create Addition | `hotai/com/mrh0/createaddition/blocks/connector/SuperconductingConnectorBlockEntity.badiff` | `com/mrh0/createaddition/blocks/connector/SuperconductingConnectorBlockEntity` | 未命中当前 JAR |
| Create Addition | `hotai/com/mrh0/createaddition/blocks/connector/SuperconductingConnectorBlockEntity$1.badiff` | `com/mrh0/createaddition/blocks/connector/SuperconductingConnectorBlockEntity$1` | 未命中当前 JAR |
| Create Addition | `hotai/com/mrh0/createaddition/energy/IWireNode.badiff` | `com/mrh0/createaddition/energy/IWireNode` | 命中 `createaddition-1.20.1-1.3.3.jar` |
| Create Addition | `hotai/com/mrh0/createaddition/energy/network/EnergyNetwork.badiff` | `com/mrh0/createaddition/energy/network/EnergyNetwork` | 命中 `createaddition-1.20.1-1.3.3.jar` |
| Create Addition | `hotai/com/mrh0/createaddition/energy/WireConnectResult.badiff` | `com/mrh0/createaddition/energy/WireConnectResult` | 命中 `createaddition-1.20.1-1.3.3.jar` |
| Create Addition | `hotai/com/mrh0/createaddition/energy/WireType.badiff` | `com/mrh0/createaddition/energy/WireType` | 命中 `createaddition-1.20.1-1.3.3.jar` |
| Create Addition | `hotai/com/mrh0/createaddition/index/CABlockEntities.badiff` | `com/mrh0/createaddition/index/CABlockEntities` | 命中 `createaddition-1.20.1-1.3.3.jar` |
| Create Addition | `hotai/com/mrh0/createaddition/index/CABlocks.badiff` | `com/mrh0/createaddition/index/CABlocks` | 命中 `createaddition-1.20.1-1.3.3.jar` |
| Create Addition | `hotai/com/mrh0/createaddition/index/CAItems.badiff` | `com/mrh0/createaddition/index/CAItems` | 命中 `createaddition-1.20.1-1.3.3.jar` |
| Vintage Improvements | `hotai/com/negodya1/vintageimprovements/infrastructure/ponder/VintagePonderScene.badiff` | `com/negodya1/vintageimprovements/infrastructure/ponder/VintagePonderScene` | 命中 `vintageimprovements-1.20.1-0.3.7.3.jar` |
| Vintage Improvements | `hotai/com/negodya1/vintageimprovements/infrastructure/ponder/VintagePonderTag.badiff` | `com/negodya1/vintageimprovements/infrastructure/ponder/VintagePonderTag` | 命中 `vintageimprovements-1.20.1-0.3.7.3.jar` |
| Create Mechanical Spawner | `hotai/com/oierbravo/create_mechanical_spawner/foundation/utility/LivingEntityHelper.badiff` | `com/oierbravo/create_mechanical_spawner/foundation/utility/LivingEntityHelper` | 命中 `create_mechanical_spawner-1.20.1-0.1.7-6.0.6.jar` |
| Bakeries | `hotai/com/renyigesai/bakeries/api/block/properties/ModIntegerProperty.badiff` | `com/renyigesai/bakeries/api/block/properties/ModIntegerProperty` | 未命中当前 JAR |
| Create | `hotai/com/simibubi/create/compat/jei/category/ItemDrainCategory.badiff` | `com/simibubi/create/compat/jei/category/ItemDrainCategory` | 命中 `create-1.20.1-6.0.8.jar` |
| Create | `hotai/com/simibubi/create/content/fluids/transfer/FluidDrainingBehaviour.badiff` | `com/simibubi/create/content/fluids/transfer/FluidDrainingBehaviour` | 命中 `create-1.20.1-6.0.8.jar` |
| Create | `hotai/com/simibubi/create/content/fluids/transfer/FluidManipulationBehaviour.badiff` | `com/simibubi/create/content/fluids/transfer/FluidManipulationBehaviour` | 命中 `create-1.20.1-6.0.8.jar` |
| Create | `hotai/com/simibubi/create/foundation/block/connected/CTSpriteShifter.badiff` | `com/simibubi/create/foundation/block/connected/CTSpriteShifter` | 命中 `create-1.20.1-6.0.8.jar` |
| TACZ | `hotai/com/tacz/guns/init/ModCreativeTabs.badiff` | `com/tacz/guns/init/ModCreativeTabs` | 命中 `tacz-1.20.1-1.1.4-hotfix-all.jar` |
| Neapolitan | `hotai/com/teamabnormals/neapolitan/core/Neapolitan.badiff` | `com/teamabnormals/neapolitan/core/Neapolitan` | 命中 `neapolitan-1.20.1-5.1.0.jar` |
| Quality Food | `hotai/de/cadentem/quality_food/mixin/BlockMixin.badiff` | `de/cadentem/quality_food/mixin/BlockMixin` | 命中 `quality_food-1.20.1-2.3.2-all.jar` |
| Better Compatibility Checker | `hotai/dev/wuffs/bcc/mixins/ServerStatusPingerMixin.badiff` | `dev/wuffs/bcc/mixins/ServerStatusPingerMixin` | 命中 `BetterCompatibilityChecker-3.0.1-build.58+mc1.20.jar` |
| Create New Age | `hotai/org/antarcticgardens/newage/CreateNewAgePonders.badiff` | `org/antarcticgardens/newage/CreateNewAgePonders` | 未命中当前 JAR |
<!-- HOTAI_STATUS:END -->

## 代码化改动索引

### Create 流体搜索与 JEI

```java
// FluidManipulationBehaviour.badiff
for (int i = 0; i < 1024
        && !frontier.isEmpty()
        && canContinueSearch(fluid, visited, maxBlocks); i++) {
    ...
    if (currentFluid.isSame(fluid)) {
        onMatchingFluidBlockFound(visited, fluidState);
        add.accept(currentPos, entry.distance());
    }
}

protected boolean canContinueSearch(Fluid fluid, Set<BlockPos> visited, int maxBlocks) {
    return visited.size() <= maxBlocks || !canDrainInfinitely(fluid);
}

protected void onMatchingFluidBlockFound(Set<BlockPos> visited, FluidState fluidState) {
}
```

```java
// FluidDrainingBehaviour.badiff
int sourceBlocksFound;
int validationSourceBlocksFound;

// 非 LiquidBlock 流体：只把源流体当成 SOURCE，流动流体当成 FLOWING。
FluidState state = blockState.getFluidState();
if (!state.isEmpty() && emptyCollisionShape(blockState, pos)) {
    return state.isSource() ? SOURCE : FLOWING;
}

@Override
protected boolean canContinueSearch(Fluid fluid, Set<BlockPos> visited, int maxBlocks) {
    return !canDrainInfinitely(fluid) || sourceBlocksFoundFor(visited) <= maxBlocks;
}

@Override
protected void onMatchingFluidBlockFound(Set<BlockPos> visited, FluidState fluidState) {
    if (!fluidState.isSource()) return;
    if (visited == this.visited) sourceBlocksFound++;
    if (visited == this.validationVisited) validationSourceBlocksFound++;
}

// reset、revalidate、chunk 未加载、搜索完成时都清零对应计数器。
```

```java
// ItemDrainCategory.badiff
LazyOptional<?> cap = stack.getCapability(ForgeCapabilities.FLUID_HANDLER_ITEM);
if (!cap.isPresent()) continue;

ItemStack copy = stack.copy();
cap = copy.getCapability(ForgeCapabilities.FLUID_HANDLER_ITEM);
if (!cap.isPresent()) {
    Create.LOGGER.warn("Fluid handler vanished after copy: {}", stack);
    continue;
}
```

```java
// CTSpriteShifter.badiff
private static final Map<String, CTSpriteShiftEntry> ENTRY_CACHE =
    new ConcurrentHashMap<>();
```

### Create Liquid Fuel

```java
// BurnerStomachHandler.badiff
public static boolean tick(SmartBlockEntity entity) {
    if (!validBurnerOrTank(entity)) return false;
    if (tankFluidAmount <= 0) return false;
    if (fuelProperty == null) return false;
    if (tankFluidAmount < mbConsuming) {
        tankFluid.setAmount(0);
        return false;
    }
    if (remainingBurnTime + fuelTime > 10000) return false;

    setHeat(fluidSuperHeats ? SEETHING : FADING);
    setRemainingBurnTime(remainingBurnTime + fuelTime);
    tankFluid.shrink(mbConsuming);
    return true;
}

public static void tryUpdateFuel(..., ItemStack stack, ..., CallbackInfoReturnable<Boolean> cir) {
    IFluidHandlerItem handler = stack.getCapability(FLUID_HANDLER_ITEM).orElse(null);
    if (handler == null || handler.getTanks() != 1) {
        cir.setReturnValue(false);
        return;
    }
    if (!knownFuel(handler.getFluidInTank(0))) {
        cir.setReturnValue(false);
        return;
    }

    int space = stomach.getCapacity() - stomach.getFluidAmount();
    if (space <= 0) {
        cir.setReturnValue(false);
        return;
    }

    FluidStack drained = handler.drain(min(space, fluidAmount), EXECUTE);
    stomach.fill(drained, EXECUTE);
    syncContainerState(stack, handler.getContainer());
    cir.setReturnValue(true);
}
```

```java
// MixinBlazeBurnerTileEntity.badiff
@Inject(
    method = "tick",
    at = @At(value = "INVOKE",
             target = "BlazeBurnerBlockEntity.updateBlockState()V",
             ordinal = 1),
    cancellable = true
)
void tick(CallbackInfo info) {
    if (BurnerStomachHandler.tick(this)) {
        info.cancel();
    }
}
```

### Create Addition 超导线缆

```java
// CAItems.badiff
public static final ItemEntry<Item> SUPERCONDUCTING_WIRE =
    REGISTRATE.item("superconducting_wire", Item::new).register();

public static final ItemEntry<WireSpool> SUPERCONDUCTING_SPOOL =
    REGISTRATE.item("superconducting_spool", WireSpool::new).register();
```

```java
// CABlocks.badiff
public static final BlockEntry<SuperconductingConnectorBlock> SUPERCONDUCTING_CONNECTOR =
    REGISTRATE.block("superconducting_connector", SuperconductingConnectorBlock::new)
        .initialProperties(SharedProperties::softMetal)
        .onRegister(MovementBehaviour.movementBehaviour(new NodeMovementBehaviour()))
        .item()
        .transform(ModelGen.customItemModel())
        .register();
```

```java
// CABlockEntities.badiff
public static final BlockEntityEntry<SuperconductingConnectorBlockEntity> SUPERCONDUCTING_CONNECTOR =
    REGISTRATE.blockEntity("superconducting_connector", SuperconductingConnectorBlockEntity::new)
        .validBlocks(CABlocks.SUPERCONDUCTING_CONNECTOR)
        .renderer(() -> ConnectorRenderer::new)
        .register();
```

```java
// ConnectorType.badiff
enum ConnectorType {
    Small("small"),
    Superconducting("superconducting"),
    Large("large");
}
```

```java
// WireType.badiff
SUPERCONDUCTING(
    4,
    Integer.MAX_VALUE,
    134, 146, 252,
    CAItems.SUPERCONDUCTING_WIRE.asStack(4),
    CAItems.SUPERCONDUCTING_SPOOL.asStack()
);

static WireType fromIndex(int index) {
    if (index == 4) return SUPERCONDUCTING;
}

static WireType fromSpool(Item item) {
    if (item == CAItems.SUPERCONDUCTING_SPOOL.get()) return SUPERCONDUCTING;
}
```

```java
// WireConnectResult.badiff
REQUIRES_SUPERCONDUCTING(
    Component.translatable("statusbar.createaddition.wire.requires_superconducting")
        .withStyle(ChatFormatting.RED)
);
```

```java
// IWireNode.badiff
if (wn1.getConnectorType() == ConnectorType.Superconducting
        && wn2.getConnectorType() == ConnectorType.Superconducting
        && type != WireType.SUPERCONDUCTING) {
    return WireConnectResult.REQUIRES_SUPERCONDUCTING;
}
```

```java
// EnergyNetwork.badiff
private static final int MAX_BUFF = Integer.MAX_VALUE;

private int saturatedAdd(int a, int b) {
    long result = (long) a + b;
    return clampToInt(result);
}

public int getMaxBuff() {
    long calculated = (long) nodeCount * ((long) outDemand + (long) inDemand * 2L + 10L);
    return clampToNonNegativeInt(calculated);
}

public int push(int energy, boolean simulate) {
    long remaining = (long) getMaxBuff() - inBuff;
    if (remaining <= 0) return 0;
    int actual = minAsInt(energy, remaining);
    if (!simulate) {
        inBuff = clampToInt((long) inBuff + actual);
        pushed = saturatedAdd(pushed, actual);
    }
    return actual;
}

public int demand(int demand) {
    inDemand = saturatedAdd(inDemand, demand);
    return demand;
}

public int pull(int energy, boolean simulate) {
    if (outBuff <= 0) return 0;
    int actual = Math.min(energy, outBuff);
    if (!simulate) {
        outBuff = Math.max(outBuff - actual, 0);
        pulled = saturatedAdd(pulled, actual);
    }
    return actual;
}
```

```java
// SuperconductingConnectorBlock*.badiff
// 当前 JAR 扫描不到目标 class，无法生成可靠代码化摘要。
// 需要用实际启动日志和游戏内注册结果验证。
```

### TACZ 创造页签

```java
// ModCreativeTabs.badiff
AMMO_TAB.icon = ammo("create_armorer:slap");
ATTACHMENT_SCOPE_TAB.icon = attachment("create_armorer:scope_telephoto");
ATTACHMENT_MUZZLE_TAB.icon = attachment("create_armorer:muzzle_refit_brass_retractor");
ATTACHMENT_STOCK_TAB.icon = attachment("applied_armorer:bracelet_zenith");
ATTACHMENT_GRIP_TAB.icon = attachment("create_armorer:grip_gantry_shaft");
ATTACHMENT_EXTENDED_MAG_TAB.icon = attachment("create_armorer:extended_mag_ca_3");
GUN_PISTOL_TAB.icon = gun("create_armorer:pistol_auto_stress");
GUN_SNIPER_TAB.icon = gun("create_armorer:sniper_semi_clockwork");
GUN_RIFLE_TAB.icon = gun("create_armorer:rifle_assult_crane");
GUN_SHOTGUN_TAB.icon = gun("create_armorer:shotgun_pump_bearing");
GUN_SMG_TAB.icon = gun("create_armorer:smg_auto_crank");
GUN_RPG_TAB.icon = gun("create_armorer:special_melee_wrench");
GUN_MG_TAB.icon = gun("create_armorer:mg_platemag_flywheel");
```

### 其他兼容修复

```java
// LivingEntityHelper.badiff
Entity entity = entityType.create(serverLevel, pos, MobSpawnType.SPAWNER);
```

```java
// VintagePonderScene.badiff
// 删除：
helper.forComponents(VintageBlocks.BELT_GRINDER)
    .addStoryBoard("belt_grinder/processing", BeltGrinderScenes::processing, KINETIC_APPLIANCES);

// VintagePonderTag.badiff
// 从 KINETIC_APPLIANCES tag 添加链中删除 VintageBlocks.BELT_GRINDER。
```

```java
// Neapolitan.badiff
// 客户端初始化中删除：
NeapolitanBlocks.setupTabEditors();
NeapolitanItems.setupTabEditors();
```

```java
// ServerStatusPingerMixin.badiff
private static final Field SERVER_DATA_FIELD = findServerDataField(ServerStatusPinger$1.class);

@Inject(
    method = {
        "handleStatusResponse(Lnet/minecraft/network/protocol/status/ClientboundStatusResponsePacket;)V",
        "m_6440_(Lnet/minecraft/network/protocol/status/ClientboundStatusResponsePacket;)V"
    },
    at = @At("TAIL"),
    remap = false,
    require = 0
)
void onHandleResponse(ClientboundStatusResponsePacket packet, CallbackInfo ci) {
    BetterStatus data = ((ServerDataExtension) packet.status()).getBetterData();
    ((ServerDataExtension) SERVER_DATA_FIELD.get(this)).setBetterData(data);
}

private static Field findServerDataField(Class<?> pinger) {
    return fieldNamed("val$p_105460_").orElse(firstFieldOfType(ServerData.class));
}
```

```java
// BlockMixin.badiff
DropData dropData = DropData.CURRENT.get();
if (dropData == DropData.SKIP) return stack;

if (dropData != null && Utils.isValidBlock(dropData.state())) {
    QualityUtils.applyQuality(stack, dropData.state(), dropData.quality(),
        dropData.player(), dropData.farmland());
}
return stack;
```

```java
// CreateNewAgePonders.badiff / ModIntegerProperty.badiff
// 当前 JAR 扫描不到目标 class，无法生成可靠代码化摘要。
// 这些条目只能保留目标路径、疑似历史来源和启动验证要求。
```

## Create

| 文件 | 状态 | 具体改动 | 影响 |
|---|---|---|---|
| `com/simibubi/create/content/fluids/transfer/FluidManipulationBehaviour.badiff` | 已还原 | 将 `search(...)` 的循环退出条件从直接检查 `visited.size() > maxBlocks && canDrainInfinitely(fluid)` 改为调用 `canContinueSearch(fluid, visited, maxBlocks)`；在找到匹配流体后调用新增钩子 `onMatchingFluidBlockFound(visited, fluidState)`；新增两个 protected 默认方法，默认行为保持原版按访问方块数量限制搜索。 | 为 `FluidDrainingBehaviour` 提供按源方块计数的扩展点，避免改动填充等其他流体行为。 |
| `com/simibubi/create/content/fluids/transfer/FluidDrainingBehaviour.badiff` | 已还原 | 新增 `sourceBlocksFound` 和 `validationSourceBlocksFound`；抽液目标识别改用 `FluidState`，要求非空、可作为源流体并且碰撞形状为空；`getFluidBlockType` 对非 `LiquidBlock` 流体区分 `SOURCE` 和 `FLOWING`；覆写 `canContinueSearch` 和 `onMatchingFluidBlockFound`，只按源方块数量判断无限流体；`reset`、`revalidate`、chunk 未加载和搜索完成时清空新增计数器。 | 分液池不再因为流动液体路径过长而提前触发无限流体判断，也不会把流动液体当成源方块抽取。 |
| `com/simibubi/create/compat/jei/category/ItemDrainCategory.badiff` | 已还原 | JEI 枚举可分液物品时，先检查原物品有 `FLUID_HANDLER_ITEM`，复制 `ItemStack` 后重新获取 capability；若复制后 capability 消失，写入 Create logger warn 并跳过。 | 避免某些物品复制后 capability 丢失导致 JEI 分液分类初始化异常。 |
| `com/simibubi/create/foundation/block/connected/CTSpriteShifter.badiff` | 已还原 | `ENTRY_CACHE` 从 `HashMap` 改为 `ConcurrentHashMap`；缓存 key 仍由原贴图、连接贴图和 `CTType` id 组成，只简化字符串拼接。 | 降低连接纹理并发注册或资源重载时的缓存竞态风险。 |

## Create Liquid Fuel

| 文件 | 状态 | 具体改动 | 影响 |
|---|---|---|---|
| `com/forsteri/createliquidfuel/core/BurnerStomachHandler.badiff` | 已还原 | `tick(SmartBlockEntity)` 从 `void` 改为 `boolean`，只有成功消耗液体燃料并增加燃烧时间时返回 true；早退路径全部返回 false。`tryUpdateFuel(...)` 改用 `IFluidHandlerItem`，失败路径显式 `cir.setReturnValue(false)`；检查燃烧室剩余容量，按 `min(space, fluidStack.amount)` 部分抽取容器流体并 `stomach.fill(...)`；新增 `syncContainerState`，把容器扣除后的 count、NBT 和 damage 同步回手持堆叠。 | 修复向液体烈焰人燃烧室倒入流体时可能不扣容器、超容量或错误成功的问题。 |
| `com/forsteri/createliquidfuel/mixin/MixinBlazeBurnerTileEntity.badiff` | 已还原 | `tick` 注入点从方法尾部改到第二次调用 `BlazeBurnerBlockEntity.updateBlockState()` 前；注入改为 `cancellable=true`；当 `BurnerStomachHandler.tick(this)` 返回 true 时取消原 tick 后续逻辑。 | 液体燃料成功接管燃烧状态时，不再让原版后续逻辑覆盖热量或燃烧时间。 |

## Create Addition

| 文件 | 状态 | 具体改动 | 影响 |
|---|---|---|---|
| `com/mrh0/createaddition/index/CAItems.badiff` | 已还原 | 新增 `ItemEntry<Item> SUPERCONDUCTING_WIRE`，注册 id `superconducting_wire`；新增 `ItemEntry<WireSpool> SUPERCONDUCTING_SPOOL`，注册 id `superconducting_spool`。 | 给超导线缆体系提供物品注册入口；资源和配方由 KubeJS 提供。 |
| `com/mrh0/createaddition/index/CABlocks.badiff` | 已还原 | 新增 `BlockEntry<SuperconductingConnectorBlock> SUPERCONDUCTING_CONNECTOR`；注册 id `superconducting_connector`，初始属性使用 `SharedProperties::softMetal`，和普通连接器一样挂 `NodeMovementBehaviour`，物品模型走 `ModelGen.customItemModel()`。 | 注册超导连接器方块，使其能作为 Create Addition 连接器参与移动结构和物品显示。 |
| `com/mrh0/createaddition/index/CABlockEntities.badiff` | 已还原 | 新增 `BlockEntityEntry<SuperconductingConnectorBlockEntity> SUPERCONDUCTING_CONNECTOR`；注册 id `superconducting_connector`，有效方块为 `CABlocks.SUPERCONDUCTING_CONNECTOR`，渲染器使用 `ConnectorRenderer`。 | 给超导连接器注册方块实体和连接器渲染。 |
| `com/mrh0/createaddition/blocks/connector/ConnectorType.badiff` | 已还原 | 在枚举中新增 `Superconducting("superconducting")`，位于 `Small` 和 `Large` 之间。 | 让连接器逻辑能区分超导连接器类型。 |
| `com/mrh0/createaddition/energy/WireType.badiff` | 已还原 | 新增 `SUPERCONDUCTING(4, Integer.MAX_VALUE, 134, 146, 252, CAItems.SUPERCONDUCTING_WIRE.asStack(4), CAItems.SUPERCONDUCTING_SPOOL.asStack())`；`fromIndex(4)` 返回 `SUPERCONDUCTING`；`fromSpool(...)` 识别 `SUPERCONDUCTING_SPOOL`。 | 新增无限传输上限的超导线缆类型，并让线轴物品能解析为该线缆。 |
| `com/mrh0/createaddition/energy/WireConnectResult.badiff` | 已还原 | 新增结果 `REQUIRES_SUPERCONDUCTING`，翻译键为 `statusbar.createaddition.wire.requires_superconducting`，红色提示。 | 玩家用非超导线缆连接超导连接器时能看到专门失败提示。 |
| `com/mrh0/createaddition/energy/IWireNode.badiff` | 已还原 | `connect(...)` 中新增限制：两端连接器类型都是 `ConnectorType.Superconducting` 且线缆不是 `WireType.SUPERCONDUCTING` 时，返回 `REQUIRES_SUPERCONDUCTING`；其余距离、重复连接和大连接器铜线限制保持。 | 超导连接器之间只能用超导线轴连接，防止普通线缆绕过高阶电力线设计。 |
| `com/mrh0/createaddition/energy/network/EnergyNetwork.badiff` | 已还原 | `MAX_BUFF` 从 80000 提升到 `Integer.MAX_VALUE`；新增 `saturatedAdd` 防止统计值溢出；`getMaxBuff()` 改用 long 中间值并夹到 int 范围；`push`、`demand`、`pull` 改为饱和/夹取逻辑，避免负剩余容量和 int 溢出。 | 支持超导线缆的大吞吐网络，同时降低能量缓存和统计溢出风险。 |
| `com/mrh0/createaddition/blocks/connector/SuperconductingConnectorBlock.badiff` | 当前未还原 | 当前 `createaddition-1.20.1-1.3.3.jar` 直接扫描未找到目标 class，无法反推出补丁前后差异；旧 `logs/latest.log` 曾出现 `Patched class: com/mrh0/createaddition/blocks/connector/SuperconductingConnectorBlock`。 | 疑似历史版本中已有该 class 或运行环境曾包含额外来源。更新 Create Addition 或 HotAI 补丁时需重新启动验证注册。 |
| `com/mrh0/createaddition/blocks/connector/SuperconductingConnectorBlockEntity.badiff` | 当前未还原 | 当前 Create Addition JAR 直接扫描未找到目标 class；旧日志曾显示已 patch。 | 可能是超导连接器方块实体实现补丁，但当前无法确认方法级改动。 |
| `com/mrh0/createaddition/blocks/connector/SuperconductingConnectorBlockEntity$1.badiff` | 当前未还原 | 当前 Create Addition JAR 直接扫描未找到目标 inner class；旧日志未单独显示 inner class。 | 可能是超导连接器方块实体的匿名 capability / handler 类补丁，需实际启动验证。 |

## TACZ / Kinetic Pixel

| 文件 | 状态 | 具体改动 | 影响 |
|---|---|---|---|
| `com/tacz/guns/init/ModCreativeTabs.badiff` | 已还原 | 移除 `DefaultAssets` 默认图标引用；把 TACZ 各创造页签图标替换为整合包枪械线资产：弹药 `create_armorer:slap`，瞄具 `create_armorer:scope_telephoto`，枪口 `create_armorer:muzzle_refit_brass_retractor`，枪托 `applied_armorer:bracelet_zenith`，握把 `create_armorer:grip_gantry_shaft`，扩容弹匣 `create_armorer:extended_mag_ca_3`，手枪 `create_armorer:pistol_auto_stress`，狙击枪 `create_armorer:sniper_semi_clockwork`，步枪 `create_armorer:rifle_assult_crane`，霰弹枪 `create_armorer:shotgun_pump_bearing`，冲锋枪 `create_armorer:smg_auto_crank`，RPG 页 `create_armorer:special_melee_wrench`，机枪 `create_armorer:mg_platemag_flywheel`。 | 创造模式中 TACZ 页签直接展示整合包自定义军械内容，而不是 TACZ 默认枪械。 |

## Create Mechanical Spawner

| 文件 | 状态 | 具体改动 | 影响 |
|---|---|---|---|
| `com/oierbravo/create_mechanical_spawner/foundation/utility/LivingEntityHelper.badiff` | 已还原 | 在指定实体和随机实体创建路径中，把 `EntityType#create(Level)` 替换为 `EntityType#create(ServerLevel, BlockPos, MobSpawnType.SPAWNER)`；新增 `MobSpawnType` import。 | 生成实体带有刷怪笼生成上下文，改善依赖生成原因、位置或服务端世界的实体兼容性。 |

## Vintage Improvements

| 文件 | 状态 | 具体改动 | 影响 |
|---|---|---|---|
| `com/negodya1/vintageimprovements/infrastructure/ponder/VintagePonderScene.badiff` | 已还原 | 移除 `BeltGrinderScenes` import；删除 `VintageBlocks.BELT_GRINDER` 的 `belt_grinder/processing` storyboard 注册。 | 禁用 Vintage Improvements 砂带磨床 Ponder 场景。 |
| `com/negodya1/vintageimprovements/infrastructure/ponder/VintagePonderTag.badiff` | 已还原 | 从 `AllCreatePonderTags.KINETIC_APPLIANCES` 添加链中移除 `VintageBlocks.BELT_GRINDER`，保留弹簧卷曲机、真空室、振动台、离心机等其他机器。 | 砂带磨床不再出现在 Create Ponder 动力设备标签页里。 |

## Neapolitan

| 文件 | 状态 | 具体改动 | 影响 |
|---|---|---|---|
| `com/teamabnormals/neapolitan/core/Neapolitan.badiff` | 已还原 | 移除 `NeapolitanItems` import；客户端 `DistExecutor.unsafeRunWhenOn` 块中删除 `NeapolitanBlocks.setupTabEditors()` 和 `NeapolitanItems.setupTabEditors()`，保留模型层、渲染器和头颅模型注册。 | 阻止 Neapolitan 自行编辑创造模式页签，减少与整合包/其他模组页签整理的冲突。 |

## Better Compatibility Checker

| 文件 | 状态 | 具体改动 | 影响 |
|---|---|---|---|
| `dev/wuffs/bcc/mixins/ServerStatusPingerMixin.badiff` | 已还原 | 不再 `@Shadow @Final ServerData val$p_105460_`；新增静态 `SERVER_DATA_FIELD`，优先反射字段 `val$p_105460_`，失败时遍历匿名类字段找 `ServerData` 类型；注入方法同时声明反混淆名和混淆名，注入点改为 TAIL，`remap=false`、`require=0`；反射失败时在 Minecraft 线程抛出 Error。 | 降低 Minecraft/Forge 映射字段名变化导致 BCC 服务器列表 ping mixin 失效的概率。 |

## Quality Food

| 文件 | 状态 | 具体改动 | 影响 |
|---|---|---|---|
| `de/cadentem/quality_food/mixin/BlockMixin.badiff` | 已还原 | `quality_food$applyQuality` 移除 `dropData == null` 时对掉落物调用 `QualityUtils.applyQuality(stack, null)` 的 fallback；新增 `Utils.isValidBlock(dropData.state())` 判断，只有存在 `DropData` 且来源方块有效时才按方块状态、品质、玩家和耕地信息应用品质。 | 避免无方块上下文的掉落物被 Quality Food 随机套品质；只让白名单/有效方块掉落继承品质。 |

## Create New Age

| 文件 | 状态 | 具体改动 | 影响 |
|---|---|---|---|
| `org/antarcticgardens/newage/CreateNewAgePonders.badiff` | 当前未还原 | 当前 `create-new-age-1.2.0+forge-mc1.20.1.jar` 中 Ponder 类路径为 `org/antarcticgardens/cna/content/ponders/CNAPonders`，未找到 `org/antarcticgardens/newage/CreateNewAgePonders`。旧 badiff 可读常量显示它针对旧包名下的 PonderPlugin / Ponder 场景与标签注册；当前 `CNAPonders` 仍承担 `registerScenes` / `registerTags`，但已切换到 `CNABlocks`、`CNAItems` 和 `content/ponders/*`。该 badiff 首次加入于 `e11d47f206c1e9cb28bdf506698c824586f9b00c`，提交标题为 `删除cna中无用的ponder (#649)`，同提交还修改了 `kubejs/assets/create_new_age/lang/zh_cn.json`，删除了 CNA heating、heater、reactor、wires 等 Ponder 文案。 | 旧补丁不能直接应用到当前 `CNAPonders`。结合提交信息，最可信的语义不是泛化的 Ponder API 适配，而是移除当时 Create New Age 中不需要展示的 Ponder 场景和标签；若仍需要该行为，应基于当前 `CNAPonders` 重新生成“删除无用 Ponder”补丁，不能只改路径复用旧 badiff。 |

## Bakeries

| 文件 | 状态 | 具体改动 | 影响 |
|---|---|---|---|
| `com/renyigesai/bakeries/api/block/properties/ModIntegerProperty.badiff` | 当前未还原 | 当前 `bakeries-1.20.1-forge-1.2.5.jar` 未找到 `api/block/properties/ModIntegerProperty`。旧 badiff 常量显示该类是 `Property<Integer>` 子类，含 `create(String, int, int)` 工厂、整数值集合和 `getName(Integer)` / 字符串解析逻辑；当前相近类只有 `com/renyigesai/bakeries/block/state/BakeriesEnumProperty`，它是 `StringRepresentable` 枚举 `NONE/BRASS/ONE_SHAPE/TWO_SHAPE`。该 badiff 首次加入于 `3f499561ab68a1262b14e777f2f1d30dcaa4e2aa`，提交标题为 `开启dynamic_resources (#715)`，同提交新增 `config/modernfix-mixins.properties` 并启用 `mixin.perf.dynamic_resources=true`。 | 当前未找到语义匹配的新类；不应把旧整数属性补丁迁移到 `BakeriesEnumProperty`。结合提交信息，最可信的语义是让 Bakeries 旧自定义整数方块状态属性适配 ModernFix dynamic resources / 资源加载优化；若 Bakeries 仍有旧问题，需要先定位具体方块状态崩溃或资源重载异常，再基于当前类重新补丁。 |

## 维护建议

- 对“已还原”条目，更新目标模组后应重新运行 class diff 或至少确认启动日志中仍有对应 `Patched class:`。
- 修改 `hotai/**/*.badiff` 后运行 `scripts/update-hotai-docs.ps1` 更新 `HOTAI_STATUS` 区块；`scripts/validate-knowledge-base.ps1` 会用 `-Check` 检查该区块是否过期。
- 对“当前未还原”条目，优先判断目标模组是否已改名、移除或被替换；如果连续版本都没有启动日志命中，可以考虑清理对应 `.badiff`。
- 超导连接器相关补丁要和 `kubejs/assets/createaddition/`、`kubejs/server_scripts/Create Addition/` 一起验证；只看 HotAI class patch 不足以证明玩法完整。


