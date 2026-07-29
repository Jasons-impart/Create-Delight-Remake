// priority: 100

const DEBUG_ROCKET_BLOCKS = {
    creativeMotor: "create:creative_motor",
    creativeTank: "create:creative_fluid_tank",
    creativeCrate: "create:creative_crate",
    autoLander: "northstar:auto_lander",
    controls: "northstar:rocket_controls",
    station: "northstar:rocket_station",
    seat: "create:red_seat",
    navigator: "northstar:interplanetary_navigator",
    thruster: "northstar:rocket_thruster",
    plating: "northstar:titanium_plating",
    sheetmetal: "northstar:titanium_sheetmetal",
    framedGlass: "create:framed_glass",
    lamp: "northstar:glowstone_lamp",
    door: "northstar:titanium_space_door"
}

function debugRocketPosition(origin, rightX, rightZ, forwardX, forwardZ, right, up, forward) {
    return origin.offset(
        rightX * right + forwardX * forward,
        up,
        rightZ * right + forwardZ * forward
    )
}

function debugRocketBlockState(blockId, facing, half) {
    let block = global.CDServerJavaClasses.$ForgeRegistries.BLOCKS.getValue(
        new global.CDServerJavaClasses.$ResourceLocation(blockId)
    )
    if (block == null)
        return null

    let state = block.defaultBlockState()
    let properties = global.CDServerJavaClasses.$BlockStateProperties
    if (facing != null && state.hasProperty(properties.HORIZONTAL_FACING))
        state = state.setValue(properties.HORIZONTAL_FACING, facing)
    if (half != null && state.hasProperty(properties.DOUBLE_BLOCK_HALF))
        state = state.setValue(properties.DOUBLE_BLOCK_HALF, half)
    return state
}

