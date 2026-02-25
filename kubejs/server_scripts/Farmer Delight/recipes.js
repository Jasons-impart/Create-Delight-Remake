ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "tetracelium:cutting/tag_dough",
        "create:emptying/compat/neapolitan/milk_bottle",
        "farmersdelight:wheat_dough",
        "create:filling/compat/farmersdelight/milk_bottle"
    ])
    remove_recipes_type(e, [
        "farmersdelight:dough"
    ])
})
