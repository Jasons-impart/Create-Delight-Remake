ServerEvents.recipes(e => {
    remove_recipes_output(e, [
        "create_bs:wooden_item_vault",
        "create_bs:netherite_item_vault"
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
    kubejs.shaped("create_bs:netherite_item_vault", [
        "ABA",
        "CDC",
        "ABA"
    ], {
        A: "minecraft:gold_block",
        B: "minecraft:diamond_block",
        C: "minecraft:netherite_ingot",
        D: "create_bs:diamond_item_vault"
    })
})