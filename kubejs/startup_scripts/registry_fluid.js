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
        let ret = e.create(id)
        isThin = isThin == null ? true : isThin
        hasBlock = hasBlock == null ? true : hasBlock
        hasBucket = hasBucket == null ? true : hasBucket

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
        /**
     * 
     * @param {string} id 
     * @param {boolean} [hasBlock] 默认为true
     * @param {boolean} [hasBucket] 默认为true
     * @param {ResourceLocation_} resourcelocation 默认存放在createdelight/asset/fluid/id下,且必须为still及flowing两个
     * @returns 
     */
    let textureFluid = function (id, hasBlock, hasBucket, resourcelocation) {
        let ret = e.create(id)
        hasBlock = hasBlock == null ? true : hasBlock
        hasBucket = hasBucket == null ? true : hasBucket
        resourcelocation = resourcelocation == null? `createdelight:fluid/${id.split(":")[1]}` : resourcelocation


        if (!hasBlock)
            ret.noBlock()
        else
            ret.translationKey("block.createdelight." + id.split(":")[1])
            ret.flowingTexture(resourcelocation + "/flowing")
        if (!hasBucket)
            ret.noBucket()
        else {
            ret.translationKey("item.createdelight." + id.split(":")[1] + "_bucket")
        }
        ret.translationKey("fluid.createdelight." + id.split(":")[1])
        ret.stillTexture(resourcelocation + "/still")
        return ret
    }

    // 清单中带 color 的酒液都是纯流体，不生成方块或桶。
    global.CDAlcoholDrinks.forEach(drink => {
        if (drink.color !== undefined) simpleFluid(drink.fluid, drink.color, true, false, false)
    })

    simpleFluid("createdelight:fuel_mixtures", 0X8470FF)
    simpleFluid("createdelight:light_crude_oil", 0X8B7E66)
    simpleFluid("createdelight:ethylene_fluid", 0XE6E6FA)
    simpleFluid("createdelight:malice_solution", 0X33E6EF, false)
    simpleFluid("createdelight:sky_solution", 0X494949, false)
    simpleFluid("createdelight:spent_liquor", 0X99ffcd)
    simpleFluid("createdelight:paper_pulp", 0xF0FFFF)
    simpleFluid("createdelight:unfermented_paper_pulp", 0xF0FFFF, false)
    simpleFluid("createdelight:nut_milk", 0xf5e7c2, true, false)
        .tag("forge:milk")
    //simpleFluid("createdelight:dragon_breath_soda", 0xdb9bc3, true, false, false)
    simpleFluid("createdelight:vinegar", 0x570000, true, false)
    simpleFluid("createdelight:radon", 0XA0FFDA, true, false)
    simpleFluid("createdelight:yeast", 0x9B897E, false)
    simpleFluid("createdelight:ancient_coffee", 0X58321E, true, false, false)
    simpleFluid("createdelight:torchflower_tea", 0XF3B727, true, false, false)
    simpleFluid("createdelight:cherry_petal_tea", 0XF28bC8, true, false, false)
    simpleFluid("createdelight:pitcher_plant_tea", 0X8Af2C9, true, false, false)
    simpleFluid("createdelight:fiddlehead_tea", 0x44451B, true, false, false)
    simpleFluid("createdelight:scarlet_tea", 0x82332a, true, false, false)
    simpleFluid("createdelight:lemon_black_tea", 0x64352a, true, false, false)
    simpleFluid("createdelight:tea_mocha", 0x815026, true, false, false)
    simpleFluid("createdelight:saidi_tea", 0xb02f2f, true, false, false)
    simpleFluid("createdelight:cornflower_tea", 0xa97549, true, false, false)
    simpleFluid("createdelight:sakura_honey_tea", 0xe497a8, true, false, false)
    simpleFluid("createdelight:genmai_tea", 0xb8a32f, true, false, false)
    simpleFluid("createdelight:green_water", 0x79ad5c, true, false, false)
    simpleFluid("createdelight:white_tea", 0xdbcfaa, true, false, false)
    simpleFluid("createdelight:soya_milk", 0xfef9c1, true, true, true)
        .tag("forge:milk")
    simpleFluid("createdelight:spring_soda", 0x7fe3b3, true, false, false)
    simpleFluid("createdelight:summer_cordial", 0xf4b12e, true, false, false)
    simpleFluid("createdelight:autumn_tea", 0xf46d44, true, false, false)
    simpleFluid("createdelight:winter_glogg", 0xa9275e, true, false, false)
    simpleFluid("createdelight:chorus_sauce", 0xc357c2, false, false, false)
    simpleFluid("createdelight:cryo_fuel", 0x87CEFA)
    simpleFluid("createdelight:green_soylent", 0xa5c266)
    textureFluid("createdelight:radpop_fluid")
    textureFluid("createdelight:lubricating_oil")
    textureFluid("createdelight:ice_lubricating_oil")
    textureFluid("createdelight:cake_batter")
    textureFluid("createdelight:blaze_cake_batter")
    textureFluid("createdelight:frost_cake_batter")
    textureFluid("createdelight:experience_cake_batter")
    textureFluid("createdelight:red_velvet_cake_batter")
    textureFluid("createdelight:egg_yolk")
    textureFluid("createdelight:artificial_egg_yolk")
    textureFluid("createdelight:egg_tart_fluid")
    textureFluid("createdelight:filling", false, false)

    let bloods = [
        "fire_dragon",
        "ice_dragon",
        "lightning_dragon",
        "end_dragon",
    ]
    bloods.forEach(blood => {
        textureFluid(`createdelight:${blood}_blood`)
            .tag("forge:bloods")
            .createAttributes()
            .tickDelay(10)
    })

    //咖啡流体
    let coffee_fluid = [
        ['espresso', 0x8D5528],
        ['americano', 0x53443d],
        ['ristretto', 0x572E18],
        ['latte', 0xE2AD78],
        ['affogato', 0xF2D2BA],
        ['con_panna', 0x864F26],
        ['cappuccino', 0xBA894B],
        ['macchiato', 0x9B5F32],
        ['mocha', 0x975b21]]
    coffee_fluid.forEach(fluid => {
        e.create(`createdelight:${fluid[0]}_fluid`)
            .noBlock()
            .noBucket()
            .thinTexture(fluid[1])
            .translationKey(`fluid.createdelight.${fluid[0]}_fluid`)
    })
    
})
