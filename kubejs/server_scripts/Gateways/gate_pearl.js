ServerEvents.recipes(e => {
    //增加配方：冰龙试炼珍珠合成
    e.shaped(Item.of('gateways:gate_pearl', '{gateway:"createdelight:ice_dragon"}'), [
        "ABA",
        "CDC",
        "ABA"
    ], {
        A: "iceandfire:ice_dragon_blood",
        B: 'iceandfire:dragon_skull_ice',
        C: "#iceandfire:scales/dragon/ice",
        D: "minecraft:nether_star"
    })
    //增加配方：火龙试炼珍珠合成
    e.shaped(Item.of('gateways:gate_pearl', '{gateway:"createdelight:fire_dragon_eyes"}'), [
        "ABA",
        "CDC",
        "ABA"
    ], {
        A: "iceandfire:fire_dragon_blood",
        B: 'iceandfire:dragon_skull_fire',
        C: "#iceandfire:scales/dragon/fire",
        D: "minecraft:nether_star"
    })
    //增加配方：雷龙试炼珍珠合成
    e.shaped(Item.of('gateways:gate_pearl', '{gateway:"createdelight:lightning_dragon"}'), [
        "ABA",
        "CDC",
        "ABA"
    ], {
        A: "iceandfire:lightning_dragon_blood",
        B: 'iceandfire:dragon_skull_lightning',
        C: "#iceandfire:scales/dragon/lightning",
        D: "minecraft:nether_star"
    })
    //添加配方：永寒悚怖之门合成
    const { create, vintageimprovements } = e.recipes
    const incomplete = "gateways:gate_pearl"

    create.sequenced_assembly([
        Item.of(Item.of('gateways:gate_pearl', '{gateway:"createdelight:the_gate_of_eternal_cold"}')).withChance(2.9),
        Item.of("minecarft:ender_pearl").withChance(0.1),
    ], "minecraft:ender_pearl", [
        create.cutting(incomplete, incomplete),
        create.deploying(incomplete, [incomplete, "iceandfire:dragonsteel_ice_ingot"]),
        vintageimprovements.vibrating(incomplete, incomplete),
        create.filling(incomplete, [incomplete, Fluid.of("createdelight:ice_dragon_blood", 250)]),
        create.deploying(incomplete, [incomplete, "iceandfire:dread_shard"])
    ]).transitionalItem(incomplete).loops(4)
    //添加配方：枯萎穿刺试炼合成
    const incomplete_2 = "gateways:gate_pearl"

    create.sequenced_assembly([
        Item.of(Item.of('gateways:gate_pearl', '{gateway:"createdelight:piercing_withering_trial"}')).withChance(4.0),
        Item.of("minecarft:ender_pearl").withChance(0.01),
    ], "minecraft:ender_pearl", [
        create.cutting(incomplete, incomplete),
        create.deploying(incomplete, [incomplete, "minecraft:wither_skeleton_skull"]),
        vintageimprovements.vibrating(incomplete, incomplete),
        create.deploying(incomplete, [incomplete, "minecraft:nether_star"]),
        create.deploying(incomplete, [incomplete, "iceandfire:witherbone"]),
        create.deploying(incomplete, [incomplete, "createdelight:otherworld_note"])
    ]).transitionalItem(incomplete).loops(2)
})
