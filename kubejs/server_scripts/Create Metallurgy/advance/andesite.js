ServerEvents.recipes(e => {
    metal_production_line_2(e,
        [
            "create:andesite_alloy_block",
            "create:andesite_alloy",
            "createdelight:andesite_alloy_nugget",
            "vintageimprovements:andesite_sheet",
            "createdelight:molten_andesite"
        ], "heated", 10
    )
    e.recipes.createmetallurgy.alloying(
        Fluid.of("createdelight:molten_andesite", 270),
        [
            "minecraft:andesite",
            Fluid.of("createmetallurgy:molten_iron", 20)
        ], "heated", 10
    ).id("createmetallurgy:alloying/andesite_alloyed_from_iron")
    e.recipes.createmetallurgy.alloying(
        Fluid.of("createdelight:molten_andesite", 270),
        [
            "minecraft:andesite",
            Fluid.of("createmetallurgy:molten_zinc", 20)
        ], "heated", 10
    ).id("createmetallurgy:alloying/andesite_alloyed_from_zinc")
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
})