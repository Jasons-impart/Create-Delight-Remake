ServerEvents.recipes((event) => {
  const { kubejs, vintageimprovements, create, minecraft, createdelightcore } = event.recipes;

  // 石英玻璃部件
  vintageimprovements
    .curving("4x createdelight:quartz_glass_parts", "ae2:quartz_glass")
    .head("createdelight:cell_housing_curving_head")
    .id("createdelight:quartz_glass_parts_curving");
  vintageimprovements
    .curving("4x createdelight:quartz_vibrant_glass_parts", "ae2:quartz_vibrant_glass")
    .head("createdelight:cell_housing_curving_head")
    .id("createdelight:quartz_vibrant_glass_parts_curving");

  // 元件外壳封头
  kubejs
    .shapeless("createdelight:cell_housing_curving_head", [
      "#forge:storage_blocks/iron",
      "#ae2:knife",
    ])
    .damageIngredient("#ae2:knife");

  // 福鲁伊克斯珍珠
  create
    .mixing("ae2:fluix_pearl", ["#forge:ender_pearls", "2x #forge:gems/fluix"])
    .id("createdelight:fluix_pearl_1");
  create
    .mixing("ae2:fluix_pearl", ["#forge:ender_pearls", "2x #forge:dusts/fluix"])
    .id("createdelight:fluix_pearl_2");
  create
    .mixing("ae2:fluix_pearl", ["#forge:ender_pearls", "#forge:gems/fluix", "#forge:dusts/fluix"])
    .id("createdelight:fluix_pearl_3");


  // 人造钻石
  let coal_64 = [Fluid.of("minecraft:lava", 250)];
  for (let i = 0; i < 4; i++) {
    coal_64.push("createmetallurgy:coke_block");
  }
  vintageimprovements
    .pressurizing("createdelight:mmd_diamond", coal_64)
    .superheated()
    .id("createdelight:mmd_diamond_1");

  // β-正交晶系六方铁 相变铁
  let iron_blocks_26 = ["mynethersdelight:bullet_pepper"];
  for (let i = 0; i < 16; i++) {
    iron_blocks_26.push("#forge:storage_blocks/iron");
  }

  vintageimprovements
    .pressurizing("createdelight:phase_transition_iron", iron_blocks_26)
    .id("createdelight:phase_transition_iron_1");

  let iron_blocks_26_ = [];
  for (let i = 0; i < 16; i++) {
    iron_blocks_26_.push({ item: "minecraft:iron_block" });
  }
  event
    .custom({
      type: "lychee:item_exploding",
      item_in: iron_blocks_26_,

      post: [
        {
          type: "drop_item",
          item: "createdelight:phase_transition_iron",
        },
      ],
    })
    .id("createdelight:phase_transition_iron_2");

  // 破坏核心
  kubejs.shaped(
    "ae2:annihilation_core",
    [
      "AAA",
      "BCD",
      "AAA"
    ], {
    A: "#forge:nuggets/iron",
    B: "#forge:gems/quartz",
    C: "#forge:dusts/fluix",
    D: "ae2:logic_processor",
  })
  let iner = "createdelight:incomplete_annihilation_core"
  create.sequenced_assembly("ae2:annihilation_core", "minecraft:iron_nugget", [
    create.deploying(iner, [iner, "#forge:gems/quartz"]),
    create.deploying(iner, [iner, "ae2:logic_processor"]),
    create.deploying(iner, [iner, "#forge:dusts/fluix"]),
  ])
    .transitionalItem(iner)
    .loops(1)
    .id("createdelight:annihilation_core_1")

  // 成型核心
  kubejs.shaped("ae2:formation_core", ["AAA", "BCD", "AAA"], {
    A: "#forge:nuggets/iron",
    B: "#forge:gems/certus_quartz",
    C: "#forge:dusts/fluix",
    D: "ae2:logic_processor",
  })
  let iner_2 = "createdelight:incomplete_formation_core"
  create.sequenced_assembly("ae2:formation_core", "minecraft:iron_nugget", [
    create.deploying(iner_2, [iner_2, "#forge:gems/certus_quartz"]),
    create.deploying(iner_2, [iner_2, "ae2:logic_processor"]),
    create.deploying(iner_2, [iner_2, "#forge:dusts/fluix"]),
  ])
    .transitionalItem(iner_2)
    .loops(1)
    .id("createdelight:formation_core_1")

  // 空间外壳
  kubejs.shaped("createdelight:space_casing",
    [
      "ABA",
      "CDC",
      "ACA"
    ], {
    A: "createdelight:phase_transition_iron",
    B: "ae2:singularity",
    C: "ae2:fluix_pearl",
    D: "#forge:storage_blocks/sky_steel",
  })

  // 铁外壳
  minecraft.stonecutting("4x createdelight:iron_casing", "#forge:storage_blocks/iron")

  // 陨钢外壳
  minecraft.stonecutting("4x createdelight:sky_steel_casing", "#forge:storage_blocks/sky_steel")

  // 累积压印模板
  vintageimprovements.pressurizing(
    "megacells:accumulation_processor_press",
    [
      "ae2:engineering_processor_press",
      "ae2:singularity",
      "ae2:calculation_processor_press",
      Fluid.of("minecraft:lava", 250),
    ]).id("createdelight:accumulation_processor_press")

  // 母岩
  create
    .item_application(
      [
        Item.of("ae2:flawless_budding_quartz").withChance(0.5),
        Item.of("ae2:quartz_block").withChance(0.5),
      ],
      ["ae2:flawed_budding_quartz", "ae2:flawed_budding_quartz"]
    )
    .id("createdelight:budding_quartz_1");
  create
    .item_application(
      [
        Item.of("ae2:flawed_budding_quartz").withChance(0.5),
        Item.of("ae2:quartz_block").withChance(0.5),
      ],
      ["ae2:chipped_budding_quartz", "ae2:chipped_budding_quartz"]
    )
    .id("createdelight:budding_quartz_2");
  create
    .item_application(
      [
        Item.of("ae2:chipped_budding_quartz").withChance(0.5),
        Item.of("ae2:quartz_block").withChance(0.5),
      ],
      ["ae2:damaged_budding_quartz", "ae2:damaged_budding_quartz"]
    )
    .id("createdelight:budding_quartz_3");
  create
    .item_application(
      [
        Item.of("ae2:damaged_budding_quartz").withChance(0.5),
        Item.of("ae2:quartz_block").withChance(0.5),
      ],
      ["ae2:quartz_block", "ae2:quartz_block"]
    )
    .id("createdelight:budding_quartz_4");

  // 照明元件
  kubejs.shaped("3x ae2:semi_dark_monitor", ["ABC", "ADC", "ABC"], {
    A: "#forge:ingots/iron",
    B: "#forge:dusts/glowstone",
    C: "ae2:quartz_glass",
    D: "#forge:dusts/redstone",
  });
  event.replaceInput(
    { id: "ae2:network/parts/panels_semi_dark_monitor" },
    "minecraft:iron_ingot",
    "#forge:plates/iron"
  );

  //包层线缆使用强化纤维制作
  kubejs.shaped("2x ae2:fluix_covered_cable", [
    "ABA"
  ],
    {
      A: "ae2:fluix_glass_cable",
      B: "protection_pixel:reinforcedfiber"
    })
  .id("createdelight:fluix_covered_cable_from_reinforcedfiber")
  create.splashing("ae2:fluix_covered_cable", Ingredient.of("#ae2:covered_cable").subtract("ae2:fluix_covered_cable"))
  .id("createdelight:splashing/fluix_covered_cable")
  create.splashing("ae2:fluix_glass_cable", Ingredient.of("#ae2:glass_cable").subtract("ae2:fluix_glass_cable"))
  .id("createdelight:splashing/fluix_glass_cable")
  create.splashing("ae2:fluix_covered_dense_cable", Ingredient.of("#ae2:covered_dense_cable").subtract("ae2:fluix_covered_dense_cable"))
  .id("createdelight:splashing/fluix_covered_dense_cable")
  create.splashing("ae2:fluix_smart_cable", Ingredient.of("#ae2:smart_cable").subtract("ae2:fluix_smart_cable"))
  .id("createdelight:splashing/fluix_smart_cable")
  create.splashing("ae2:fluix_smart_dense_cable", Ingredient.of("#ae2:smart_dense_cable").subtract("ae2:fluix_smart_dense_cable"))
  .id("createdelight:splashing/smart_dense_cable")

  createdelightcore.fan_freezing("ae2:fluix_covered_cable", Ingredient.of("#ae2:covered_cable").subtract("ae2:fluix_covered_cable"))
  .id("createdelight:fan_freezing/fluix_covered_cable")
  createdelightcore.fan_freezing("ae2:fluix_glass_cable", Ingredient.of("#ae2:glass_cable").subtract("ae2:fluix_glass_cable"))
  .id("createdelight:fan_freezing/fluix_glass_cable")
  createdelightcore.fan_freezing("ae2:fluix_covered_dense_cable", Ingredient.of("#ae2:covered_dense_cable").subtract("ae2:fluix_covered_dense_cable"))
  .id("createdelight:fan_freezing/fluix_covered_dense_cable")
  createdelightcore.fan_freezing("ae2:fluix_smart_cable", Ingredient.of("#ae2:smart_cable").subtract("ae2:fluix_smart_cable"))
  .id("createdelight:fan_freezing/fluix_smart_cable")
  createdelightcore.fan_freezing("ae2:fluix_smart_dense_cable", Ingredient.of("#ae2:smart_dense_cable").subtract("ae2:fluix_smart_dense_cable"))
  .id("createdelight:fan_freezing/smart_dense_cable")

});
