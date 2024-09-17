ServerEvents.tags("item", e => {
    e.add("forge:fruits/durian", [
        "fruitsdelight:durian_flesh"
    ])
})
ServerEvents.recipes(e => {
    e.remove({ id: "create:mixing/tea" })
    e.remove({ id: "createcafe:mixing/mango_tea_mixing" })
    e.remove({ id: "createcafe:mixing/peach_tea_mixing" })
    e.remove({ id: "createcafe:mixing/durian_tea_mixing" })
    e.remove({ id: "createcafe:mixing/fig_tea_mixing" })
    e.remove({ id: "createcafe:mixing/grape_tea_mixing" })
    e.remove({ id: "createcafe:mixing/blood_tea_mixing" })
    e.remove({ id: "createcafe:mixing/lychee_tea_mixing" })
    e.remove({ id: "createcafe:mixing/blueberry_tea_mixing" })
    e.remove({ id: "createcafe:mixing/pineapple_tea_mixing" })
    e.remove({ id: "createcafe:mixing/apple_tea_mixing" })
    e.remove({ id: "createcafe:mixing/pumpkin_tea_mixing" })
    e.remove({ id: "createcafe:mixing/sweetberry_tea_mixing" })
    e.remove({ id: "createcafe:mixing/kiwi_tea_mixing" })
    e.remove({ id: "createcafe:mixing/orange_tea_mixing" })
    e.remove({ id: "createcafe:mixing/persimmon_tea_mixing" })
    e.remove({ id: "createcafe:mixing/lemon_tea_mixing" })
    e.remove({ id: "createcafe:mixing/watermelon_tea_mixing" })
    e.remove({ id: "createcafe:mixing/banana_tea_mixing" })
    e.remove({ id: "createcafe:mixing/cherry_tea_mixing" })
    e.remove({ id: "createcafe:mixing/oreo_tea_mixing" })
    e.remove({ id: "farmersrespite:brewing/chorus_flower_tea_from_water" })
    e.remove({ id: "ends_delight:food/chorus_fruit_milk_tea" })
    //建造工程茶
    e.custom({
        "type": "create:mixing",
        "heatRequirement": "heated",
        "ingredients": [
            { "tag": "minecraft:leaves" },
            {
                "amount": 200,
                "fluidTag": "forge:milk"
            },
            {
                "amount": 100,
                "fluid": "farmersrespite:rose_hip_tea"
            }],
        "results": [
            {
                "amount": 500,
                "fluid": "create:tea"
            }
        ]
    })
    //芒果奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:mango_tea", 500), [
        "fruitsdelight:mango", Fluid.of("minecraft:milk", 200), Fluid.of("createcafe:melted_sugar", 200), Fluid.of("farmersrespite:dandelion_tea", 100)
    ]).heated()
    //桃子奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:peach_tea", 500), [
        "fruitsdelight:peach", Fluid.of("minecraft:milk", 200), Fluid.of("createcafe:melted_sugar", 200), Fluid.of("farmersrespite:dandelion_tea", 100)
    ]).heated()
    //榴莲茶
    e.recipes.create.mixing(Fluid.of("createcafe:durian_tea", 500), [
        "fruitsdelight:durian_flesh", Fluid.of("minecraft:milk", 200), Fluid.of("createcafe:melted_sugar", 200), Fluid.of("farmersrespite:dandelion_tea", 100)
    ]).heated()
    //无花果茶
    e.recipes.create.mixing(Fluid.of("createcafe:fig_tea", 500), [
        "fruitsdelight:fig", Fluid.of("minecraft:milk", 200), Fluid.of("createcafe:melted_sugar", 200), Fluid.of("farmersrespite:green_tea", 100)
    ]).heated()
    //葡萄奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:grape_tea", 500), [
        "#forge:fruits/grape", Fluid.of("minecraft:milk", 200), Fluid.of("createcafe:melted_sugar", 200), Fluid.of("farmersrespite:green_tea", 100)
    ]).heated()
    //血橙奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:blood_tea", 500), [
        "createcafe:blood_orange", Fluid.of("minecraft:milk", 200), Fluid.of("createcafe:melted_sugar", 200), Fluid.of("farmersrespite:rose_hip_tea", 100)
    ]).heated()
    //荔枝奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:lychee_tea", 500), [
        "fruitsdelight:lychee", Fluid.of("minecraft:milk", 200), Fluid.of("createcafe:melted_sugar", 200), Fluid.of("farmersrespite:rose_hip_tea", 100)
    ]).heated()
    //蓝莓奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:blueberry_tea", 500), [
        "fruitsdelight:blueberry", Fluid.of("minecraft:milk", 200), Fluid.of("createcafe:melted_sugar", 200), Fluid.of("farmersrespite:rose_hip_tea", 100)
    ]).heated()
    //菠萝奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:pineapple_tea", 500), [
        "fruitsdelight:pineapple", Fluid.of("minecraft:milk", 200), Fluid.of("createcafe:melted_sugar", 200), Fluid.of("farmersrespite:green_tea", 100)
    ]).heated()
    //苹果奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:apple_tea", 500), [
        "minecraft:apple", Fluid.of("minecraft:milk", 200), Fluid.of("createcafe:melted_sugar", 200), Fluid.of("farmersrespite:green_tea", 100)
    ]).heated()
    //南瓜奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:pumpkin_tea", 500), [
        "minecraft:pumpkin", Fluid.of("minecraft:milk", 200), Fluid.of("createcafe:melted_sugar", 200), Fluid.of("farmersrespite:yellow_tea", 100)
    ]).heated()
    //甜浆果奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:sweetberry_tea", 500), [
        "minecraft:sweet_berries", Fluid.of("minecraft:milk", 200), Fluid.of("createcafe:melted_sugar", 200), Fluid.of("farmersrespite:rose_hip_tea", 100)
    ]).heated()
    //猕猴桃奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:kiwi_tea", 500), [
        "fruitsdelight:kiwi", Fluid.of("minecraft:milk", 200), Fluid.of("createcafe:melted_sugar", 200), Fluid.of("farmersrespite:yellow_tea", 100)
    ]).heated()
    //橙子奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:orange_tea", 500), [
        "fruitsdelight:orange", Fluid.of("minecraft:milk", 200), Fluid.of("createcafe:melted_sugar", 200), Fluid.of("farmersrespite:yellow_tea", 100)
    ]).heated()
    //🦁奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:persimmon_tea", 500), [
        "fruitsdelight:persimmon", Fluid.of("minecraft:milk", 200), Fluid.of("createcafe:melted_sugar", 200), Fluid.of("farmersrespite:yellow_tea", 100)
    ]).heated()
    //柠檬茶
    e.recipes.create.mixing(Fluid.of("createcafe:lemon_tea", 500), [
        "fruitsdelight:lemon", Fluid.of("minecraft:milk", 200), Fluid.of("createcafe:melted_sugar", 200), Fluid.of("farmersrespite:green_tea", 100)
    ]).heated()
    //西瓜奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:watermelon_tea", 500), [
        "minecraft:melon_slice", Fluid.of("minecraft:milk", 200), Fluid.of("createcafe:melted_sugar", 200), Fluid.of("farmersrespite:rose_hip_tea", 100)
    ]).heated()
    //香蕉奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:banana_tea", 500), [
        "alexsmobs:banana", Fluid.of("minecraft:milk", 200), Fluid.of("createcafe:melted_sugar", 200), Fluid.of("farmersrespite:black_tea", 100)
    ]).heated()
    //樱桃奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:cherry_tea", 500), [
        "vinery:cherry", Fluid.of("minecraft:milk", 200), Fluid.of("createcafe:melted_sugar", 200), Fluid.of("farmersrespite:black_tea", 100)
    ]).heated()
    //奥利奥奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:oreo_tea", 500), [
        "createcafe:oreo_crushed", Fluid.of("minecraft:milk", 200), Fluid.of("createcafe:melted_sugar", 200), Fluid.of("farmersrespite:black_tea", 100)
    ]).heated()
    //紫颂花奶茶
    e.recipes.create.mixing(Fluid.of("create_central_kitchen:chorus_fruit_milk_tea", 500), [
        "minecraft:chorus_fruit", Fluid.of("minecraft:milk", 200), Fluid.of("createcafe:melted_sugar", 200), Fluid.of("farmersrespite:black_tea", 100)
    ]).heated()
})