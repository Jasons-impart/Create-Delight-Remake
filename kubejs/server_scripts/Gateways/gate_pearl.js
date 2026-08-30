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
        create.deploying(incomplete, [incomplete, "alexscaves:immortal_embryo"]).keepHeldItem(),
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
    ////添加配方：不再有梦合成
    create.sequenced_assembly([
        Item.of(Item.of('gateways:gate_pearl', '{gateway:"createdelight:dream_no_more"}'))
    ], "minecraft:ender_pearl", [
        create.deploying(incomplete, [incomplete, "alexscaves:sweet_tooth"]),
        create.pressing(incomplete,incomplete),
        create.deploying(incomplete, [incomplete, "alexscaves:enigmatic_engine"]),
        vintageimprovements.vibrating(incomplete, incomplete),
        create.deploying(incomplete, [incomplete, "alexsmobs:void_worm_eye"]),
        create.deploying(incomplete, [incomplete, "dungeonsdelight:monster_cake"]).keepHeldItem()
    ]).transitionalItem(incomplete).loops(6)
    .id("createdelight:sequenced_assembly/dream_no_more")
    ////添加配方：炽锋之誓合成
    create.sequenced_assembly([
        Item.of('gateways:gate_pearl', '{gateway:"createdelight:oath_of_fierce_blade_ouel"}')
    ], "minecraft:fire_charge", [
        create.deploying(incomplete, [incomplete, "iceandfire:dragonsteel_fire_ingot"]),
        create.deploying(incomplete, [incomplete, "minecraft:netherite_block"]),
        vintageimprovements.vibrating(incomplete, incomplete),
        create.deploying(incomplete, [incomplete, "more_mod_tetra:ignitium_core"]),
        create.deploying(incomplete, [incomplete, "blackknightarmor:dragon_fire_ingot"]),
        create.deploying(incomplete, [incomplete, "cataclysm:monstrous_horn"]).keepHeldItem()
    ]).transitionalItem(incomplete).loops(6)
    .id("createdelight:sequenced_assembly/oath_of_fierce_blade_ouel")
    ////添加配方：沧海桑田合成
    create.sequenced_assembly([
        Item.of('gateways:gate_pearl', '{gateway:"createdelight:shattered_past"}')
    ], "alexsmobs:void_worm_eye", [
        create.deploying(incomplete, [incomplete, "cataclysm:witherite_ingot"]),
        create.deploying(incomplete, [incomplete, "cataclysm:ancient_metal_ingot"]),
        vintageimprovements.vibrating(incomplete, incomplete),
        create.deploying(incomplete, [incomplete, "minecraft:nether_star"]),
        create.deploying(incomplete, [incomplete, "minecraft:dragon_breath"]),
        create.deploying(incomplete, [incomplete, "cataclysm:sandstorm_in_a_bottle"]).keepHeldItem()
    ]).transitionalItem(incomplete).loops(8)
    .id("createdelight:sequenced_assembly/shattered_past")
    ////添加配方：风溟雷殛合成
    create.sequenced_assembly([
        Item.of('gateways:gate_pearl', '{gateway:"createdelight:wind_mist_and_thunder_strike"}')
    ], "alexscaves:pearl", [
        create.deploying(incomplete, [incomplete, "more_mod_tetra:abyssal_ingot"]),
        create.deploying(incomplete, [incomplete, "cataclysm:cursium_ingot"]),
        create.deploying(incomplete, [incomplete, "more_mod_tetra:storm_ingot"]),
        vintageimprovements.vibrating(incomplete, incomplete),
        create.deploying(incomplete, [incomplete, "cataclysm:blessed_amethyst_crab_meat"]),
        create.deploying(incomplete, [incomplete, "minecraft:conduit"]).keepHeldItem()
    ]).transitionalItem(incomplete).loops(8)
    .id("createdelight:sequenced_assembly/wind_mist_and_thunder_strike")
})