ServerEvents.recipes(e => {
    // 增加配方：龙齿合成龙息
    e.shapeless("4x minecraft:dragon_breath", [
        "ends_delight:dragon_tooth",
        "4x minecraft:glass_bottle"
    ])
    .id("minecraft:dragon_breath_from_dragon_tooth")
    e.recipes.farmersdelight.cooking(
        [
            "#forge:shulker_meat",
            "ends_delight:dried_endermite_meat",
            "ends_delight:chorus_sauce",
            "#forge:mushrooms",
            "createdelight:vermicelli"
        ], "ends_delight:ender_noodle", 1.0, 200
    ).id("ends_delight:food/ender_noodle")
})
