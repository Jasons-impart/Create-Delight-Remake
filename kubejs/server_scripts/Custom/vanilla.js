ServerEvents.recipes(e => {
    remove_recipes_output(e,
        [
            "minecraft:enchanted_golden_apple"
        ]
    )
    const {vintageimprovements, create, createmetallurgy, create_new_age} = e.recipes
    vintageimprovements.pressurizing("minecraft:glowstone_dust", "minecraft:glow_berries")
    .heated()
    .id("createdelight:pressurizing/glowstone_dust")

    create.filling("minecraft:golden_apple", ["minecraft:apple", Fluid.of("createmetallurgy:molten_gold", 450)])
    .id("createdelight:filling/golden_apple")
    create.filling("minecraft:golden_carrot", ["minecraft:carrot", Fluid.of("createmetallurgy:molten_gold", 30)])
    .id("createdelight:filling/golden_carrot")

    createmetallurgy.casting_in_basin(
        "cratedelight:golden_carrot_crate", 
        ["farmersdelight:carrot_crate", Fluid.of("createmetallurgy:molten_gold", 450)], 100, true)
    .id("createdelight:casting_in_basin/golden_carrot_crate")

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
    ], "minecraft:water", 50)
    let iner_1 = "create_new_age:incomplete_enchanted_golden_apple"
    create.sequenced_assembly("minecraft:enchanted_golden_apple", "minecraft:apple", [
        create.filling(iner_1, [iner_1, Fluid.of("create_enchantment_industry:experience", 120)]),
        create.deploying(iner_1, [iner_1, "minecraft:gold_block"]),
        create.deploying(iner_1, [iner_1, "minecraft:gold_block"]),
        create_new_age.energising(iner_1, iner_1, 2000000)
    ])
    .loops(4)
    .transitionalItem(iner_1)
    .id("minecraft:enchanted_golden_apple")

    create.compacting(Fluid.of("createdelight:unrefined_sugar", 500),
     ["minecraft:sugar_cane", Fluid.water(250)])
    .id("createdelight:compacting/unrefined_sugar_from_sugar_cane")
    create.compacting(Fluid.of("createdelight:unrefined_sugar", 500),
     ["2x minecraft:beetroot", Fluid.water(250)])
    .id("createdelight:compacting/unrefined_sugar_from_beetroot")
    create.compacting(Fluid.of("createdelight:unrefined_sugar", 500),
     ["3x alexscaves:licoroot_vine", Fluid.water(250)])
    .id("createdelight:compacting/unrefined_sugar_from_licoroot_vine")
    vintageimprovements.pressurizing([Fluid.of("createcafe:melted_sugar", 100), Fluid.water(100)], Fluid.of("createdelight:unrefined_sugar", 200))
    .secondaryFluidOutput(1)
    .heated()
    .id("createdelight:pressurizing/melted_sugar")

    vintageimprovements.vacuumizing("minecraft:blaze_rod", [
        "minecraft:blaze_powder",
        "minecraft:blaze_powder",
        "minecraft:blaze_powder",
        "minecraft:blaze_powder", 
        "minecraft:stick"])
    .id("vintageimprovements:vacuumizing/blaze_rod")

    e.replaceInput({ id: "minecraft:sticky_piston" }, "minecraft:slime_ball", "#forge:slimeballs")
})

ServerEvents.tags("minecraft:item", e => {
    e.add("create:upright_on_belt", [
        "minecraft:small_amethyst_bud", 
        "minecraft:medium_amethyst_bud", 
        "minecraft:large_amethyst_bud", 
        "minecraft:amethyst_cluster"])
})