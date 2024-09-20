ServerEvents.recipes(e => {
    cutting(e, "farmersdelight:onion", [["createdelight:sliced_onion", 2]])
    cutting(e, "farmersdelight:tomato", [["createdelight:sliced_tomato", 2]])
    remove_recipes_id(e, ["tetracelium:cutting/tag_dough"])
})
