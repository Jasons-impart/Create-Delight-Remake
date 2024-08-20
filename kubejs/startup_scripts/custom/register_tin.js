StartupEvents.registry("item", e => {
    let items = [
        "tin_ingot",
        "tin_nugget",
        "raw_tin",
        "tin_dust",
        "dirty_tin_dust"
    ]
    items.forEach(item => {
        e.create(`createdelight:${item}`)
            .maxStackSize(64)
            .translationKey(`item.createdelight.${item}`)
    });
})
StartupEvents.registry("block", e => {
    let blocks = [
        ["tin_block", "metal", 7, "pickaxe", "iron"],
        ["raw_tin_block", "stone", 7, "pickaxe", "iron"],
        ["tin_ore", "stone", 4, "pickaxe", "iron"],
        ["deepslate_tin_ore", "deepslate", 4, "pickaxe", "iron"],
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