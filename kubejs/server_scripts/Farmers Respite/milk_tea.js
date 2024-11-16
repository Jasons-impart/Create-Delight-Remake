ServerEvents.tags("item", e => {
    e.add("forge:fruits/durian", [
        "fruitsdelight:durian_flesh"
    ])
})
ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "createcafe:mixing/vanilla_tea_mixing2",
        "createcafe:mixing/avocado_tea_mixing3"
    ])
    //紫颂果珍珠奶茶
    e.custom({
        type: "create:mixing",
        heatRequirement: "heated",
        ingredients: [
            {
                tag: "forge:chorus_fruits"
            },
            {
                item: "ends_delight:ender_pearl_grain"
            },
            {
                item: "minecraft:sugar"
            },
            {
                amount: 200,
                fluidTag: "forge:milk"
            },
            {
                amount: 100,
                fluid: "farmersrespite:black_tea",
                nbt: {}
            }
        ],
        results: [
            {
                amount: 500,
                fluid: "create_central_kitchen:chorus_fruit_bubble_tea"
            }
        ]
    }).id("ends_delight:food/bubble_tea")
    let milk_teas = [
        ["neapolitan:vanilla", "farmersrespite:black_tea", "createcafe:vanilla_tea"],
        ['culturaldelights:avocados', "farmersrespite:black_tea", "createcafe:avocado_tea"],
        ["forge:fruits/mango", "farmersrespite:dandelion_tea", "createcafe:mango_tea"],
        ['forge:fruits/peach', "farmersrespite:dandelion_tea", "createcafe:peach_tea"],
        ['forge:fruits/durian', "farmersrespite:dandelion_tea", "createcafe:durian_tea"]
    ]
    milk_teas.forEach(milk_tea => {
        e.custom({
            type: "create:mixing",
            heatRequirement: "heated",
            ingredients: [
                {
                    tag: milk_tea[0]
                },
                {
                    item: "minecraft:sugar"
                },
                {
                    amount: 200,
                    fluidTag: "forge:milk"
                },
                {
                    amount: 100,
                    fluid: milk_tea[1],
                    nbt: {}
                }
            ],
            results: [
                {
                    amount: 500,
                    fluid: milk_tea[2]
                }
            ]
        }).id(`createcafe:mixing/${milk_tea[2].split(":")[1]}_mixing`)
    });
    //榴莲茶
    e.recipes.create.mixing(Fluid.of("createcafe:durian_tea", 500), [
        "fruitsdelight:durian_flesh", 
        "minecraft:sugar", 
        Fluid.of("minecraft:milk", 200), 
        Fluid.of("farmersrespite:dandelion_tea", 100)
    ]).heated().id("createcafe:mixing/durian_tea_mixing")
    //无花果茶
    e.recipes.create.mixing(Fluid.of("createcafe:fig_tea", 500), [
        "fruitsdelight:fig", 
        "minecraft:sugar", 
        Fluid.of("minecraft:milk", 200), 
        Fluid.of("farmersrespite:green_tea", 100)
    ]).heated().id("createcafe:mixing/fig_tea_mixing")
    //葡萄奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:grape_tea", 500), [
        "#forge:fruits/grape", 
        "minecraft:sugar", 
        Fluid.of("minecraft:milk", 200), 
        Fluid.of("farmersrespite:green_tea", 100)
    ]).heated().id("createcafe:mixing/grape_tea_mixing")
    //血橙奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:blood_tea", 500), [
        "createcafe:blood_orange", 
        "minecraft:sugar", 
        Fluid.of("minecraft:milk", 200), 
        Fluid.of("farmersrespite:rose_hip_tea", 100)
    ]).heated().id("createcafe:mixing/blood_tea_mixing")
    //荔枝奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:lychee_tea", 500), [
        "fruitsdelight:lychee", 
        "minecraft:sugar", 
        Fluid.of("minecraft:milk", 200), 
        Fluid.of("farmersrespite:rose_hip_tea", 100)
    ]).heated().id("createcafe:mixing/lychee_tea_mixing")
    //蓝莓奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:blueberry_tea", 500), [
        "fruitsdelight:blueberry", 
        "minecraft:sugar", 
        Fluid.of("minecraft:milk", 200), 
        Fluid.of("farmersrespite:rose_hip_tea", 100)
    ]).heated().id("createcafe:mixing/blueberry_tea_mixing")
    //菠萝奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:pineapple_tea", 500), [
        "fruitsdelight:pineapple", 
        "minecraft:sugar", 
        Fluid.of("minecraft:milk", 200), 
        Fluid.of("farmersrespite:green_tea", 100)
    ]).heated().id("createcafe:mixing/pineapple_tea_mixing")
    //苹果奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:apple_tea", 500), [
        "minecraft:apple", 
        "minecraft:sugar", 
        Fluid.of("minecraft:milk", 200), 
        Fluid.of("farmersrespite:green_tea", 100)
    ]).heated().id("createcafe:mixing/apple_tea_mixing")
    //南瓜奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:pumpkin_tea", 500), [
        'farmersdelight:pumpkin_slice', 
        "minecraft:sugar", 
        Fluid.of("minecraft:milk", 200), 
        Fluid.of("farmersrespite:yellow_tea", 100)
    ]).heated().id("createcafe:mixing/pumpkin_tea_mixing")
    //甜浆果奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:sweetberry_tea", 500), [
        "minecraft:sweet_berries", 
        "minecraft:sugar", 
        Fluid.of("minecraft:milk", 200), 
        Fluid.of("farmersrespite:rose_hip_tea", 100)
    ]).heated().id("createcafe:mixing/sweetberry_tea_mixing")
    //猕猴桃奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:kiwi_tea", 500), [
        "fruitsdelight:kiwi", 
        "minecraft:sugar", 
        Fluid.of("minecraft:milk", 200), 
        Fluid.of("farmersrespite:yellow_tea", 100)
    ]).heated().id("createcafe:mixing/kiwi_tea_mixing")
    //橙子奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:orange_tea", 500), [
        "fruitsdelight:orange", 
        "minecraft:sugar", 
        Fluid.of("minecraft:milk", 200), 
        Fluid.of("farmersrespite:yellow_tea", 100)
    ]).heated().id("createcafe:mixing/orange_tea_mixing")
    //🦁奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:persimmon_tea", 500), [
        "fruitsdelight:persimmon", 
        "minecraft:sugar", 
        Fluid.of("minecraft:milk", 200), 
        Fluid.of("farmersrespite:yellow_tea", 100)
    ]).heated().id("createcafe:mixing/persimmon_tea_mixing")
    //柠檬茶
    e.recipes.create.mixing(Fluid.of("createcafe:lemon_tea", 500), [
        "fruitsdelight:lemon", 
        "minecraft:sugar", 
        Fluid.of("minecraft:milk", 200), 
        Fluid.of("farmersrespite:green_tea", 100)
    ]).heated().id("createcafe:mixing/lemon_tea_mixing")
    //西瓜奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:watermelon_tea", 500), [
        "minecraft:melon_slice", 
        "minecraft:sugar", 
        Fluid.of("minecraft:milk", 200), 
        Fluid.of("farmersrespite:rose_hip_tea", 100)
    ]).heated().id("createcafe:mixing/watermelon_tea_mixing")
    //香蕉奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:banana_tea", 500), [
        "alexsmobs:banana", 
        "minecraft:sugar", 
        Fluid.of("minecraft:milk", 200), 
        Fluid.of("farmersrespite:black_tea", 100)
    ]).heated().id("createcafe:mixing/banana_tea_mixing")
    //樱桃奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:cherry_tea", 500), [
        "vinery:cherry", 
        "minecraft:sugar", 
        Fluid.of("minecraft:milk", 200), 
        Fluid.of("farmersrespite:black_tea", 100)
    ]).heated().id("createcafe:mixing/cherry_tea_mixing")
    //奥利奥奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:oreo_tea", 500), [
        "createcafe:oreo_crushed", 
        "minecraft:sugar", 
        Fluid.of("minecraft:milk", 200), 
        Fluid.of("farmersrespite:black_tea", 100)
    ]).heated().id("createcafe:mixing/oreo_tea_mixing")
    //紫颂花奶茶
    e.recipes.create.mixing(Fluid.of("create_central_kitchen:chorus_fruit_milk_tea", 500), [
        '#forge:chorus_fruits', 
        "minecraft:sugar", 
        Fluid.of("minecraft:milk", 200), 
        Fluid.of("farmersrespite:black_tea", 100)
    ]).heated().id("ends_delight:food/chorus_fruit_milk_tea")
})