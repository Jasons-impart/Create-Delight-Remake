ServerEvents.recipes(e => {
    const { create, kubejs } = e.recipes
    remove_recipes_id(e, [
        "fruitsdelight:apple_from_apple_crate",
        "fruitsdelight:apple_crate",
        "vintagedelight:jam/apple_sauce_jar",
        "vintagedelight:cooking/apple_sauce_jar",
        "vintagedelight:jam/sweet_berry_jam_jar",
        "vintagedelight:cooking/sweet_berry_jam_jar",
        "vintagedelight:jam/glow_berry_jam_jar",
        "vintagedelight:cooking/glow_berry_jam_jar",
        "vintagedelight:jam/apple_sauce_jar_deconstruct",
        "vintagedelight:jam/sweet_berry_jam_jar_deconstruct",
        "vintagedelight:jam/glow_berry_jam_jar_deconstruct",
        "vintagedelight:jam/gearo_berry_jam_jar_deconstruct",
        "vintagedelight:jam/gearo_berry_jam_jar",
        "vintagedelight:cooking/gearo_berry_jam_jar",
        "farmersdelight:cooking/mangosteen_cake",
        "fruitsdelight:hamimelon_shaved_ice"
    ])
    e.replaceInput({ mod: "fruitsdelight", input: "minecraft:slime_ball" }, "minecraft:slime_ball", "#forge:gelatin")
    create.mixing(
        Fluid.of("fruitsdelight:kiwi_juice", 250),
        "2x fruitsdelight:kiwi"
    ).id("createdelight:mixing/flowing_kiwi_juice")
    create.mixing(
        Fluid.of("fruitsdelight:hamimelon_juice", 250),
        "4x fruitsdelight:hamimelon_slice"
    ).id("createdelight:mixing/flowing_hamimelon_juice")
    kubejs.shapeless(
        'fruitsdelight:hamimelon_shaved_ice',
        [
            "minecraft:glass_bottle",
            "youkaishomecoming:ice_cube",
            "#forge:milk",
            'fruitsdelight:hamimelon_slice',
        ]
    ).id("createdelight:shapeless/hamimelon_shaved_ice")
    {
        let iner = "minecraft:glass_bottle"
        create.sequenced_assembly('fruitsdelight:hamimelon_shaved_ice', iner, [
            create.deploying(iner, [iner, "fruitsdelight:hamimelon_slice"]),
            create.deploying(iner, [iner, "youkaishomecoming:ice_cube"]),
            create.filling(iner, [iner, FluidIngredients("forge:milk", 250)]),
        ])
        .loops(1)
        .transitionalItem(iner)
        .id("createdelight:sequenced_assembly/hamimelon_shaved_ice")
    }
})
