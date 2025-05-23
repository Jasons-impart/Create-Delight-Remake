ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "some_assembly_required:crafting_shapeless/burger_bun",
        "tetracelium:cutting/farmersdelight/bread_slice",
        "some_assembly_required:cutting/farmersdelight/bread_slice"
    ])
    remove_recipes_output(e, [
        "some_assembly_required:toasted_bread_slice"
    ])
    baking(e, "createdelight:oil_dough", "some_assembly_required:burger_bun", 1, "food", 100)
    toasting(e, "some_assembly_required:bread_slice", "some_assembly_required:toasted_bread_slice", "food", 300)
    cutting_2(e, "minecraft:bread", [['some_assembly_required:bread_slice', 2]])
    e.recipes.create.cutting(
        "2x some_assembly_required:bread_slice",
        "minecraft:bread"
    ).id("some_assembly_required:cutting/create/bread_slice")
})