ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "some_assembly_required:crafting_shapeless/burger_bun",
        "some_assembly_required:cutting/farmersdelight/tomato_slices",
        "some_assembly_required:cutting/farmersdelight/golden_apple_slices",
        "some_assembly_required:cutting/farmersdelight/enchanted_golden_apple_slices",
        "some_assembly_required:cutting/farmersdelight/chopped_golden_carrot",
        "some_assembly_required:cutting/farmersdelight/chopped_carrot",
        "some_assembly_required:cutting/farmersdelight/chopped_beetroot",
        "some_assembly_required:cutting/farmersdelight/burger_bun",
        "some_assembly_required:cutting/farmersdelight/bread_slice",
        "some_assembly_required:cutting/farmersdelight/apple_slices"
    ])
    remove_recipes_output(e, [
        "some_assembly_required:toasted_bread_slice"
    ])
    cutting(e, "farmersdelight:onion", [["some_assembly_required:sliced_onion", 2]])
    cutting(e, "farmersdelight:tomato", [["some_assembly_required:tomato_slices", 2]])
    cutting(e, "minecraft:beetroot",  [["some_assembly_required:chopped_beetroot", 2]])
    cutting(e, "minecraft:carrot",  [["some_assembly_required:chopped_carrot", 2]])
    cutting(e, "minecraft:golden_carrot",  [["some_assembly_required:chopped_golden_carrot", 2]])
    cutting(e, "minecraft:apple",  [["some_assembly_required:apple_slices", 2]])
    cutting(e, "minecraft:golden_apple",  [["some_assembly_required:golden_apple_slices", 2]])
    cutting(e, "minecraft:enchanted_golden_apple",  [["some_assembly_required:enchanted_golden_apple_slices", 2]])
    cutting(e, "minecraft:bread",  [["some_assembly_required:bread_slice", 4]])




    baking(e, "createdelight:oil_dough", "some_assembly_required:burger_bun", 1, "food", 600)
    toasting(e, "some_assembly_required:bread_slice", "some_assembly_required:toasted_bread_slice", "food", 300)
    e.replaceInput({mod: "some_assembly_required", output: "some_assembly_required:tomato_slices"}, "#forge:vegetables/tomato", "farmersdelight:tomato")
    e.replaceInput({mod: "some_assembly_required", output: "some_assembly_required:sliced_onion"}, "#forge:crops/onion", "farmersdelight:onion")
})