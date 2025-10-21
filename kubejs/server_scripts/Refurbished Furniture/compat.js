ServerEvents.recipes(e => {
    e.remove({ type: "refurbished_furniture:cutting_board_slicing" })
    remove_recipes_id(e, [
        "refurbished_furniture:knife",
        "refurbished_furniture:combining/cheese_sandwich",
        "refurbished_furniture:toasting/toast",
        "culturaldelights:avocado_toast",
        "create_central_kitchen:sequenced_assembly/chicken_sandwich",
        "create_central_kitchen:sequenced_assembly/bacon_sandwich",
        "create_central_kitchen:sequenced_assembly/egg_sandwich",
        "refurbished_furniture:frying/sweet_berry_jam",
        "refurbished_furniture:frying/glow_berry_jam",
    ])
    remove_recipes_input(e, [
        'refurbished_furniture:toast'
    ])
    combination(e, [
        'some_assembly_required:bread_slice',
        'ad_astra:cheese',
        'some_assembly_required:bread_slice'
    ], 'refurbished_furniture:cheese_sandwich', 1)
    combination(e, [
        'some_assembly_required:toasted_bread_slice',
        'culturaldelights:cut_avocado'
    ], 'culturaldelights:avocado_toast', 1)
    e.replaceInput({type: "refurbished_furniture:workbench_constructing"}, "minecraft:wheat", "farmersdelight:straw")

})