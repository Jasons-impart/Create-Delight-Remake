ServerEvents.recipes(e => {

    remove_recipes_id(e, [
        "create_oppenheimered:mixing/sulfuric_acid",
        "create_oppenheimered:filling/acid_radrook",
        "create_oppenheimered:filling/fissile_acid_to_waste",
        "alexscaves:uranium_rod",
        "alexscaves:nuclear_bomb",
        "create_oppenheimered:compacting/chocolate_to_chocolate_block",
        "create_oppenheimered:compacting/compacted_dough",
        "create_oppenheimered:cutting/peppermint_powder_saw",
        "create_oppenheimered:compacting/galena",
        "create_oppenheimered:mixing/scarlet_neodymium",
        "create_oppenheimered:mixing/azure_neodymium",
        "alexscaves:azure_neodymium_ingot",
        "alexscaves:scarlet_neodymium_ingot",
        "create_oppenheimered:compacting/layer_cake",
        "create_oppenheimered:mixing/chocolate_heating",
        "cavedelight:trilocaris_roll"
    ])
    remove_recipes_output(e, [
        "alexscaves:cave_map"
    ])
    // e.replaceInput({not: {type: "minecraft:smithing_trim"}}, "#forge:raw_materials/uranium", "#forge:ingots/uranium")
    e.replaceInput({ id: "create_oppenheimered:mixing/ice_cream_licoroot" }, "alexscaves:licoroot", "neapolitan:dried_vanilla_pod_block")


    //粉碎珍珠出海洋玻璃碎片
    e.recipes.create.crushing([
        "3x alexscaves:sea_glass_shards",
        Item.of("alexscaves:sea_glass_shards", 3).withChance(0.5)], "alexscaves:pearl")
        .id("alexscaves:crushing/pearl")
    centrifugation(e,[
        "minecraft:mud",
        "alexscaves:sea_glass_shards"
    ],
        "alexscaves:muck"
    ).id("alexscaves:centrifugation/muck")
})
