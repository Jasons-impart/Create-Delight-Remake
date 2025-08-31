ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "quark:building/crafting/compressed/carrot_crate",
        "quark:building/crafting/compressed/carrot_crate_uncompress",
        "quark:building/crafting/compressed/potato_crate",
        "quark:building/crafting/compressed/potato_crate_uncompress",
        "quark:building/crafting/compressed/beetroot_crate",
        "quark:building/crafting/compressed/beetroot_crate_uncompress",
        "quark:building/crafting/compressed/apple_crate",
        "quark:building/crafting/compressed/apple_crate_uncompress",
        "quark:building/crafting/compressed/golden_apple_crate",
        "quark:building/crafting/compressed/golden_apple_crate_uncompress",
        "quark:building/crafting/compressed/golden_carrot_crate",
        "quark:building/crafting/compressed/golden_carrot_crate_uncompress",
        "quark:building/crafting/compressed/berry_sack",
        "quark:building/crafting/compressed/berry_sack_uncompress",
        "quark:building/crafting/compressed/glowberry_sack",
        "quark:building/crafting/compressed/glowberry_sack_uncompress",
        "quark:building/crafting/compressed/gunpowder_sack",
        "quark:building/crafting/compressed/gunpowder_sack_uncompress",
    ])
    e.recipes.create.mixing(
        Fluid.of("create_enchantment_industry:experience", 10),
        'quark:ancient_fruit'
    )
    .heated()
    .id("create_enchantment_industry:experience_from_ancient_fruit")
})