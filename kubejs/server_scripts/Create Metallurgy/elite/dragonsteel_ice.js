ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "iceandfire:dragonforge_ice_core_disabled",
        "iceandfire:dragonforge_ice_input"
    ])
    metal_production_line_6(e, 
        [
            "iceandfire:dragonsteel_ice_block",
            'iceandfire:dragonsteel_ice_ingot',
            "createdelight:molten_ice_steel"
        ], "superheated", 180
    )
    e.recipes.createmetallurgy.alloying(
        Fluid.of("createdelight:molten_ice_steel", 30),
        [
            Fluid.of("createmetallurgy:molten_steel", 15),
            Fluid.of("createdelight:ice_dragon_blood", 15),
        ], "superheated", 60
    ).id("iceandfire:dragonforge/dragonsteel_ice_ingot")
})