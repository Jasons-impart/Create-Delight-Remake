    // extradelight的bug修复
ServerEvents.tags("item", e => {
    // 香肠相关
    e.add("forge:sausage", [
        'ratatouille:raw_sausage'
    ])
    e.add("forge:sausage/cooked", [
        'ratatouille:sausage'
    ])
    // 玉米面包增加extradeligt兼容
    e.add("forge:bread/sliced", [
        "extradelight:cornbread"
    ])
})
ServerEvents.recipes(e => {
    e.replaceInput(
        { mod: 'extradelight'},
        "minecraft:heavy_weighted_pressure_plate",
        "create:iron_sheet"
    )
    e.shapeless(
        'extradelight:baking_stone',
        'minecraft:smooth_stone_slab'
    )
    .id("extradelight:baking_stone")
    // 奶油相关合成
    e.recipes.create.mixing(
        Fluid.of("createdelight:whipped_cream", 50),
        Fluid.of("minecraft:milk", 50)
    ).id("extradelight:whipped_cream")
    e.recipes.create.filling(
        'extradelight:whipped_cream',
        [
            Fluid.of("createdelight:whipped_cream", 250),
            "bowl"
        ]
    ).id("extradelight:filling/whipped_cream")
    e.recipes.create.emptying(
        [
            Fluid.of("createdelight:whipped_cream", 250),
            "bowl"
        ],
        'extradelight:whipped_cream',
    ).id("extradelight:emptying/whipped_cream")
    // 黄油合成
    e.recipes.create.mixing(
        [
            "extradelight:butter",
            "minecraft:bowl"
        ],
        'extradelight:whipped_cream'
    ).id("extradelight:butter_from_cream")
    e.recipes.create.mixing(
        "extradelight:butter",
        Fluid.of("createdelight:whipped_cream", 250)
    ).id("extradelight:butter_from_whipped_cream")
})
LootJS.modifiers(e => {
    e.addBlockLootModifier("extradelight:corn_bottom")
        .replaceLoot("extradelight:corn_seeds", "culturaldelights:corn_kernels")
})
