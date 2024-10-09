StartupEvents.registry("item", e => {
    let items = [
        "bronze_ingot",
        "bronze_nugget"
    ]
    items.forEach(item => {
        e.create(`createdelight:${item}`)
            .maxStackSize(64)
            .translationKey(`item.createdelight.${item}`)
            .tag(`forge:${item.split("_")[1]}s/bronze`)
            .tag(`forge:${item.split("_")[1]}s`)
    })
})

StartupEvents.registry("block", e => {
    let blocks = [
        ["bronze_block", "metal", 10, "pickaxe", "diamond"],
    ]
    blocks.forEach(([id, sound, hardness, tool, level]) => {
        e.create(`createdelight:${id}`)
            .soundType(sound)
            .hardness(hardness)
            .resistance(hardness)
            .tag(`minecraft:mineable/${tool}`)
            .tag(`minecraft:needs_${level}_tool`)
            .tag("forge:storage_blocks/bronze")
            .tag("forge:storage_blocks")
            .translationKey(`block.createdelight.${id}`)
            .requiresTool(true)
    })
})
