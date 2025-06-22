ServerEvents.tags("minecraft:item", e => {
    e.add("create:blaze_burner_fuel/special", [
        "mynethersdelight:magma_cake_slice",
        "mynethersdelight:hot_cream_cone"
    ])
    e.add("create:cogwheel", [
        'create:cogwheel',
        'create:large_cogwheel',
        'petrolsparts:coaxial_gear',
        'petrolsparts:large_coaxial_gear',
        'petrolsparts:differential',
        'petrolsparts:planetary_gearset',
        'petrolsparts:colossal_cogwheel'        
    ])
    e.add("create_bs:vaults", [
        'create:item_vault',
        'create_connected:item_silo'
    ])
})

ServerEvents.tags("minecraft:fluid", e => {
    e.add("create:bottomless/allow", [
        "ratatouille:cocoa_liquor",
        "createdelight:egg_yolk",
        "createcafe:melted_sugar",
        "create:honey",
        "createdelight:vinegar",
        "#forge:molten_materials",
        "netherexp:ectoplasm",
        "the_bumblezone:sugar_water_still"
    ])
})