ServerEvents.recipes(e => {
    const {vintageimprovements, create, createmetallurgy, create_new_age} = e.recipes
    vintageimprovements.pressurizing("minecraft:glowstone_dust", "minecraft:glow_berries")
    .heated()
    .id("createdelight:pressurizing/glowstone_dust")
    create.filling("minecraft:golden_apple", ["minecraft:apple", Fluid.of("createmetallurgy:molten_gold", 450)])
    create.filling("minecraft:golden_carrot", ["minecraft:carrot", Fluid.of("createmetallurgy:molten_gold", 50)])
    createmetallurgy.casting_in_basin("quark:golden_carrot_crate", ["farmersdelight:carrot_crate", Fluid.of("createmetallurgy:molten_gold", 450)])
    .processingTime(100)
    vintageimprovements.pressurizing(["minecraft:deepslate"], [Fluid.lava(50), "#forge:cobblestone"])
    .heated()
    .id("vintageimprovements:pressurizing/deepslate")
    create.sequenced_assembly([
        Item.of("minecraft:budding_amethyst").withChance(0.1), 
        Item.of("minecraft:amethyst_block").withChance(0.9)
    ],
    "minecraft:amethyst_block", [
        create.filling("minecraft:amethyst_block", ["minecraft:amethyst_block", Fluid.of("createdelight:spent_liquor", 1000)]),
        create_new_age.energising("minecraft:amethyst_block", "minecraft:amethyst_block", 20000)
    ])
    .transitionalItem("minecraft:amethyst_block")
    .loops(1)
    .id("create:sequenced_assembly/budding_amethyst_from_amethyst_block")

    make_growing_cluster(e, [
        "minecraft:amethyst_shard",
        "minecraft:small_amethyst_bud",
        "minecraft:medium_amethyst_bud",
        "minecraft:large_amethyst_bud",
        "minecraft:amethyst_cluster"
    ], 0.25, "minecraft:water", 50)
})

ServerEvents.tags("minecraft:item", e => {
    e.add("create:upright_on_belt", [
        "minecraft:small_amethyst_bud", 
        "minecraft:medium_amethyst_bud", 
        "minecraft:large_amethyst_bud", 
        "minecraft:amethyst_cluster"])
})