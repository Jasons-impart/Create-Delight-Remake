ServerEvents.recipes(e => {

    remove_recipes_id(e, ["create_oppenheimered:mixing/sulfuric_acid",
        "create_oppenheimered:filling/acid_radrook",
        "alexscaves:uranium_rod",
        "create_oppenheimered:mixing/azure_to_scarlet_neodymium",
        "create_oppenheimered:mixing/scarlet_to_azure_neodymium"
])


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

    //酸液再生（？）
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
    e.replaceInput({id: "alexscaves:polymer_plate"}, "minecraft:iron_ingot", "createmetallurgy:steel_ingot")
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

    
    //磁化洞穴

    //重锤
    let iner_3 = "alexscaves:block_of_scarlet_neodymium"
    e.recipes.create.sequenced_assembly("alexscaves:heavyweight", iner_3,
        [
            e.recipes.vintageimprovements.curving(iner_3, iner_3, 2),
            e.recipes.create.deploying(iner_3, [iner_3, "createmetallurgy:steel_ingot"])
        ]
    )
    .transitionalItem(iner_3)
    .loops(1)
    .id("alexscaves:heavyweight")

    //机铁之心
    let iner_4 = "minecraft:iron_block"
    e.recipes.create.sequenced_assembly("alexscaves:heart_of_iron", iner_4,
        [
            e.recipes.vintageimprovements.turning(iner_4, iner_4),
            e.recipes.create_new_age.energising(iner_4, iner_4, 20000)
        ]
    )
    .transitionalItem(iner_4)
    .loops(1)
    .id("alexscaves:heart_of_iron")

    //磁流核
    e.recipes.kubejs.shaped("alexscaves:telecore", [
        "ABC",
        " D ",
        "   "
    ],
    {
        A: "alexscaves:scarlet_neodymium_ingot",
        B: "minecraft:quartz",
        C: "alexscaves:azure_neodymium_ingot",
        D: "create_new_age:overcharged_iron_sheet"
    })
    .id("alexscaves:telecore")
    e.replaceInput({id: "create_oppenheimered:deploying/precision_mechanism_from_telecore"}, "create:large_cogwheel", "#forge:spring/between_500_2_1000")
    e.replaceInput({id: "create_oppenheimered:deploying/electron_tube_from_notor_gizmo"}, "create:copper_nugget", "create_new_age:overcharged_iron_sheet")

    //扫描机兵零件
    let iner_5 = "ad_astra:steel_nugget"
    e.recipes.create.sequenced_assembly("alexscaves:notor_gizmo", iner_5, 
        [
            e.recipes.create.deploying(iner_5, [iner_5, "alexscaves:azure_neodymium_ingot"]),
            e.recipes.create.deploying(iner_5, [iner_5, "alexscaves:scarlet_neodymium_ingot"])
        ]
    )
    .transitionalItem(iner_5)
    .loops(1)
    .id("alexscaves:notor_gizmo")
})