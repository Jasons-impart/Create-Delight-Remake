ServerEvents.recipes(e => {
    dragonPlusFreezing(e, "fluidlogistics:blaze_cooler", "create:blaze_burner",
        "createdelight:fan_freezing/blaze_cooler")

    // 保留原 CDC 配方 ID，兼容仍包含这些配方的旧版 CDC。
    e.custom({
        type: "create_dragons_plus:freezing",
        ingredients: [{ item: "create:blaze_cake" }],
        results: [
            { item: "create:powdered_obsidian" },
            { item: "create:cinder_flour", chance: 0.9 }
        ]
    }).id("createdelightcore:fan_freezing/blaze_cake")

    dragonPlusFreezing(e, "minecraft:obsidian", "minecraft:crying_obsidian",
        "createdelightcore:fan_freezing/crying_obsidian")
    dragonPlusFreezing(e, "minecraft:snow_block", "minecraft:snow",
        "createdelightcore:fan_freezing/snow")
    dragonPlusFreezing(e, "minecraft:snow", "minecraft:snowball",
        "createdelightcore:fan_freezing/snowball")
    dragonPlusFreezing(e, "minecraft:powder_snow_bucket", "minecraft:water_bucket",
        "createdelightcore:fan_freezing/water_bucket")
})
