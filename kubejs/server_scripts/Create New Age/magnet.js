ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "create_new_age:shaped/netherite_magnet",
        "create_new_age:shaped/connector_mirrored",
        "create_new_age:shaped/boiler_heater",
        "create_new_age:shaped/heat_pump",
        "create_new_age:shaped/heat_pipe",
        "create_new_age:shaped/heat_pipe_mirror",
        "create_new_age:shaped/stirling_engine",
        "create_new_age:shaped/basic_solar_plate",
        "create_new_age:shaped/advanced_solar_plate"
    ])
    // 磁铁块
    let ingr_1 = ["minecraft:iron_block"]
    for (let i = 0; i < 8; i++) {
        ingr_1.push("alexscaves:energized_galena_neutral")
    }
    e.recipes.vintageimprovements.pressurizing(
        "create_new_age:magnetite_block", 
        ingr_1
    ).heated().id("create_new_age:pressurizing/magnetite_block")
    // 红石磁铁
    e.recipes.vintageimprovements.pressurizing(
        "create_new_age:redstone_magnet",
        [
            "create_new_age:magnetite_block",
            'minecraft:redstone'
        ]
    ).heated().id("create_new_age:shaped/redstone_magnet")
    // 铁金介质磁铁
    let iner_3 = "createdelight:incomplete_layered_magnet"
    e.recipes.create.sequenced_assembly("create_new_age:layered_magnet", "create_new_age:redstone_magnet", 
        [
            e.recipes.create.deploying(iner_3, [iner_3, 'create_new_age:overcharged_golden_sheet']),
            e.recipes.create.deploying(iner_3, [iner_3, 'create_new_age:overcharged_iron_sheet']),
        ]
    )
        .loops(3)
        .transitionalItem(iner_3)
        .id("create_new_age:shaped/layered_magnet")
    // 钻石磁铁
    e.recipes.vintageimprovements.pressurizing(
        "create_new_age:fluxuated_magnetite",
        [
            Fluid.of("alexscaves:acid", 250),
            'create_new_age:overcharged_diamond',
            'create_new_age:overcharged_diamond',
            "create_new_age:layered_magnet",
            'minecraft:blaze_powder',
            'minecraft:blaze_powder'
        ]
    )
    .secondaryFluidInput(0)
    .heated()
    .id("create_new_age:fluxuated_magnetite")
    // 下界合金磁铁
    e.recipes.vintageimprovements.pressurizing(
        "create_new_age:netherite_magnet",
        [
            "create_new_age:fluxuated_magnetite",
            Fluid.of("createmetallurgy:molten_netherite", 180),
            Fluid.of("createdelightcore:molten_azure_neodymium", 180)
        ]
    ).heated().id("create_new_age:shaped/netherite_magnet_1")
    e.recipes.vintageimprovements.pressurizing(
        "create_new_age:netherite_magnet",
        [
            "create_new_age:fluxuated_magnetite",
            Fluid.of("createmetallurgy:molten_netherite", 180),
            Fluid.of("createdelightcore:molten_scarlet_neodymium", 180),
        ]
    ).heated().id("create_new_age:shaped/netherite_magnet_2")
    // 碳刷
    let iner_4 = "createdelight:incomplete_carbon_brushes"
    e.recipes.create.sequenced_assembly('create_new_age:carbon_brushes', 'create:shaft',
        [
            e.recipes.create.deploying(iner_4, [iner_4, "createaddition:copper_spool"]),
            e.recipes.create.deploying(iner_4, [iner_4, "createdelight:carbon_plate"]),
            e.recipes.create.filling(iner_4, [iner_4, Fluid.of("createdelightcore:molten_andesite",810)])
        ]
    )
        .loops(1)
        .transitionalItem(iner_4)
        .id("create_new_age:shaped/carbon_brushes")
})