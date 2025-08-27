ServerEvents.recipes(e => {
    const {vintageimprovements, create, createmetallurgy} = e.recipes

    e.remove({output: '#vintageimprovements:small_springs'})
    remove_recipes_id(e, [
        "vintageimprovements:pressurizing/sulfur_trioxide",
        "vintageimprovements:rolling/netherite_rod",
        "vintageimprovements:rolling/netherite_plate",
        "vintageimprovements:rolling/nethersteel_rod",
        "vintageimprovements:rolling/nethersteel_plate"
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
    // 下界合金相关配方调整，以避免与熔融搭配后无限增产
    e.recipes.createaddition.rolling("minecraft:netherite_ingot", 
        "2x vintageimprovements:netherite_rod").id("vintageimprovements:rolling/netherite_ingot")
    e.recipes.createaddition.rolling("vintageimprovements:netherite_sheet", 
        "2x vintageimprovements:netherite_wire").id("vintageimprovements:rolling/netherite_sheet")
    e.recipes.createaddition.rolling("createbigcannons:nethersteel_ingot", 
        "2x vintageimprovements:nethersteel_rod").id("vintageimprovements:rolling/nethersteel_ingot")
    e.recipes.createaddition.rolling("vintageimprovements:nethersteel_sheet", 
        "2x vintageimprovements:nethersteel_wire").id("vintageimprovements:rolling/nethersteel_sheet")
})