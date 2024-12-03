ServerEvents.recipes(e => {
    const {create} = e.recipes
    remove_recipes_id(e, [
        "conditional:create/mixing/red_grape_juice_mixing",
        "conditional:create/mixing/red_taiga_grape_juice_mixing",
        "conditional:create/mixing/red_jungle_grape_juice_mixing",
        "conditional:create/mixing/red_savanna_grape_juice_mixing",
        "conditional:create/mixing/white_grape_juice_mixing",
        "conditional:create/mixing/white_taiga_grape_juice_mixing",
        "conditional:create/mixing/white_jungle_grape_juice_mixing",
        "conditional:create/mixing/white_savanna_grape_juice_mixing"
    ])

    create.haunting("vinery:rotten_cherry", "vinery:cherry").id("vinery:haunting/rotten_cherry")
})