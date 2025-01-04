ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "netherexp:wither_bone_block",
        "netherexp:glowcheese",
        "netherexp:nether_pizza",
        "netherexp:roasted_bone"
    ])
    const {create, kubejs, vintageimprovements, farmersdelight} = e.recipes
    e.replaceInput({}, "farmersdelight:ham", "#forge:ham")
    e.replaceInput({}, "farmersdelight:smoked_ham", "#forge:cooked_ham")

    cutting(e, "netherexp:hogham", [['mynethersdelight:hoglin_loin', 2], ['minecraft:bone', 1]])
    cutting(e, "netherexp:cooked_hogham", [['mynethersdelight:cooked_loin', 2], ['minecraft:bone', 1]])
    create.crushing(["3x netherexp:banshee_powder", Item.of("netherexp:banshee_powder", 3).withChance(0.5)], "netherexp:banshee_rod")
    .id("netherexp:crushing/banshee_rod")
    kubejs.shapeless("netherexp:wither_bone_block", "9x iceandfire:wither_shard")
    .id("netherexp:wither_bone_block")
    kubejs.shapeless("9x iceandfire:wither_shard", "netherexp:wither_bone_block")
    .id("netherexp:compat/wither_shard")
    create.mixing(Fluid.of("create_bic_bit:curdled_milk", 1000), ["2x #netherexp:glowspores", Fluid.of("minecraft:milk", 1000)])
    .id("netherexp:compat/curdled_milk")

    combination(e, [
        "create:dough",
        "ad_astra:cheese",
        "mynethersdelight:hoglin_loin",
        "netherexp:warped_wart",
        "minecraft:nether_wart"
    ], "netherexp:nether_pizza", 1)

    cutting_3(e, "netherexp:nether_pizza", [["netherexp:nether_pizza_slice", 4]])

    farmersdelight.cooking(["netherexp:cerebrage", "warped_fungus", "#netherexp:cooked_hogham"], "netherexp:roasted_bone", 5.0, 200, "minecraft:bone")
    .id("netherexp:cooking/roasted_bone")

    create.compacting(Fluid.of("netherexp:ectoplasm", 200), "netherexp:wraithing_flesh")
    .id("netherexp:compating/wraithing_flesh")
    vintageimprovements.centrifugation(["minecraft:rotten_flesh", Fluid.of("netherexp:ectoplasm", 100)], "netherexp:wraithing_flesh")
    .id("netherexp:centrifugation/wraithing_flesh")
    vintageimprovements.centrifugation(["minecraft:pumpkin", Fluid.of("netherexp:ectoplasm", 500)], "netherexp:sorrowsquash")
    .id("netherexp:centrifugation/sorrowsquash")
})