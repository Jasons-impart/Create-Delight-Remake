ServerEvents.recipes(e => {
    const { create, kubejs } = e.recipes
    
    remove_recipes_output(e, [
        "create_enchantment_industry:printer"
    ])

    remove_recipes_id(e, [
        "create_enchantment_industry:compacting/experience_cake_base"
    ])

    create.mixing(
        Fluid.of("createdelight:experience_cake_batter", 1000),
        [
        Fluid.of("createdelight:cake_batter", 1000),
        "2x minecraft:lapis_lazuli"
        ]
    ).id("createdelight:mixing/experience_cake_batter")

    create.compacting("4x create_enchantment_industry:experience_cake_base", [
        Fluid.of("createdelight:experience_cake_batter", 1000)
    ]).id("createdelight:compacting/experience_cake_base")
    
    //同名覆盖原配方，以便与本包其他蛋糕胚注液配方保持一致
    create.filling("create_enchantment_industry:experience_cake", [
        "create_enchantment_industry:experience_cake_base",
        Fluid.of("create_enchantment_industry:experience", 250)
    ]).id("create_enchantment_industry:filling/experience_cake")

    kubejs.shaped(
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
