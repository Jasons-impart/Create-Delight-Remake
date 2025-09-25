ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "cratedelight:potato_crate_smelting_fd"
    ])

    e.recipes.kubejs.shaped("createdelight:mechanic_grinding_wheel", [
        "AAA",
        "ACB",
        "AAA"
    ], {
        A: "create:andesite_alloy",
        B: "create:shaft",
        C: "minecraft:grindstone"
    })
        .id("createdelight:mechanic_grinding_wheel")
})
