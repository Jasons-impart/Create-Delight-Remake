ServerEvents.tags("item", e => {
    e.remove("forge:dough", [
        'create:dough'
    ]);
    e.remove("forge:dough/wheat", [
        'create:dough'
    ])
    e.remove("forge:eggs", [
        'alexsmobs:emu_egg'
    ])
    e.add("forge:chorus_fruits", [
        'ends_delight:chorus_fruit_grain',
        'minecraft:chorus_fruit'
    ])
})
ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "create:milling/wheat",
        "create_central_kitchen:crafting/dough_4",
        "create_central_kitchen:crafting/dough_3",
        "create_central_kitchen:crafting/dough_2",
        "create_central_kitchen:crafting/dough_1",
        "farmersdelight:wheat_dough_from_water",
        "create:mixing/wheat_dough_egg_create",
        "minecraft:bread",
        "quark:tweaks/crafting/utility/bent/bread",
        "farmersdelight:cutting/tag_dough",
        "culturaldelights:cooking/raw_pasta",
        "ends_delight:food/chorus_fruit_pie",
        "create_central_kitchen:sequenced_assembly/chorus_fruit_pie",
        "unusualend:chorus_pie_recipe",
        "refurbished_furniture:combining/wheat_flour",
        "refurbished_furniture:baking/sea_salt",
        "refurbished_furniture:dough",
        "vintagedelight:oat_dough_from_water",
        "mynethersdelight:crafting/ghast_dough",
        "ratatouille:cutting/wheat_seeds",
        "vintagedelight:cutting/oat_cutting",
        "vintagedelight:create/milling/oat",
        "farmersdelight:rice",
        "farmersdelight:integration/create/milling/rice_panicle",
        "farmersdelight:integration/create/milling/wild_rice",
        "ratatouille:threshing/rice_panicle",
        "vintagedelight:oat_bread"
    ])
    // 脱粒
    threshing(e, "minecraft:wheat", [
        ["ratatouille:wheat_kernels", 2],
        ["farmersdelight:straw", 1],
        ["ratatouille:wheat_kernels", 1, 0.5]
    ], 200)
    threshing(e, 'vintagedelight:oat', [
        ['vintagedelight:raw_oats', 2],
        ["farmersdelight:straw", 1],
        ['vintagedelight:raw_oats', 2, 0.5]
    ], 200)
    threshing(e, 'farmersdelight:rice_panicle', [
        ['farmersdelight:rice', 3],
        ["farmersdelight:straw", 1],
        ['farmersdelight:rice', 2, 0.5]
    ], 200)
    // 蛋液适配
    e.recipes.create.emptying([
            Fluid.of("ratatouille:egg_yolk", 250),
            "ratatouille:egg_shell"
        ], "#forge:eggs"
    ).id("create:emptying/yolk")
    e.recipes.create.emptying([
            Fluid.of("ratatouille:egg_yolk", 1000),
            "ratatouille:egg_shell"
        ], 'alexsmobs:emu_egg'
    ).id("create:emptying/emu_yolk")
    // 面团相关
        // 恶魂面团
    e.recipes.kubejs.shapeless(
        "2x mynethersdelight:ghast_dough",
        [
            "#forge:eggs",
            "mynethersdelight:ghasmati",
            "mynethersdelight:ghasmati",
            "#forge:eggs"
        ]
    ).id("mynethersdelight:crafting/ghast_dough_manual_only")
    e.recipes.create.mixing(
        "mynethersdelight:ghast_dough",
        [
            Fluid.of("ratatouille:egg_yolk", 100),
            "mynethersdelight:ghasmati"
        ]
    ).id("mynethersdelight:mixing/ghast_dough")
        // 燕麦面团
    e.recipes.create.mixing(
        'vintagedelight:oat_dough',
        [
            Fluid.of("ratatouille:egg_yolk", 50),
            'vintagedelight:raw_oats'
        ]
    ).id("vintagedelight:oat_dough_from_eggs")
    e.recipes.kubejs.shapeless(
        "vintagedelight:oat_dough",
        [
            "#forge:eggs",
            "3x vintagedelight:raw_oats"
        ]
    ).id("vintagedelight:oat_dough_from_eggs_manual_only")
    e.recipes.minecraft.smoking(
        "createdelight:oat_bread",
        "vintagedelight:oat_dough"
    ).id("vintagedelight:bread_from_smoking")
    e.recipes.minecraft.smelting(
        "createdelight:oat_bread",
        "vintagedelight:oat_dough"
    ).id("vintagedelight:bread_from_smelting")
        // 面团
    e.recipes.create.mixing(
        "create:dough",
        [
            Fluid.of("water", 50),
            "create:wheat_flour"
        ]
    ).id("create:mixing/dough_by_mixing")
        // 蛋黄面团
    e.recipes.create.mixing(
        'farmersdelight:wheat_dough',
        [
            Fluid.of("ratatouille:egg_yolk", 50),
            'create:wheat_flour'
        ]
    ).id("farmersdelight:wheat_dough_from_eggs")
    e.recipes.kubejs.shapeless(
        '3x farmersdelight:wheat_dough',
        [
            "#forge:eggs",
            "3x create:wheat_flour"
        ]
    ).id("farmersdelight:crafting/wheat_dough_manual_only")
        // 咸面团
    e.recipes.create.mixing(
        'ratatouille:salty_dough',
        [
            Fluid.of("ratatouille:egg_yolk", 100),
            '2x create:wheat_flour',
            "#forge:salt"
        ]
    )
        .id("create:mixing/salty_dough")
    // 燕麦相关食物合成
    // 山竹糕合成
    e.recipes.farmersdelight.cooking(
        [
            "farmersdelight:rice",
            "minecraft:sugar",
            "minecraft:sugar",
            '#forge:fruits/mangosteen',
            '#forge:fruits/mangosteen'
        ], "fruitsdelight:mangosteen_cake", 1.0, 200
    )
    .id("farmersdelight:cooking/mangosteen_cake")
})