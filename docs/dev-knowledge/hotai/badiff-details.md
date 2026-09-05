# hotai badiff 逐文件明细

本文逐个记录 `hotai/**/*.badiff` 的补丁内容。已还原条目基于当前 `mods/*.jar` 中的目标 class、`hotai` 对 class 的 ASM 归一化方式、以及补丁后 class 的反编译 diff；静态 JAR 未找到目标 class 时还需结合启动日志判断 `hotai` 是否动态创建该类。

代码块是“等价改动摘要”，不是完整反编译源码。它们用于表达字段、方法、条件和注册项的变化，避免把第三方模组源码整段复制进仓库。

`HOTAI_STATUS` 区块由 `scripts/update-hotai-docs.ps1` 维护，区分静态 JAR 命中、启动日志确认的动态创建和未确认项；方法级语义、历史提交依据和迁移建议仍写在人工维护区。

## 当前生效性核查（2026-07-29）

核查方法：逐个读取当前 `hotai/**/*.badiff`，扫描当前 `mods/*.jar` 中的同名目标 class，并核对 `logs/latest.log` 的 `Patched class:` 记录。Forge ModLauncher 会为不存在原始字节码、但被转换器声明为目标的类创建空 `ClassNode`；`hotai` 可对其应用 `.badiff` 并动态创建完整类，因此静态 JAR 未命中不是失效结论。

| 对应模组 | 当前 JAR / 状态 | 补丁结果 | 结论 |
|---|---|---|---|
| hotai | `mods/hotai-1.0.jar` 存在 | 补丁加载器存在。 | `hotai` 本体可用。 |
| Create | `create-1.20.1-6.0.8.jar` | 4/4 可应用：`FluidManipulationBehaviour`、`FluidDrainingBehaviour`、`ItemDrainCategory`、`CTSpriteShifter`。 | 当前可生效。 |
| Create Liquid Fuel | `createliquidfuel-2.1.1-1.20.1.jar` | 2/2 可应用：`BurnerStomachHandler`、`MixinBlazeBurnerTileEntity`。 | 当前可生效。 |
| Create Addition | `createaddition-1.20.1-1.3.3.jar` | 11/14 静态命中；`SuperconductingConnectorBlock` 与 `SuperconductingConnectorBlockEntity` 已在当前启动日志确认由 `hotai` 动态创建；`SuperconductingConnectorBlockEntity$1` 尚未在本次启动日志出现。 | 超导连接器实现类不在上游 JAR 中，而由对应 `.badiff` 创建；匿名内部类可能按需加载，需在实际使用超导连接器时继续核对日志。 |
| Vintage Improvements | `vintageimprovements-1.20.1-0.3.7.8.jar` | 2/2 目标 class 命中：`VintagePonderScene`、`VintagePonderTag`。 | 当前 JAR 可匹配。 |
| TACZ | `tacz-1.20.1-1.1.8-hotfix.jar` | 1/1 可应用：`ModCreativeTabs`。 | 已按 1.1.8 重建并完成客户端页签回归。 |
| TACZ-addon | `taczaddon-1.20.1-1.1.8-hotfix2-for-new-soph.jar` | 1/1 可应用：`ShoulderSurfingCompatInner`。 | 已按 Shoulder Surfing 5.0.7 API 重建，已完成开镜回归。 |
| Neapolitan | `neapolitan-1.20.1-5.1.0.jar` | 1/1 可应用：`Neapolitan`。 | 当前可生效。 |
| Better Compatibility Checker | `BetterCompatibilityChecker-3.0.1-build.58+mc1.20.jar` | 1/1 可应用：`ServerStatusPingerMixin`。 | 当前可生效。 |
| IAF Dragon Fix | `iafdragonfix-2.0.0.jar` | `DragonDenPiece.class` 已由 HotAI 转存为运行时 `.badiff`，启动日志记录 `Patched class`。 | 当前 JAR 已完成首次转换启动；配套禁止群系标签由 KubeJS 数据包提供，badiff 第二次启动重放仍待确认。 |
| Quality Food | `quality_food-1.20.1-2.3.3-all.jar` | 1/1 目标 class 命中：`BlockMixin`。 | 当前 JAR 可匹配。 |
| Create New Age | `create-new-age-1.2.0+forge-mc1.20.1.jar` | 1/1 可应用：旧 `org/antarcticgardens/newage/CreateNewAgePonders` 补丁已替换为当前路径 `org/antarcticgardens/cna/content/ponders/CNAPonders`。 | 当前可生效；补丁继续实现提交 `e11d47f206c1e9cb28bdf506698c824586f9b00c`（`删除cna中无用的ponder (#649)`）的意图，移除 heating、heater、reactor、wires 场景与对应标签。 |

