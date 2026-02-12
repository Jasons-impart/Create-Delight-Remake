ServerEvents.recipes(e => {
    remove_recipes_output(e, [
        'create_new_age:electrical_connector',
        'create_new_age:heat_pipe',
        'create_new_age:heat_pump',
        'create_new_age:heater',
        'create_new_age:stirling_engine',
        'create_new_age:solid_corium',
        'create_new_age:corium',
        'create_new_age:reactor_fuel_acceptor',
        'create_new_age:reactor_rod',
        'create_new_age:overcharged_iron_wire',
        'create_new_age:overcharged_golden_wire',
        'create_new_age:overcharged_diamond_wire',
        'create_new_age:reactor_heat_vent',
        'create_new_age:basic_solar_heating_plate',
        'create_new_age:advanced_solar_heating_plate',
        'create_new_age:copper_wire_block',
        'create_new_age:overcharged_iron_wire_block',
        'create_new_age:overcharged_golden_wire_block',
        'create_new_age:overcharged_diamond_wire_block',
        'create_new_age:blank_circuit',
        'create_new_age:copper_circuit',
        "create_new_age:basic_energiser",
        "create_new_age:advanced_energiser",
        "create_new_age:reinforced_energiser",
        "create_new_age:redstone_magnet",
        "create_new_age:layered_magnet",
        "create_new_age:carbon_brushes"
    ])

    e.forEachRecipe({ type: "createaddition:charging", mod: "createaddition" }, r => {
        let energy = r.json.get("energy").asDouble
        let input = r.json.get("input").asJsonObject
        let itemId = input.get("item").asString
        let count = input.get("count").asDouble
        let output = r.getOriginalRecipeResult()
        e.recipes.create_new_age.energising(Ingredient.of(itemId, count), output, energy)
            .id(`createdelight:energising/${output.getId().split(":")[1]}`)
    })
    e.remove({ type: "createaddition:charging" })
    // 充能器
    e.recipes.kubejs.shaped(
        'create_new_age:basic_energiser',
        [
            " A ",
            "BCB",
            " D "
        ], {
        A: 'createaddition:capacitor',
        B: 'createaddition:copper_wire',
        C: "create:andesite_casing",
        D: "minecraft:lightning_rod"
    }
    ).id("createdelight:shapeless/basic_energiser")
    e.recipes.kubejs.shaped(
        "create_new_age:advanced_energiser",
        [
            " A ",
            "BCB",
            " D "
        ], {
        A: 'createaddition:capacitor',
        B: "create_new_age:overcharged_golden_sheet",
        C: "create_new_age:basic_energiser",
        D: "vintageimprovements:laser_item"
    }
    ).id("createdelight:shaped/advanced_energiser")
    let iner = "create_new_age:advanced_energiser"
    e.recipes.create.sequenced_assembly(
        'create_new_age:reinforced_energiser',
        'create_new_age:advanced_energiser',
        [
            e.recipes.create.deploying(iner, [iner, 'create_new_age:overcharged_diamond']),
            e.recipes.create.deploying(iner, [iner, "createdelight:bleak_electron_tube"]),
            e.recipes.create.deploying(iner, [iner, "alexscaves:tesla_bulb"])
        ]
    )
        .loops(1)
        .id("createdelight:shaped/reinforced_energiser")
        .transitionalItem(iner)
    e.recipes.create_new_age.energising(
        'createdelight:mmd_diamond',
        'create_new_age:overcharged_diamond',
        10000
    ).id("createdelight:energising/mmd_diamond")
})