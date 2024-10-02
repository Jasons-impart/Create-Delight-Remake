ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "ends_delight:ender_pearl_grain",
        "ends_delight:food/chorus_fruit_pie_cutting"
    ])
    cutting_1(e, "minecraft:ender_pearl", [["ends_delight:ender_pearl_grain", 4]])
    cutting_1(e, "minecraft:chorus_fruit", [["ends_delight:chorus_fruit_grain", 4]])
    cutting_1(e, "ends_delight:roasted_shulker_meat", [["ends_delight:roasted_shulker_meat_slice", 2]])
    cutting_1(e, "ends_delight:shulker_meat", [["ends_delight:shulker_meat_slice", 2]])
    cutting_1(e, "ends_delight:chorus_fruit_pie", [["ends_delight:chorus_fruit_pie_slice", 4]])
    cutting_1(e, "ends_delight:raw_dragon_meat", [["ends_delight:raw_dragon_meat_cuts", 3]])
    cutting_1(e, "ends_delight:roasted_dragon_meat", [["ends_delight:roasted_dragon_meat_cuts", 3]])
})