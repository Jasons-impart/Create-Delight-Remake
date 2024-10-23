ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "ends_delight:ender_pearl_grain",
        "ends_delight:food/chorus_fruit_pie_cutting"
    ])
    cutting_1(e, 'minecraft:ender_pearl', [["ends_delight:ender_pearl_grain", 4]])
    cutting_1(e, 'minecraft:chorus_fruit', [['ends_delight:chorus_fruit_grain', 4]])
    cutting_1(e, "ends_delight:roasted_shulker_meat", [['ends_delight:roasted_shulker_meat_slice', 2]])
    cutting_1(e, "ends_delight:shulker_meat", [['ends_delight:shulker_meat_slice', 2]])
    cutting_1(e, 'ends_delight:chorus_fruit_pie', [['ends_delight:chorus_fruit_pie_slice', 4]])
    cutting_1(e, 'ends_delight:raw_dragon_meat', [['ends_delight:raw_dragon_meat_cuts', 3]])
    cutting_1(e, 'ends_delight:roasted_dragon_meat', [['ends_delight:roasted_dragon_meat_cuts', 3]])
    e.recipes.create.mixing(Fluid.of("create_central_kitchen:chorus_fruit_wine", 250), [
        "minecraft:sugar", Ingredient.of("#forge:chorus_fruits", 2)
    ])
    .heated()
    .id("ends_delight:mixing/chorus_fruit_wine")
    e.replaceInput({id: "ends_delight:crack_non_hatchable_dragon_egg"}, "ends_delight:non_hatchable_dragon_egg", "#forge:dragonegg")
})