总计：当前 26 个 `.badiff` 中 23 个静态 JAR 命中，2 个由当前启动日志确认动态创建，1 个尚未在当前启动日志确认。三个静态未命中项均属于 Create Addition 超导连接器实现类，不应仅因 JAR 扫描未命中而删除。Create New Age 旧路径补丁已完成迁移。

<!-- HOTAI_STATUS:BEGIN -->
> 本区块由 `scripts/update-hotai-docs.ps1` 生成。修改 `hotai/**/*.badiff` 后运行该脚本；人工解释写在区块外。

当前扫描到 29 个 `.badiff`；静态 JAR 命中 25 个，静态未命中但已由当前启动日志确认动态创建 3 个，尚未由当前启动日志确认 1 个。

| 模组/领域 | 补丁文件 | 目标 class | 静态 JAR / 运行时状态 |
|---|---|---|---|
| Create Liquid Fuel | `hotai/com/forsteri/createliquidfuel/core/BurnerStomachHandler.badiff` | `com/forsteri/createliquidfuel/core/BurnerStomachHandler` | 静态命中 `createliquidfuel-2.1.1-1.20.1.jar` |
| Create Liquid Fuel | `hotai/com/forsteri/createliquidfuel/mixin/MixinBlazeBurnerTileEntity.badiff` | `com/forsteri/createliquidfuel/mixin/MixinBlazeBurnerTileEntity` | 静态命中 `createliquidfuel-2.1.1-1.20.1.jar` |
| IAF Dragon Fix | `hotai/com/iafdragonfix/structure/DragonDenPiece.badiff` | `com/iafdragonfix/structure/DragonDenPiece` | 静态命中 `iafdragonfix-2.0.0.jar` |
| Unknown | `hotai/com/inolia_zaicek/more_mod_tetra/Modular/ModularMMTBow.badiff` | `com/inolia_zaicek/more_mod_tetra/Modular/ModularMMTBow` | 静态命中 `more_mod_tetra-2.4.15-all.jar` |
| TACZ-addon | `hotai/com/mafuyu404/taczaddon/compat/ShoulderSurfingCompatInner.badiff` | `com/mafuyu404/taczaddon/compat/ShoulderSurfingCompatInner` | 静态命中 `taczaddon-1.20.1-1.1.8-hotfix2-for-new-soph.jar` |
| Create Addition | `hotai/com/mrh0/createaddition/blocks/connector/ConnectorType.badiff` | `com/mrh0/createaddition/blocks/connector/ConnectorType` | 静态命中 `createaddition-1.20.1-1.3.3.jar` |
| Create Addition | `hotai/com/mrh0/createaddition/blocks/connector/SuperconductingConnectorBlock.badiff` | `com/mrh0/createaddition/blocks/connector/SuperconductingConnectorBlock` | 运行时已确认动态创建（静态 JAR 无此 class） |
| Create Addition | `hotai/com/mrh0/createaddition/blocks/connector/SuperconductingConnectorBlockEntity$1.badiff` | `com/mrh0/createaddition/blocks/connector/SuperconductingConnectorBlockEntity$1` | 静态 JAR 无此 class；当前启动日志未确认（可能按需加载） |
| Create Addition | `hotai/com/mrh0/createaddition/blocks/connector/SuperconductingConnectorBlockEntity.badiff` | `com/mrh0/createaddition/blocks/connector/SuperconductingConnectorBlockEntity` | 运行时已确认动态创建（静态 JAR 无此 class） |
| Create Addition | `hotai/com/mrh0/createaddition/energy/IWireNode.badiff` | `com/mrh0/createaddition/energy/IWireNode` | 静态命中 `createaddition-1.20.1-1.3.3.jar` |
| Create Addition | `hotai/com/mrh0/createaddition/energy/network/EnergyNetwork.badiff` | `com/mrh0/createaddition/energy/network/EnergyNetwork` | 静态命中 `createaddition-1.20.1-1.3.3.jar` |
| Create Addition | `hotai/com/mrh0/createaddition/energy/WireConnectResult.badiff` | `com/mrh0/createaddition/energy/WireConnectResult` | 静态命中 `createaddition-1.20.1-1.3.3.jar` |
| Create Addition | `hotai/com/mrh0/createaddition/energy/WireType.badiff` | `com/mrh0/createaddition/energy/WireType` | 静态命中 `createaddition-1.20.1-1.3.3.jar` |
| Create Addition | `hotai/com/mrh0/createaddition/index/CABlockEntities.badiff` | `com/mrh0/createaddition/index/CABlockEntities` | 静态命中 `createaddition-1.20.1-1.3.3.jar` |
| Create Addition | `hotai/com/mrh0/createaddition/index/CABlocks.badiff` | `com/mrh0/createaddition/index/CABlocks` | 静态命中 `createaddition-1.20.1-1.3.3.jar` |
| Create Addition | `hotai/com/mrh0/createaddition/index/CAItems.badiff` | `com/mrh0/createaddition/index/CAItems` | 静态命中 `createaddition-1.20.1-1.3.3.jar` |
| Create Addition | `hotai/com/mrh0/createaddition/index/CAPonders.badiff` | `com/mrh0/createaddition/index/CAPonders` | 静态命中 `createaddition-1.20.1-1.3.3.jar` |
| Vintage Improvements | `hotai/com/negodya1/vintageimprovements/infrastructure/ponder/VintagePonderScene.badiff` | `com/negodya1/vintageimprovements/infrastructure/ponder/VintagePonderScene` | 静态命中 `vintageimprovements-1.20.1-0.3.7.8.jar` |
| Vintage Improvements | `hotai/com/negodya1/vintageimprovements/infrastructure/ponder/VintagePonderTag.badiff` | `com/negodya1/vintageimprovements/infrastructure/ponder/VintagePonderTag` | 静态命中 `vintageimprovements-1.20.1-0.3.7.8.jar` |
| Create | `hotai/com/simibubi/create/compat/jei/category/ItemDrainCategory.badiff` | `com/simibubi/create/compat/jei/category/ItemDrainCategory` | 静态命中 `create-1.20.1-6.0.8.jar` |
| Create | `hotai/com/simibubi/create/content/fluids/transfer/FluidDrainingBehaviour.badiff` | `com/simibubi/create/content/fluids/transfer/FluidDrainingBehaviour` | 静态命中 `create-1.20.1-6.0.8.jar` |
| Create | `hotai/com/simibubi/create/content/fluids/transfer/FluidManipulationBehaviour.badiff` | `com/simibubi/create/content/fluids/transfer/FluidManipulationBehaviour` | 静态命中 `create-1.20.1-6.0.8.jar` |
| Create | `hotai/com/simibubi/create/foundation/block/connected/CTSpriteShifter.badiff` | `com/simibubi/create/foundation/block/connected/CTSpriteShifter` | 静态命中 `create-1.20.1-6.0.8.jar` |
| TACZ | `hotai/com/tacz/guns/init/ModCreativeTabs.badiff` | `com/tacz/guns/init/ModCreativeTabs` | 静态命中 `tacz-1.20.1-1.1.8-hotfix.jar` |
| Neapolitan | `hotai/com/teamabnormals/neapolitan/core/Neapolitan.badiff` | `com/teamabnormals/neapolitan/core/Neapolitan` | 静态命中 `neapolitan-1.20.1-5.1.0.jar` |
| Quality Food | `hotai/de/cadentem/quality_food/mixin/BlockMixin.badiff` | `de/cadentem/quality_food/mixin/BlockMixin` | 静态命中 `quality_food-1.20.1-2.4.3-all.jar` |
| Better Compatibility Checker | `hotai/dev/wuffs/bcc/mixins/ServerStatusPingerMixin.badiff` | `dev/wuffs/bcc/mixins/ServerStatusPingerMixin` | 静态命中 `BetterCompatibilityChecker-3.0.1-build.58+mc1.20.jar` |
| Unknown | `hotai/net/yiran/rebalancing/core/mixins/AttributeHelperMixin.badiff` | `net/yiran/rebalancing/core/mixins/AttributeHelperMixin` | 运行时已确认动态创建（静态 JAR 无此 class） |
| Create New Age | `hotai/org/antarcticgardens/cna/content/ponders/CNAPonders.badiff` | `org/antarcticgardens/cna/content/ponders/CNAPonders` | 静态命中 `create-new-age-1.2.0+forge-mc1.20.1.jar` |
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

