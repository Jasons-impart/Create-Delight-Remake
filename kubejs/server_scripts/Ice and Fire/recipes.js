ServerEvents.recipes(e => {
    const { create, iceandfire, minecraft, kubejs, vintageimprovements, createmetallurgy } = e.recipes
    remove_recipes_id(e, [
        "iceandfire:copper_nuggets_to_ingot",
        "iceandfire:copper_ingot_to_nuggets"
    ])
    remove_recipes_output(e, [
        "dreadsteel:dreadsteel_helmet",
        "dreadsteel:dreadsteel_chestplate",
        "dreadsteel:dreadsteel_leggings",
        "dreadsteel:dreadsteel_boots",
        "iceandfire:dragonsteel_fire_helmet",
        "iceandfire:dragonsteel_fire_leggings",
        "iceandfire:dragonsteel_fire_chestplate",
        "iceandfire:dragonsteel_fire_boots",
        "iceandfire:dragonsteel_ice_helmet",
        "iceandfire:dragonsteel_ice_chestplate",
        "iceandfire:dragonsteel_ice_leggings",
        "iceandfire:dragonsteel_ice_boots",
        "iceandfire:dragonsteel_lightning_helmet",
        "iceandfire:dragonsteel_lightning_chestplate",
        "iceandfire:dragonsteel_lightning_leggings",
        "iceandfire:dragonsteel_lightning_boots",
        "iceandfire:copper_pile"
    ])
    create.filling("ends_delight:raw_dragon_meat", ["#createdelight:dragon_flesh", Fluid.of("create_central_kitchen:dragon_breath", 250)])
    e.replaceInput({ id: "iceandfire:dragon_meal" }, "#iceandfire:dragon_food_meat", "#forge:meat/raw")
    create.haunting(Item.of("iceandfire:rotten_egg").withChance(0.25), "minecraft:egg").id("iceandfire:haunting/rotten_egg")
    iceandfire.dragonforge(
        "minecraft:dragon_breath",
        "ends_delight:dried_chorus_flower", "minecraft:glass_bottle", "fire", 400)
        .id("iceandfire:dragonforge/dragon_breath_fire")
    iceandfire.dragonforge(
        "minecraft:dragon_breath",
        "ends_delight:dried_chorus_flower", "minecraft:glass_bottle", "ice", 400)
        .id("iceandfire:dragonforge/dragon_breath_ice")
    iceandfire.dragonforge(
        "minecraft:dragon_breath",
        "ends_delight:dried_chorus_flower", "minecraft:glass_bottle", "lightning", 400)
        .id("iceandfire:dragonforge/dragon_breath_lightning")
    let armor = [
        "iceandfire:dragonsteel_fire_helmet",
        "iceandfire:dragonsteel_fire_leggings",
        "iceandfire:dragonsteel_fire_chestplate",
        "iceandfire:dragonsteel_fire_boots",
        "iceandfire:dragonsteel_ice_helmet",
        "iceandfire:dragonsteel_ice_chestplate",
        "iceandfire:dragonsteel_ice_leggings",
        "iceandfire:dragonsteel_ice_boots",
        "iceandfire:dragonsteel_lightning_helmet",
        "iceandfire:dragonsteel_lightning_chestplate",
        "iceandfire:dragonsteel_lightning_leggings",
        "iceandfire:dragonsteel_lightning_boots"
    ]
    let ifl = ["ice", "fire", "lightning"]
    armor.forEach(item => {
        let res
        if (item.endsWith("helmet"))
            res = "dreadsteel:dreadsteel_helmet"
        else if (item.endsWith("chestplate"))
            res = "dreadsteel:dreadsteel_chestplate"
        else if (item.endsWith("leggings"))
            res = "dreadsteel:dreadsteel_leggings"
        else
            res = "dreadsteel:dreadsteel_boots"
        minecraft.smithing_transform(res, "createdelight:dread_upgrade_smithing_template", item, "dreadsteel:dreadsteel_ingot")
            .id(`dreadsteel:smithing_transform/${res.split(':')[1]}_from_${item.split(':')[1]}`)
    })
    ifl.forEach(text => {
        let ingot = `iceandfire:dragonsteel_${text}_ingot`
        kubejs.shaped(`iceandfire:dragonsteel_${text}_helmet`, [
            "ACA",
            "B B"
        ], {
            A: ingot,
            B: `#iceandfire:scales/dragon/${text}`,
            C: "art_of_forging:nano_insectoid"
        }).id(`iceandfire:dragonsteel_${text}_helmet`)
        kubejs.shaped(`iceandfire:dragonsteel_${text}_chestplate`, [
            "B B",
            "ACA",
            "AAA"
        ], {
            A: ingot,
            B: `#iceandfire:scales/dragon/${text}`,
            C: "art_of_forging:nano_insectoid"
        }).id(`iceandfire:dragonsteel_${text}_chestplate`)
        kubejs.shaped(`iceandfire:dragonsteel_${text}_leggings`, [
            "ACA",
            "A A",
            "B B"
        ], {
            A: ingot,
            B: `#iceandfire:scales/dragon/${text}`,
            C: "art_of_forging:nano_insectoid"
        }).id(`iceandfire:dragonsteel_${text}_leggings`)
        kubejs.shaped(`iceandfire:dragonsteel_${text}_boots`, [
            "   ",
            "A A",
            "BCB"
        ], {
            A: ingot,
            B: `#iceandfire:scales/dragon/${text}`,
            C: "art_of_forging:nano_insectoid"
        }).id(`iceandfire:dragonsteel_${text}_boots`)
    })
    kubejs.shaped("2x createdelight:dread_upgrade_smithing_template", [
        "ABA",
        "ACA",
        "AAA"
    ], {
        A: ['iceandfire:dragonsteel_fire_ingot', 'iceandfire:dragonsteel_ice_ingot', 'iceandfire:dragonsteel_lightning_ingot'],
        B: "createdelight:dread_heart",
        C: "createdelight:dread_upgrade_smithing_template"
    }).id("createdelight:dread_upgrade_smithing_template")
    vintageimprovements.vacuumizing(["butchercraft:chicken_skull_head_item", "iceandfire:cockatrice_eye"],
        ["iceandfire:cockatrice_skull", "butchercraft:eyeball"])
    {
        let iner = "supplementaries:key"
        create.sequenced_assembly("iceandfire:dread_key", iner, [
            create.filling(iner, [iner, Fluid.of("createdelightcore:molten_ice_steel", 90)]),
            create.deploying(iner, [iner, "iceandfire:dread_shard"]),
            vintageimprovements.hammering(iner, iner)
        ])
        .loops(1)
        .transitionalItem(iner)
        .id("iceandfire:sequenced_assembly/dread_key")
    }
    kubejs.shapeless(
        'iceandfire:copper_pile',
        [
            "2x create:copper_nugget"
        ]
    ).id("iceandfire:shapeless/copper_pile_manual_only")
})