ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "vinery:straw_hat",
        "vinery:winemaker_apron",
        "vinery:winemaker_leggings",
        "vinery:winemaker_boots",
        "vinery:apples",
        "vinery:apple_bag"
    ])
    e.recipes.kubejs.shapeless("9x nethervinery:warped_grape", "nethervinery:warped_grape_crate")
    .id("nethervinery:warped_grape_from_crate")
    e.recipes.kubejs.shapeless("9x nethervinery:crimson_grape", "nethervinery:crimson_grape_crate")
    .id("nethervinery:crimson_grape_from_crate")
})