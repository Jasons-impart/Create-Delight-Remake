ServerEvents.recipes(e => {
    let ingr_1 = ["minecraft:iron_block"]
    for (let i = 0; i < 8; i++) {
        ingr_1.push("alexscaves:energized_galena_neutral")
    }
    e.recipes.vintageimprovements.pressurizing(
        "create_new_age:magnetite_block", 
        ingr_1
    ).heated()
})