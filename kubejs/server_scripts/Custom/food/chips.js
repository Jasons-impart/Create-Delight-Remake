ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "casualness_delight:cutting/potato_slice"
    ])
    cutting(e, "casualness_delight:potato_slice", [["createdelight:potato_sticks"]])
    cutting(e, "minecraft:potato", [["casualness_delight:potato_slice"]])
})