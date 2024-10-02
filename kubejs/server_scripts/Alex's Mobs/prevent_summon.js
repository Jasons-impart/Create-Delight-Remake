EntityEvents.spawned(event => {
    // 苍蝇生成
    if (event.entity.type == "alexsmobs:fly") {
        if (event.level.dimension != "minecraft:overworld") {
            event.cancel()
        }
    }
    // 蜈蚣生成
    if (event.entity.type == "alexsmobs:centipede_head") {
        event.cancel()
    }
    // 轻语灵生成
    if (event.entity.type == "alexsmobs:murmur") {
        event.cancel()
    }
})