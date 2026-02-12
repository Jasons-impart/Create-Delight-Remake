ServerEvents.recipes(e => {
    remove_recipes_output(e, [
        "create_enchantment_industry:printer"
    ])
    const { create } = e.recipes
    create.mixing(Fluid.of("create_enchantment_industry:hyper_experience", 50), [
        Fluid.of("create_enchantment_industry:experience", 200),
        Fluid.of("supplementaries:lumisene", 250),
        "tetra:pristine_lapis"
    ])
        .superheated()
        .id("createdelight:mixing/hyper_experience_2")
    
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