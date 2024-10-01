ServerEvents.recipes(e => {
    metal_production_line_3(e, [
        "createutilities:void_steel_block",
        'createutilities:void_steel_ingot',
        'createutilities:void_steel_sheet',
        "createdelight:molten_void_steel"
    ], "heated", 80)
    e.recipes.createmetallurgy.alloying(
        Fluid.of("createdelight:molten_void_steel", 90),
        [
            Fluid.of("createmetallurgy:molten_steel", 90),
            'ae2:ender_dust'
        ], "heated", 60
    ).id("createutilities:mixing/void_steel_ingot")
})