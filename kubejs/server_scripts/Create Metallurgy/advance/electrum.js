ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "createaddition:mixing/electrum"
    ])
    metal_production_line_4(e, 
        [
            "createaddition:electrum_ingot",
            "createaddition:electrum_nugget",
            "createaddition:electrum_sheet",
            "createdelight:molten_electrum"
        ], "heated", 20
    )
    e.recipes.createmetallurgy.alloying(
        Fluid.of("createdelight:molten_electrum", 90),
        [
            Fluid.of("createmetallurgy:molten_gold", 45),
            Fluid.of("createdelight:molten_sliver", 45)
        ], "heated", 20
    ).id("createmetallurgy:alloying/molten_electrum")
})