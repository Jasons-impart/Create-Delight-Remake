ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "neapolitan:adzuki/adzuki_crate",
        "neapolitan:milk/milk_bottles_from_bucket",
        "neapolitan:adzuki/adzuki_crate_uncompress"
    ])
    remove_recipes_output(e, [
        "neapolitan:chocolate_strawberries",
        "neapolitan:vanilla_chocolate_fingers",
        "neapolitan:chocolate_bar",
        "neapolitan:chocolate_spider_eye",
        "neapolitan:vanilla_cake",
        "neapolitan:chocolate_cake",
        "neapolitan:strawberry_cake",
        "neapolitan:banana_cake",
        "neapolitan:mint_cake",
        "neapolitan:adzuki_cake",
        "neapolitan:adzuki_curry",
        "neapolitan:adzuki_stew"
    ])
    e.replaceInput({ not: { output: ["minecraft:packed_ice", Fluid.water(), "neapolitan:ice_cubes"] } }, "minecraft:ice", "#forge:ice_cubes")
    e.replaceInput({}, "neapolitan:chocolate_bar", "create:bar_of_chocolate")
    e.replaceInput({ id: "neapolitan:adzuki/adzuki_bun" }, "minecraft:wheat", "create:dough")
    e.replaceInput({ id: "neapolitan:strawberry/strawberry_scones" }, "minecraft:wheat", "vintagedelight:oat_dough")

    make_cake(e, "neapolitan:dried_vanilla_pods", "neapolitan:vanilla_cake")
    make_cake(e, "neapolitan:strawberries", "neapolitan:strawberry_cake")
    make_cake(e, "#forge:fruits/banana", "neapolitan:banana_cake")
    make_cake(e, "neapolitan:mint_leaves", "neapolitan:mint_cake")
    make_cake(e, "neapolitan:roasted_adzuki_beans", "neapolitan:adzuki_cake")
    package_item(e, 'createdelight:adzuki_beans_seed', 'neapolitan:adzuki_crate', 9)

    e.recipes.create.filling(
        "neapolitan:chocolate_strawberries",
        [
            "neapolitan:strawberries",
            Fluid.of("create:chocolate", 250)
        ]).id("neapolitan:filling/chocolate_strawberries")
    e.recipes.create.filling(
        "neapolitan:vanilla_chocolate_fingers",
        [
            "neapolitan:dried_vanilla_pods",
            Fluid.of("create:chocolate", 250)
        ]).id("neapolitan:filling/vanilla_chocolate_fingers")
    e.recipes.create.filling(
        "neapolitan:chocolate_spider_eye",
        [
            "minecraft:spider_eye",
            Fluid.of("create:chocolate", 125)
        ]).id("neapolitan:filling/chocolate_spider_eye")
    e.recipes.create.haunting("neapolitan:white_strawberries", "neapolitan:strawberries").id("neapolitan:haunting/white_strawberries")
    
    
    cutting_2(e, "neapolitan:banana_bunch", [
        ["neapolitan:banana", 2],
        ["neapolitan:banana", 1, 0.5],
        ["neapolitan:banana", 1, 0.25]
    ])
    cutting_2(e, "neapolitan:banana_bundle", [
        ["neapolitan:banana", 9]
    ])

    e.recipes.farmersdelight.cooking([
        "2x createdelight:adzuki_beans_seed",
        "minecraft:beetroot",
        "#forge:vegetables/carrot",
        "#forge:mushrooms"
    ], "neapolitan:adzuki_stew", 10.0, 200, "minecraft:bowl")
    .id("neapolitan:cooking/adzuki_stew")

    e.recipes.farmersdelight.cooking([
        "createdelight:adzuki_beans_seed",
        "neapolitan:dried_banana",
        "#forge:vegetables/carrot",
        "#forge:pumpkins"
    ], "neapolitan:adzuki_curry", 10.0, 200, "minecraft:bowl")
    .id("neapolitan:cooking/adzuki_curry")

})