### Create Liquid Fuel 补丁

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
boolean firstSuperconducting = wn1.getConnectorType() == ConnectorType.Superconducting;
boolean secondSuperconducting = wn2.getConnectorType() == ConnectorType.Superconducting;
if (firstSuperconducting != secondSuperconducting) {
    return WireConnectResult.INVALID;
}
if (firstSuperconducting && type != WireType.SUPERCONDUCTING) {
    return WireConnectResult.REQUIRES_SUPERCONDUCTING;
}
if (!firstSuperconducting && type == WireType.SUPERCONDUCTING) {
    return WireConnectResult.INVALID;
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
    if (energy <= 0) return 0;
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
    if (energy <= 0 || outBuff <= 0) return 0;
    int actual = Math.min(energy, outBuff);
    if (!simulate) {
        outBuff = Math.max(outBuff - actual, 0);
        pulled = saturatedAdd(pulled, actual);
    }
    return actual;
}
```

```java
// CAPonders.badiff
// registerTags: 不再把 CAItems.STRAW 加入 AllCreatePonderTags.FLUIDS。
// registerScenes: 不再以 CAItems.STRAW 注册 liquid_blaze_burner；
//                 AllBlocks.BLAZE_BURNER 的同名场景仍保留。
```

```java
// SuperconductingConnectorBlock*.badiff
// 上游 JAR 没有目标 class；ModLauncher 提供空 ClassNode，hotai 据此动态创建。
// 当前启动日志已确认 Block 与 BlockEntity；$1 需在实际使用时继续验证。
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
// CNAPonders.badiff
// 删除 WIRING、HEATING、REACTOR 三个 Ponder 标签及其注册项。
// 删除 heating、heater、reactor、wires 场景注册。
// 保留 ELECTRICAL、MAGNETS、ELECTRICITY_GENERATION、MOTOR_EXTENSION。
```

## 待首次启动转存的 MMT class

`hotai/net/yiran/rebalancing/core/mixins/AttributeHelperMixin.class` 是供人工反编译审阅的完整 Java 17 class，当前长度 6349 字节，SHA-256 为 `12346144BFA21040CDC8B2DC36DCD24698C579B1E73BF9AA9C6E77FCC4714514`。它不属于上方只扫描 `.badiff` 的 `HOTAI_STATUS` 生成区块；在客户端首次加载前，不得将它记录成已转存或已重放。

等价改动摘要：

- 注入方法为 `AttributeHelper#round(Attribute, AttributeModifier)`，注入点仍是 `@At("STORE")`。
- `@ModifyVariable` 的目标局部变量名从 `multiplier` 改为 `rounding`。
- 原处理器 `multiplier(double)` 的返回常量从 `1000d` 改为 `0.001d`。

