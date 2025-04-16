ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "create:crushing/raw_uranium"
    ])
  //铀矿打粉
  e.recipes.create.crushing(
    [
      'createdelight:uranium_dust',
      Item.of('createdelight:uranium_dust').withChance(0.25)
    ],
    'alexscaves:uranium'
  ).id("alexscaves:crushing/uranium_dust")
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
      Fluid.of("createdelightcore:slime", 90),
          "minecraft:mud"
      ]
  ).heated()
      .id("alexscaves:pressurizing/toxic_paste")

  //离心核废料
  centrifugation(e,
      ["4x alexscaves:uranium_shard",
          Fluid.of("alexscaves:acid").withAmount(250)
      ],
      ["alexscaves:unrefined_waste"])
      .id("alexscaves:centrifugation/uranium_shard")

  //铀棒
  let iner_1 = "alexscaves:block_of_uranium"
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

})