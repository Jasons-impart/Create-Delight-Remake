ServerEvents.tags("item", e => {
    e.remove("forge:dough", [
        "create:dough"
    ]);
    e.remove("forge:dough/wheat", [
        "create:dough"
    ])
    e.remove("forge:eggs", [
        "alexsmobs:emu_egg"
    ])
    e.add("forge:chorus_fruits", [
        "ends_delight:chorus_fruit_grain",
        "minecraft:chorus_fruit"
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
        "vintagedelight:oat_bread",
        "ratatouille:threshing/wheat_kernels",
        "vintagedelight:oatmeal_cookie",
        "farmersdelight:wheat_dough_from_egg"
    ])
    // 脱粒
    threshing(e, "minecraft:wheat", [
        "2x ratatouille:wheat_kernels",
        "farmersdelight:straw",
        Item.of("ratatouille:wheat_kernels").withChance(0.5)
    ], 200)
    e.custom({
        type: "farmersdelight:cutting",
        ingredients: [{ item: "minecraft:wheat" }],
        result: [{ item: "ratatouille:wheat_kernels", count: 2 }, { item: "farmersdelight:straw", count: 1 }],
        tool: { type: "farmersdelight:tool_action", action: "blade_cut" }
    }).id("tetracelium:cutting/wheat")
    threshing(e, "vintagedelight:oat", [
        "2x vintagedelight:raw_oats",
        "farmersdelight:straw",
        Item.of("2x vintagedelight:raw_oats").withChance(0.5)
    ], 300)
    e.custom({
        type: "farmersdelight:cutting",
        ingredients: [{ item: "vintagedelight:oat" }],
        result: [{ item: "vintagedelight:raw_oats", count: 2 }, { item: "farmersdelight:straw", count: 1 }],
        tool: { type: "farmersdelight:tool_action", action: "blade_cut" }
    }).id("tetracelium:cutting/oat")
    threshing(e, "farmersdelight:rice_panicle", [
        "3x farmersdelight:rice",
        "farmersdelight:straw",
        Item.of("2x farmersdelight:rice").withChance(0.5)
    ], 400)
    // 蛋液适配
    e.recipes.create.emptying([
        Fluid.of("createdelight:egg_yolk", 250),
        "ratatouille:egg_shell"
    ], "#forge:eggs"
    ).id("create:emptying/yolk")
    e.recipes.create.emptying([
        Fluid.of("createdelight:egg_yolk", 1000),
        "ratatouille:egg_shell"
    ], "#forge:bigger_eggs"
    ).id("create:emptying/more_yolk")
    //人工蛋液适配
    e.recipes.create.mixing(
        Fluid.of("createdelight:artificial_egg_yolk", 250),
        [
            Fluid.of("createdelight:soya_milk", 250),
            Fluid.of("createdelightcore:slime", 30)
        ]
    ).id("createdelight:mixing/artificial_egg_yolk")
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
            FluidIngredients("forge:egg_yolk", 100),
            "mynethersdelight:ghasmati"
        ]
    ).id("mynethersdelight:mixing/ghast_dough")
    // 燕麦面团
    e.recipes.create.mixing("vintagedelight:oat_dough", [
        FluidIngredients("forge:egg_yolk", 50),
        "vintagedelight:raw_oats"
    ]).id("vintagedelight:mixing/oat_dough")
    e.recipes.minecraft.smoking(
        "createdelight:oat_bread",
        "vintagedelight:oat_dough"
    ).id("vintagedelight:bread_from_smoking")
    e.recipes.minecraft.smelting(
        "createdelight:oat_bread",
        "vintagedelight:oat_dough"
    ).id("vintagedelight:bread_from_smelting")
    // 燕麦相关食物合成
    e.replaceInput({ id: "vintagedelight:fruity_granola_bar" }, "vintagedelight:raw_oats", "vintagedelight:oat_dough")
    e.replaceInput({ id: "vintagedelight:deluxe_granola_bar" }, "vintagedelight:raw_oats", "vintagedelight:oat_dough")
    e.replaceInput({ id: "vintagedelight:chocolate_granola_bar" }, "vintagedelight:raw_oats", "vintagedelight:oat_dough")
    e.replaceInput({ id: "vintagedelight:deluxe_granola_bar" }, "minecraft:cocoa_beans", "#forge:bars/chocolate")
    e.replaceInput({ id: "vintagedelight:chocolate_granola_bar" }, "minecraft:cocoa_beans", "#forge:bars/chocolate")
    // 山竹糕合成
    e.recipes.farmersdelight.cooking(
        [
            "farmersdelight:rice",
            "minecraft:sugar",
            "minecraft:sugar",
            "#forge:fruits/mangosteen",
            "#forge:fruits/mangosteen"
        ], "fruitsdelight:mangosteen_cake", 1.0, 200
    )
        .id("farmersdelight:cooking/mangosteen_cake")
})
