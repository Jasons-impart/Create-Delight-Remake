ServerEvents.recipes(e => {
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
    ])
    e.replaceInput({ mod: "fruitsdelight", input: "minecraft:slime_ball" }, "minecraft:slime_ball", "#forge:gelatin")
    e.recipes.create.mixing(
        Fluid.of("fruitsdelight:kiwi_juice", 250),
        "2x fruitsdelight:kiwi"
    ).id("fruitsdelight:mixing/flowing_kiwi_juice")
    e.recipes.create.mixing(
        Fluid.of("fruitsdelight:hamimelon_juice", 250),
        "4x fruitsdelight:hamimelon_slice"
    ).id("fruitsdelight:mixing/flowing_hamimelon_juice")
})
