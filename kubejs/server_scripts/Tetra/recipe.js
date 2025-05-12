ServerEvents.recipes(e => {
    //无暇宝石制作
    const {vintageimprovements, create, createaddition, createmetallurgy} = e.recipes
    create.sequenced_assembly([Item.of("tetra:pristine_lapis").withChance(0.11), "minecraft:air"], "minecraft:lapis_lazuli", [
        vintageimprovements.laser_cutting("minecraft:lapis_lazuli", "minecraft:lapis_lazuli", 10000, 1000),
        // vintageimprovements.polishing("minecraft:lapis_lazuli", "minecraft:lapis_lazuli")
        createmetallurgy.grinding("minecraft:lapis_lazuli", "minecraft:lapis_lazuli")
    ])
    .loops(1)
    .transitionalItem("minecraft:lapis_lazuli")
    .id("tetra:sequenced_assembly/pristine_lapis")

    create.sequenced_assembly([Item.of("tetra:pristine_emerald").withChance(0.11), "minecraft:air"], "minecraft:emerald", [
        vintageimprovements.laser_cutting("minecraft:emerald", "minecraft:emerald", 10000, 1000),
        // vintageimprovements.polishing("minecraft:emerald", "minecraft:emerald")
        createmetallurgy.grinding("minecraft:emerald", "minecraft:emerald")

    ])
    .loops(1)
    .transitionalItem("minecraft:emerald")
    .id("tetra:sequenced_assembly/pristine_emerald")

    create.sequenced_assembly(["tetra:pristine_emerald", "minecraft:air"], "createoreexcavation:raw_emerald", [
        vintageimprovements.laser_cutting("createoreexcavation:raw_emerald", "createoreexcavation:raw_emerald", 10000, 1000),
        // vintageimprovements.polishing("createoreexcavation:raw_emerald", "createoreexcavation:raw_emerald")
        createmetallurgy.grinding("createoreexcavation:raw_emerald", "createoreexcavation:raw_emerald")
    ])
    .loops(1)
    .transitionalItem("createoreexcavation:raw_emerald")
    .id("tetra:sequenced_assembly/pristine_emerald_2")

    create.sequenced_assembly([Item.of("tetra:pristine_diamond").withChance(0.11), "minecraft:air"], "minecraft:diamond", [
        vintageimprovements.laser_cutting("minecraft:diamond", "minecraft:diamond", 10000, 1000),
        // vintageimprovements.polishing("minecraft:diamond", "minecraft:diamond")
        createmetallurgy.grinding("minecraft:diamond", "minecraft:diamond")
    ])
    .loops(1)
    .transitionalItem("minecraft:diamond")
    .id("tetra:sequenced_assembly/pristine_diamond")

    create.sequenced_assembly(["tetra:pristine_diamond", "minecraft:air"], "createoreexcavation:raw_diamond", [
        vintageimprovements.laser_cutting("createoreexcavation:raw_diamond", "createoreexcavation:raw_diamond", 10000, 1000),
        // vintageimprovements.polishing("createoreexcavation:raw_diamond", "createoreexcavation:raw_diamond")
        createmetallurgy.grinding("createoreexcavation:raw_diamond", "createoreexcavation:raw_diamond")
    ])
    .loops(1)
    .transitionalItem("createoreexcavation:raw_diamond")
    .id("tetra:sequenced_assembly/pristine_diamond_2")

    create.sequenced_assembly([Item.of("tetra:pristine_amethyst").withChance(0.11), "minecraft:air"], "minecraft:amethyst_shard", [
        vintageimprovements.laser_cutting("minecraft:amethyst_shard", "minecraft:amethyst_shard", 10000, 1000),
        // vintageimprovements.polishing("minecraft:amethyst_shard", "minecraft:amethyst_shard")
        createmetallurgy.grinding("minecraft:amethyst_shard", "minecraft:amethyst_shard")
    ])
    .loops(1)
    .transitionalItem("minecraft:amethyst_shard")
    .id("tetra:sequenced_assembly/pristine_amethyst")

    //晶洞制作
    create.sequenced_assembly([Item.of("tetra:geode").withChance(0.011), "minecraft:air"], "minecraft:deepslate", [
        vintageimprovements.laser_cutting("minecraft:deepslate", "minecraft:deepslate", 10000, 1000),
        // vintageimprovements.polishing("minecraft:deepslate", "minecraft:deepslate")
        createmetallurgy.grinding("minecraft:deepslate", "minecraft:deepslate")
    ])
    .loops(1)
    .transitionalItem("minecraft:deepslate")
    .id("tetra:sequenced_assembly/geode")

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

    create.deploying(["tetra:forged_mesh", Item.of("art_of_forging:nano_insectoid").withChance(0.1)], ["createdelight:forged_steel_sheet", "art_of_forging:nano_insectoid"])
    .keepHeldItem()
    .id("tetra:deploying/forged_mesh")
    createaddition.rolling("art_of_forging:forged_steel_ingot", "2x tetra:forged_beam")
    .id("tetra:rolling/forged_beam")
    create.deploying("2x tetra:forged_bolt", ["tetra:forged_beam", "createdelight:forged_steel_sheet"])
    .id("tetra:deploying/forged_bolt")
    vintageimprovements.pressurizing([
        Item.of("art_of_forging:nano_insectoid").withChance(0.95),
        "3x tetra:metal_scrap",
        Item.of("2x tetra:metal_scrap").withChance(0.5),
        Item.of("2x tetra:metal_scrap").withChance(0.25)], [
            "art_of_forging:nano_insectoid",
            "art_of_forging:forged_steel_ingot"
        ]).id("tetra:pressurizing/metal_scrap")
})