ServerEvents.recipes(e => {
    e.recipes.create.mixing(
        Fluid.of("create_enchantment_industry:experience", 10),
        'quark:ancient_fruit'
    ).heated().id("create_enchantment_industry:experience_from_ancient_fruit")
})