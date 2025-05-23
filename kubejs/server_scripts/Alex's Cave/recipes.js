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

    //磁化洞穴


    //焦糖转换
    e.recipes.create.cutting("3x alexscaves:caramel", "create_confectionery:bar_of_caramel")
        .id("alexscaves:caramel")
    e.recipes.create.compacting(Fluid.of("create_confectionery:caramel", 80), "alexscaves:caramel")
        .heated()
        .id("create_confectionery:compacting/caramel_2")

    //焦糖苹果注液
    e.recipes.create.filling("alexscaves:caramel_apple", ["minecraft:apple", Fluid.of("create_confectionery:caramel", 500)])
        .id("alexscaves:filling/caramel_apple")
    //蛋糕胚
    e.recipes.create.compacting("ratatouille:cake_base", "3x alexscaves:cake_layer")
        .heated()
        .id("alexscaves:compacting/cake_base")

    //黑巧克力to巧克力块
    e.recipes.minecraft.stonecutting("3x alexscaves:block_of_chocolate", "create_confectionery:bar_of_black_chocolate")
        .id("block_of_chocolate_from_bar_of_black_chocolate")

    //统一拐杖糖
    e.replaceInput({ input: "alexscaves:candy_cane", not: {type: "minecraft:smithing_trim"}}, "alexscaves:candy_cane", "#createdelight:candy_cane")

    //拐杖糖打磨成尖拐杖糖
    // e.recipes.vintageimprovements.polishing("alexscaves:sharpened_candy_cane", "#createdelight:candy_cane")
    //     .id("alexscaves:polishing/sharpened_candy_cane")
    e.recipes.createmetallurgy.grinding("alexscaves:sharpened_candy_cane", "#createdelight:candy_cane")
       .id("alexscaves:grinding/sharpened_candy_cane")

    //拐杖糖粉碎成薄荷糖粉
    e.recipes.create.crushing([Item.of("3x alexscaves:peppermint_powder"), Item.of("2x alexscaves:peppermint_powder").withChance(0.5)], [["alexscaves:sharpened_candy_cane", "#createdelight:candy_cane"]])
    //姜饼块to姜饼块
    e.recipes.minecraft.stonecutting("6x alexscaves:gingerbread_block", "create_confectionery:gingerbread_block")
        .id("gingerbread_block_from_gingerbread_block")

    //姜饼面团to生面团块
    e.recipes.minecraft.stonecutting("2x alexscaves:dough_block", "create_confectionery:gingerdough")
        .id("dough_block_from_gingerdough")

    //甘草糖粉碎出甘草蔓
    e.recipes.create.crushing([Item.of("alexscaves:licoroot_vine"), Item.of("alexscaves:licoroot_vine").withChance(0.25)], "alexscaves:licoroot")
        .id("alexscaves:crushing/licoroot_vine")
    e.recipes.create.item_application("alexscaves:licoroot_sprout", ["alexscaves:licoroot_vine", "minecraft:sugar"])
        .id("alexscaves:item_application/licoroot_sprout")
    //姜饼块粉碎出姜饼屑
    e.recipes.create.milling("alexscaves:gingerbread_crumbs", "alexscaves:gingerbread_block")
        .id("alexscaves:milling/gingerbread_crumbs")
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

ServerEvents.recipes((event) => {
  const { create, vintageimprovements } = event.recipes;

  // 辐鳃鱼（和桶）量产
  vintageimprovements
    .pressurizing(
      [Item.of("alexscaves:radgill").withChance(0.01), Fluid.of("minecraft:lava", 250)],
      ["#minecraft:fishes", Fluid.of("alexscaves:acid", 1000)]
    )
    .heated()
    .id("createdelight:radgill");
  vintageimprovements
    .pressurizing(
      [Item.of("alexscaves:radgill_bucket").withChance(0.05), Fluid.of("minecraft:lava", 250)],
      ["#createdelight:fish_buckets", Fluid.of("alexscaves:acid", 1000)]
    )
    .heated()
    .id("createdelight:radgill_bucket");
});