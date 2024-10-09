ServerEvents.recipes(e => {
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