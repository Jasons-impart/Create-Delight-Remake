ServerEvents.recipes(e => {
    // 增加配方：龙齿合成龙息
    e.shapeless("4x minecraft:dragon_breath", [
        "ends_delight:dragon_tooth",
        "4x minecraft:glass_bottle"
    ])
    e.recipes.farmersdelight.cooking(
        [
            "#forge:shulker_meat",
            "ends_delight:dried_endermite_meat",
            "ends_delight:chorus_sauce",
            "#forge:mushrooms",
            "createdelight:vermicelli"
        ], "ends_delight:ender_noodle", 1.0, 200
    ).id("ends_delight:food/ender_noodle")

    //增加配方：冰龙试炼珍珠合成
    e.shaped(Item.of('gateways:gate_pearl', '{gateway:"createdelight:ice_dragon"}'),[  //输出   
        "ABA",
        "CDC",
        "ABA"
    ],{
        A:"iceandfire:ice_dragon_blood",  //龙血
        B:"#iceandfire:dragon_skulls",  //iaf龙头
        C:"#iceandfire:scales/dragon/ice",  //冰龙鳞 
        D:"minecraft:nether_star"  //下界之星
    })

    //增加配方：火龙试炼珍珠合成
    e.shaped(Item.of('gateways:gate_pearl', '{gateway:"createdelight:fire_dragon_eyes"}'),[  //输出   
        "ABA",
        "CDC",
        "ABA"
    ],{
        A:"iceandfire:fire_dragon_blood",  //龙血
        B:"#iceandfire:dragon_skulls",  //iaf龙头
        C:"#iceandfire:scales/dragon/fire",  //火龙鳞 
        D:"minecraft:nether_star"  //下界之星
    })

    //增加配方：雷龙试炼珍珠合成
    e.shaped(Item.of('gateways:gate_pearl', '{gateway:"createdelight:lightning_dragon"}'),[  //输出   
        "ABA",
        "CDC",
        "ABA"
    ],{
        A:"iceandfire:lightning_dragon_blood",  //龙血
        B:"#iceandfire:dragon_skulls",  //iaf龙头
        C:"#iceandfire:scales/dragon/lightning",  //电龙鳞 
        D:"minecraft:nether_star"  //下界之星
    })
})