MMT 原 class 针对 Tetra 6.9 的局部变量名 `multiplier`，返回 `1000d`，对应“属性值乘以倍率、取整、再除回”的实现。Tetra 6.17 改为“属性值除以步长、取整、再乘回”，局部变量名也改为 `rounding`；因此只改注入变量名会把精度语义反转，必须同时把 `1000d` 换成等价步长 `0.001d`。`javap -c -v` 已确认常量和 Mixin 注解，但仍需首次启动观察 `.class → .badiff` 转存，再在第二次启动确认 `MemoryDiff` 重放与 `Patched class: net/yiran/rebalancing/core/mixins/AttributeHelperMixin` 日志。

## Create 补丁

| 文件 | 状态 | 具体改动 | 影响 |
|---|---|---|---|
| `com/simibubi/create/content/fluids/transfer/FluidManipulationBehaviour.badiff` | 已还原 | 将 `search(...)` 的循环退出条件从直接检查 `visited.size() > maxBlocks && canDrainInfinitely(fluid)` 改为调用 `canContinueSearch(fluid, visited, maxBlocks)`；在找到匹配流体后调用新增钩子 `onMatchingFluidBlockFound(visited, fluidState)`；新增两个 protected 默认方法，默认行为保持原版按访问方块数量限制搜索。 | 为 `FluidDrainingBehaviour` 提供按源方块计数的扩展点，避免改动填充等其他流体行为。 |
| `com/simibubi/create/content/fluids/transfer/FluidDrainingBehaviour.badiff` | 已还原 | 新增 `sourceBlocksFound` 和 `validationSourceBlocksFound`；抽液目标识别改用 `FluidState`，要求非空、可作为源流体并且碰撞形状为空；`getFluidBlockType` 对非 `LiquidBlock` 流体区分 `SOURCE` 和 `FLOWING`；覆写 `canContinueSearch` 和 `onMatchingFluidBlockFound`，只按源方块数量判断无限流体；`reset`、`revalidate`、chunk 未加载和搜索完成时清空新增计数器。 | 分液池不再因为流动液体路径过长而提前触发无限流体判断，也不会把流动液体当成源方块抽取。 |
| `com/simibubi/create/compat/jei/category/ItemDrainCategory.badiff` | 已还原 | JEI 枚举可分液物品时，先检查原物品有 `FLUID_HANDLER_ITEM`，复制 `ItemStack` 后重新获取 capability；若复制后 capability 消失，写入 Create logger warn 并跳过。 | 避免某些物品复制后 capability 丢失导致 JEI 分液分类初始化异常。 |
| `com/simibubi/create/foundation/block/connected/CTSpriteShifter.badiff` | 已还原 | `ENTRY_CACHE` 从 `HashMap` 改为 `ConcurrentHashMap`；缓存 key 仍由原贴图、连接贴图和 `CTType` id 组成，只简化字符串拼接。 | 降低连接纹理并发注册或资源重载时的缓存竞态风险。 |

