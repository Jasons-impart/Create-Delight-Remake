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
        if (!hasBucket)
            ret.noBucket()
        else {
            ret.translationKey("item.createdelight." + id.split(":")[1] + "_bucket")
        }
        ret.translationKey("fluid.createdelight." + id.split(":")[1])
        ret.stillTexture(resourcelocation + "/still")
        ret.flowingTexture(resourcelocation + "/flowing")
        return ret
    }

    simpleFluid("createdelight:fuel_mixtures", 0X8470FF)
    simpleFluid("createdelight:light_crude_oil", 0X8B7E66)
    simpleFluid("createdelight:ethylene_gas", 0XF0FFFF, true, false, false)
    simpleFluid("createdelight:ethylene_fluid", 0XE6E6FA)
    simpleFluid("createdelight:malice_solution", 0X33E6EF, false)
    simpleFluid("createdelight:sky_solution", 0X494949, false)
    simpleFluid("createdelight:spent_liquor", 0X99ffcd)
    simpleFluid("createdelight:paper_pulp", 0xF0FFFF)
    simpleFluid("createdelight:unfermented_paper_pulp", 0xF0FFFF, false)
    simpleFluid("createdelight:nut_milk", 0xf5e7c2, true, false)
        .tag("forge:milk")
    simpleFluid("createdelight:tree_star_tea", 0x6ca30e, true, false, false)
    simpleFluid("createdelight:jellyfish_soda", 0x85d5f0, true, false, false)
    simpleFluid("createdelight:dragon_breath_soda", 0xdb9bc3, true, false, false)
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
    textureFluid("createdelight:lubricating_oil")
    textureFluid("createdelight:cake_batter")
    textureFluid("createdelight:egg_yolk")
    textureFluid("createdelight:artificial_egg_yolk")
    textureFluid("createdelight:whipped_cream")
        .createAttributes()
        .tickDelay(10)
    let bloods = [
        "fire_dragon",
        "ice_dragon",
        "lightning_dragon"
    ]
    bloods.forEach(blood => {
        textureFluid(`createdelight:${blood}_blood`)
            .tag("forge:bloods")
            .createAttributes()
            .tickDelay(10)
    })


    let vinery_fluid_list = [
        ["apple_juice", 0xeed4a7],
        ["mead", 0xeac88a],
        ["apple_cider", 0x9c6140],
        ["apple_wine", 0xd6d375],
        ["mellohi_wine", 0xc3e1b7],
        ["glowing_wine", 0xfcd263],
        ["solaris_wine", 0xb68346],
        ["noir_wine", 0x443672],
        ["red_wine", 0xdf7f8b],
        ["strad_wine", 0x173443],
        ["cherry_wine", 0x7d100f],
        ["cristel_wine", 0xeb7c7c],
        ["creepers_crush", 0xc5e755, false],
        ["kelp_cider", 0x4af6a8],
        ["lilitu_wine", 0x5c151a],
        ["jo_special_mixture", 0xbe0e22],
        ["eiswein", 0x82d7fc],
        ["aegis_wine", 0xb96f47],
        ["bolvar_wine", 0xe35e5e],
        ["chorus_wine", 0xaf1fbf],
        ["villagers_fright", 0x8f96ae],
        ["clark_wine", 0x696969],
        ["magnetic_wine", 0xfc8f72],
        ["stal_wine", 0xb71818],
        ["chenet_wine", 0x551625],
        ["bottle_mojang_noir", 0x7d6d7d],
        ["jellie_wine", 0xb24571],
        ["blazewine_pinot", 0xe5272c],
        ["netherite_nectar", 0x650627],
        ["ghastly_grenache", 0x16605a],
        ["lava_fizz", 0xc42200],
        ["nether_fizz", 0x915a8f]
    ].forEach(list => {
        simpleFluid(`createdelight:${list[0]}`, list[1], list[2], false, false)
    })

    //奶昔流体
    let icecream_list = [
        ["vanilla", 0xfceeca],
        ["chocolate", 0xefa385],
        ["strawberry", 0xf4bcea],
        ["banana", 0xfce285],
        ["mint", 0x8bf1ac],
        ["adzuki", 0xfcc4b3],
        ["lime", 0xd4f4aa],
        ["pomegranate", 0xf9a8af],
        ["sweetberry", 0xe97285]
    ]
    icecream_list.forEach((list) => {
        e.create(`createdelight:${list[0]}_milkshake`)
            .thinTexture(list[1])
            .bucketColor(list[1])
            .translationKey(`fluid.createdelight.${list[0]}_milkshake`)
            .translationKey(`block.createdelight.${list[0]}_milkshake`)
            .translationKey(`item.createdelight.${list[0]}_milkshake_bucket`)
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
            .translationKey(`block.createdelight.${fluid[0]}_fluid`)
    })
    
})
