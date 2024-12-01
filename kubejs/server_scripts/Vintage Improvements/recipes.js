ServerEvents.recipes(e => {
    const {vintageimprovements} = e.recipes
    e.remove({output: '#vintageimprovements:small_springs'})
    remove_recipes_id(e, [
        "vintageimprovements:pressurizing/sulfur_trioxide"
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
    e.recipes.vintageimprovements.polishing(
        [
            '2x create:polished_rose_quartz',
            Item.of("create:polished_rose_quartz").withChance(0.5)
        ],
        'create:rose_quartz',
        100, 1, true
    ).id("vintageimprovements:grinder_polishing/rose_quartz")
    e.recipes.vintageimprovements.polishing(
        [
            '2x createutilities:polished_amethyst',
            Item.of('createutilities:polished_amethyst').withChance(0.5)
        ],
        'minecraft:amethyst_shard',
        100, 1, true
    ).id("createutilities:sandpaper_polishing/polished_amethyst")
})