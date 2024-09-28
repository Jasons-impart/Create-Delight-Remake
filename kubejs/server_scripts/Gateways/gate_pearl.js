ServerEvents.recipes(e => {
    //增加配方：冰龙试炼珍珠合成
    e.shaped(Item.of('gateways:gate_pearl', '{gateway:"createdelight:ice_dragon"}'),[
        "ABA",
        "CDC",
        "ABA"
    ],{
        A:"iceandfire:ice_dragon_blood",  
        B:'iceandfire:dragon_skull_ice',
        C:"#iceandfire:scales/dragon/ice",  
        D:"minecraft:nether_star"  
    })
    //增加配方：火龙试炼珍珠合成
    e.shaped(Item.of('gateways:gate_pearl', '{gateway:"createdelight:fire_dragon_eyes"}'),[
        "ABA",
        "CDC",
        "ABA"
    ],{
        A:"iceandfire:fire_dragon_blood",
        B:'iceandfire:dragon_skull_fire',
        C:"#iceandfire:scales/dragon/fire",
        D:"minecraft:nether_star"
    })
    //增加配方：雷龙试炼珍珠合成
    e.shaped(Item.of('gateways:gate_pearl', '{gateway:"createdelight:lightning_dragon"}'),[
        "ABA",
        "CDC",
        "ABA"
    ],{
        A:"iceandfire:lightning_dragon_blood",
        B:'iceandfire:dragon_skull_lightning',
        C:"#iceandfire:scales/dragon/lightning",
        D:"minecraft:nether_star"
    })
})