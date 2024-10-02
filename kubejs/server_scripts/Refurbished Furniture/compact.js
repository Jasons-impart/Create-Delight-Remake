ServerEvents.recipes(e => {
    e.remove({ type: "refurbished_furniture:cutting_board_slicing" })
    remove_recipes_id(e, [
        "refurbished_furniture:knife",
        "refurbished_furniture:combining/cheese_sandwich",
        "refurbished_furniture:toasting/toast",
        "culturaldelights:avocado_toast"
    ])
    remove_recipes_input(e, [
        "refurbished_furniture:toast"
    ])
    combination(e, [
        "some_assembly_required:toasted_bread_slice",
        "refurbished_furniture:sweet_berry_jam"
    ], "refurbished_furniture:sweet_berry_jam_toast", 1)
    combination(e, [
        "some_assembly_required:toasted_bread_slice",
        "refurbished_furniture:glow_berry_jam"
    ], "refurbished_furniture:glow_berry_jam_toast", 1)
    combination(e, [
        "some_assembly_required:bread_slice",
        "ad_astra:cheese",
        "some_assembly_required:bread_slice"
    ], "refurbished_furniture:cheese_sandwich", 1)
    combination(e, [
        "some_assembly_required:toasted_bread_slice",
        "culturaldelights:cut_avocado"
    ], "culturaldelights:avocado_toast", 1)
})