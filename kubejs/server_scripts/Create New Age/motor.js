ServerEvents.recipes(e => {
    remove_recipes_output(e, [
        "create_new_age:basic_motor",
        "create_new_age:advanced_motor",
        "create_new_age:reinforced_motor"
    ])
    e.replaceInput({id: "create_new_age:shaped/basic_motor_extension"}, "create_new_age:copper_circuit", "ae2:logic_processor")
    e.replaceInput({id: "create_new_age:shaped/basic_motor_extension"}, "create_new_age:overcharged_iron", "createmetallurgy:steel_ingot")
    e.replaceInput({id: "create_new_age:advanced_motor_extension"}, "create_new_age:overcharged_iron_sheet", "vvaddon:mine_ingot")
    e.replaceInput({id: "create_new_age:advanced_motor_extension"}, "create_new_age:copper_circuit", "ae2omnicells:multidimensional_expansion_processor")
    //基础电机
    let iner = "createdelight:incomplete_basic_motor"
    e.recipes.create.sequenced_assembly("2x create_new_age:basic_motor", "createaddition:electric_motor",
        [
            e.recipes.create.deploying(iner, [iner, "createaddition:copper_spool"]),
            e.recipes.create.deploying(iner, [iner, "create_sa:heat_engine"]),
            e.recipes.create.filling(iner, [iner, Fluid.of("createmetallurgy:molten_steel", 360)]),
        ]
    )
        .loops(1)
        .transitionalItem(iner)
        .id("create_new_age:sequenced_assembly/basic_motor")
    //高级电机
    let iner_1 = "createdelight:incomplete_advanced_motor"
    e.recipes.create.sequenced_assembly("2x create_new_age:advanced_motor", "create_new_age:basic_motor",
        [
            e.recipes.create.deploying(iner_1, [iner_1, "#createaddition:high_current_spools"]),
            e.recipes.create.deploying(iner_1, [iner_1, "create_sa:steam_engine"]),
            e.recipes.create.filling(iner_1, [iner_1, Fluid.of("createmetallurgy:molten_obdurium", 360)])
        ]
    )
        .loops(1)
        .transitionalItem(iner_1)
        .id("create_new_age:sequenced_assembly/advanced_motor")
    //超级电机
    let iner_2 = "createdelight:incomplete_reinforced_motor"
    e.recipes.create.sequenced_assembly("2x create_new_age:reinforced_motor", "create_new_age:advanced_motor",
        [
            e.recipes.create.deploying(iner_2, [iner_2, "createaddition:superconducting_spool"]),
            e.recipes.create.deploying(iner_2, [iner_2, "createdelight:magnetic_mechanism"]),
            e.recipes.create.filling(iner_2, [iner_2, FluidIngredients("forge:molten_neodymium", 360)])
        ]
    )
        .loops(1)
        .transitionalItem(iner_2)
        .id("create_new_age:sequenced_assembly/reinforced_motor")

    // //行星齿轮
    // let iner_3 = "createdelight:incomplete_planet_gear"
    // e.recipes.create.sequenced_assembly("createdelight:planet_gear", "create:brass_sheet", 
    //     [
    //         e.recipes.create.deploying(iner_3, [iner_3, "create:precision_mechanism"]),
    //         e.recipes.create.deploying(iner_3, [iner_3, "create:cogwheel"]),
    //         e.recipes.create.deploying(iner_3, [iner_3, 'create:large_cogwheel']),
    //         e.recipes.create.filling(iner_3, [iner_3, Fluid.of("createdelight:lubricating_oil", 100)])
    //     ]
    // )
    //     .loops(1)
    //     .transitionalItem(iner_3)
    //     .id("createdelight:sequenced_assembly/planet_gear")
    // //基础电机超频器
    // e.recipes.create.mechanical_crafting("create_new_age:basic_motor_extension", [
    //     "AAAAA",
    //     "BCDEA",
    //     "AAAAA"
    // ], {
    //     A: "ad_astra:steel_plate",
    //     B: "create:shaft",
    //     C: "create:precision_mechanism",
    //     D: "createdelight:planet_gear",
    //     E: "ae2:logic_processor"
    // })
    // .id("create_new_age:shaped/basic_motor_extension")
    // //超级电机超频器
    // let iner_4 = "create_new_age:basic_motor_extension"
    // e.recipes.create.sequenced_assembly("create_new_age:advanced_motor_extension", "create_new_age:basic_motor_extension",
    //     [
    //         e.recipes.create.filling(iner_4, [iner_4, Fluid.of("createmetallurgy:molten_void_steel", 450)]),
    //         e.recipes.create.deploying(iner_4, [iner_4, "ae2:logic_processor"]),
    //         e.recipes.create.deploying(iner_4, [iner_4, "ae2:calculation_processor"]),
    //         e.recipes.create.filling(iner_4, [iner_4, Fluid.of("createmetallurgy:molten_electrum", 450)]),
    //         e.recipes.create.filling(iner_4, [iner_4, Fluid.of("createmetallurgy:molten_brass", 450)])
    //     ]
    // )
    //    .loops(1)
    //    .transitionalItem(iner_4)
    //    .id("create_new_age:advanced_motor_extension")
})