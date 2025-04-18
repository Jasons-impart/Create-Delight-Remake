StartupEvents.registry("fluid", e => {
    /**
     * 
     * @param {string} id 
     * @param {dev.latvian.mods.rhino.mod.util.color.Color_} color 
     * @param {boolean} [isThin] 默认为true
     * @param {boolean} [hasBlock] 默认为true
     * @param {boolean} [hasBucket] 默认为true
     * @returns 
     */
    let simpleFluid = function (id, color, isThin, hasBlock, hasBucket) {
        hasBlock = (hasBlock != null) || true
        hasBucket = (hasBucket != null) || true
        isThin = (isThin != null) || true
        let ret = e.create(id)
        if (isThin)
            ret.thinTexture(color)
        else
            ret.thickTexture(color)
        if (!hasBlock)
            ret.noBlock()
        else
            ret.translationKey("block.createdelight." + id.split(":")[1])
        if (!hasBucket)
            ret.noBucket()
        else {
            ret.bucketColor(color)
            ret.translationKey("item.createdelight." + id.split(":")[1] + "_bucket")
        }
        ret.translationKey("fluid.createdelight." + id.split(":")[1])
        return ret
    }
    simpleFluid("createdelight:fuel_mixtures", 0X8470FF)
    simpleFluid("createdelight:malice_solution", 0X8470FF, false)
    simpleFluid("createdelight:sky_solution", 0X494949, false)
    simpleFluid("createdelight:spent_liquor", 0X99ffcd)
    simpleFluid("createdelight:paper_pulp", 0xF0FFFF)
    simpleFluid("createdelight:unfermented_paper_pulp", 0xF0FFFF, false)
    simpleFluid("createdelight:nut_milk", 0xf5e7c2, true, false)
    .tag("forge:milk")
    simpleFluid("createdelight:tree_star_tea", 0x6ca30e, true, false, false)
    simpleFluid("createdelight:jellyfish_soda", 0x85d5f0, true, false, false)
    simpleFluid("createdelight:vinegar", 0x570000, true, false)
    simpleFluid("createdelight:radon", 0XA0FFDA, true, false)
    simpleFluid("createdelight:unrefined_sugar", 0XBCB998)
    simpleFluid("createdelight:yeast", 0x9B897E, false)
    simpleFluid("createdelight:limeade", 0X35B71A, true, false, false)
    simpleFluid("createdelight:berry_limeade", 0XC62700, true, false, false)
    simpleFluid("createdelight:pink_limeade", 0XFCA997, true, false, false)
    simpleFluid("createdelight:mint_limeade", 0X17CC19, true, false, false)
    simpleFluid("createdelight:ancient_coffee", 0X58321E, true, false, false)
    simpleFluid("createdelight:torchflower_tea", 0XF3B727, true, false, false)
    simpleFluid("createdelight:cherry_petal_tea", 0XF28bC8, true, false, false)
    simpleFluid("createdelight:pitcher_plant_tea", 0X8Af2C9, true, false, false)
    simpleFluid("createdelight:fiddlehead_tea", 0x44451B, true, false, false)

    //冰淇淋流体
    let icecream_list = [
        ["vanilla", 0xfceeca],
        ["chocolate", 0xefa385],
        ["strawberry", 0xf4bcea],
        ["banana", 0xfce285],
        ["mint", 0x8bf1ac],
        ["adzuki", 0xfcc4b3],
        ["lime", 0xd4f4aa],
        ["pomegranate", 0xf9a8af]
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
    })
    
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

})
