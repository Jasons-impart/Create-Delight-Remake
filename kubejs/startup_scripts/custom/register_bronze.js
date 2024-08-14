StartupEvents.registry("item", e => {
    let items = [
        "bronze_ingot",
        "bronze_nugget",
        "bronze_sheet"
    ]    
    items.forEach(item => {
        e.create(`createdelight:${item}`)
            .maxStackSize(64)
            .translationKey(`item.createdelight.${item}`)
    });
})
StartupEvents.registry("block", e => {
    let blocks = [
        ["bronze_block", 'metal', 10, "pickaxe", "diamond"],
    ]
    blocks.forEach(([id, sound, hardness, tool, level]) => {
        e.create(`createdelight:${id}`)
            .soundType(sound)
            .hardness(hardness)
            .resistance(hardness)
            .tag(`minecraft:mineable/${tool}`)
            .tag(`minecraft:needs_${level}_tool`)
            .translationKey(`block.createdelight.${id}`)
            .requiresTool(true)
    })
})