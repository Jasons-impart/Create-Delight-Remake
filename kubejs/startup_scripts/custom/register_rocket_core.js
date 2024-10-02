StartupEvents.registry("block", e => {
    let blocks = [
        ["first_stage_rocket_core", "copper", 10, "pickaxe", "iron"],
        ["second_stage_rocket_core", "copper", 10, "pickaxe", "diamond"],
        ["third_stage_rocket_core", "copper", 10, "pickaxe", "netherite"],
        ["fourth_stage_rocket_core", "copper", 10, "pickaxe", "netherite"]
    ]
    blocks.forEach(([id, sound, hardness, tool, level]) => {
        e.create(`createdelight:${id}`)
            .defaultCutout()
            .soundType(sound)
            .hardness(hardness)
            .resistance(hardness)
            .tag(`minecraft:mineable/${tool}`)
            .tag(`minecraft:needs_${level}_tool`)
            .translationKey(`block.createdelight.${id}`)
            .requiresTool(true)
    })
})
