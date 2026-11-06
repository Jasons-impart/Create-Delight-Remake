ServerEvents.recipes(e => {
    remove_recipes_output(e, [
        "create_enchantment_industry:printer"
    ])
    e.recipes.kubejs.shaped(
        "create_enchantment_industry:printer", [
        "ABA",
        " C ",
        " D "
    ], {
        A: "#forge:spring/below_500",
        B: "create:copper_casing",
        C: "minecraft:dried_kelp",
        D: "create:iron_sheet"
    }).id("createdelight:crafting/printer")
})
