ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "casualness_delight:cutting/potato_slice"
    ])
    cutting(e, "casualness_delight:potato_slice", [["create_bic_bit:raw_fries"]])
    cutting(e, "cosmopolitan:cut_potatoes", [["casualness_delight:potato_slice"]])
    cutting(e, "minecraft:potato", [["cosmopolitan:cut_potatoes"]])
})