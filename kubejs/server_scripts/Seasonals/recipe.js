ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "seasonals:crafting/pumpkin_cake",
        "seasonals:crafting/beetroot_cake",
        "seasonals:crafting/sweet_berry_cake"
    ])
    remove_recipes_input(e, [
        "create_central_kitchen:pumpkin_cake_slice",
        "create_central_kitchen:sweet_berry_cake_slice"
    ])
    remove_recipes_output(e, [
        "create_central_kitchen:pumpkin_cake_slice",
        "create_central_kitchen:sweet_berry_cake_slice"
    ])
    e.replaceInput({mod: "seasonals"}, "minecraft:wheat", "create:dough")
    const {create} = e.recipes
    make_cake(e, "#seasonals:pumpkin_puree", "seasonals:pumpkin_cake")
    make_cake(e, "some_assembly_required:chopped_beetroot", "seasonals:beetroot_cake")
    e.recipes.create.deploying('seasonals:sweet_berry_cake', [
        "neapolitan:chocolate_cake",
        '#alexscaves:sweet_berries'
    ])
        .id("neapolitan:deploying/sweet_berry_cake")
    
    create.filling("seasonals:glazed_sweet_berries", ["minecraft:sweet_berries", FluidIngredients("forge:honey", 50)])
    .id("seasonals:filling/glazed_sweet_berries")
})