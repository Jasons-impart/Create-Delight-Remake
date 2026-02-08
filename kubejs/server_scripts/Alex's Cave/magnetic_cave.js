ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        
    ])
    //粉碎方铅岩获取铁粒和钒粒
    e.recipes.create.crushing([
        Item.of('minecraft:iron_nugget').withChance(0.15),
        Item.of('vintageimprovements:vanadium_nugget').withChance(0.1)],
        'alexscaves:galena'
    ).id("createdelight:crushing/galena")

    //方铅岩再生
    e.recipes.vintageimprovements.pressurizing(
        [
            "alexscaves:galena",
            "create_new_age:magnetite_block"
        ],
        [
            "create_new_age:magnetite_block",
            "minecraft:deepslate",
            "minecraft:iron_nugget"
        ]
    ).heatRequirement("heated").id("createdelight:pressurizing/galena")
    e.recipes.create.mixing(
        [
            "alexscaves:galena",
            "create_new_age:magnetite_block"
        ],
        [
            "create_new_age:magnetite_block",
            "minecraft:deepslate",
            "minecraft:iron_nugget"
        ], 5000
    ).id("createdelight:mixing/galena")

    //方铅岩充能为充能方铅岩
    e.recipes.create_new_age.energising(
        "alexscaves:galena",
        "alexscaves:energized_galena_neutral",
        20000
    ).id("createdelight:energising/energized_galena_neutral")


    //充能方铅岩离心成两种方铅岩
    centrifugation(e,
        [
            Item.of("alexscaves:energized_galena_scarlet").withChance(0.5),
            Item.of("alexscaves:energized_galena_azure").withChance(0.5)
        ],
        "alexscaves:energized_galena_neutral"
    ).id("createdelight:centrifugation/energized_galena_neutral")

    //三种方铅岩粉碎
    e.recipes.create.crushing([
        Item.of("minecraft:iron_nugget").withChance(0.2),
        Item.of("vintageimprovements:vanadium_nugget").withChance(0.2),
        Item.of("alexscaves:raw_scarlet_neodymium").withChance(0.15)],
        "alexscaves:energized_galena_scarlet"
    ).id("createdelight:crushing/energized_galena_scarlet")

    e.recipes.create.crushing([
        Item.of("minecraft:iron_nugget").withChance(0.2),
        Item.of("vintageimprovements:vanadium_nugget").withChance(0.2),
        Item.of("alexscaves:raw_azure_neodymium").withChance(0.15)],
        "alexscaves:energized_galena_azure"
    ).id("createdelight:crushing/energized_galena_azure")


    e.recipes.create.crushing([
        Item.of("minecraft:iron_nugget").withChance(0.15),
        Item.of("vintageimprovements:vanadium_nugget").withChance(0.3),
        Item.of("alexscaves:raw_scarlet_neodymium").withChance(0.05),
        Item.of("alexscaves:raw_azure_neodymium").withChance(0.05)],
        "alexscaves:energized_galena_neutral"
    ).id("createdelight:crushing/energized_galena_neutral")

    //赤汝、青汝合金
    e.recipes.createmetallurgy.alloying(
        Fluid.of("createdelightcore:molten_scarlet_neodymium", 90),
        [
            Fluid.of("createmetallurgy:molten_iron", 180),
            "alexscaves:raw_scarlet_neodymium",
            "alexscaves:raw_scarlet_neodymium"
        ]
    ).heatRequirement("superheated").id("createdelight:alloying/molten_scarlet_neodymium")

    e.recipes.createmetallurgy.alloying(
        Fluid.of("createdelightcore:molten_azure_neodymium", 90),
        [
            Fluid.of("createmetallurgy:molten_iron", 180),
            "alexscaves:raw_azure_neodymium",
            "alexscaves:raw_azure_neodymium"
        ]
    ).heatRequirement("superheated").id("createdelight:alloying/molten_azure_neodymium")

    metal_production_line_7(e,
        [
            'alexscaves:block_of_scarlet_neodymium',
            'alexscaves:scarlet_neodymium_ingot',
            'createdelightcore:molten_scarlet_neodymium'
        ], "heated", 100
    )

    metal_production_line_7(e,
        [
            'alexscaves:block_of_azure_neodymium',
            'alexscaves:azure_neodymium_ingot',
            'createdelightcore:molten_azure_neodymium'
        ], "heated", 100
    )

    //配重块
    let iner_3 = "alexscaves:block_of_scarlet_neodymium"
    e.recipes.create.sequenced_assembly("alexscaves:heavyweight", iner_3,
        [
            e.recipes.vintageimprovements.curving(iner_3, iner_3, 2),
            e.recipes.create.deploying(iner_3, [iner_3, "createmetallurgy:steel_ingot"])
        ]
    )
        .transitionalItem(iner_3)
        .loops(1)
        .id("createdelight:heavyweight")

    //机铁之心
    let iner_4 = "alexscaves:heart_of_iron"
    e.recipes.create.sequenced_assembly("alexscaves:heart_of_iron", "minecraft:iron_block",
        [
            e.recipes.vintageimprovements.turning(iner_4, iner_4),
            e.recipes.create_new_age.energising(iner_4, iner_4, 20000)
        ]
    )
        .transitionalItem(iner_4)
        .loops(1)
        .id("createdelight:heart_of_iron")

    //磁流核
    e.recipes.kubejs.shaped("alexscaves:telecore", [
        "ABC",
        " D ",
        "   "
    ],
        {
            A: "alexscaves:raw_scarlet_neodymium",
            B: "minecraft:quartz",
            C: "alexscaves:raw_azure_neodymium",
            D: "create_new_age:overcharged_iron_sheet"
        })
        .id("createdelight:telecore")

    //扫描机兵零件
    let iner_5 = "createdelight:steel_sheet"
    e.recipes.create.sequenced_assembly("alexscaves:notor_gizmo", "createdelight:steel_sheet",
        [
            e.recipes.create.deploying(iner_5, [iner_5, "alexscaves:raw_azure_neodymium"]),
            e.recipes.create.deploying(iner_5, [iner_5, "alexscaves:raw_scarlet_neodymium"])
        ]
    )
        .transitionalItem(iner_5)
        .loops(1)
        .id("createdelight:notor_gizmo")
    
    e.replaceInput({ id: "create_oppenheimered:deploying/electron_tube_from_notor_gizmo" }, "create:copper_nugget", "create:iron_sheet")

    //追踪箭合成
    e.recipes.kubejs.shapeless(
        "alexscaves:seeking_arrow",
        [
            "minecraft:arrow",
            "alexscaves:scarlet_neodymium_ingot"
        ]
    ).id("createdelight:seeking_arrow")
    e.recipes.create.filling(
        'alexscaves:seeking_arrow',
        [
            'minecraft:arrow',
            Fluid.of("createdelightcore:molten_scarlet_neodymium", 10)
        ]
    ).id("createdelight:filling/seeking_arrow")
    e.recipes.create.mixing(
        "alexscaves:seeking_arrow",
        [
            "minecraft:arrow",
            Fluid.of("createdelightcore:molten_scarlet_neodymium", 20)
        ]
    ).id("createdelight:mixing/seeking_arrow")

    //富铁粘液球
    e.recipes.create.mixing(
        'alexscaves:ferrouslime_ball',
        [
            'minecraft:slime_ball',
            '#forge:dusts/iron'
        ]
    ).id("createdelight:mixing/ferrouslime_ball")
    //富铁粘液
    e.recipes.create.mixing(
        Fluid.of("createdelightcore:ferrouslime", 90),
        [
            Fluid.of("createdelightcore:slime", 90),
            '#forge:dusts/iron'
        ]
    ).id("createdelight:mixing/ferrouslime")
    //紫颂黏液
    e.recipes.create.mixing(
        Fluid.of("createdelightcore:chorusslime", 90),
        [
            Fluid.of("createdelightcore:slime", 90),
            '#forge:chorus_fruits'
        ]
    ).id("createdelight:mixing/chorusslime")
    e.recipes.create.compacting(
        'alexscaves:ferrouslime_ball',
        Fluid.of("createdelightcore:ferrouslime", 90)
    ).id("createdelight:compacting/ferrouslime")
    e.recipes.create.mixing(
        Fluid.of("createdelightcore:ferrouslime", 90),
        'alexscaves:ferrouslime_ball'
    ).heated().id("createdelight:mixing/ferrouslime_melting")
    //磁悬浮组件
    let iner_6 = "createdelight:incomplete_magnetic_mechanism"
    e.recipes.create.sequenced_assembly('createdelight:magnetic_mechanism', 'vintageimprovements:vanadium_sheet', [
            e.recipes.create.filling(iner_6, [iner_6, Fluid.of("createdelightcore:ferrouslime", 90)]),
            e.recipes.create.deploying(iner_6, [iner_6, "alexscaves:scarlet_neodymium_ingot"]),
            e.recipes.create.deploying(iner_6, [iner_6, "alexscaves:azure_neodymium_ingot"]),
            e.recipes.create.deploying(iner_6, [iner_6, "alexscaves:tesla_bulb"])
    ])
        .loops(1)
        .transitionalItem(iner_6)
        .id("createdelight:magnetic_mechanism")
})