## Create Liquid Fuel 补丁

| 文件 | 状态 | 具体改动 | 影响 |
|---|---|---|---|
| `com/forsteri/createliquidfuel/core/BurnerStomachHandler.badiff` | 已还原 | `tick(SmartBlockEntity)` 从 `void` 改为 `boolean`，只有成功消耗液体燃料并增加燃烧时间时返回 true；早退路径全部返回 false。`tryUpdateFuel(...)` 改用 `IFluidHandlerItem`，失败路径显式 `cir.setReturnValue(false)`；检查燃烧室剩余容量，按 `min(space, fluidStack.amount)` 部分抽取容器流体并 `stomach.fill(...)`；新增 `syncContainerState`，把容器扣除后的 count、NBT 和 damage 同步回手持堆叠。 | 修复向液体烈焰人燃烧室倒入流体时可能不扣容器、超容量或错误成功的问题。 |
| `com/forsteri/createliquidfuel/mixin/MixinBlazeBurnerTileEntity.badiff` | 已还原 | `tick` 注入点从方法尾部改到第二次调用 `BlazeBurnerBlockEntity.updateBlockState()` 前；注入改为 `cancellable=true`；当 `BurnerStomachHandler.tick(this)` 返回 true 时取消原 tick 后续逻辑。 | 液体燃料成功接管燃烧状态时，不再让原版后续逻辑覆盖热量或燃烧时间。 |

## Create Addition 补丁

