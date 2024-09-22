ServerEvents.tags("item", e => {
    e.add("forge:fruits/durian", [
        "fruitsdelight:durian_flesh"
    ])
})
ServerEvents.recipes(e => {
    //芒果奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:mango_tea", 500), [
        "fruitsdelight:mango", 
        "minecraft:sugar", 
        Fluid.of("minecraft:milk", 200), 
        Fluid.of("farmersrespite:dandelion_tea", 100)
    ]).heated().id("createcafe:mixing/mango_tea_mixing")
    //桃子奶茶
    e.recipes.create.mixing(Fluid.of("createcafe:peach_tea", 500), [
        "fruitsdelight:peach", 
        "minecraft:sugar", 
        Fluid.of("minecraft:milk", 200), 
        Fluid.of("farmersrespite:dandelion_tea", 100)
    ]).heated().id("createcafe:mixing/peach_tea_mixing")
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
    //紫颂果珍珠奶茶
    e.recipes.create.mixing(Fluid.of("create_central_kitchen:chorus_fruit_bubble_tea", 500), [
        '#forge:chorus_fruits', 
        "ends_delight:ender_pearl_grain",
        "minecraft:sugar", 
        Fluid.of("minecraft:milk", 200), 
        Fluid.of("farmersrespite:black_tea", 100)
    ]).heated().id("ends_delight:food/bubble_tea")
})