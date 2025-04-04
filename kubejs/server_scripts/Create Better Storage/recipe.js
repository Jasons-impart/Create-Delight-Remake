ServerEvents.recipes(e => {
    remove_recipes_output(e, [
        "create_bs:wooden_item_vault"
    ])
    const {kubejs} = e.recipes
    kubejs.shaped("3x create_bs:wooden_item_vault", [
        "ABA",
        "BCB",
        "ABA"
    ], {
        A: "#minecraft:logs",
        B: "createdieselgenerators:wood_chip",
        C: "minecraft:barrel"
    })
})