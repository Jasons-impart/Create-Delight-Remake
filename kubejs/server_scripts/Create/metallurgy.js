ServerEvents.recipes(e => {
    metal_production_line_6(e, [
        "create:andesite_alloy_block",
        "create:andesite_alloy",
        "createdelight:andesite_alloy_nugget",
        "vintageimprovements:andesite_sheet",
        "vintageimprovements:andesite_rod",
        "vintageimprovements:andesite_wire",
        "createdelightcore:molten_andesite"
    ],
    "heated",
    60)
    e.recipes.createmetallurgy.alloying(
        Fluid.of("createdelightcore:molten_andesite", 270),
        [Fluid.of("createmetallurgy:molten_iron", 20), "andesite"])
    .heatRequirement("heated")
    .id("createmetallurgy:alloying/molten_andesite_1")
    e.recipes.createmetallurgy.alloying(
        Fluid.of("createdelightcore:molten_andesite", 270),
        [Fluid.of("createmetallurgy:molten_zinc", 20), "andesite"])
    .heatRequirement("heated")
    .id("createmetallurgy:alloying/molten_andesite_2")
})