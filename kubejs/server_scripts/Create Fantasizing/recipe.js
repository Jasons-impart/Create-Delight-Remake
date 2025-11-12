ServerEvents.recipes(e => {
    const { kubejs, create } = e.recipes
    remove_recipes_id(e, [
        "create_fantasizing:transporter",
        "create_fantasizing:compact_hydraulic_engine",
        "create_fantasizing:compact_wind_engine",
        "create_fantasizing:sturdy_conduit",
        "create_fantasizing:sturdy_heavy_core",
        "create_fantasizing:block_placer" //太卡了
    ])
    kubejs.shaped("create_fantasizing:sturdy_conduit", [
        "A",
        "B",
        "C"
    ], {
        A: "alexscaves:enigmatic_engine",
        B: "create_sa:hydraulic_engine",
        C: "create:sturdy_sheet"
    })
        .id("create_fantasizing:sturdy_conduit")

    kubejs.shaped("create_fantasizing:sturdy_heavy_core", [
        "A",
        "B",
        "C"
    ], {
        A: "megacells:sky_steel_block",
        B: "create_sa:heat_engine",
        C: "create:sturdy_sheet"
    })
        .id("create_fantasizing:sturdy_heavy_core")

    kubejs.shaped("create_fantasizing:transporter", [
        "A",
        "B",
        "C"
    ], {
        A: "create:brass_funnel",
        B: "create_sa:heat_engine",
        C: "create:brass_funnel"
    })
        .id("create_fantasizing:transporter")
    {
        let iner = "create_fantasizing:incomplete_compact_hydraulic_engine"
        create.sequenced_assembly("create_fantasizing:compact_hydraulic_engine", "create_fantasizing:sturdy_conduit", [
            create.deploying(iner, [iner, "alexscaves:sea_glass_shards"]),
            create.filling(iner, [iner, Fluid.water(250)])
        ])
            .loops(8)
            .transitionalItem(iner)
            .id("create_fantasizing:compact_hydraulic_engine")
    }

    {
        let iner = "create_fantasizing:incomplete_compact_wind_engine"
        create.sequenced_assembly("create_fantasizing:compact_wind_engine", "create_fantasizing:sturdy_heavy_core", [
            create.deploying(iner, [iner, "#forge:gems/fluix"]),
            create.filling(iner, [iner, Fluid.of("createdelight:spent_liquor", 250)])
        ])
            .loops(8)
            .transitionalItem(iner)
            .id("create_fantasizing:compact_wind_engine")
    }
})