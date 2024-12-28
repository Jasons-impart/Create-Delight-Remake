ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "neapolitan:adzuki/adzuki_crate",
        "neapolitan:adzuki/adzuki_crate_uncompress"
    ])
    remove_recipes_output(e, [
        "neapolitan:chocolate_strawberries",
        "neapolitan:vanilla_chocolate_fingers",
        "neapolitan:chocolate_bar",
        "neapolitan:chocolate_spider_eye",
        "neapolitan:milk_bottle",
        "neapolitan:vanilla_cake",
        "neapolitan:chocolate_cake",
        "neapolitan:strawberry_cake",
        "neapolitan:banana_cake",
        "neapolitan:mint_cake",
        "neapolitan:adzuki_cake",
        "neapolitan:milk/milk_bottles_from_bucket",
        "neapolitan:ice_cubes"
    ])

    // e.replaceInput({}, "neapolitan:ice_cubes", "youkaishomecoming:ice_cube")
    e.replaceInput({}, "neapolitan:chocolate_bar", "create:bar_of_chocolate")
    e.replaceInput({}, "neapolitan:adzuki_beans", "createdelight:adzuki_beans_seed")
    e.replaceInput({id: "neapolitan:adzuki/adzuki_bun"}, "minecraft:wheat", "create:dough")
    e.replaceInput({id: "neapolitan:strawberry/strawberry_scones"}, "minecraft:wheat", "vintagedelight:oat_dough")

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
})

ServerEvents.tags("minecraft:item", e => {
    e.removeAllTagsFrom(['neapolitan:milk_bottle'])
})