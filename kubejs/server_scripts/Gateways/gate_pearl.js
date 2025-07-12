ServerEvents.recipes(e => {
    //增加配方：冰龙试炼珍珠合成
    e.shaped(Item.of('gateways:gate_pearl', '{gateway:"createdelight:ice_dragon"}'), [
        "ABA",
        "CDC",
        "ABA"
    ], {
        A: "iceandfire:ice_dragon_blood",
        B: "iceandfire:dragon_skull_ice",
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
        B: "iceandfire:dragon_skull_fire",
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
        B: "iceandfire:dragon_skull_lightning",
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
        create.deploying(incomplete, [incomplete, "iceandfire:dragonsteel_ice_ingot"]),
        create.cutting(incomplete, incomplete),
        vintageimprovements.vibrating(incomplete, incomplete),
        create.filling(incomplete, [incomplete, Fluid.of("createdelight:ice_dragon_blood", 250)]),
        create.deploying(incomplete, [incomplete, "createdelight:dread_heart"])
    ]).transitionalItem(incomplete).loops(4)
    .id("createdelight:sequenced_assembly/the_gate_of_eternal_cold")
    //添加配方：枯萎穿刺试炼合成
    create.sequenced_assembly([
        Item.of(Item.of('gateways:gate_pearl', '{gateway:"createdelight:piercing_withering_trial"}')).withChance(2.0),
        Item.of("minecarft:ender_pearl").withChance(0.01),
    ], "minecraft:ender_pearl", [
        create.deploying(incomplete, [incomplete, "minecraft:wither_skeleton_skull"]),
        create.cutting(incomplete, incomplete),
        vintageimprovements.vibrating(incomplete, incomplete),
        create.deploying(incomplete, [incomplete, "minecraft:nether_star"]),
        create.deploying(incomplete, [incomplete, "iceandfire:witherbone"]),
        create.deploying(incomplete, [incomplete, "art_of_forging:sigil_of_eden"]),
        create.deploying(incomplete, [incomplete, "createdelight:otherworld_note"])
    ]).transitionalItem(incomplete).loops(4)
    .id("createdelight:sequenced_assembly/piercing_withering_trial")
    //添加恶魂试炼
    e.shaped(Item.of('gateways:gate_pearl', '{gateway:"createdelight:ghast_trial"}'), [
        "AAA",
        "ABA",
        "AAA"
    ], {
        A: "minecraft:ghast_tear",
        B: "minecraft:ender_pearl"
    })
    //添加配方：糖分临界点合成
    create.sequenced_assembly([
        Item.of(Item.of('gateways:gate_pearl', '{gateway:"createdelight:sweettide_brokenpoint"}')).withChance(5.0),
        Item.of("minecarft:ender_pearl").withChance(0.01),
    ], "minecraft:ender_pearl", [
        create.deploying(incomplete, [incomplete, "alexscaves:radiant_essence"]),
        create.cutting(incomplete, incomplete),
        vintageimprovements.vibrating(incomplete, incomplete),
        create.filling(incomplete, [incomplete, Fluid.of("alexscaves:purple_soda", 250)]),
        create.deploying(incomplete, [incomplete, "alexscaves:conversion_crucible"]),
        create.deploying(incomplete, [incomplete, "alexscaves:biome_treat"])
    ]).transitionalItem(incomplete).loops(4)
    .id("createdelight:sequenced_assembly/sweettide_brokenpoint")
    ////添加配方：黯渊之视合成
    create.sequenced_assembly([
        Item.of(Item.of('gateways:gate_pearl', '{gateway:"createdelight:infinite_and_dark_trials"}')).withChance(7.0),
        Item.of("minecarft:ender_pearl").withChance(0.01),
    ], "minecraft:ender_pearl", [
        create.deploying(incomplete, [incomplete, "alexscaves:pure_darkness"]),
        create.cutting(incomplete, incomplete),
        vintageimprovements.vibrating(incomplete, incomplete),
        create.deploying(incomplete, [incomplete, "createdelight:devil_eye"]),
        create.deploying(incomplete, [incomplete, "alexscaves:desolate_dagger"]),
        create.deploying(incomplete, [incomplete, "alexscaves:dreadbow"])
    ]).transitionalItem(incomplete).loops(2)
    .id("createdelight:sequenced_assembly/infinite_and_dark_trials")
})
