ServerEvents.recipes(e => {
    const { create } = e.recipes
    create.mixing(Fluid.of("create_enchantment_industry:hyper_experience", 50), [
        Fluid.of("create_enchantment_industry:experience", 200),
        Fluid.of("supplementaries:lumisene", 250),
        "tetra:pristine_lapis"
    ])
    .superheated()
    .id("create_enchantment_industry:mixing/hyper_experience_2")
})