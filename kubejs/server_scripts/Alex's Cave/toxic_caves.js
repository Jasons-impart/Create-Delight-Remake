ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "create:crushing/raw_uranium",
        "create_new_age:thorium/thorium_crushing",
        "create_new_age:thorium_multiplication"
    ])
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
            Fluid.of("createdieselgenerators:diesel", 10),
            Fluid.of("createdieselgenerators:gasoline", 10)
        ], 
        Fluid.of("createdieselgenerators:crude_oil", 100), 100
    )
        .heatRequirement("heated")
        .id("createdieselgenerators:distillation/crude_oil")
    //石油裂解
    e.recipes.vintageimprovements.pressurizing(
        [
            Fluid.of("createdelight:light_crude_oil", 50),
            Fluid.of("createdelight:ethylene_gas", 20),
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
            Fluid.of("createdelight:ethylene_gas", 50),
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
            Fluid.of("createdelight:lubricating_oil", 10),
            Fluid.of("createdieselgenerators:diesel", 40),
            Fluid.of("createdieselgenerators:gasoline", 40),
            Fluid.of("createdelight:ethylene_gas", 10)
        ],
        Fluid.of("createdelight:light_crude_oil", 100), 20
    )
        .heatRequirement("heated")
        .id("createdelight:distillation/light_crude_oil")
    //乙烯液化
    e.recipes.vintageimprovements.pressurizing(
        Fluid.of("createdelight:ethylene_fluid", 100),
        Fluid.of("createdelight:ethylene_gas", 100), 40
    ).id("createdelight:liquefaction/ethylene_gas")
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
    e.recipes.create.crushing(
        [
            'alexscaves:sulfur_dust',
            Item.of('alexscaves:sulfur_dust').withChance(0.25)
        ],
        'vintageimprovements:sulfur'
    ).id("alexscaves:crushing/sulfur_dust_2")
    //硫磺晶体生长
    make_growing_cluster(e, [
        "alexscaves:sulfur_dust",
        "alexscaves:sulfur_bud_small",
        "alexscaves:sulfur_bud_medium",
        "alexscaves:sulfur_bud_large",
        "alexscaves:sulfur_cluster"
    ], "alexscaves:acid", 50)

    //烂泥再生
    e.recipes.vintageimprovements.pressurizing(
        "9x alexscaves:toxic_paste",
        [
            Fluid.of("alexscaves:acid").withAmount(100),
            Fluid.of("createdelightcore:slime", 90),
            "minecraft:mud"
        ]
    )
        .heated()
        .id("alexscaves:pressurizing/toxic_paste")

    //离心核废料
    centrifugation(e,
        [
            "4x alexscaves:uranium_shard",
            Fluid.of("alexscaves:acid").withAmount(250)
        ],
        ["alexscaves:unrefined_waste"]
    ).id("alexscaves:centrifugation/uranium_shard")

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
    //核弹
    e.recipes.create.mechanical_crafting("alexscaves:nuclear_bomb", [
        "AABAA",
        "ACDCA",
        "ACECA",
        "ACDCA",
        "AABAA"
    ],
    {
        A: "ad_astra:steel_plate",
        B: "minecraft:tnt",
        C: "alexscaves:uranium_rod",
        D: "alexscaves:fissile_core",
        E: "alexscaves:block_of_uranium"
    }).id("alexscaves:nuclear_bomb")

  
    //氡气相关
    e.recipes.vintageimprovements.pressurizing(
        [
            Fluid.of("createdelight:radon", 100),
            Fluid.of("vintageimprovements:sulfuric_acid", 100)
        ],
        Fluid.of("alexscaves:acid", 200)
    )
        .secondaryFluidOutput(0)
        .heated()
        .id("alexscaves:pressurizing/radon")
    e.recipes.create.filling("alexscaves:radon_bottle", ["minecraft:glass_bottle", Fluid.of("createdelight:radon").withAmount(250)])
        .id("alexscaves:filling/radon_bottle")
    e.recipes.create.emptying(["minecraft:glass_bottle", Fluid.of("createdelight:radon").withAmount(250)], "alexscaves:radon_bottle")
        .id("alexscaves:emptying/radon")
})