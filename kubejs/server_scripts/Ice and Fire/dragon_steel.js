ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "iceandfire:dragonforge/dragonsteel_fire_ingot",
        "iceandfire:dragonforge/dragonsteel_ice_ingot",
        "iceandfire:dragonforge/dragonsteel_lightning_ingot"
    ])
    const {createmetallurgy} = e.recipes
    metal_production_line_7(e, ["iceandfire:dragonsteel_fire_block", "iceandfire:dragonsteel_fire_ingot", "createdelightcore:molten_fire_steel"], "heated", 160)
    metal_production_line_7(e, ["iceandfire:dragonsteel_ice_block", "iceandfire:dragonsteel_ice_ingot", "createdelightcore:molten_ice_steel"], "heated", 160)
    metal_production_line_7(e, ["iceandfire:dragonsteel_lightning_block", "iceandfire:dragonsteel_lightning_ingot", "createdelightcore:molten_lightning_steel"], "heated", 160)
    createmetallurgy.alloying(Fluid.of("createdelightcore:molten_fire_steel", 90), [Fluid.of("createdelightcore:molten_calorite", 90), Fluid.of("createdelight:fire_dragon_blood", 250), "#iceandfire:scales/dragon/fire"])
    .heatRequirement("superheated")
    .id("createmetallurgy:alloying/molten_fire_steel")
    createmetallurgy.alloying(Fluid.of("createdelightcore:molten_ice_steel", 90), [Fluid.of("createdelightcore:molten_calorite", 90), Fluid.of("createdelight:ice_dragon_blood", 250), "#iceandfire:scales/dragon/ice"])
    .heatRequirement("superheated")
    .id("createmetallurgy:alloying/molten_ice_steel")
    createmetallurgy.alloying(Fluid.of("createdelightcore:molten_lightning_steel", 90), [Fluid.of("createdelightcore:molten_calorite", 90), Fluid.of("createdelight:lightning_dragon_blood", 250), "#iceandfire:scales/dragon/lightning"])
    .heatRequirement("superheated")
    .id("createmetallurgy:alloying/molten_lightning_steel")
    createmetallurgy.alloying(Fluid.of("createdelightcore:molten_fire_steel", 180), [Fluid.of("createdelightcore:molten_fire_steel", 90), Fluid.of("createdelight:fire_dragon_blood", 250), "art_of_forging:forged_steel_ingot"])
    .heatRequirement("superheated")
    .id("createmetallurgy:alloying/molten_fire_steel_2")
    createmetallurgy.alloying(Fluid.of("createdelightcore:molten_ice_steel", 180), [Fluid.of("createdelightcore:molten_ice_steel", 90), Fluid.of("createdelight:ice_dragon_blood", 250), "art_of_forging:forged_steel_ingot"])
    .heatRequirement("superheated")
    .id("createmetallurgy:alloying/molten_ice_steel_2")
    createmetallurgy.alloying(Fluid.of("createdelightcore:molten_lightning_steel", 180), [Fluid.of("createdelightcore:molten_lightning_steel", 90), Fluid.of("createdelight:lightning_dragon_blood", 250), "art_of_forging:forged_steel_ingot"])
    .heatRequirement("superheated")
    .id("createmetallurgy:alloying/molten_lightning_steel_2")
})