function createDebugRocket(player) {
    let level = player.level
    // KubeJS command callbacks expose a wrapped player without the vanilla
    // horizontal direction getters. Use a deterministic east-facing placement.
    let forwardX = 1
    let forwardZ = 0
    let rightX = 0
    let rightZ = 1
    let origin = player.blockPosition().offset(12, 1, 0)
    let frontInteriorFacing = global.CDServerJavaClasses.$Direction.EAST
    let rearInteriorFacing = global.CDServerJavaClasses.$Direction.WEST

    let placements = []
    let add = (right, up, forward, id, facing, half) => placements.push({
        right: right,
        up: up,
        forward: forward,
        id: id,
        facing: facing,
        half: half
    })

    // 5x5 engine deck with eight visible thrusters. The creative components
    // remain inside the deck and provide unlimited debug-flight resources.
    for (let right = -2; right <= 2; right++) {
        for (let forward = -2; forward <= 2; forward++) {
            let id = DEBUG_ROCKET_BLOCKS.plating
            if (right == 0 && forward == 0)
                id = DEBUG_ROCKET_BLOCKS.creativeMotor
            else if (right == -1 && forward == 0)
                id = DEBUG_ROCKET_BLOCKS.creativeTank
            else if (right == 1 && forward == 0)
                id = DEBUG_ROCKET_BLOCKS.creativeCrate
            else if ((Math.abs(right) == 2 && Math.abs(forward) == 2) ||
                (right == 0 && Math.abs(forward) == 2) ||
                (Math.abs(right) == 2 && forward == 0))
                id = DEBUG_ROCKET_BLOCKS.thruster
            add(right, 0, forward, id)
        }
    }

    // Full cabin floor and four broad stabilizer fins.
    for (let right = -2; right <= 2; right++)
        for (let forward = -2; forward <= 2; forward++)
            add(right, 1, forward, DEBUG_ROCKET_BLOCKS.plating)
    for (let offset = -1; offset <= 1; offset++) {
        add(-3, 1, offset, DEBUG_ROCKET_BLOCKS.sheetmetal)
        add(3, 1, offset, DEBUG_ROCKET_BLOCKS.sheetmetal)
        add(offset, 1, -3, DEBUG_ROCKET_BLOCKS.sheetmetal)
        add(offset, 1, 3, DEBUG_ROCKET_BLOCKS.sheetmetal)
    }

    // Three-block-high 5x5 cabin shell. Non-corner upper wall sections are
    // windows, and the rear centre uses Northstar's real two-block space door.
    for (let up = 2; up <= 4; up++) {
        for (let right = -2; right <= 2; right++) {
            for (let forward = -2; forward <= 2; forward++) {
                if (Math.abs(right) != 2 && Math.abs(forward) != 2)
                    continue

                if (right == 0 && forward == 2 && (up == 2 || up == 3)) {
                    add(
                        right, up, forward, DEBUG_ROCKET_BLOCKS.door, rearInteriorFacing,
                        up == 2
                            ? global.CDServerJavaClasses.$DoubleBlockHalf.LOWER
                            : global.CDServerJavaClasses.$DoubleBlockHalf.UPPER
                    )
                    continue
                }

                let nonCornerWall = Math.abs(right) != 2 || Math.abs(forward) != 2
                let id = up >= 3 && nonCornerWall
                    ? DEBUG_ROCKET_BLOCKS.framedGlass
                    : DEBUG_ROCKET_BLOCKS.sheetmetal
                add(right, up, forward, id)
            }
        }
    }

    // All functional controls are inside the cabin and face its walkable centre.
    add(-1, 2, -1, DEBUG_ROCKET_BLOCKS.controls, frontInteriorFacing)
    add(1, 2, -1, DEBUG_ROCKET_BLOCKS.station, frontInteriorFacing)
    add(0, 2, 0, DEBUG_ROCKET_BLOCKS.seat)
    add(-1, 2, 1, DEBUG_ROCKET_BLOCKS.autoLander)
    add(
        1, 2, 1, DEBUG_ROCKET_BLOCKS.navigator, rearInteriorFacing,
        global.CDServerJavaClasses.$DoubleBlockHalf.LOWER
    )
    add(
        1, 3, 1, DEBUG_ROCKET_BLOCKS.navigator, rearInteriorFacing,
        global.CDServerJavaClasses.$DoubleBlockHalf.UPPER
    )

    // Full roof and a three-stage tapered nose cone.
    for (let right = -2; right <= 2; right++)
        for (let forward = -2; forward <= 2; forward++)
            add(right, 5, forward, DEBUG_ROCKET_BLOCKS.plating)
    for (let right = -1; right <= 1; right++)
        for (let forward = -1; forward <= 1; forward++)
            add(right, 6, forward, DEBUG_ROCKET_BLOCKS.sheetmetal)
    add(0, 7, 0, DEBUG_ROCKET_BLOCKS.sheetmetal)
    add(-1, 7, 0, DEBUG_ROCKET_BLOCKS.sheetmetal)
    add(1, 7, 0, DEBUG_ROCKET_BLOCKS.sheetmetal)
    add(0, 7, -1, DEBUG_ROCKET_BLOCKS.sheetmetal)
    add(0, 7, 1, DEBUG_ROCKET_BLOCKS.sheetmetal)
    add(0, 8, 0, DEBUG_ROCKET_BLOCKS.lamp)

    if (origin.y < level.minBuildHeight || origin.y + 8 >= level.maxBuildHeight)
        return { ok: false, message: "生成位置超出了世界高度范围。" }

    for (let i = 0; i < placements.length; i++) {
        let placement = placements[i]
        placement.pos = debugRocketPosition(
            origin,
            rightX,
            rightZ,
            forwardX,
            forwardZ,
            placement.right,
            placement.up,
            placement.forward
        )
        placement.state = debugRocketBlockState(placement.id, placement.facing, placement.half)
        if (placement.state == null)
            return { ok: false, message: `缺少调试火箭方块：${placement.id}` }
        if (!level.worldBorder.isWithinBounds(placement.pos.x + 0.5, placement.pos.z + 0.5))
            return { ok: false, message: "生成位置超出了世界边界。" }
        if (!level.getBlockState(placement.pos).isAir())
            return { ok: false, message: `前方生成区域被方块占用：${placement.pos.x}, ${placement.pos.y}, ${placement.pos.z}` }
    }

    let placed = []
    for (let i = 0; i < placements.length; i++) {
        let placement = placements[i]
        // Flag 2 synchronizes the structure without letting the two-block door or
        // navigator remove its other half before both halves have been placed.
        if (!level.setBlock(placement.pos, placement.state, 2)) {
            let air = global.CDServerJavaClasses.$ForgeRegistries.BLOCKS.getValue(
                new global.CDServerJavaClasses.$ResourceLocation("minecraft:air")
            ).defaultBlockState()
            placed.forEach(pos => level.setBlockAndUpdate(pos, air))
            return { ok: false, message: "调试火箭生成失败，已回滚已放置方块。" }
        }
        placed.push(placement.pos)
    }

    placements.forEach(placement => level.blockUpdated(placement.pos, placement.state.block))

    let glueMin = debugRocketPosition(origin, rightX, rightZ, forwardX, forwardZ, -3, 0, -3)
    let glueMax = debugRocketPosition(origin, rightX, rightZ, forwardX, forwardZ, 3, 8, 3)
    let glueBounds = new global.CDServerJavaClasses.$AABB(
        Math.min(glueMin.x, glueMax.x),
        glueMin.y,
        Math.min(glueMin.z, glueMax.z),
        Math.max(glueMin.x, glueMax.x) + 1,
        glueMax.y + 1,
        Math.max(glueMin.z, glueMax.z) + 1
    )
    let glue = null
    let glueAdded = false
    try {
        glue = new global.CDServerJavaClasses.$SuperGlueEntity(level, glueBounds)
        glueAdded = level.addFreshEntity(glue)
    } catch (error) {
        if (glue != null)
            glue.discard()
        console.error(`[CD-DEBUG-ROCKET] 生成强力胶实体失败：${error}\n${error.stack || ""}`)
    }
    if (!glueAdded) {
        if (glue != null)
            glue.discard()
        let air = global.CDServerJavaClasses.$ForgeRegistries.BLOCKS.getValue(
            new global.CDServerJavaClasses.$ResourceLocation("minecraft:air")
        ).defaultBlockState()
        placed.forEach(pos => level.setBlockAndUpdate(pos, air))
        return { ok: false, message: "调试火箭强力胶生成失败，已回滚火箭方块。" }
    }

    let stationPlacement = placements.find(placement => placement.id == DEBUG_ROCKET_BLOCKS.station)
    return { ok: true, station: stationPlacement.pos, glued: true }
}

ServerEvents.commandRegistry(event => {
    const { commands: Commands } = event

    event.register(
        Commands.literal("cd_rocket")
            .requires(source => source.hasPermission(2))
            .then(Commands.literal("spawn_debug")
                .executes(context => {
                    let player = context.source.getPlayerOrException()
                    try {
                        let result = createDebugRocket(player)
                        if (!result.ok) {
                            player.tell(result.message)
                            return 0
                        }

                        player.tell(
                            `已在东侧生成大型调试火箭。火箭站坐标：${result.station.x}, ${result.station.y}, ${result.station.z}`
                        )
                        player.tell("驾驶舱内配有控制器、火箭站、座椅、自动着陆器、导航器和太空门；整艘火箭已自动涂覆强力胶。")
                        player.tell("创造组件提供无限燃料、推力与隔热，向火箭站放入星图后即可组装。")
                        return 1
                    } catch (error) {
                        console.error(`[CD-DEBUG-ROCKET] 生成调试火箭失败：${error}\n${error.stack || ""}`)
                        player.tell("生成调试火箭时发生脚本错误，详细原因已写入服务端日志。")
                        return 0
                    }
                })
            )
    )
})
