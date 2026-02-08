ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "vintageimprovements:craft/grinder_belt",
        "vintageimprovements:craft/belt_grinder",
        "createmetallurgy:sequenced_assembly/industrial_crucible"
    ])
    e.replaceInput({id: "createmetallurgy:crafting/materials/tungsten_wire_spool"}, "minecraft:stick", "createaddition:spool")
    const { createmetallurgy, create, minecraft, vintageimprovements, kubejs } = e.recipes
    kubejs.shaped(
        'createmetallurgy:sandpaper_belt',
        [
            "AAA",
            "A A",
            "AAA"
        ], {
        A: "#create:sandpaper"
    }
    ).id("createdelight:crafting/materials/sandpaper_belt")
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
        "createdelightcore:raw_tin",
        "createdelightcore:tin_nugget"])
    metal_production_line_5(e, [
        "createdelight:dirty_silver_dust",
        "createdelight:silver_dust",
        "create:crushed_raw_silver",
        "iceandfire:raw_silver",
        "iceandfire:silver_nugget"])

    remove_recipes_id(e, [
        "createmetallurgy:alloying/netherite",
        "createmetallurgy:alloying/steel",
        "createmetallurgy:alloying/electrum",
        "createmetallurgy:alloying/brass"
    ])

    e.replaceInput({ mod: "createmetallurgy", not: "createmetallurgy:alloying/obdurium" }, "create:andesite_alloy", "createdeco:industrial_iron_ingot")
    e.replaceInput({ id: "createmetallurgy:alloying/obdurium" }, "create:andesite_alloy", "createmetallurgy:steel_ingot")
    e.replaceInput({ output: "createmetallurgy:coke" }, "#forge:ores/coal", "#minecraft:coals")
    kubejs.shapeless("createmetallurgy:refractory_mortar", ["minecraft:water_bucket", "6x #minecraft:sand", "2x minecraft:clay_ball"])
    .replaceIngredient("minecraft:water_bucket", "minecraft:bucket")
    .id("createdelight:refractory_mortar")
    createmetallurgy.alloying(Fluid.of("createmetallurgy:molten_netherite", 30),
        [
            Fluid.of("createmetallurgy:molten_gold", 90),
            "netherite_scrap"])
        .heatRequirement("superheated")
        .id("createdelight:alloying/netherite")
    createmetallurgy.alloying(Fluid.of("createmetallurgy:molten_steel", 270),
        [
            Fluid.of("createmetallurgy:molten_iron", 270),
            "#forge:coal_coke"
        ])
        .heatRequirement("superheated")
        .id("createdelight:alloying/steel")

    createmetallurgy.alloying(Fluid.of("createmetallurgy:molten_electrum", 30),
        [
            Fluid.of("createmetallurgy:molten_silver", 15),
            Fluid.of("createmetallurgy:molten_gold", 15)
        ])
        .processingTime(40)
        .heatRequirement("heated")
        .id("createdelight:alloying/electrum")
    createmetallurgy.alloying(Fluid.of("createmetallurgy:molten_brass", 30),
        [
            Fluid.of("createmetallurgy:molten_zinc", 15),
            Fluid.of("createmetallurgy:molten_copper", 15)
        ])
        .processingTime(40)
        .heatRequirement("heated")
        .id("createdelight:alloying/molten_brass")
    createmetallurgy.alloying(Fluid.of("createmetallurgy:molten_obdurium", 150),
        [
            Fluid.of("createmetallurgy:molten_steel", 90),
            Fluid.of("createmetallurgy:molten_tungsten", 60)
        ])
        .heatRequirement("superheated")
        .id("createdelight:alloying/molten_obdurium_from_fluid")

    e.recipes.create.mixing(
        Fluid.of("createmetallurgy:molten_bronze", 40),
        [
            Fluid.of("createmetallurgy:molten_tin", 10),
            Fluid.of("createmetallurgy:molten_copper", 30)
        ], 150, "heated"
    ).id("createdelight:mixing/alloying_bronze")
    e.recipes.create.mixing(
        Fluid.of("createmetallurgy:molten_electrum", 30),
        [
            Fluid.of("createmetallurgy:molten_silver", 15),
            Fluid.of("createmetallurgy:molten_gold", 15)
        ], 100, "heated"
    ).id("createdelight:mixing/molten_electrum")
    e.recipes.create.mixing(
        Fluid.of("createmetallurgy:molten_brass", 30),
        [
            Fluid.of("createmetallurgy:molten_copper", 15),
            Fluid.of("createmetallurgy:molten_zinc", 15)
        ], 150, "heated"
    ).id("createdelight:mixing/alloying_brass")
    e.recipes.create.mixing(
        Fluid.of("createdelightcore:molten_andesite", 270),
        [
            "minecraft:andesite",
            Fluid.of("createmetallurgy:molten_iron", 20)
        ], 50, "heated"
    ).id("createdelight:mixing/andesite_alloyed_from_iron")
    e.recipes.create.mixing(
        Fluid.of("createdelightcore:molten_andesite", 270),
        [
            "minecraft:andesite",
            Fluid.of("createmetallurgy:molten_zinc", 20)
        ], 50, "heated"
    ).id("createdelight:mixing/andesite_alloyed_from_zinc")
    e.recipes.create.pressing(
        'createdelight:steel_sheet',
        'createmetallurgy:steel_ingot'
    ).id("createdelight:pressing/steel_ingot")
    e.recipes.create.pressing(
        "createmetallurgy:tungsten_sheet",
        "createmetallurgy:tungsten_ingot"
    ).id("createdelight:pressing/tungsten_sheet")
    e.recipes.createmetallurgy.casting_in_table(
        'createdelight:steel_sheet',
        [
            Fluid.of("createmetallurgy:molten_steel", 90),
            "createmetallurgy:graphite_plate_mold"
        ], 100, false
    ).id("createdelight:casting_in_table/steel/plate")
    e.recipes.vintageimprovements.pressurizing("createmetallurgy:graphite", [
        "#forge:coal_coke",
        "#forge:coal_coke",
        "minecraft:clay_ball"
    ])
    .superheated()
    .id("createdelight:pressurizing/graphite")
    {
        let iner = "createmetallurgy:incomplete_industrial_crucible"
        e.recipes.create.sequenced_assembly("createmetallurgy:industrial_crucible", 'createfluidstuffs:multi_fluid_tank', [
            e.recipes.create.pressing(iner, iner),
            e.recipes.create.deploying(iner, [iner, "createmetallurgy:refractory_mortar"]),
            e.recipes.create.deploying(iner, [iner, "#forge:plates/obdurium"]),
            e.recipes.createmetallurgy.grinding(iner, iner)
        ])
            .loops(1)
            .transitionalItem("createmetallurgy:incomplete_industrial_crucible")
            .id("createdelight:sequenced_assembly/industrial_crucible")
    }
    vintageimprovements.hammering("createmetallurgy:obdurium_sheet", "#forge:ingots/obdurium")
        .id("createdelight:hammering/obdurium_sheet")
    entity_melting(e, Fluid.of("createdelight:fire_dragon_blood", 5000), "iceandfire:fire_dragon", 4)
        .id("createdelight:entity_melting/fire_dragon")
    entity_melting(e, Fluid.of("createdelight:ice_dragon_blood", 5000), "iceandfire:ice_dragon", 4)
        .id("createdelight:entity_melting/ice_dragon")
    entity_melting(e, Fluid.of("createdelight:lightning_dragon_blood", 5000), "iceandfire:lightning_dragon", 4)
        .id("createdelight:entity_melting/lightning_dragon")
})
