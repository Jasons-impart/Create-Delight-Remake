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
        Item.of(Item.of('gateways:gate_pearl', '{gateway:"createdelight:the_gate_of_eternal_cold"}'))
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
        Item.of(Item.of('gateways:gate_pearl', '{gateway:"createdelight:piercing_withering_trial"}'))
    ], "minecraft:ender_pearl", [
        create.deploying(incomplete, [incomplete, "minecraft:wither_skeleton_skull"]),
        create.cutting(incomplete, incomplete),
        vintageimprovements.vibrating(incomplete, incomplete),
        create.deploying(incomplete, [incomplete, "minecraft:nether_star"]),
        create.deploying(incomplete, [incomplete, "iceandfire:witherbone"]),
        create.deploying(incomplete, [incomplete, "art_of_forging:sigil_of_eden"]).keepHeldItem(),
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
        Item.of(Item.of('gateways:gate_pearl', '{gateway:"createdelight:sweettide_brokenpoint"}'))
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
        Item.of(Item.of('gateways:gate_pearl', '{gateway:"createdelight:infinite_and_dark_trials"}'))
    ], "minecraft:ender_pearl", [
        create.deploying(incomplete, [incomplete, "alexscaves:pure_darkness"]),
        create.cutting(incomplete, incomplete),
        vintageimprovements.vibrating(incomplete, incomplete),
        create.deploying(incomplete, [incomplete, "createdelight:devil_eye"]),
        create.deploying(incomplete, [incomplete, "alexscaves:desolate_dagger"]).keepHeldItem(),
        create.deploying(incomplete, [incomplete, "alexscaves:dreadbow"]).keepHeldItem()
    ]).transitionalItem(incomplete).loops(2)
    .id("createdelight:sequenced_assembly/infinite_and_dark_trials")
    ////添加配方：磁暴领域合成
    create.sequenced_assembly([
        Item.of(Item.of('gateways:gate_pearl', '{gateway:"createdelight:magnetic_storm_field"}'))
    ], "minecraft:ender_pearl", [
        create.deploying(incomplete, [incomplete, "alexscaves:telecore"]),
        create.cutting(incomplete, incomplete),
        create.pressing(incomplete,incomplete),
        create.deploying(incomplete, [incomplete, "alexscaves:scarlet_neodymium_ingot"]),
        create.deploying(incomplete, [incomplete, "alexscaves:azure_neodymium_ingot"]),
        create.deploying(incomplete, [incomplete, "alexscaves:heart_of_iron"])
    ]).transitionalItem(incomplete).loops(4)
    .id("createdelight:sequenced_assembly/magnetic_storm_field")
    ////添加配方：熔蚀之地合成
    create.sequenced_assembly([
        Item.of(Item.of('gateways:gate_pearl', '{gateway:"createdelight:a_place_of_melting"}'))
    ], "minecraft:ender_pearl", [
        create.deploying(incomplete, [incomplete, "alexscaves:uranium"]),
        create.cutting(incomplete, incomplete),
        create.pressing(incomplete,incomplete),
        create.deploying(incomplete, [incomplete, "alexscaves:fissile_core"]),
        create.deploying(incomplete, [incomplete, "alexscaves:nuclear_bomb"]).keepHeldItem(),
        create.deploying(incomplete, [incomplete, "alexscaves:tremorzilla_egg"]).keepHeldItem()
    ]).transitionalItem(incomplete).loops(4)
    .id("createdelight:sequenced_assembly/a_place_of_melting")
    ////添加配方：远古终焉合成
    create.sequenced_assembly([
        Item.of(Item.of('gateways:gate_pearl', '{gateway:"createdelight:the_ancient_end"}'))
    ], "minecraft:ender_pearl", [
        create.deploying(incomplete, [incomplete, "alexscaves:heavy_bone"]),
        create.pressing(incomplete,incomplete),
        create.cutting(incomplete, incomplete),
        create.deploying(incomplete, [incomplete, "alexscaves:amber_curiosity"]),
        create.deploying(incomplete, [incomplete, "alexscaves:tectonic_shard"]),
        create.deploying(incomplete, [incomplete, "alexscaves:extinction_spear"]).keepHeldItem()
    ]).transitionalItem(incomplete).loops(4)
    .id("createdelight:sequenced_assembly/the_ancient_end")
    ////添加配方：自噬之潮合成
    create.sequenced_assembly([
        Item.of(Item.of('gateways:gate_pearl', '{gateway:"createdelight:the_legacy_of_the_abyss"}'))
    ], "minecraft:ender_pearl", [
        create.deploying(incomplete, [incomplete, "alexscaves:gazing_pearl"]),
        create.pressing(incomplete,incomplete),
        create.deploying(incomplete, [incomplete, "alexscaves:enigmatic_engine"]),
        vintageimprovements.vibrating(incomplete, incomplete),
        create.deploying(incomplete, [incomplete, "alexscaves:immortal_embryo"]),
        create.deploying(incomplete, [incomplete, "alexscaves:magic_conch"]).keepHeldItem()
    ]).transitionalItem(incomplete).loops(4)
    .id("createdelight:sequenced_assembly/the_legacy_of_the_abyss")
})
