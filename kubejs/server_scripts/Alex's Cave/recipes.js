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
        "alexcaves_delight:cooking/tree_tea_recipe",
        "alexcaves_delight:cooking/jellyfishsoda_recipe"
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



    // 食物兼容
    e.recipes.create.emptying(
        [
            "minecraft:glass_bottle",
            Fluid.of("createdelight:tree_star_tea", 250)
        ],
        'alexcaves_delight:tree_star_tea'
    ).id("farmersrespite:emptying/tree_star_tea")
    e.recipes.create.filling(
        'alexcaves_delight:tree_star_tea',
        [
            "minecraft:glass_bottle",
            Fluid.of("createdelight:tree_star_tea", 250)
        ]
    ).id("farmersrespite:filling/tree_star_tea")
    brewing(e, "farmersrespite:green_tea",
        [
            "alexscaves:tree_star",
            "alexscaves:tree_star"
        ], "createdelight:tree_star_tea", "alexcaves_delight:tree_star_tea"
    )
    e.recipes.create.mixing(
        Fluid.of("createdelight:tree_star_tea", 500),
        [
            "alexscaves:tree_star",
            Fluid.of("farmersrespite:green_tea", 500)
        ]
    ).id("alexcaves_delight:mixing/tree_star_tea")
    brewing(e, "minecraft:water",
        [
            "alexscaves:bioluminesscence",
            "alexscaves:bioluminesscence"
        ], "createdelight:jellyfish_soda", "alexcaves_delight:jellyfish_soda"
    )
    e.recipes.create.mixing(
        Fluid.of("createdelight:jellyfish_soda", 500),
        [
            "alexscaves:bioluminesscence",
            Fluid.of("minecraft:water", 500)
        ]
    ).id("alexcaves_delight:mixing/jellyfish_soda")
})
