ServerEvents.recipes(e => {
    const {create} = e.recipes
    remove_recipes_output(e, [
        "trailandtales_delight:cheese_wheel",
        "trailandtales_delight:cherry_cake",
        "trailandtales_delight:curd_block",
        "trailandtales_delight:cheese_slice",
        "trailandtales_delight:ancient_coffee",
        "trailandtales_delight:torchflower_tea",
        "trailandtales_delight:cherry_petal_tea",
        "trailandtales_delight:pitcher_plant_tea",
        "trailandtales_delight:dried_cherry_petal"

    ])
    e.replaceInput({}, "trailandtales_delight:cheese_slice", "#forge:cheese")

    make_cake(e, "trailandtales_delight:cherry_petal", "trailandtales_delight:cherry_cake")

    brewing(e, "farmersrespite:coffee", [
        "trailandtales_delight:baked_pitcher_pod", 
        "trailandtales_delight:baked_torchflower_seeds"],
    "createdelight:ancient_coffee",
    "trailandtales_delight:ancient_coffee")
    brewing(e, "farmersrespite:yellow_tea", [
        "minecraft:sugar", 
        "minecraft:torchflower"],
    "createdelight:torchflower_tea",
    "trailandtales_delight:torchflower_tea")
    brewing(e, "farmersrespite:yellow_tea", [
        "minecraft:sugar", 
        "trailandtales_delight:dried_cherry_petal"],
    "createdelight:cherry_petal_tea",
    "trailandtales_delight:cherry_petal_tea")
    brewing(e, "farmersrespite:green_tea", [
        "minecraft:sugar", 
        "minecraft:pitcher_plant"],
    "createdelight:pitcher_plant_tea",
    "trailandtales_delight:pitcher_plant_tea")
    create.mixing(Fluid.of("createdelight:ancient_coffee", 1000), [
        "trailandtales_delight:baked_pitcher_pod", 
        "trailandtales_delight:baked_torchflower_seeds",
        Fluid.of("farmersrespite:coffee", 1000)
    ]).id("createdelight:mixing/ancient_coffee")
    create.mixing(Fluid.of("createdelight:torchflower_tea", 1000), [
        "minecraft:sugar", 
        "minecraft:torchflower",
        Fluid.of("farmersrespite:yellow_tea", 1000)
    ]).id("createdelight:mixing/torchflower_tea")
    create.mixing(Fluid.of("createdelight:cherry_petal_tea", 1000), [
        "minecraft:sugar", 
        "trailandtales_delight:dried_cherry_petal",
        Fluid.of("farmersrespite:yellow_tea", 1000)
    ]).id("createdelight:mixing/cherry_petal_tea")
    create.mixing(Fluid.of("createdelight:pitcher_plant_tea", 1000), [
        "trailandtales_delight:baked_pitcher_pod", 
        "trailandtales_delight:baked_torchflower_seeds",
        Fluid.of("farmersrespite:green_tea", 1000)
    ]).id("createdelight:mixing/pitcher_plant_tea")

})