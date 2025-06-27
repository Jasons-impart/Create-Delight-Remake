ServerEvents.recipes(e => {
    remove_recipes_type(e, [
        "frycooks_delight:frying"
    ])
    remove_recipes_id(e, [
        "farmersdelight:cooking/canola_oil",
        "frycooks_delight:canola_crate",
        "frycooks_delight:canola",
        "frycooks_delight:lard",
        "frycooks_delight:lard_block",
    ])
    package_item(e, 'frycooks_delight:canola', 'frycooks_delight:canola_crate', 9)
    e.replaceInput({ id: "culturaldelights:smelting/smoked_tomato" }, "farmersdelight:tomato", "some_assembly_required:tomato_slices")
    e.recipes.create.compacting(
        Fluid.of("createdieselgenerators:plant_oil", 500),
        "2x frycooks_delight:canola_seeds"
    ).id("createdieselgenerators:compacting/plant_oil_from_canola_seeds")
    e.recipes.create.compacting(
        Fluid.of("createdieselgenerators:plant_oil", 500),
        "2x vintagedelight:roasted_peanut"  
    ).id("createdieselgenerators:compacting/plant_oil_from_peanut")
    threshing(e,
        "frycooks_delight:canola",
        [
            "2x frycooks_delight:canola_seeds",
            Item.of("2x frycooks_delight:canola_seeds").withChance(0.5)
        ], 200)
    // 生炸鸡腿，生炸土豆
    e.recipes.create.mixing(
        "createdelightcore:unfried_potato",
        [
            "minecraft:potato",
            'bakeries:flour',
            Fluid.of("minecraft:water", 50)
        ]
    ).id("frycooks_delight:mixing/unfried_potato")
    e.recipes.create.mixing(
        "createdelightcore:unfried_chicken_leg",
        [
            'butchercraft:chicken_leg',
            'bakeries:flour',
            Fluid.of("minecraft:water", 50)
        ]
    ).id("frycooks_delight:mixing/unfried_chicken_leg")
    e.recipes.create.filling("frycooks_delight:canola_oil", ["minecraft:glass_bottle", Fluid.of("createdieselgenerators:plant_oil", 250)])
    .id("frycooks_delight:filling/canola_oil")
    e.recipes.create.emptying(["minecraft:glass_bottle", Fluid.of("createdieselgenerators:plant_oil", 250)], "frycooks_delight:canola_oil")
    .id("frycooks_delight:emptying/canola_oil")
})
