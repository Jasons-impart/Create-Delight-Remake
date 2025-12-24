ServerEvents.recipes(e => {
    const { create, vintageimprovements } = e.recipes;
    remove_recipes_id(e, [
        "create:crushing/raw_uranium",
        "create_new_age:thorium/thorium_crushing",
        "create_new_age:thorium_multiplication",
        "alexscaves:nuclear_furnace_component",
        "vintageimprovements:craft/sulfur_item_to_nuggets",
        "vintageimprovements:craft/sulfur_block_to_items",
        "vintageimprovements:craft/sulfur_items_to_block",
        "vintageimprovements:craft/sulfur_nuggets_to_item",
        "vintageimprovements:pressurizing/compat/sulfur_dioxide_from_dust",
        "vintageimprovements:pressurizing/sulfuric_acid"
    ])
  // 辐鳃鱼（和桶）量产
  vintageimprovements
    .pressurizing(
      [Item.of("alexscaves:radgill").withChance(0.01), Fluid.of("minecraft:lava", 250)],
      ["#minecraft:fishes", Fluid.of("alexscaves:acid", 1000)]
    )
    .heated()
    .id("createdelight:radgill");
  vintageimprovements
    .pressurizing(
      [Item.of("alexscaves:radgill_bucket").withChance(0.05), Fluid.of("minecraft:lava", 250)],
      ["#createdelight:fish_buckets", Fluid.of("alexscaves:acid", 1000)]
    )
    .heated()
    .id("createdelight:radgill_bucket");

    //铀矿打粉
    e.recipes.create.crushing(
        [
            'createdelight:uranium_dust',
            Item.of('createdelight:uranium_dust').withChance(0.25)
        ],
        'alexscaves:uranium'
    ).id("alexscaves:crushing/uranium_dust")
    //石油蒸馏
    e.recipes.createdieselgenerators.distillation(
        [
            Fluid.of("createdieselgenerators:diesel", 20),
            Fluid.of("createdieselgenerators:gasoline", 20)
        ],
        Fluid.of("createdieselgenerators:crude_oil", 100), 100
    )
        .heatRequirement("heated")
        .id("createdieselgenerators:distillation/crude_oil")
    //石油裂解
    e.recipes.vintageimprovements.pressurizing(
        [
            Fluid.of("createdelight:light_crude_oil", 50),
            Fluid.of("createdelight:ethylene_fluid", 20),
            'createmetallurgy:coke'
        ],
        Fluid.of("createdieselgenerators:crude_oil", 100), 60, 1
    )
        .superheated()
        .id("createdelight:pyrolysis/crude_oil")
    //石油催化裂解
    e.recipes.vintageimprovements.pressurizing(
        [
            Fluid.of("createdelight:light_crude_oil", 100),
            Fluid.of("createdelight:ethylene_fluid", 50)
        ],
        [
            Fluid.of("createdieselgenerators:crude_oil", 100),
            'vintageimprovements:vanadium_nugget'
        ], 30, 1
    )
        .superheated()
        .id("createdelight:catalytic_cracking/crude_oil")
    //轻质油蒸馏
    e.recipes.createdieselgenerators.distillation(
        [
            Fluid.of("createdelight:lubricating_oil", 20),
            Fluid.of("createdieselgenerators:diesel", 50),
            Fluid.of("createdieselgenerators:gasoline", 50),
            Fluid.of("createdelight:ethylene_fluid", 20)
        ],
        Fluid.of("createdelight:light_crude_oil", 100), 20
    )
        .heatRequirement("heated")
        .id("createdelight:distillation/light_crude_oil")
    //乙烯乙醇互相制作
    e.recipes.vintageimprovements.pressurizing(
        Fluid.of("createdieselgenerators:ethanol", 250), 
        [
            Fluid.of("alexscaves:acid", 50),
            Fluid.water(250),
            Fluid.of("createdelight:ethylene_fluid", 250)
        ]
    )
        .secondaryFluidInput(0)
        .heated()
        .id("createdelight:pressurizing/ethanol_from_ethylene")
    e.recipes.vintageimprovements.pressurizing(
        [
            Fluid.of("createdelight:ethylene_fluid", 250),
            Fluid.water(250)
        ], [
            Fluid.of("vintageimprovements:sulfuric_acid", 50),
            Fluid.of("createdieselgenerators:ethanol", 250)
        ]
    )
        .secondaryFluidOutput(0)
        .heated()
        .id("createdelight:pressurizing/ethylene_fluid_from_ethanol")
    //润滑油合成
    e.recipes.vintageimprovements.pressurizing(
       Fluid.of("createdelight:lubricating_oil", 250), 
       [
            Fluid.of("vintageimprovements:sulfuric_acid", 100),
            Fluid.of("createdelight:ethylene_fluid", 250),
            'vintageimprovements:vanadium_nugget',

       ], 500
    ).superheated().id("createdelight:pressurizing/lubricating_oil")
    // 聚合物板
    e.recipes.vintageimprovements.pressurizing(
        'alexscaves:polymer_plate',
        [
            Fluid.of("createdelight:ethylene_fluid", 100),
            Fluid.of("vintageimprovements:sulfuric_acid", 100)
        ]
    )
        .heated()
        .id("alexscaves:polymer_plate")
    //石墨粉
    e.recipes.create.crushing(
        [
            'createdelight:carbon_dust',
            Item.of('createdelight:carbon_dust').withChance(0.25)
        ],
        'createmetallurgy:graphite',
    ).id("createdelight:crushing/carbon_dust")
    //石墨板合成
    e.recipes.create.filling(
        'createdelight:carbon_plate',
        [
            'createdelight:carbon_dust',
            Fluid.of('createdelight:ethylene_fluid', 100)
        ]
    ).id("createdelight:filling/carbon_plate")
    e.recipes.vintageimprovements.pressurizing(
        "createdelight:carbon_plate",
        [
            "createdelight:carbon_dust",
            Fluid.of('createdelight:ethylene_fluid', 10)
        ], 200
    )
        .heated()
        .id("createdelight:pressurizing/carbon_plate")
    //核燃料棒合成
    {
        let iner = "create_new_age:incomplete_fuel"
        e.recipes.create.sequenced_assembly('create_new_age:nuclear_fuel', "ad_astra:steel_plate", [
            e.recipes.vintageimprovements.curving(iner, iner, 1),
            e.recipes.create.deploying(iner, [iner, 'createdelight:carbon_plate']),
            e.recipes.create.deploying(iner, [iner, '#createdelight:fisson_fuel']),
            e.recipes.create.pressing(iner, iner)
        ]
        )
            .loops(1)
            .transitionalItem(iner)
            .id("create_new_age:thorium/nuclear_fuel")
    }
    //硫磺，硫磺晶簇->硫粉
    //硫磺晶体生长
    make_growing_cluster(e, [
        "alexscaves:sulfur_dust",
        "alexscaves:sulfur_bud_small",
        "alexscaves:sulfur_bud_medium",
        "alexscaves:sulfur_bud_large",
        "alexscaves:sulfur_cluster"
    ], "vintageimprovements:sulfuric_acid", 50)

    e.recipes.vintageimprovements.pressurizing(
        Fluid.of("vintageimprovements:sulfur_dioxide", 500),
        "alexscaves:sulfur_dust"
    )
    .processingTime(100)
    .secondaryFluidOutput(0)
    .heated()
    .id("vintageimprovements:pressurizing/compat/sulfur_dioxide_from_dust")

    e.recipes.vintageimprovements.pressurizing(
        Fluid.of("vintageimprovements:sulfuric_acid", 500),
        [Fluid.water(500), Fluid.of("vintageimprovements:sulfur_trioxide", 500)]
    )
    .processingTime(100)
    .secondaryFluidInput(0)
    .id("vintageimprovements:pressurizing/sulfuric_acid")

    e.recipes.vintageimprovements.pressurizing(
        Fluid.of("vintageimprovements:sulfur_dioxide", 500),
        ["alexscaves:sulfur_dust", "ad_astra:ostrum_nugget"]
    )
    .secondaryFluidOutput(0)
    .processingTime(40)
    .heated()
    .id("vintageimprovements:pressurizing/compat/sulfur_dioxide_from_dust_using_ostrum_nugget")
    //烂泥再生
    e.recipes.vintageimprovements.pressurizing(
        "27x alexscaves:toxic_paste",
        [
            'createdelight:depleted_uranium_dust',
            Fluid.of("createdelightcore:slime", 270),
            "minecraft:mud"
        ]
    )
        .heated()
        .id("alexscaves:pressurizing/toxic_paste")
    //硫芯蛋糕卷
    {
        let iner = "bakeries:cut_cake_base"
        e.recipes.create.sequenced_assembly('alexscaves:spelunkie', iner, [
            e.recipes.create.deploying(iner, [iner, "alexscaves:sulfur_dust"]),
            e.recipes.create.pressing(iner, iner),
            e.recipes.create.deploying(iner, [iner, "#forge:cream"]),
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("alexcaves:sequenced_assembly/spelunkie")
    }
    {
        let iner = "bakeries:cut_cake_base"
        e.recipes.create.sequenced_assembly('alexscaves:spelunkie', iner, [
            e.recipes.create.deploying(iner, [iner, "alexscaves:sulfur_dust"]),
            e.recipes.create.pressing(iner, iner),
            e.recipes.create.filling(iner, [iner, Fluid.of("cosmopolitan:cream", 250)]),
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("alexcaves:sequenced_assembly/spelunkie_2")
    }
    e.recipes.kubejs.shapeless(
        "alexscaves:spelunkie",
        [
            'bakeries:cut_cake_base',
            "#forge:cream",
            "alexscaves:sulfur_dust"
        ]
    ).id("alexscaves:spelunkie")
    //猛汉午餐肉
    {
        let iner = 'luncheonmeatsdelight:luncheon_meat_can'
        e.recipes.create.sequenced_assembly('alexscaves:slam', iner, 
            [
                e.recipes.create.deploying(iner, [iner, 'alexscaves:sulfur_dust']),
                e.recipes.create.deploying(iner, [iner, 'minecraft:bone_meal'])
            ] 
        )
            .loops(1)
            .transitionalItem(iner)
            .id("alexscaves:slam")
    }
    //铀块
    e.recipes.kubejs.shapeless(
        "alexscaves:block_of_uranium",
        '9x createdelight:enriched_uraniumdust'
    ).id("alexscaves:block_of_uranium")
    e.recipes.kubejs.shapeless(
        '9x createdelight:enriched_uraniumdust',
        "alexscaves:block_of_uranium"
    ).id("alexscaves:uranium_from_block")
    //铀棒
    let iner_1 = "alexscaves:block_of_uranium"
    e.recipes.create.sequenced_assembly("3x alexscaves:uranium_rod", iner_1,
        [
            e.recipes.createaddition.rolling(iner_1, iner_1),
            e.recipes.create.deploying(iner_1, [iner_1, "create:iron_sheet"]),
            e.recipes.create.deploying(iner_1, [iner_1, "create:iron_sheet"]),
            e.recipes.create.cutting(iner_1, iner_1)
        ]
    )
        .transitionalItem(iner_1)
        .loops(1)
        .id("alexscaves:uranium_rod")
    //裂变核心
    e.recipes.create.mechanical_crafting("alexscaves:fissile_core", 
    [
        "ABA",
        "ACA",
        "AAA", 
    ], {
        A: 'create:iron_sheet',
        B: 'createdelight:bleak_electron_tube',
        C: 'createdelight:enriched_uraniumdust'
    }).id("create_oppenheimered:compacting/nuclear_fissile_core")
    //核弹
    e.recipes.create.mechanical_crafting("alexscaves:nuclear_bomb", [
        "AAAAAAA",
        "ABBBBBA",
        "ABCCCBA",
        "ABCDCBA",
        "ABCCCBA",
        "ABBBBBA",
        "AAAAAAA"
    ], {
        A: "ad_astra:steel_plate",
        B: "minecraft:tnt",
        C: "alexscaves:block_of_uranium",
        D: "alexscaves:fissile_core"
    }).id("alexscaves:nuclear_bomb")


    //氡气相关
    e.recipes.vintageimprovements.pressurizing(
        [
            Fluid.of("createdelight:radon", 25),
            Fluid.of("vintageimprovements:sulfuric_acid", 25)
        ],
        Fluid.of("alexscaves:acid", 50)
    )
        .secondaryFluidOutput(0)
        .heated()
        .id("alexscaves:pressurizing/sulfuric_acid")
    e.recipes.vintageimprovements.pressurizing(
        [
            Fluid.of("createdelight:radon", 250),
            Fluid.of("vintageimprovements:sulfuric_acid", 250)
        ],
        [
            Fluid.of("alexscaves:acid", 500),
            "ad_astra:ostrum_nugget"
        ]
    )
        .secondaryFluidOutput(0)
        .heated()
        .id("alexscaves:pressurizing/sulfuric_acid_using_ostrum")
    e.recipes.create.filling("alexscaves:radon_bottle", ["minecraft:glass_bottle", Fluid.of("createdelight:radon").withAmount(250)])
        .id("alexscaves:filling/radon_bottle")
    e.recipes.create.emptying(["minecraft:glass_bottle", Fluid.of("createdelight:radon").withAmount(250)], "alexscaves:radon_bottle")
        .id("alexscaves:emptying/radon")

    e.recipes.vintageimprovements.pressurizing(
        Item.of("alexscaves:uranium_shard", 1).withChance(0.1),
        Fluid.of("alexscaves:acid", 500),
        160
    )
    .superheated()
    .id("alexscaves:pressurizing/uranium_shard")
    
})