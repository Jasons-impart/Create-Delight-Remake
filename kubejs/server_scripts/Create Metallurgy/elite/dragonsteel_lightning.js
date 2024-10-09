ServerEvents.recipes(e => {
    metal_production_line_6(e, 
        [
            "iceandfire:dragonsteel_lightning_block",
            'iceandfire:dragonsteel_lightning_ingot',
            "createdelight:molten_lightning_steel"
        ], "superheated", 180
    )
    e.recipes.createmetallurgy.alloying(
        Fluid.of("createdelight:molten_lightning_steel", 30),
        [
            Fluid.of("createmetallurgy:molten_steel", 15),
            Fluid.of("createdelight:lightning_dragon_blood", 15),
        ], "superheated", 60
    ).id("iceandfire:dragonforge/dragonsteel_lightning_ingot")

})