ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "tetracelium:cutting/tag_dough",
        "create:emptying/compat/neapolitan/milk_bottle",
        "farmersdelight:wheat_dough"
    ])
    remove_recipes_type(e, [
        "farmersdelight:dough"
    ])
})
