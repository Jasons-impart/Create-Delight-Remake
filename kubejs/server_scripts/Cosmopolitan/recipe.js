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
})