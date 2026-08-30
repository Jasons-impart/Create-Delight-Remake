ServerEvents.recipes(e => {
    remove_recipes_output(e, [
        "create_new_age:basic_motor",
        "create_new_age:advanced_motor",
        "create_new_age:reinforced_motor"
    ])
    e.replaceInput({id: "create_new_age:shaped/basic_motor_extension"}, "create_new_age:copper_circuit", "ae2:logic_processor")
    e.replaceInput({id: "create_new_age:shaped/basic_motor_extension"}, "create_new_age:overcharged_iron", "createmetallurgy:steel_ingot")
    e.replaceInput({id: "create_new_age:mechanical_crafting/advanced_motor_extension"}, "create_new_age:overcharged_iron_sheet", "vvaddon:mine_ingot")
    e.replaceInput({id: "create_new_age:mechanical_crafting/advanced_motor_extension"}, "create_new_age:copper_circuit", "ae2omnicells:multidimensional_expansion_processor")
    //基础电机
    let iner = "createdelight:incomplete_basic_motor"
    e.recipes.create.sequenced_assembly("2x create_new_age:basic_motor", "createaddition:electric_motor",
        [
            e.recipes.create.deploying(iner, [iner, "createaddition:copper_spool"]),
            e.recipes.create.deploying(iner, [iner, "create_sa:heat_engine"]),
            e.recipes.create.filling(iner, [iner, Fluid.of("createdelightcore:molten_andesite", 360)]),
        ]
    )
        .loops(1)
        .transitionalItem(iner)
        .id("createdelight:sequenced_assembly/basic_motor")
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
        .id("createdelight:sequenced_assembly/advanced_motor")
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
        .id("createdelight:sequenced_assembly/reinforced_motor")

})