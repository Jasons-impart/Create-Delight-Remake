ServerEvents.recipes(e => {

    let iner_1 = "create_sa:incomplete_hydraulic_engine"
    e.recipes.create.sequenced_assembly(
        [
            Item.of("create_sa:hydraulic_engine")
        ], "create:copper_sheet",
        [
            e.recipes.create.deploying(iner_1, [iner_1, "create:copper_sheet"]),
            e.recipes.create.filling(iner_1, [iner_1, Fluid.water(250)]),
            e.recipes.create.deploying(iner_1, [iner_1, "create:copper_sheet"]),
        ]
    )
        .transitionalItem(iner_1)
        .loops(3)
        .id("create_sa:hydraulic_engine_recipe")
    let iner_2 = "create_sa:incomplete_heat_engine"
    e.recipes.create.sequenced_assembly("create_sa:heat_engine", "vintageimprovements:andesite_sheet", [
        e.recipes.create.deploying(iner_2, [iner_2, "create:cogwheel"]),
        e.recipes.create.deploying(iner_2, [iner_2, "create:zinc_nugget"]),
        e.recipes.create.deploying(iner_2, [iner_2, "create:copper_nugget"]),
        e.recipes.create.deploying(iner_2, [iner_2, "#forge:coal_coke"])
    ])
        .transitionalItem(iner_2)
        .loops(3)
        .id("create_sa:heat_engine_recipe")
    let iner_3 = "create_sa:incomplete_steam_engine"
    e.recipes.create.sequenced_assembly("create_sa:steam_engine", "create:precision_mechanism", [
        e.recipes.create.deploying(iner_3, [iner_3, "create:brass_sheet"]),
        e.recipes.create.deploying(iner_3, [iner_3, "#forge:spring/between_500_2_1000"]),
        e.recipes.create.deploying(iner_3, [iner_3, "create:propeller"])
    ])
        .transitionalItem(iner_3)
        .loops(3)
        .id("create_sa:steam_engine_recipe")
    e.recipes.create.mechanical_crafting(
        "create_sa:brass_jetpack_chestplate", [
        "ABA",
        "ACA",
        "ADA"
    ], {
        A: "create:brass_sheet",
        B: "create_sa:copper_jetpack_chestplate",
        C: "create_sa:steam_engine",
        D: "create_sa:andesite_jetpack_chestplate"
    }
    ).id("create_sa:brass_jetpack_recipe")
    e.recipes.create.mechanical_crafting(
        "create_sa:brass_exoskeleton_chestplate", [
        "ABA",
        "ACA",
        "ADA"
    ], {
        A: "create:brass_sheet",
        B: "create_sa:copper_exoskeleton_chestplate",
        C: "create_sa:steam_engine",
        D: "create_sa:andesite_exoskeleton_chestplate"
    }
    ).id("create_sa:brass_exoskeleton_recipe")
})