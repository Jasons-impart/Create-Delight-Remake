ServerEvents.recipes(e => {
    const {createmetallurgy, create} = e.recipes
    metal_production_line_5(e, [
        "createmetallurgy:dirty_copper_dust",
        "createmetallurgy:copper_dust",
        "create:crushed_raw_copper",
        "minecraft:raw_copper",
        "create:copper_nugget"])
    metal_production_line_5(e, [
        "createmetallurgy:dirty_iron_dust",
        "createmetallurgy:iron_dust",
        "create:crushed_raw_iron",
        "minecraft:raw_iron",
        "minecraft:iron_nugget"])
    metal_production_line_5(e, [
        "createmetallurgy:dirty_gold_dust",
        "createmetallurgy:gold_dust",
        "create:crushed_raw_gold",
        "minecraft:raw_gold",
        "minecraft:gold_nugget"])
    metal_production_line_5(e, [
        "createmetallurgy:dirty_wolframite_dust",
        "createmetallurgy:wolframite_dust",
        "createmetallurgy:crushed_raw_wolframite",
        "createmetallurgy:raw_wolframite",
        "createmetallurgy:tungsten_nugget"])
    metal_production_line_5(e, [
        "createmetallurgy:dirty_zinc_dust",
        "createmetallurgy:zinc_dust",
        "create:crushed_raw_zinc",
        "create:raw_zinc",
        "create:zinc_nugget"])
    metal_production_line_5(e, [
        "createdelight:dirty_tin_dust",
        "createdelight:tin_dust",
        "create:crushed_raw_tin",
        "createdelight:raw_tin",
        "createdelight:tin_nugget"])
    metal_production_line_5(e, [
        "createdelight:dirty_silver_dust",
        "createdelight:silver_dust",
        "create:crushed_raw_silver",
        "iceandfire:raw_silver",
        "iceandfire:silver_nugget"])
    metal_production_line_5(e, [
        "createdelight:dirty_desh_dust",
        "createdelight:desh_dust",
        "createdelight:crushed_raw_desh",
        "ad_astra:raw_desh",
        "ad_astra:desh_nugget"])
    metal_production_line_5(e, [
        "createdelight:dirty_ostrum_dust",
        "createdelight:ostrum_dust",
        "createdelight:crushed_raw_ostrum",
        "ad_astra:raw_ostrum",
        "ad_astra:ostrum_nugget"])
    metal_production_line_5(e, [
        "createdelight:dirty_calorite_dust",
        "createdelight:calorite_dust",
        "createdelight:crushed_raw_calorite",
        "ad_astra:raw_calorite",
        "ad_astra:calorite_nugget"])
    
    remove_recipes_id(e, [
        "createmetallurgy:alloying/netherite",
        "createmetallurgy:alloying/steel",
        "createmetallurgy:alloying/electrum"
    ])
    
    createmetallurgy.alloying(Fluid.of("createmetallurgy:molten_netherite", 30), 
    [
        Fluid.of("createmetallurgy:molten_gold", 90),
        "netherite_scrap"])
    .heatRequirement("superheated")
    .id("createmetallurgy:alloying/netherite")
    createmetallurgy.alloying(Fluid.of("createmetallurgy:molten_steel", 270), 
    [
        Fluid.of("createmetallurgy:molten_iron", 270),
        "#forge:coal_coke"        
    ])
    .heatRequirement("superheated")
    .id("createmetallurgy:alloying/steel")

    createmetallurgy.alloying(Fluid.of("createmetallurgy:molten_electrum", 30),
        [
            Fluid.of("createmetallurgy:molten_silver", 15),
            Fluid.of("createmetallurgy:molten_gold", 15)
        ])
    .processingTime(40)
    .heatRequirement("heated")
    .id("createmetallurgy:alloying/electrum")

    e.recipes.create.mixing(
        Fluid.of("createmetallurgy:molten_bronze", 40),
        [
            Fluid.of("createmetallurgy:molten_tin", 10),
            Fluid.of("createmetallurgy:molten_copper", 30)
        ], 150, "heated"
    ).id("createmetallurgy:mixing/alloying_bronze")
    e.recipes.create.mixing(
        Fluid.of("createmetallurgy:molten_electrum", 30),
        [
            Fluid.of("createmetallurgy:molten_sliver", 15),
            Fluid.of("createmetallurgy:molten_gold", 15)
        ], 100, "heated"
    ).id("createmetallurgy:mixing/molten_electrum")
    e.recipes.create.mixing(
        Fluid.of("createmetallurgy:molten_brass", 10),
        [
            Fluid.of("createmetallurgy:molten_copper", 5),
            Fluid.of("createmetallurgy:molten_zinc", 5)
        ], 100, "heated"
    ).id("createmetallurgy:mixing/alloying_brass")
    e.recipes.create.mixing(
        Fluid.of("createdelight:molten_andesite", 270),
        [
            "minecraft:andesite",
            Fluid.of("createmetallurgy:molten_iron", 20)
        ], 50, "heated"
    ).id("createmetallurgy:mixing/andesite_alloyed_from_iron")
    e.recipes.create.mixing(
        Fluid.of("createdelight:molten_andesite", 270),
        [
            "minecraft:andesite",
            Fluid.of("createmetallurgy:molten_zinc", 20)
        ], 50, "heated"
    ).id("createmetallurgy:mixing/andesite_alloyed_from_zinc")
    e.recipes.create.pressing(
        'ad_astra:steel_plate',
        'createmetallurgy:steel_ingot'
    ).id("create:pressing/steel_ingot")
    e.recipes.createmetallurgy.casting_in_table(
        'ad_astra:steel_plate',
        [
            Fluid.of("createmetallurgy:molten_steel", 90),
            "createmetallurgy:graphite_plate_mold"
        ], 100, false
    ).id("createmetallurgy:casting_in_table/steel/plate")
})
