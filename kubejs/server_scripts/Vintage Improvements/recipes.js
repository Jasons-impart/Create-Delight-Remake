ServerEvents.recipes(e => {
    const {vintageimprovements, create, createmetallurgy} = e.recipes

    e.remove({output: '#vintageimprovements:small_springs'})
    remove_recipes_id(e, [
        "vintageimprovements:pressurizing/sulfur_trioxide",
    ])
    vintageimprovements.pressurizing(
        Fluid.of("vintageimprovements:sulfur_trioxide", 1000),
    [
        Fluid.of("vintageimprovements:sulfur_dioxide", 1000),
        "vintageimprovements:vanadium_nugget"
    ])
    .secondaryFluidOutput(0)
    .superheated()
    .id("vintageimprovements:pressurizing/sulfur_trioxide")
    e.recipes.createmetallurgy.grinding(
        [
            '2x create:polished_rose_quartz',
            Item.of("create:polished_rose_quartz").withChance(0.5)
        ],
        'create:rose_quartz',
    ).id("vintageimprovements:grinder_polishing/rose_quartz")
    // e.recipes.vintageimprovements.polishing(
    //     [
    //         '2x createutilities:polished_amethyst',
    //         Item.of('createutilities:polished_amethyst').withChance(0.5)
    //     ],
    //     'minecraft:amethyst_shard',
    //     100, 1, true
    // ).id("createutilities:sandpaper_polishing/polished_amethyst")
    e.recipes.createmetallurgy.grinding(
        [
            '2x createutilities:polished_amethyst',
            Item.of('createutilities:polished_amethyst').withChance(0.5)
        ] ,
        'minecraft:amethyst_shard'
    ).id("createutilities:sandpaper_polishing/polished_amethyst")
    {
        let iner = 'vintageimprovements:incomplete_recipe_card'
        create.sequenced_assembly("vintageimprovements:recipe_card", "create:brass_sheet",
            [
                create.deploying(iner, [iner, "minecraft:redstone"]),
                create.pressing(iner, iner),
                createmetallurgy.grinding(iner, iner)
            ]
        )
            .loops(3)
            .transitionalItem(iner)
            .id("vintageimprovements:sequenced_assembly/recipe_card")
    }
})