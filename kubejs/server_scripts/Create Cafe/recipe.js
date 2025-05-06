ServerEvents.recipes(e => {
    const {create, vintageimprovements} = e.recipes
    remove_recipes_id(e , [
        "createcafe:mixing/sugar_melting"
    ])
    create.mixing(Fluid.of("createcafe:melted_sugar", 125), "minecraft:sugar")
    .heated()
    .id("createcafe:mixing/sugar_melting")

    vintageimprovements.vacuumizing("minecraft:sugar", Fluid.of("createcafe:melted_sugar", 125))
    .id("createcafe:vacuumizing/melted_sugar_vacuumizing")
    create.milling(
        [
            '2x createcafe:oreo_crushed',
            Item.of("createcafe:oreo_crushed").withChance(0.25)
        ],
        'createcafe:oreo'
    ).id("createcafe:milling/oreo_milling")
    create.crushing(
        [
            '2x createcafe:oreo_crushed',
            Item.of("createcafe:oreo_crushed").withChance(0.25)
        ],
        'createcafe:oreo'
    ).id("createcafe:crushing/oreo_crushing")
    create.milling(
        "createcafe:oreo_crushed",
        "createcafe:oreo_half"
    ).id("createcafe:crushing/oreo_half_crushing")
})