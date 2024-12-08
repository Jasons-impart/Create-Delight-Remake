ServerEvents.recipes(e => {
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
            'minecraft:redstone',
            Fluid.of("createdelight:molten_scarlet_neodymium", 90),
            Fluid.of("createdelight:molten_azure_neodymium", 90)
        ]
    ).heated().id("create_new_age:shaped/redstone_magnet")
    // 铁金介质磁铁
    let iner_3 = "createdelight:incomplete_layered_magnet"
    e.recipes.create.sequenced_assembly("create_new_age:layered_magnet", "create_new_age:redstone_magnet", 
        [
            e.recipes.create.deploying(iner_3, [iner_3, 'create_new_age:overcharged_golden_sheet']),
            e.recipes.create.deploying(iner_3, [iner_3, 'create_new_age:overcharged_iron_sheet']),
            e.recipes.create.deploying(iner_3, [iner_3, 'create_new_age:overcharged_golden_sheet']),
            e.recipes.create.deploying(iner_3, [iner_3, 'create_new_age:overcharged_iron_sheet']),
        ]
    )
        .loops(1)
        .transitionalItem(iner_3)
        .id("create_new_age:shaped/layered_magnet")
    // 钻石磁铁
    e.recipes.vintageimprovements.pressurizing(
        "create_new_age:fluxuated_magnetite",
        [
            'create_new_age:overcharged_gold',
            'create_new_age:overcharged_diamond',
            "create_new_age:layered_magnet",
            'minecraft:blaze_powder',
            Fluid.of("alexscaves:acid", 250)
        ]
    ).heated().id("create_new_age:fluxuated_magnetite")
    // 下届合金磁铁
    e.recipes.vintageimprovements.pressurizing(
        "create_new_age:netherite_magnet",
        [
            "create_new_age:fluxuated_magnetite",
            Fluid.of("createmetallurgy:molten_netherite", 90)
        ]
    ).heated().id("create_new_age:shaped/netherite_magnet")

})