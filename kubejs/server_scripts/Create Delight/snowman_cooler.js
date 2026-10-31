ServerEvents.tags("item", e => {
    e.add("createdelightcore:snowman_cooler_fuel/regular", "minecraft:ice")
})

ServerEvents.recipes(e => {
    const { create } = e.recipes

    create.mixing(
        "minecraft:blue_ice",
        ["minecraft:packed_ice", Fluid.of("minecraft:water", 1000)]
    ).heatRequirement("frozen").id("createdelight:cooling_mixing/blue_ice")

    create.mixing(
        "minecraft:packed_ice",
        ["minecraft:ice", Fluid.of("minecraft:water", 1000)]
    ).heatRequirement("frozen").id("createdelight:cooling_mixing/packed_ice")

    create.compacting(
        "alexscaves:block_of_chocolate",
        Fluid.of("create_confectionery:black_chocolate", 100)
    ).heatRequirement("cooled").id("createdelight:cooling_compacting/block_of_chocolate")

    create.mixing(
        Fluid.of("createdelight:ice_dragon_blood", 500),
        [
            "iceandfire:frost_lily",
            Fluid.of("createdelightcore:nuclear_waste", 100),
            Fluid.of("createdelight:ice_dragon_blood", 250)
        ]
    ).heatRequirement("frozen").id("createdelight:cooling_mixing/ice_dragon_blood_from_nuclear_waste")

    create.mixing(
        Fluid.of("createdelight:ice_lubricating_oil", 500),
        [
            Fluid.of("createdelight:lubricating_oil", 250),
            "northstar:enriched_glowstone_ore"
        ]
    ).heatRequirement("frozen").id("createdelight:cooling_mixing/ice_lubricating_oil")

    const seasons = ["spring", "summer", "autumn", "winter"]
    seasons.forEach(season => {
        const essence = `eclipticseasons:${season}_greenhouse_essence`
        create.sequenced_assembly(`2x ${essence}`, essence, [
            create.deploying(essence, [essence, "create:blaze_burner"]),
            create.deploying(essence, [essence, "createdelightcore:snowman_cooler"]),
            create.filling(essence, [essence, Fluid.of("create_enchantment_industry:experience", 250)])
        ])
            .loops(1)
            .transitionalItem(essence)
            .id(`createdelight:${season}_greenhouse_essence_from_blaze_cooler`)
    })

    remove_recipes_id(e, [
        "createdelightcore:mixing/frozen_cake",
        "createdelightcore:compacting/frozen_cake"
    ])

    create.mixing(
        Fluid.of("createdelight:frost_cake_batter", 1000),
        [
        Fluid.of("createdelight:cake_batter", 1000),
        "2x minecraft:snowball"
        ]
    )
    .id("createdelight:mixing/frost_cake_batter")

    create.compacting("4x createdelightcore:frozen_cake_base", [
        Fluid.of("createdelight:frost_cake_batter", 1000)
    ])
    .id("createdelight:compacting/frost_cake_base")

    create.filling("createdelightcore:frozen_cake", ["createdelightcore:frozen_cake_base", Fluid.of("netherexp:ectoplasm", 250)])
    .id("createdelight:filling/frost_cake")

    create.compacting(["minecraft:packed_ice"], ["minecraft:ice"])
        .heatRequirement("cooled").id("createdelight:cooling/ice_to_packed_ice")
    create.compacting(["minecraft:blue_ice"], ["minecraft:packed_ice"])
        .heatRequirement("cooled").id("createdelight:cooling/packed_ice_to_blue_ice")
    create.compacting(["minecraft:ice"], ["minecraft:snow_block"])
        .heatRequirement("cooled").id("createdelight:cooling/snow_block_to_ice")
    create.compacting(["minecraft:blue_ice"], ["minecraft:ice"])
        .heatRequirement("frozen").id("createdelight:cooling/supercooled_ice_to_blue_ice")
    create.mixing(["minecraft:ice"], [Fluid.of("minecraft:water", 500)])
        .heatRequirement("frozen").id("createdelight:cooling/supercooled_water_to_ice")
    create.mixing(["minecraft:snow_block"], [Fluid.of("minecraft:water", 250)])
        .heatRequirement("cooled").id("createdelight:cooling/water_to_snow")
})
