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
})
