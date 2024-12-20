ServerEvents.recipes(e => {
    //无暇宝石制作
    const {vintageimprovements, create} = e.recipes
    vintageimprovements.laser_cutting(Item.of("tetra:pristine_lapis").withChance(0.1), "minecraft:lapis_lazuli", 10000, 1000)
    .id("tetra:laser_cutting/pristine_lapis")
    
    vintageimprovements.laser_cutting(Item.of("tetra:pristine_emerald").withChance(0.1), "minecraft:emerald", 10000, 1000)
    .id("tetra:laser_cutting/pristine_emerald")
    vintageimprovements.laser_cutting(Item.of("tetra:pristine_emerald").withChance(0.5), "createoreexcavation:raw_emerald", 10000, 1000)
    .id("tetra:laser_cutting/pristine_emerald_2")

    vintageimprovements.laser_cutting(Item.of("tetra:pristine_diamond").withChance(0.1), "minecraft:diamond", 10000, 1000)
    .id("tetra:laser_cutting/pristine_diamond")
    vintageimprovements.laser_cutting(Item.of("tetra:pristine_diamond").withChance(0.5), "createoreexcavation:raw_diamond", 10000, 1000)
    .id("tetra:laser_cutting/pristine_diamond_2")

    vintageimprovements.laser_cutting(Item.of("tetra:pristine_amethyst").withChance(0.1), "minecraft:amethyst_shard", 10000, 1000)
    .id("tetra:laser_cutting/pristine_amethyst")


    //晶洞制作
    vintageimprovements.laser_cutting(Item.of("tetra:geode").withChance(0.01), "minecraft:deepslate", 10000, 1000)
    .id("tetra:laser_cutting/geode")

    //无暇宝石产普通宝石
    create.cutting(
        ["3x minecraft:diamond",
        Item.of("2x minecraft:diamond").withChance(0.25),
        Item.of("minecraft:diamond").withChance(0.5)],
        "tetra:pristine_diamond")
        .id("tetra:cutting/pristine_diamond")

    create.cutting(
        ["3x minecraft:emerald",
        Item.of("2x minecraft:emerald").withChance(0.25),
        Item.of("minecraft:emerald").withChance(0.5)],
        "tetra:pristine_emerald")
        .id("tetra:cutting/pristine_emerald")

    create.cutting(
        ["4x minecraft:amethyst_shard",
        Item.of("3x minecraft:amethyst_shard").withChance(0.25),
        Item.of("2x minecraft:amethyst_shard").withChance(0.5)],
        "tetra:pristine_amethyst")
        .id("tetra:cutting/pristine_amethyst")
        
    create.cutting(
        ["4x minecraft:lapis_lazuli",
        Item.of("3x minecraft:lapis_lazuli").withChance(0.25),
        Item.of("2x minecraft:lapis_lazuli").withChance(0.5)],
        "tetra:pristine_lapis")
        .id("tetra:cutting/pristine_lapis")
})