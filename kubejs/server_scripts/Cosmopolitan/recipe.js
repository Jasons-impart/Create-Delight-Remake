ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "cosmopolitan:general/wafer",
        "cosmopolitan:create/pressing/wafer_cone",
        "cosmopolitan:farmersdelight/frying/potato_pancakes_from_deep_frying",
        "cosmopolitan:farmersdelight/cutting/fern"
    ])
    const {kubejs, create, create_new_age} = e.recipes
    kubejs.shapeless("cosmopolitan:wafer", [
        "farmersdelight:wheat_dough",
        "ratatouille:cocoa_powder"
    ]).id("cosmopolitan:general/wafer")
    e.replaceInput({mod: "cosmopolitan"}, "#forge:crops/wheat", "#forge:flour")
    e.replaceOutput({mod: "cosmopolitan"}, "cosmopolitan:chorus_fruit_popsicle", "ends_delight:chorus_fruit_popsicle")
    create.filling("cosmopolitan:cream_bun", ["#forge:bread", Fluid.of("cosmopolitan:cream", 250)])
    .id("cosmopolitan:filling/cream_bun")
    create.deploying("cosmopolitan:cream_bun", ["#forge:bread", "#forge:cream"])
    .id("cosmopolitan:deploying/cream_bun")
    create.mixing("cosmopolitan:gulime", [
        Fluid.of("createdelightcore:slime", 270),
        FluidIngredients("forge:honey", 250),
        "minecraft:pumpkin"
    ])
    .id("cosmopolitan:mixing/gulime")
    create.filling("cosmopolitan:cream", ["minecraft:bowl", Fluid.of("cosmopolitan:cream", 250)])
    .id("cosmopolitan:filling/cream")
    create.filling("cosmopolitan:cream_bucket", ["minecraft:bucket", Fluid.of("cosmopolitan:cream", 1000)])
    .id("cosmopolitan:filling/cream_bucket")
    create.mixing(Fluid.of("cosmopolitan:berry_syrup", 250), [
        "4x #forge:berries",
        Fluid.of("createcafe:melted_sugar", 500)
    ]).heated().id("cosmopolitan:mixing/cream_bucket")
    create.compacting([
            Fluid.of("cosmopolitan:birch_sap", 10),
            '4x createdieselgenerators:wood_chip',
            Item.of("farmersdelight:tree_bark").withChance(0.5)
        ], "minecraft:birch_log"
    ).heated().id("cosmopolitan:compacting/birch_sap")
    {
        let iner = 'cosmopolitan:arbutus_berries'
        create.sequenced_assembly("createdelight:enchanted_golden_arbutus_berries", 'cosmopolitan:arbutus_berries', [
            create.filling(iner, [iner, Fluid.of("create_enchantment_industry:experience", 120)]),
            create.deploying(iner, [iner, "minecraft:gold_block"]),
            create.deploying(iner, [iner, "minecraft:gold_block"]),
            create_new_age.energising(iner, iner, 2000000)
        ])
        .loops(4)
        .transitionalItem(iner)
        .id("createdelight:enchanted_golden_arbutus_berries")
    }
    create.filling(
        'cosmopolitan:golden_arbutus_berries',
        [
            'cosmopolitan:arbutus_berries',
            Fluid.of("createmetallurgy:molten_gold", 450)
        ]
    ).id("cosmopolitan:filling/golden_arbutus_berries")
    cutting(e,  'minecraft:fern',
        [
            ["minecraft:wheat_seeds"],
            ['alexscaves:fiddlehead', 1, 0.75],
            ['alexscaves:fiddlehead', 1, 0.25]
        ]
    )
    cutting(e,  'minecraft:large_fern',
        [
            ["minecraft:wheat_seeds"],
            ['alexscaves:fiddlehead'],
            ['alexscaves:fiddlehead', 1, 0.25]
        ]
    )
    cutting(e,  'alexscaves:curly_fern',
        [
            ["minecraft:wheat_seeds"],
            ['alexscaves:fiddlehead'],
            ['alexscaves:fiddlehead', 1, 0.25]
        ]
    )
    {
        let iner = "bakeries:cut_cake_base"
        create.sequenced_assembly('cosmopolitan:jelly_roll', iner, [
            create.filling(iner, [iner, Fluid.of("cosmopolitan:berry_syrup", 250)]),
            create.pressing(iner, iner)
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("cosmopolitan:sequenced_assembly/jelly_roll")
    }
    kubejs.shapeless(
        "cosmopolitan:jelly_roll",
        [
            "bakeries:cut_cake_base",
            "cosmopolitan:berry_syrup_bottle"
        ]
    ).id("cosmopolitan:farmersdelight/jelly_roll").replaceIngredient("cosmopolitan:berry_syrup", "minecraft:glass_bottle")
    {
        let iner = "bakeries:cut_cake_base"
        create.sequenced_assembly('cosmopolitan:chocolate_roll', iner, [
            create.filling(iner, [iner, Fluid.of("create:chocolate", 250)]),
            create.pressing(iner, iner)
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("cosmopolitan:sequenced_assembly/chocolate_roll_from_chocolate")
    }
    kubejs.shapeless(
        "cosmopolitan:chocolate_roll",
        [
            "bakeries:cut_cake_base",
            "create:bar_of_chocolate"
        ]
    ).id("cosmopolitan:farmersdelight/chocolate_roll_from_chocolate")
    {
        let iner = "bakeries:cut_cake_base"
        create.sequenced_assembly('cosmopolitan:ink_roll', iner, [
            create.filling(iner, [iner, Fluid.of("create_enchantment_industry:ink", 250)]),
            create.deploying(iner, [iner, "minecraft:glow_ink_sac"]),
            create.pressing(iner, iner)
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("cosmopolitan:sequenced_assembly/ink_roll")
    }
    kubejs.shapeless(
        "cosmopolitan:ink_roll",
        [
            "bakeries:cut_cake_base",
            'minecraft:ink_sac',
            'minecraft:glow_ink_sac'
        ]
    ).id("cosmopolitan:farmersdelight/ink_roll")
})