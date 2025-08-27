ServerEvents.recipes(e => {
    remove_recipes_output(e, [
        "quark:carrot_crate",
        "quark:potato_crate",
        "quark:beetroot_crate",
        "quark:apple_crate",
        "quark:golden_apple_crate",
        "quark:golden_carrot_crate",
        "quark:berry_sack",
        "quark:glowberry_sack",
        "quark:gunpowder_sack"
    ])
    remove_recipes_id(e, [
        "quark:mobs/smelting/cooked_crab_leg",
        "quark:mobs/smoking/cooked_crab_leg",
        "quark:mobs/campfire/cooked_crab_leg"
    ])
    //不要删除夸克的箱装方块拆解的配方，idas的建筑中会有。
    // remove_recipes_id(e, [
    //    "quark:building/crafting/compressed/potato_crate_uncompress", 
    // ])
    e.shapeless(
        "9x minecraft:gunpowder",
        "quark:gunpowder_sack"
    )
    e.recipes.create.mixing(
        Fluid.of("create_enchantment_industry:experience", 10),
        'quark:ancient_fruit'
    )
    .heated()
    .id("create_enchantment_industry:experience_from_ancient_fruit")
})