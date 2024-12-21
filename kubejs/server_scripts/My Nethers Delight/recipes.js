ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "mynethersdelight:boiled_egg_from_smoking",
        "mynethersdelight:boiled_egg_cooking"
    ])
    const {create, kubejs} = e.recipes
    create.milling("minecraft:gunpowder", "mynethersdelight:powder_cannon")
    .id("mynethersdelight:milling/powdery_cannon")
    kubejs.shapeless("mynethersdelight:letios_compost", [
        "2x vintagedelight:organic_mash",
        ["minecraft:soul_sand", "minecraft:soul_soil"],
        ["minecraft:crimson_roots", "minecraft:warped_roots"],
        ["minecraft:crimson_roots", "minecraft:warped_roots", "farmersdelight:straw"],
        "4x minecraft:bone_meal"
    ])
    .id("mynethersdelight:letios_compost_from_organic_mash")
    kubejs.shapeless("mynethersdelight:letios_compost", [
        ["minecraft:soul_sand", "minecraft:soul_soil"],
        "2x vintagedelight:organic_mash",
        "2x #netherexp:glowspores",
        "4x minecraft:bone_meal"
    ])
    .id("mynethersdelight:letios_compost_from_glowspores")
    kubejs.shapeless("mynethersdelight:letios_compost", [
        ["minecraft:soul_sand", "minecraft:soul_soil"],
        "2x minecraft:rotten_flesh",
        "2x #netherexp:glowspores",
        "4x minecraft:bone_meal"
    ])
    .id("mynethersdelight:letios_compost_from_glowspores_2")
    e.recipes.farmersdelight.cooking(
        '#forge:eggs',
        'mynethersdelight:boiled_egg',
        1.0, 200
    ).id("mynethersdelight:boiled_egg_from_campfire_cooking")

    
    cutting_3(e, "mynethersdelight:ghasta_with_cream", [
        ["mynethersdelight:ghasta_with_cream", 1, 0.9],
        ["mynethersdelight:ghasta", 1]
    ])

    e.recipes.create.filling(
        "2x mynethersdelight:ghasta",
        ["mynethersdelight:ghasta", Fluid.of("create:potion", 250, {Potion: "minecraft:healing"})])
        .id("mynethersdelight:filling/ghasta")
    e.recipes.create.filling(
        "2x mynethersdelight:ghasmati",
        ["mynethersdelight:ghasmati", Fluid.of("create:potion", 250, {Potion: "minecraft:healing"})])
        .id("mynethersdelight:filling/ghasmati")

    e.recipes.create.emptying([Fluid.of("netherexp:ectoplasm", 250), "minecraft:bowl", "mynethersdelight:ghasta"], "mynethersdelight:plate_of_ghasta_with_cream")
})