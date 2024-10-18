ServerEvents.recipes(e => {
    const {vintageimprovements, create, createmetallurgy} = e.recipes
    vintageimprovements.pressurizing("minecraft:glowstone_dust", "minecraft:glow_berries")
    .heated()
    .id("createdelight:pressurizing/glowstone_dust")
    create.filling("minecraft:golden_apple", ["minecraft:apple", Fluid.of("createmetallurgy:molten_gold", 450)])
    create.filling("minecraft:golden_carrot", ["minecraft:carrot", Fluid.of("createmetallurgy:molten_gold", 50)])
    createmetallurgy.casting_in_basin("quark:golden_carrot_crate", ["farmersdelight:carrot_crate", Fluid.of("createmetallurgy:molten_gold", 450)])
    .processingTime(100)
})