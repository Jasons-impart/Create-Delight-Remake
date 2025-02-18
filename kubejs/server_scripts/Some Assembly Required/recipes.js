ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "some_assembly_required:crafting_shapeless/burger_bun"
    ])
    remove_recipes_output(e, [
        "some_assembly_required:toasted_bread_slice"
    ])





    baking(e, "createdelight:oil_dough", "some_assembly_required:burger_bun", 1, "food", 600)
    toasting(e, "some_assembly_required:bread_slice", "some_assembly_required:toasted_bread_slice", "food", 300)
    e.replaceInput({mod: "some_assembly_required", output: "some_assembly_required:tomato_slices"}, "#forge:vegetables/tomato", "farmersdelight:tomato")
    e.replaceInput({mod: "some_assembly_required", output: "some_assembly_required:sliced_onion"}, "#forge:crops/onion", "farmersdelight:onion")
})