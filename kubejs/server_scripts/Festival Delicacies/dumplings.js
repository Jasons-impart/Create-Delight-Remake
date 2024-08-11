ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "festival_delicacies:dumpling_fd/fd_pork_cabbage_boiled_dumpling_recipe",
        "festival_delicacies:dumpling/pork_cabbage_boiled_dumpling_recipe",
        "festival_delicacies:dumpling/pork_cabbage_boiled_dumpling_recipe_2"
    ])
    dumpling(e, [
        "#forge:dough",
        'butchercraft:pork_stewmeat',
        "#forge:vegetables/cabbage",
        "#forge:vegetables/greenonion"
    ], 'festival_delicacies:pork_cabbage_boiled_dumpling', 1.0, 200)
})