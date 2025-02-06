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
    // e.replaceInput({ id: "create_oppenheimered:mixing/ice_cream_licoroot" }, "alexscaves:licoroot", "neapolitan:dried_vanilla_pod_block")
    //硫磺，硫磺晶簇->硫粉
    e.recipes.create.crushing([
        'alexscaves:sulfur_dust',
        Item.of('alexscaves:sulfur_dust').withChance(0.25)
    ], 'vintageimprovements:sulfur'
    ).id("alexscaves:crushing/sulfur_dust_2")

    make_growing_cluster(e, [
        "alexscaves:sulfur_dust",
        "alexscaves:sulfur_bud_small",
        "alexscaves:sulfur_bud_medium",
        "alexscaves:sulfur_bud_large",
        "alexscaves:sulfur_cluster"
    ], "alexscaves:acid", 50)

    //烂泥再生
    e.recipes.vintageimprovements.pressurizing(
        "9x alexscaves:toxic_paste",
        [Fluid.of("alexscaves:acid").withAmount(100),
        Fluid.of("createdelight:slime", 90),
            "minecraft:mud"
        ]
    ).heated()
        .id("alexscaves:pressurizing/toxic_paste")

    //离心核废料
    e.recipes.vintageimprovements.centrifugation(
        ["4x alexscaves:uranium_shard",
            Fluid.of("alexscaves:acid").withAmount(250)
        ],
        ["alexscaves:unrefined_waste"])
        .id("alexscaves:centrifugation/uranium_shard")

    let iner_1 = "alexscaves:block_of_uranium"
    //铀棒
    e.recipes.create.sequenced_assembly(
        "3x alexscaves:uranium_rod",
        iner_1,
        [
            e.recipes.createaddition.rolling(iner_1, iner_1),
            e.recipes.create.deploying(iner_1, [iner_1, "create:iron_sheet"]),
            e.recipes.create.deploying(iner_1, [iner_1, "create:iron_sheet"]),
            e.recipes.create.cutting(iner_1, iner_1)
        ])
        .transitionalItem(iner_1)
        .loops(1)
        .id("alexscaves:uranium_rod")
    //核弹
    e.recipes.create.mechanical_crafting("alexscaves:nuclear_bomb", [
        "AABAA",
        "ACDCA",
        "ACECA",
        "ACDCA",
        "AABAA"
    ],
        {
            A: "ad_astra:steel_plate",
            B: "minecraft:tnt",
            C: "alexscaves:uranium_rod",
            D: "alexscaves:fissile_core",
            E: "alexscaves:block_of_uranium"
        })
        .id("alexscaves:nuclear_bomb")

    
    //氡气相关
    e.recipes.vintageimprovements.pressurizing(
        [
            Fluid.of("createdelight:radon", 100),
            Fluid.of("vintageimprovements:sulfuric_acid", 100)
        ],
        Fluid.of("alexscaves:acid", 200)
    )
        .secondaryFluidOutput(0)
        .heated()
        .id("alexscaves:pressurizing/radon")
    e.recipes.create.filling("alexscaves:radon_bottle", ["minecraft:glass_bottle", Fluid.of("createdelight:radon").withAmount(250)])
        .id("alexscaves:filling/radon_bottle")
    e.recipes.create.emptying(["minecraft:glass_bottle", Fluid.of("createdelight:radon").withAmount(250)], "alexscaves:radon_bottle")
        .id("alexscaves:emptying/radon")
    // 聚合物板
    e.replaceInput({ id: "alexscaves:polymer_plate" }, "minecraft:iron_ingot", "createmetallurgy:steel_ingot")
    let iner_2 = "createmetallurgy:steel_block"
    e.recipes.create.sequenced_assembly("48x alexscaves:polymer_plate", iner_2, [
        e.recipes.vintageimprovements.hammering(iner_2, iner_2),
        e.recipes.create.filling(iner_2, [iner_2, Fluid.of("vintageimprovements:sulfuric_acid").withAmount(1000)]),
        e.recipes.create.filling(iner_2, [iner_2, Fluid.of("createdelight:radon").withAmount(1000)]),
        e.recipes.create.cutting(iner_2, iner_2)
    ])
        .transitionalItem(iner_2)
        .loops(1)
        .id("alexscaves:polymer_plate_2")


    //粉碎珍珠出海洋玻璃碎片
    e.recipes.create.crushing([
        "3x alexscaves:sea_glass_shards",
        Item.of("alexscaves:sea_glass_shards", 3).withChance(0.5)], "alexscaves:pearl")
        .id("alexscaves:crushing/pearl")
    e.recipes.vintageimprovements.centrifugation([
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
    e.recipes.vintageimprovements.polishing("alexscaves:sharpened_candy_cane", "#createdelight:candy_cane")
        .id("alexscaves:polishing/sharpened_candy_cane")

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