| 文件 | 状态 | 具体改动 | 影响 |
|---|---|---|---|
| `com/mrh0/createaddition/index/CAItems.badiff` | 已还原 | 新增 `ItemEntry<Item> SUPERCONDUCTING_WIRE`，注册 id `superconducting_wire`；新增 `ItemEntry<WireSpool> SUPERCONDUCTING_SPOOL`，注册 id `superconducting_spool`。 | 给超导线缆体系提供物品注册入口；资源和配方由 KubeJS 提供。 |
| `com/mrh0/createaddition/index/CABlocks.badiff` | 已还原 | 新增 `BlockEntry<SuperconductingConnectorBlock> SUPERCONDUCTING_CONNECTOR`；注册 id `superconducting_connector`，初始属性使用 `SharedProperties::softMetal`，和普通连接器一样挂 `NodeMovementBehaviour`，物品模型走 `ModelGen.customItemModel()`。 | 注册超导连接器方块，使其能作为 Create Addition 连接器参与移动结构和物品显示。 |
| `com/mrh0/createaddition/index/CABlockEntities.badiff` | 已还原 | 新增 `BlockEntityEntry<SuperconductingConnectorBlockEntity> SUPERCONDUCTING_CONNECTOR`；注册 id `superconducting_connector`，有效方块为 `CABlocks.SUPERCONDUCTING_CONNECTOR`，渲染器使用 `ConnectorRenderer`。 | 给超导连接器注册方块实体和连接器渲染。 |
| `com/mrh0/createaddition/blocks/connector/ConnectorType.badiff` | 已还原 | 在枚举中新增 `Superconducting("superconducting")`，位于 `Small` 和 `Large` 之间。 | 让连接器逻辑能区分超导连接器类型。 |
| `com/mrh0/createaddition/energy/WireType.badiff` | 已还原 | 新增 `SUPERCONDUCTING(4, Integer.MAX_VALUE, 134, 146, 252, CAItems.SUPERCONDUCTING_WIRE.asStack(4), CAItems.SUPERCONDUCTING_SPOOL.asStack())`；`fromIndex(4)` 返回 `SUPERCONDUCTING`；`fromSpool(...)` 识别 `SUPERCONDUCTING_SPOOL`。 | 新增无限传输上限的超导线缆类型，并让线轴物品能解析为该线缆。 |
| `com/mrh0/createaddition/energy/WireConnectResult.badiff` | 已还原 | 新增结果 `REQUIRES_SUPERCONDUCTING`，翻译键为 `statusbar.createaddition.wire.requires_superconducting`，红色提示。 | 玩家用非超导线缆连接超导连接器时能看到专门失败提示。 |
| `com/mrh0/createaddition/energy/IWireNode.badiff` | 已还原 | `connect(...)` 先判断两端是否都是 `ConnectorType.Superconducting`：一端为超导而另一端不是时返回 `INVALID`；两个超导连接器使用非超导线时返回 `REQUIRES_SUPERCONDUCTING`；普通连接器使用超导线时返回 `INVALID`。其余距离、重复连接和大连接器铜线限制保持。 | 超导线缆和超导连接器只能成套使用，禁止超导/普通连接器混接或让普通连接器使用超导线。 |
| `com/mrh0/createaddition/energy/network/EnergyNetwork.badiff` | 已还原 | `MAX_BUFF` 从 80000 提升到 `Integer.MAX_VALUE`；新增 `saturatedAdd` 防止统计值溢出；`getMaxBuff()` 改用 long 中间值并夹到 int 范围；`push`、`demand`、`pull` 改为饱和/夹取逻辑，且 `push`、`pull` 对非正数请求直接返回 0。 | 支持超导线缆的大吞吐网络，同时降低能量缓存和统计溢出风险，避免负数推拉反向修改缓冲。 |
| `com/mrh0/createaddition/index/CAPonders.badiff` | 已还原 | `registerTags(...)` 移除 `CAItems.STRAW` 到 `AllCreatePonderTags.FLUIDS` 的映射；`registerScenes(...)` 移除以 `CAItems.STRAW` 为入口的 `liquid_blaze_burner` 场景，保留 `AllBlocks.BLAZE_BURNER` 的同名场景。 | 吸管不再重复展示液体烈焰人燃烧室 Ponder，燃烧室本体仍可查看。 |
| `com/mrh0/createaddition/blocks/connector/SuperconductingConnectorBlock.badiff` | 运行时已确认动态创建 | 上游 JAR 不含目标 class；Forge ModLauncher 为声明的转换目标提供空 `ClassNode`，`hotai` 应用 `.badiff` 后创建完整类。当前 `logs/latest.log` 已记录 `Patched class`。 | 这是超导连接器方块的实现补丁；更新 Create Addition 或 `hotai` 后需重新启动验证注册。 |
| `com/mrh0/createaddition/blocks/connector/SuperconductingConnectorBlockEntity.badiff` | 运行时已确认动态创建 | 上游 JAR 不含目标 class；当前 `logs/latest.log` 已记录 `Patched class`，说明 `hotai` 已应用该 `.badiff` 创建方块实体类。 | 为超导连接器提供方块实体实现；仍需游戏内验证注册和渲染。 |
| `com/mrh0/createaddition/blocks/connector/SuperconductingConnectorBlockEntity$1.badiff` | 动态创建待按需确认 | 上游 JAR 不含目标匿名内部类；当前启动日志尚无对应 `Patched class`，可能尚未走到加载路径。 | 预期为超导连接器方块实体的匿名 capability / handler 类；在实际使用超导连接器后检查日志。 |

