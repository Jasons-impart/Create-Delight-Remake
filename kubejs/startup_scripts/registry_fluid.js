StartupEvents.registry("fluid", e => {
    e.create("createdelight:fuel_mixtures")
        .thinTexture(0X8470FF)
        .bucketColor(0X8470FF)
        .translationKey("fluid.createdelight.fuel_mixtures")
        .translationKey("block.createdelight.fuel_mixtures")
        .translationKey("item.createdelight.fuel_mixtures_bucket")
    // 鲜奶油
    e.create("createdelight:whipped_cream")
        .stillTexture("createdelight:fluid/whipped_cream/still")
        .flowingTexture("createdelight:fluid/whipped_cream/flowing")
        .translationKey("fluid.createdelight.whipped_cream")
        .translationKey("block.createdelight.whipped_cream")
        .translationKey("item.createdelight.whipped_cream_bucket")
        .createAttributes()
        .tickDelay(10)

    // 龙血相关
    let bloods = [
        "fire_dragon",
        "ice_dragon",
        "lightning_dragon"
    ]
    bloods.forEach(blood => {
        e.create(`createdelight:${blood}_blood`)
            .stillTexture(`createdelight:fluid/${blood}_blood/still`)
            .flowingTexture(`createdelight:fluid/${blood}_blood/flowing`)
            .translationKey(`fluid.createdelight.${blood}_blood`)
            .translationKey(`block.createdelight.${blood}_blood`)
            .translationKey(`item.createdelight.${blood}_blood_bucket`)
            .tag("forge:bloods")
            .createAttributes()
            .tickDelay(10)
    });

    // 恶意溶液
    e.create("createdelight:malice_solution")
        .thickTexture(0x2CFFFF)
        .bucketColor(0x2CFFFF)
        .translationKey("fluid.createdelight.malice_solution")
        .translationKey("block.createdelight.malice_solution")
        .translationKey("item.createdelight.malice_solution_bucket")

    // 陨石溶液
    e.create("createdelight:sky_solution")
        .thickTexture(0X494949)
        .bucketColor(0X494949)
        .translationKey("fluid.createdelight.sky_solution")
        .translationKey("block.createdelight.sky_solution")
        .translationKey("item.createdelight.sky_solution_bucket")
    // 废液
    e.create("createdelight:spent_liquor")
        .thinTexture(0X99ffcd)
        .bucketColor(0X99ffcd)
        .translationKey("fluid.createdelight.spent_liquor")
        .translationKey("block.createdelight.spent_liquor")
        .translationKey("item.createdelight.spent_liquor_bucket")
    //纸浆
    e.create("createdelight:paper_pulp")
        .thickTexture(0xF0FFFF)
        .bucketColor(0xF0FFFF)
        .translationKey("fluid.createdelight.paper_pulp")
        .translationKey("block.createdelight.paper_pulp")
        .translationKey("item.createdelight.paper_pulp_bucket")
    //待发酵的纸浆
    e.create("createdelight:unfermented_paper_pulp")
        .thinTexture(0xF0FFFF)
        .bucketColor(0xF0FFFF)
        .translationKey("fluid.createdelight.unfermented_paper_pulp")
        .translationKey("block.createdelight.unfermented_paper_pulp")
        .translationKey("item.createdelight.unfermented_paper_pulp_bucket")
    //蛋黄以及蛋糕糊
    e.create("createdelight:cake_batter")
        .stillTexture("ratatouille:fluid/cake_batter_still")
        .flowingTexture("ratatouille:fluid/cake_batter_flow")
        .translationKey("fluid.createdelight.cake_batter")
        .translationKey("block.createdelight.cake_batter")
        .translationKey("item.createdelight.cake_batter_bucket")
    e.create("createdelight:egg_yolk")
        .stillTexture("ratatouille:fluid/egg_yolk_still")
        .flowingTexture("ratatouille:fluid/egg_yolk_flow")
        .translationKey("fluid.createdelight.egg_yolk")
        .translationKey("block.createdelight.egg_yolk")
        .translationKey("item.createdelight.egg_yolk_bucket")
    //花生奶
    e.create("createdelight:nut_milk")
        .thinTexture(0xf5e7c2)
        .noBlock()
        .translationKey("fluid.createdelight.nut_milk")
        .translationKey("item.createdelight.nut_milk_bucket")
        .tag("forge:milk")
    // 星树茶
    e.create("createdelight:tree_star_tea")
        .thinTexture(0x6ca30e)
        .noBlock()
        .noBucket()
        .translationKey("fluid.createdelight.tree_star_tea")
    // 水母汽水
    e.create("createdelight:jellyfish_soda")
        .thinTexture(0x85d5f0)
        .noBlock()
        .noBucket()
        .translationKey("fluid.createdelight.jellyfish_soda")
    //醋
    e.create("createdelight:vinegar")
        .thinTexture(0x570000)
        .noBlock()
        .translationKey("fluid.createdelight.vinegar")
        .translationKey("item.createdelight.vinegar_bucket")
    //氡气
    e.create("createdelight:radon")
        .thinTexture(0XA0FFDA)
        .noBlock()
        .translationKey("fluid.createdelight.radon")
        .translationKey("block.createdelight.radon")
        .translationKey("item.createdelight.radon_bucket")
    //未精炼的糖汁
    e.create("createdelight:unrefined_sugar")
        .thinTexture(0XBCB998)
        .translationKey("fluid.createdelight.unrefined_sugar")
        .translationKey("block.createdelight.unrefined_sugar")
        .translationKey("item.createdelight.unrefined_sugar_bucket")
    //酵母
    e.create("createdelight:yeast")
    .thickTexture(0x9B897E)
    .translationKey("fluid.createdelight.yeast")
    .translationKey("block.createdelight.yeast")
    .translationKey("item.createdelight.yeast_bucket")

    //冰淇淋流体
    let icecream_list = [
        ["vanilla", 0xfceeca],
        ["chocolate", 0xefa385],
        ["strawberry", 0xf4bcea],
        ["banana", 0xfce285],
        ["mint", 0x8bf1ac],
        ["adzuki", 0xfcc4b3],
        ["lime", 0x35b71a],
        ["pomegranate", 0xc62700]
    ]
    icecream_list.forEach((list) => {
        e.create(`createdelight:${list[0]}_milkshake`)
            .thinTexture(list[1])
            .bucketColor(list[1])
            .translationKey(`fluid.createdelight.${list[0]}_milkshake`)
            .translationKey(`block.createdelight.${list[0]}_milkshake`)
            .translationKey(`item.createdelight.${list[0]}_milkshake_bucket`)
    })
    let coffee_fluid = [
        ['espresso', 0x120A08], 
        ['americano', 0x120A08], 
        ['ristretto', 0x120A08], 
        ['latte', 0x120A08], 
        ['affogato', 0x120A08], 
        ['con_panna', 0x120A08], 
        ['cappuccino', 0x120A08], 
        ['macchiato', 0x120A08], 
        ['mocha', 0x120A08]]
        coffee_fluid.forEach(fluid => {
            e.create(`createdelight:${fluid[0]}_fluid`)
            .noBlock()
            .noBucket()
            .thinTexture(fluid[1])
            .translationKey(`fluid.createdelight.${fluid[0]}_fluid`)
            .translationKey(`block.createdelight.${fluid[0]}_fluid`)
        })
    
        e.create("createdelight:limeade")
        .thinTexture(0X35B71A)
        .noBlock()
        .noBucket()
        .translationKey("fluid.createdelight.limeade")
        
        e.create("createdelight:berry_limeade")
        .thinTexture(0XC62700)
        .noBlock()
        .noBucket()
        .translationKey("fluid.createdelight.berry_limeade")
        
        e.create("createdelight:pink_limeade")
        .thinTexture(0XFCA997)
        .noBlock()
        .noBucket()
        .translationKey("fluid.createdelight.pink_limeade")
        
        e.create("createdelight:mint_limeade")
        .thinTexture(0X17CC19)
        .noBlock()
        .noBucket()
        .translationKey("fluid.createdelight.mint_limeade")

})
