StartupEvents.registry("item", e => {
    let items = [
        "tin_ingot",
        "tin_nugget"
    ]
    items.forEach(item => {
        e.create(`createdelight:${item}`)
            .maxStackSize(64)
            .translationKey(`item.createdelight.${item}`)
            .tag(`forge:${item.split("_")[1]}s/tin`)
            .tag(`forge:${item.split("_")[1]}s`)
    })
    e.create("createdelight:raw_tin")
        .maxStackSize(64)
        .translationKey("item.createdelight.raw_tin")
        .tag("forge:raw_materials/tin")
        .tag("forge:raw_materials")
})

StartupEvents.registry("block", e => {
    let blocks = [
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
            .tag("forge:ores/tin")
            .translationKey(`block.createdelight.${id}`)
            .requiresTool(true)
    })
    e.create("createdelight:tin_block")
        .soundType("metal")
        .hardness(7)
        .resistance(7)
        .tag("minecraft:mineable/pickaxe")
        .tag("minecraft:needs_iron_tool")
        .tag("forge:storage_blocks/tin")
        .tag("forge:storage_blocks")
        .translationKey("block.createdelight.tin_block")
        .requiresTool(true)
    e.create("createdelight:raw_tin_block")
        .soundType("stone")
        .hardness(7)
        .resistance(7)
        .tag("minecraft:mineable/pickaxe")
        .tag("minecraft:needs_iron_tool")
        .tag("forge:storage_blocks/raw_tin")
        .tag("forge:storage_blocks")
        .translationKey("block.createdelight.raw_tin_block")
        .requiresTool(true)
})