## TACZ / Kinetic Pixel 补丁

| 文件 | 状态 | 具体改动 | 影响 |
|---|---|---|---|
| `com/tacz/guns/init/ModCreativeTabs.badiff` | 已按 TACZ 1.1.8 重建并完成客户端回归 | 移除 `DefaultAssets` 默认图标引用；把 TACZ 各创造页签图标替换为整合包枪械线资产：弹药 `create_armorer:slap`，瞄具 `create_armorer:scope_telephoto`，枪口 `create_armorer:muzzle_refit_brass_retractor`，枪托 `applied_armorer:bracelet_zenith`，握把 `create_armorer:grip_gantry_shaft`，扩容弹匣 `create_armorer:extended_mag_ca_3`，手枪 `create_armorer:pistol_auto_stress`，狙击枪 `create_armorer:sniper_semi_clockwork`，步枪 `create_armorer:rifle_assult_crane`，霰弹枪 `create_armorer:shotgun_pump_bearing`，冲锋枪 `create_armorer:smg_auto_crank`，RPG 页 `create_armorer:special_melee_wrench`，机枪 `create_armorer:mg_platemag_flywheel`。 | 创造模式中 TACZ 页签直接展示整合包自定义军械内容，而不是 TACZ 默认枪械。 |

| `com/mafuyu404/taczaddon/compat/ShoulderSurfingCompatInner.badiff` | 已运行时验证 | `isShoulderSurfing()` 将 `ShoulderSurfingImpl.getInstance().isShoulderSurfing()` 改为 `ShoulderSurfing.getInstance().isShoulderSurfing()`；`enableShoulderSurfing()` 同步将实例类型和 `Perspective` 枚举从旧 `api/model` 包迁移到 `api/client` 包，仍请求 `SHOULDER_SURFING` 视角。 | `logs/latest.log` 已记录 `Patched class`，第三人称持枪开镜和松开瞄准回归成功；补丁强绑定该 TACZ-addon JAR 与 Shoulder Surfing 5.x API。 |

## Vintage Improvements 补丁

| 文件 | 状态 | 具体改动 | 影响 |
|---|---|---|---|
| `com/negodya1/vintageimprovements/infrastructure/ponder/VintagePonderScene.badiff` | 已还原 | 移除 `BeltGrinderScenes` import；删除 `VintageBlocks.BELT_GRINDER` 的 `belt_grinder/processing` storyboard 注册。 | 禁用 Vintage Improvements 砂带磨床 Ponder 场景。 |
| `com/negodya1/vintageimprovements/infrastructure/ponder/VintagePonderTag.badiff` | 已还原 | 从 `AllCreatePonderTags.KINETIC_APPLIANCES` 添加链中移除 `VintageBlocks.BELT_GRINDER`，保留弹簧卷曲机、真空室、振动台、离心机等其他机器。 | 砂带磨床不再出现在 Create Ponder 动力设备标签页里。 |

## Neapolitan 补丁

| 文件 | 状态 | 具体改动 | 影响 |
|---|---|---|---|
| `com/teamabnormals/neapolitan/core/Neapolitan.badiff` | 已还原 | 移除 `NeapolitanItems` import；客户端 `DistExecutor.unsafeRunWhenOn` 块中删除 `NeapolitanBlocks.setupTabEditors()` 和 `NeapolitanItems.setupTabEditors()`，保留模型层、渲染器和头颅模型注册。 | 阻止 Neapolitan 自行编辑创造模式页签，减少与整合包/其他模组页签整理的冲突。 |

## Better Compatibility Checker 补丁

