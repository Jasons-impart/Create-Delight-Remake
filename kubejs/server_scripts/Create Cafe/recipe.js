ServerEvents.recipes(e => {
    const {create, vintageimprovements} = e.recipes
    remove_recipes_id(e , [
        "createcafe:mixing/sugar_melting",
        "createcafe:filling/tamarind_tea_filling",
        "createcafe:filling/lavender_tea_filling",
        "createcafe:filling/aloe_tea_filling",
        "createcafe:filling/blackberry_tea_filling",
        "createcafe:filling/guava_tea_filling",
        "createcafe:filling/passionfruit_tea_filling",
        "createcafe:filling/redlove_tea_filling",
        "createcafe:filling/apricot_tea_filling",
        "createcafe:filling/barberry_tea_filling",
        "createcafe:filling/jackfruit_tea_filling",
        "createcafe:filling/gooseberry_tea_filling",
        "createcafe:filling/mandarin_tea_filling",
        "createcafe:filling/starfruit_tea_filling",
        "createcafe:filling/dragonfruit_tea_filling",
        "createcafe:filling/papaya_tea_filling",
        "createcafe:filling/coconut_tea_filling",
        "createcafe:filling/grapefruit_tea_filling",
        "createcafe:filling/mana_tea_filling",
        "createcafe:filling/pomelo_tea_filling",
        "createcafe:filling/citron_tea_filling",
        "createcafe:filling/raspberry_tea_filling",
        "createcafe:filling/yucca_tea_filling",
        "createcafe:filling/plum_tea_filling",
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