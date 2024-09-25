ServerEvents.recipes(e => {
    //硫磺，硫磺晶簇->硫粉
    e.recipes.create.crushing([
        '3x alexscaves:sulfur_dust',
        Item.of('alexscaves:sulfur_dust').withChance(0.5)
    ], 'alexscaves:sulfur_cluster'
    ).id("alexscaves:crushing/sulfur_dust")
    e.recipes.create.crushing([
        'alexscaves:sulfur_dust',
        Item.of('alexscaves:sulfur_dust').withChance(0.25)
    ], 'vintageimprovements:sulfur'
    ).id("alexscaves:crushing/sulfur_dust_2")

    //粉碎方铅岩获取铁粒和钒粒
    e.recipes.create.crushing([
        Item.of('minecraft:iron_nugget').withChance(0.15),
        Item.of('vintageimprovements:vanadium_nugget').withChance(0.15)],
        'alexscaves:galena'
    ).id("alexscaves:crushing/galena")

    //硫磺晶芽注入酸液生长
    e.recipes.create.filling(
        'alexscaves:sulfur_bud_medium',
        ['alexscaves:sulfur_bud_small',
            Fluid.of('alexscaves:acid').withAmount(50)]
    ).id("alexscaves:filling/sulfur_bud_medium")
    e.recipes.create.filling(
        'alexscaves:sulfur_bud_large',
        ['alexscaves:sulfur_bud_medium',
            Fluid.of('alexscaves:acid').withAmount(50)]
    ).id("alexscaves:filling/sulfur_bud_large")
    e.recipes.create.filling(
        'alexscaves:sulfur_cluster',
        ['alexscaves:sulfur_bud_large',
            Fluid.of('alexscaves:acid').withAmount(50)]
    ).id("alexscaves:filling/sulfur_cluster")


    //酸液再生（？）
    remove_recipes_id(e, ["create_oppenheimered:mixing/sulfuric_acid",
                          "create_oppenheimered:filling/acid_radrook",
                          "alexscaves:uranium_rod"
    ])
    e.recipes.create.mixing(
        Fluid.of('alexscaves:acid').withAmount(1000),
        ['2x alexscaves:acidic_radrock',
            'minecraft:mud',
            Fluid.water(1000)]
    ).heated()
        .id("alexscaves:mixing/acid")

    e.recipes.create.compacting(
        '4x alexscaves:acidic_radrock',
        ['4x alexscaves:radrock',
            Fluid.of('alexscaves:acid').withAmount(1000)]
    )
        .id("alexscaves:compacting/acidic_radrock")

    //烂泥再生
    e.recipes.vintageimprovements.pressurizing(
        "9x alexscaves:toxic_paste",
        [Fluid.of("alexscaves:acid").withAmount(250),
        Fluid.water(1000),
            "minecraft:mud"
        ]
    ).heated()
    .id("alexscaves:pressurizing/toxic_paste")

    //离心核废料
    e.recipes.vintageimprovements.centrifugation(
        ["4x alexscaves:uranium_shard",
            Fluid.of("alexscaves:acid").withAmount(250)
        ],
        ["alexscaves:unrefined_waste"])
    .id("alexscaves:centrifugation/uranium_shard")

    let iner_1 = "alexscaves:block_of_uranium"
    //铀棒
    e.recipes.create.sequenced_assembly(
        "3x alexscaves:uranium_rod",
        iner_1,
        [
            e.recipes.createaddition.rolling(iner_1, iner_1),
            e.recipes.create.deploying(iner_1, [iner_1, "create:iron_sheet"]),
            e.recipes.create.deploying(iner_1, [iner_1, "create:iron_sheet"]),
            e.recipes.create.cutting(iner_1, iner_1)
        ])
        .transitionalItem(iner_1)
        .loops(1)
        .id("alexscaves:uranium_rod")
    
    //修改动力刷怪笼配方
    e.replaceInput({id: "create_mechanical_spawner:mechanical_spawner"}, "minecraft:emerald", "alexscaves:amber_monolith")

    //氡气相关
    e.recipes.vintageimprovements.pressurizing(Fluid.of("createdelight:radon").withAmount(1000), Fluid.of("alexscaves:acid").withAmount(100))
    .secondaryFluidOutput(0)
    .heated()
    e.recipes.create.filling("alexscaves:radon_bottle", ["minecraft:glass_bottle", Fluid.of("createdelight:radon").withAmount(250)])

    // 聚合物板
    e.replaceInput({id: "create_mechanical_spawner:polymer_plate"}, "minecraft:iron_ingot", "createmetallurgy:steel_ingot")
    let iner_2 = "createmetallurgy:steel_block"
    e.recipes.create.sequenced_assembly("48x alexscaves:polymer_plate", iner_2, [
        e.recipes.vintageimprovements.hammering(iner_2, iner_2),
        e.recipes.create.filling(iner_2, [iner_2, Fluid.of("vintageimprovements:sulfuric_acid").withAmount(1000)]),
        e.recipes.create.filling(iner_2, [iner_2, Fluid.of("createdelight:radon").withAmount(1000)]),
        e.recipes.create.cutting(iner_2, iner_2)
    ])
    .transitionalItem(iner_2)
    .loops(1)
    .id("alexscaves:polymer_plate_2")

    //粉碎珍珠出海洋玻璃碎片
    e.recipes.create.crushing([
        "3x alexscaves:sea_glass_shards",
        Item.of("alexscaves:sea_glass_shards", 3).withChance(0.5)], "alexscaves:pearl")
})