| 文件 | 状态 | 具体改动 | 影响 |
|---|---|---|---|
| `dev/wuffs/bcc/mixins/ServerStatusPingerMixin.badiff` | 已还原 | 不再 `@Shadow @Final ServerData val$p_105460_`；新增静态 `SERVER_DATA_FIELD`，优先反射字段 `val$p_105460_`，失败时遍历匿名类字段找 `ServerData` 类型；注入方法同时声明反混淆名和混淆名，注入点改为 TAIL，`remap=false`、`require=0`；反射失败时在 Minecraft 线程抛出 Error。 | 降低 Minecraft/Forge 映射字段名变化导致 BCC 服务器列表 ping mixin 失效的概率。 |

## IAF Dragon Fix 补丁

| 文件 | 状态 | 具体改动 | 影响 |
|---|---|---|---|
| `com/iafdragonfix/structure/DragonDenPiece.badiff` | 首次转换启动已确认 | `generateCave(...)` 仅在龙种为 `ICE_CAVE` 时创建 `#createdelight:blocks_ice_dragon_caves` 群系标签，并在实际地下中心的 X/Z 各偏移 `-16/0/16` 组成的 3×3 点阵读取群系；任一点命中标签就提前返回。配套标签包含 `northstar:europan_subsurface_ocean` 与 `alexscaves:abyssal_chasm`。首次错误补丁由 `BadiffCli diff` 生成 `BadiffFileDiff`，与 HotAI 使用 `DefaultSerialization` 读取的 `MemoryDiff` 格式不兼容，触发 `Not all bytes consumed from byte[]`；现有文件由 HotAI 官方 `.class` 转存流程生成。 | 木卫二地下冰龙穴仍可在冰原和山脊区域生成，但不会以地下海或渊海陷窟为中心、也不会跨入其近邻 16 格范围；火星冰龙穴及所有地表龙巢不受影响。首次转换启动已记录 `Patched class` 并成功进入木卫二；仍需第二次启动确认 badiff 重放，以及在新生成区块验证结构分布。 |

## Quality Food 补丁

| 文件 | 状态 | 具体改动 | 影响 |
|---|---|---|---|
| `de/cadentem/quality_food/mixin/BlockMixin.badiff` | 已还原 | `quality_food$applyQuality` 移除 `dropData == null` 时对掉落物调用 `QualityUtils.applyQuality(stack, null)` 的 fallback；新增 `Utils.isValidBlock(dropData.state())` 判断，只有存在 `DropData` 且来源方块有效时才按方块状态、品质、玩家和耕地信息应用品质。 | 避免无方块上下文的掉落物被 Quality Food 随机套品质；只让白名单/有效方块掉落继承品质。 |

## Create New Age 补丁

| 文件 | 状态 | 具体改动 | 影响 |
|---|---|---|---|
| `org/antarcticgardens/cna/content/ponders/CNAPonders.badiff` | 已还原 | 旧 `org/antarcticgardens/newage/CreateNewAgePonders` 补丁已按当前包和注册 API 重建。补丁移除 `WIRING`、`HEATING`、`REACTOR` 字段及标签注册；移除 `heating`、`heater`、`reactor`、`wires` 场景，涉及热管、热泵、太阳能加热板、斯特林引擎、加热器、核反应堆组件、电气连接器及各类导线；保留 `ELECTRICAL`、`MAGNETS`、`ELECTRICITY_GENERATION`、`MOTOR_EXTENSION`。配套 `energiser.nbt`、`generation.nbt`、`motor.nbt`、`motor_extension.nbt` 已按当前方块 id 和方块实体数据刷新。 | 延续 `e11d47f206c1e9cb28bdf506698c824586f9b00c` 的“删除 CNA 无用 Ponder”意图，并让补丁重新命中当前 Create New Age 版本。 |

## 维护建议

- 对“已还原”条目，更新目标模组后应重新运行 class diff 或至少确认启动日志中仍有对应 `Patched class:`。
- 修改 `hotai/**/*.badiff` 后运行 `scripts/update-hotai-docs.ps1` 更新 `HOTAI_STATUS` 区块；`scripts/validate-knowledge-base.ps1` 会用 `-Check` 检查该区块是否过期。
- 对“当前未还原”条目，优先判断目标模组是否已改名、移除或被替换；如果连续版本都没有启动日志命中，可以考虑清理对应 `.badiff`。
- 超导连接器相关补丁要和 `kubejs/assets/createaddition/`、`kubejs/server_scripts/Create Addition/` 一起验证；只看 `hotai` class patch 不足以证明玩法完整。
