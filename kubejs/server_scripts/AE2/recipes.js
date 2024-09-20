/*
额todo：
杀压印器改压印器配方到较后
材质
e 配方id
纸的制造

*/

ServerEvents.recipes((event) => {
  const { kubejs, vintageimprovements, create } = event.recipes;

  remove_recipes_output(event, "ae2:inscriber");

  // 电路板配方
  vintageimprovements
    .curving("ae2:printed_engineering_processor", "minecraft:diamond")
    .head("createdelight:universal_press")
    .id("createdelight:universal_press_1");
  vintageimprovements
    .curving("megacells:printed_accumulation_processor", "megacells:sky_steel_ingot")
    .head("createdelight:universal_press")
    .id("createdelight:universal_press_2");
  vintageimprovements
    .curving("ae2:printed_calculation_processor", "ae2:certus_quartz_crystal")
    .head("createdelight:universal_press")
    .id("createdelight:universal_press_3");
  vintageimprovements
    .curving("ae2:printed_logic_processor", "minecraft:gold_ingot")
    .head("createdelight:universal_press")
    .id("createdelight:universal_press_4");
  vintageimprovements
    .curving("ae2:printed_silicon", "ae2:silicon")
    .head("createdelight:universal_press")
    .id("createdelight:universal_press_5");
  vintageimprovements
    .curving("createdelight:universal_press", "minecraft:iron_block")
    .head("createdelight:universal_press")
    .id("createdelight:universal_press_6");

  let custom_inscribe = (result, middle) => {
    event.custom({
      type: "ae2:inscriber",
      ingredients: {
        middle: { item: middle },
        top: { item: "createdelight:universal_press" },
      },
      mode: "inscribe",
      result: { item: result },
    }).id(`${result}_recipe`);
  };

  custom_inscribe("ae2:printed_engineering_processor", "minecraft:diamond");
  custom_inscribe("megacells:printed_accumulation_processor", "megacells:sky_steel_ingot");
  custom_inscribe("ae2:printed_logic_processor", "minecraft:gold_ingot");
  custom_inscribe("ae2:printed_silicon", "ae2:silicon");
  custom_inscribe("ae2:printed_calculation_processor", "ae2:certus_quartz_crystal");
  custom_inscribe("createdelight:universal_press", "minecraft:iron_block");

  // 通用压印模板的配方
  event.custom({
    type: "ae2:transform",
    circumstance: {
      type: "fluid",
      tag: "minecraft:water",
    },
    ingredients: [
      { item: "ae2:silicon_press" },
      { item: "ae2:logic_processor_press" },
      { item: "ae2:engineering_processor_press" },
      { item: "ae2:calculation_processor_press" },
      { item: "megacells:accumulation_processor_press" },
    ],
    result: { item: "createdelight:universal_press", count: 5 },
  }).id("universal_press_transform_recipe");

  // 初加工的电路板
  kubejs.shapeless("createdelight:initial_processing_of_printed_engineering_processor", [
    "ae2:printed_engineering_processor",
    "2x #forge:dusts/redstone",
  ]);
  kubejs.shapeless("createdelight:initial_processing_of_printed_calculation_processor", [
    "ae2:printed_calculation_processor",
    "2x #forge:dusts/redstone",
  ]);
  kubejs.shapeless("createdelight:initial_processing_of_printed_logic_processor", [
    "ae2:printed_logic_processor",
    "2x #forge:dusts/redstone",
  ]);
  vintageimprovements.vacuumizing(
    "createdelight:initial_processing_of_printed_engineering_processor",
    ["ae2:printed_engineering_processor", "#forge:dusts/redstone"]
  );
  vintageimprovements.vacuumizing(
    "createdelight:initial_processing_of_printed_calculation_processor",
    ["ae2:printed_calculation_processor", "#forge:dusts/redstone"]
  );
  vintageimprovements.vacuumizing("createdelight:initial_processing_of_printed_logic_processor", [
    "ae2:printed_logic_processor",
    "#forge:dusts/redstone",
  ]);
  create
    .sequenced_assembly(
      "createdelight:initial_processing_of_printed_engineering_processor",
      "ae2:printed_engineering_processor",
      create.deploying("ae2:printed_engineering_processor", [
        "ae2:printed_engineering_processor",
        "#forge:dusts/redstone",
      ])
    )
    .id("createdelight:initial_processing_of_printed_processor_1")
    .transitionalItem("ae2:printed_engineering_processor")
    .loops(2);
  create
    .sequenced_assembly(
      "createdelight:initial_processing_of_printed_calculation_processor",
      "ae2:printed_calculation_processor",
      create.deploying("ae2:printed_calculation_processor", [
        "ae2:printed_calculation_processor",
        "#forge:dusts/redstone",
      ])
    )
    .id("createdelight:initial_processing_of_printed_processor_2")
    .transitionalItem("ae2:printed_calculation_processor")
    .loops(2);
  create
    .sequenced_assembly(
      "createdelight:initial_processing_of_printed_logic_processor",
      "ae2:printed_logic_processor",
      create.deploying("ae2:printed_logic_processor", [
        "ae2:printed_logic_processor",
        "#forge:dusts/redstone",
      ])
    )
    .id("createdelight:initial_processing_of_printed_processor_3")
    .transitionalItem("ae2:printed_logic_processor")
    .loops(2);
  kubejs
    .shapeless("createdelight:initial_processing_of_printed_engineering_processor", [
      "ae2:printed_engineering_processor",
      "createdelight:redstone_paste",
    ])
    .damageIngredient("createdelight:redstone_paste");
  kubejs
    .shapeless("createdelight:initial_processing_of_printed_calculation_processor", [
      "ae2:printed_calculation_processor",
      "createdelight:redstone_paste",
    ])
    .damageIngredient("createdelight:redstone_paste");
  kubejs
    .shapeless("createdelight:initial_processing_of_printed_logic_processor", [
      "ae2:printed_logic_processor",
      "createdelight:redstone_paste",
    ])
    .damageIngredient("createdelight:redstone_paste");

  // 待压印的处理器
  kubejs.shapeless("createdelight:engineering_processor_inscribed", [
    "createdelight:initial_processing_of_printed_engineering_processor",
    "ae2:printed_silicon",
  ]);
  kubejs.shapeless("createdelight:calculation_processor_inscribed", [
    "createdelight:initial_processing_of_printed_calculation_processor",
    "ae2:printed_silicon",
  ]);
  kubejs.shapeless("createdelight:logic_processor_inscribed", [
    "createdelight:initial_processing_of_printed_logic_processor",
    "ae2:printed_silicon",
  ]);
  create
    .deploying("createdelight:engineering_processor_inscribed", [
      "createdelight:initial_processing_of_printed_engineering_processor",
      "ae2:printed_silicon",
    ])
    .id("createdelight:processor_inscribed_1");
  create
    .deploying("createdelight:calculation_processor_inscribed", [
      "createdelight:initial_processing_of_printed_calculation_processor",
      "ae2:printed_silicon",
    ])
    .id("createdelight:processor_inscribed_2");
  create
    .deploying("createdelight:logic_processor_inscribed", [
      "createdelight:initial_processing_of_printed_logic_processor",
      "ae2:printed_silicon",
    ])
    .id("createdelight:processor_inscribed_3");

  // 红石膏合成
  create
    .mixing("createdelight:redstone_paste", ["64x #forge:dusts/redstone", "#forge:plates/iron"])
    .heated();

  // 处理器配方
  vintageimprovements
    .curving("ae2:engineering_processor", "createdelight:engineering_processor_inscribed")
    .mode(2)
    .id("createdelight:processor_inscribed_4");
  vintageimprovements
    .curving("ae2:calculation_processor", "createdelight:calculation_processor_inscribed")
    .mode(2)
    .id("createdelight:processor_inscribed_5");
  vintageimprovements
    .curving("ae2:logic_processor", "createdelight:logic_processor_inscribed")
    .mode(2)
    .id("createdelight:processor_inscribed_6");

  // 陨钢锭
  create
    .mixing("2x megacells:sky_steel_ingot", [
      "#forge:ingots/iron",
      "ae2:charged_certus_quartz_crystal",
      "ae2:sky_stone_block",
      Fluid.of("minecraft:lava", 250),
    ])
    .id("createdelight:sky_steel_ingot");

  // 奇点
  create.cutting("ae2:singularity", "create:mechanical_saw").id("createdelight:singularity_1");
  create.crushing("ae2:singularity", "create:crushing_wheel").id("createdelight:singularity_2");
  create.milling("ae2:singularity", "create:millstone").id("createdelight:singularity_3");

  // 陨石再生
  create.milling("4x ae2:sky_dust", "ae2:sky_stone_block").id("createdelight:sky_dust_1");
  create
    .crushing(
      ["4x ae2:sky_dust", Item.of("ae2:sky_dust", 2).withChance(0.1)],
      "ae2:sky_stone_block"
    )
    .id("createdelight:sky_dust_2");
  create
    .mixing("createdelight:enriched_sky_stone_block", [
      "ae2:sky_stone_block",
      "#forge:dusts/redstone",
    ])
    .id("createdelight:enriched_sky_stone_block");
  create
    .crushing(
      [
        "4x ae2:sky_dust",
        Item.of("ae2:sky_dust", 2).withChance(0.3),
        Item.of("ae2:sky_dust", 2).withChance(0.3),
      ],
      "createdelight:enriched_sky_stone_block"
    )
    .id("createdelight:sky_dust_3");

  // 移除陨石粉配方
  event.remove({ id: "create:milling/compat/ae2/sky_stone_block" });

  // 红石再生
  create
    .mixing(Fluid.of("createdelight:sky_solution", 250), [
      Fluid.of("minecraft:water", 250),
      "ae2:sky_dust",
    ])
    .id("createdelight:regeneration_of_redstone_1");
  vintageimprovements
    .centrifugation(
      ["4x #forge:dusts/redstone", Fluid.of("createdelight:spent_liquor", 250)],
      Fluid.of("createdelight:sky_solution", 250)
    )
    .id("createdelight:regeneration_of_redstone_2");
  create
    .mixing(
      ["2x #forge:dusts/redstone", Fluid.of("createdelight:spent_liquor", 250)],
      Fluid.of("createdelight:sky_solution", 250)
    )
    .id("createdelight:regeneration_of_redstone_3");

  // 线缆锚
  vintageimprovements.turning(Item.of("ae2:cable_anchor", 64), "#forge:ingots/iron");

  // 添加福鲁伊克斯升级配方
  create.deploying("2x ae2:fluix_upgrade_smithing_template", [
    "minecraft:paper",
    "ae2:fluix_crystal",
  ]);

  // 陨铜锭
  create
    .mixing("2x createdelight:sky_copper_ingot", [
      "#forge:ingots/copper",
      "ae2:charged_certus_quartz_crystal",
      "ae2:sky_stone_block",
      Fluid.of("minecraft:lava", 250),
    ])
    .id("createdelight:sky_copper_ingot");
  event
    .custom({
      type: "ae2:transform",
      circumstance: {
        type: "fluid",
        tag: "minecraft:lava",
      },
      ingredients: [
        {
          item: "ae2:charged_certus_quartz_crystal",
        },
        {
          tag: "forge:ingots/copper",
        },
        {
          item: "ae2:sky_stone_block",
        },
      ],
      result: {
        count: 2,
        item: "createdelight:sky_copper_ingot",
      },
    })
    .id("createdelight:sky_copper_ingot_transform");

  // ME元件外壳坯件
  vintageimprovements
    .curving("4x createdelight:item_cell_housing_blank", "#forge:ingots/iron")
    .head("createdelight:cell_housing_curving_head")
    .id("createdelight:item_cell_housing_blank_curving");
  vintageimprovements
    .curving("4x createdelight:fluid_cell_housing_blank", "#forge:ingots/copper")
    .head("createdelight:cell_housing_curving_head")
    .id("createdelight:fluid_cell_housing_blank_curving");
  vintageimprovements
    .curving("4x createdelight:mega_item_cell_housing_blank", "#forge:ingots/sky_steel")
    .head("createdelight:cell_housing_curving_head")
    .id("createdelight:mega_item_cell_housing_blank_curving");
  vintageimprovements
    .curving("4x createdelight:mega_fluid_cell_housing_blank", "createdelight:sky_copper_ingot")
    .head("createdelight:cell_housing_curving_head")
    .id("createdelight:mega_fluid_cell_housing_blank_curving");

  // 初处理的元件外壳
  kubejs.shapeless("createdelight:initial_processing_of_item_cell_housing", [
    "createdelight:item_cell_housing_blank",
    "3x #forge:dusts/redstone",
  ]);
  kubejs.shapeless("createdelight:initial_processing_of_fluid_cell_housing", [
    "createdelight:fluid_cell_housing_blank",
    "3x #forge:dusts/redstone",
  ]);
  kubejs.shapeless("createdelight:initial_processing_of_mega_item_cell_housing", [
    "createdelight:mega_item_cell_housing_blank",
    "3x #forge:dusts/redstone",
  ]);
  kubejs.shapeless("createdelight:initial_processing_of_mega_fluid_cell_housing", [
    "createdelight:mega_fluid_cell_housing_blank",
    "3x #forge:dusts/redstone",
  ]);

  kubejs
    .shapeless("createdelight:initial_processing_of_item_cell_housing", [
      "createdelight:item_cell_housing_blank",
      "createdelight:redstone_paste",
    ])
    .damageIngredient("createdelight:redstone_paste");
  kubejs
    .shapeless("createdelight:initial_processing_of_fluid_cell_housing", [
      "createdelight:fluid_cell_housing_blank",
      "createdelight:redstone_paste",
    ])
    .damageIngredient("createdelight:redstone_paste");
  kubejs
    .shapeless("createdelight:initial_processing_of_mega_item_cell_housing", [
      "createdelight:mega_item_cell_housing_blank",
      "createdelight:redstone_paste",
    ])
    .damageIngredient("createdelight:redstone_paste");
  kubejs
    .shapeless("createdelight:initial_processing_of_mega_fluid_cell_housing", [
      "createdelight:mega_fluid_cell_housing_blank",
      "createdelight:redstone_paste",
    ])
    .damageIngredient("createdelight:redstone_paste");

  create
    .sequenced_assembly(
      "createdelight:initial_processing_of_item_cell_housing",
      "createdelight:item_cell_housing_blank",
      create.deploying("createdelight:item_cell_housing_blank", [
        "createdelight:item_cell_housing_blank",
        "#forge:dusts/redstone",
      ])
    )
    .loops(2)
    .transitionalItem("createdelight:item_cell_housing_blank")
    .id("createdelight:initial_processing_of_item_cell_housing_sequenced_assembly");
  create
    .sequenced_assembly(
      "createdelight:initial_processing_of_fluid_cell_housing",
      "createdelight:fluid_cell_housing_blank",
      create.deploying("createdelight:fluid_cell_housing_blank", [
        "createdelight:fluid_cell_housing_blank",
        "#forge:dusts/redstone",
      ])
    )
    .loops(2)
    .transitionalItem("createdelight:fluid_cell_housing_blank")
    .id("createdelight:initial_processing_of_fluid_cell_housing_sequenced_assembly");
  create
    .sequenced_assembly(
      "createdelight:initial_processing_of_mega_item_cell_housing",
      "createdelight:mega_item_cell_housing_blank",
      create.deploying("createdelight:mega_item_cell_housing_blank", [
        "createdelight:mega_item_cell_housing_blank",
        "#forge:dusts/redstone",
      ])
    )
    .loops(2)
    .transitionalItem("createdelight:mega_item_cell_housing_blank")
    .id("createdelight:initial_processing_of_mega_item_cell_housing_sequenced_assembly");
  create
    .sequenced_assembly(
      "createdelight:initial_processing_of_mega_fluid_cell_housing",
      "createdelight:mega_fluid_cell_housing_blank",
      create.deploying("createdelight:mega_fluid_cell_housing_blank", [
        "createdelight:mega_fluid_cell_housing_blank",
        "#forge:dusts/redstone",
      ])
    )
    .loops(2)
    .transitionalItem("createdelight:mega_fluid_cell_housing_blank")
    .id("createdelight:initial_processing_of_mega_fluid_cell_housing_sequenced_assembly");

  vintageimprovements.vacuumizing("createdelight:initial_processing_of_item_cell_housing", [
    "createdelight:item_cell_housing_blank",
    "#forge:dusts/redstone",
  ]);
  vintageimprovements.vacuumizing("createdelight:initial_processing_of_fluid_cell_housing", [
    "createdelight:fluid_cell_housing_blank",
    "#forge:dusts/redstone",
  ]);
  vintageimprovements.vacuumizing("createdelight:initial_processing_of_mega_item_cell_housing", [
    "createdelight:mega_item_cell_housing_blank",
    "#forge:dusts/redstone",
  ]);
  vintageimprovements.vacuumizing("createdelight:initial_processing_of_mega_fluid_cell_housing", [
    "createdelight:mega_fluid_cell_housing_blank",
    "#forge:dusts/redstone",
  ]);

  // 未成型的元件外壳
  kubejs.shapeless("createdelight:unformed_item_cell_housing", [
    "createdelight:initial_processing_of_item_cell_housing",
    "2x ae2:quartz_glass",
  ]);
  kubejs.shapeless("createdelight:unformed_fluid_cell_housing", [
    "createdelight:initial_processing_of_fluid_cell_housing",
    "2x ae2:quartz_glass",
  ]);
  kubejs.shapeless("createdelight:unformed_mega_item_cell_housing", [
    "createdelight:initial_processing_of_mega_item_cell_housing",
    "2x ae2:quartz_vibrant_glass",
  ]);
  kubejs.shapeless("createdelight:unformed_mega_fluid_cell_housing", [
    "createdelight:initial_processing_of_mega_fluid_cell_housing",
    "2x ae2:quartz_vibrant_glass",
  ]);

  create
    .sequenced_assembly(
      "createdelight:unformed_item_cell_housing",
      "createdelight:initial_processing_of_item_cell_housing",
      create.deploying("createdelight:initial_processing_of_item_cell_housing", [
        "createdelight:initial_processing_of_item_cell_housing",
        "ae2:quartz_glass",
      ])
    )
    .loops(2)
    .transitionalItem("createdelight:initial_processing_of_item_cell_housing")
    .id("createdelight:unformed_item_cell_housing_sequenced_assembly");
  create
    .sequenced_assembly(
      "createdelight:unformed_fluid_cell_housing",
      "createdelight:initial_processing_of_fluid_cell_housing",
      create.deploying("createdelight:initial_processing_of_fluid_cell_housing", [
        "createdelight:initial_processing_of_fluid_cell_housing",
        "ae2:quartz_glass",
      ])
    )
    .loops(2)
    .transitionalItem("createdelight:initial_processing_of_fluid_cell_housing")
    .id("createdelight:unformed_fluid_cell_housing_sequenced_assembly");
  create
    .sequenced_assembly(
      "createdelight:unformed_mega_item_cell_housing",
      "createdelight:initial_processing_of_mega_item_cell_housing",
      create.deploying("createdelight:initial_processing_of_mega_item_cell_housing", [
        "createdelight:initial_processing_of_mega_item_cell_housing",
        "ae2:quartz_vibrant_glass",
      ])
    )
    .loops(2)
    .transitionalItem("createdelight:initial_processing_of_mega_item_cell_housing")
    .id("createdelight:unformed_mega_item_cell_housing_sequenced_assembly");
  create
    .sequenced_assembly(
      "createdelight:unformed_mega_fluid_cell_housing",
      "createdelight:initial_processing_of_mega_fluid_cell_housing",
      create.deploying("createdelight:initial_processing_of_mega_fluid_cell_housing", [
        "createdelight:initial_processing_of_mega_fluid_cell_housing",
        "ae2:quartz_vibrant_glass",
      ])
    )
    .loops(2)
    .transitionalItem("createdelight:initial_processing_of_mega_fluid_cell_housing")
    .id("createdelight:unformed_mega_fluid_cell_housing_sequenced_assembly");

  kubejs.shapeless("createdelight:unformed_item_cell_housing", [
    "createdelight:initial_processing_of_item_cell_housing",
    "createdelight:quartz_glass_parts",
  ]);
  kubejs.shapeless("createdelight:unformed_fluid_cell_housing", [
    "createdelight:initial_processing_of_fluid_cell_housing",
    "createdelight:quartz_glass_parts",
  ]);
  kubejs.shapeless("createdelight:unformed_mega_item_cell_housing", [
    "createdelight:initial_processing_of_mega_item_cell_housing",
    "createdelight:quartz_vibrant_glass_parts",
  ]);
  kubejs.shapeless("createdelight:unformed_mega_fluid_cell_housing", [
    "createdelight:initial_processing_of_mega_fluid_cell_housing",
    "createdelight:quartz_vibrant_glass_parts",
  ]);

  create
    .deploying("createdelight:unformed_item_cell_housing", [
      "createdelight:initial_processing_of_item_cell_housing",
      "createdelight:quartz_glass_parts",
    ])
    .id("createdelight:unformed_item_cell_housing_deploying");
  create
    .deploying("createdelight:unformed_fluid_cell_housing", [
      "createdelight:initial_processing_of_fluid_cell_housing",
      "createdelight:quartz_glass_parts",
    ])
    .id("createdelight:unformed_fluid_cell_housing_deploying");
  create
    .deploying("createdelight:unformed_mega_item_cell_housing", [
      "createdelight:initial_processing_of_mega_item_cell_housing",
      "createdelight:quartz_vibrant_glass_parts",
    ])
    .id("createdelight:unformed_mega_item_cell_housing_deploying");
  create
    .deploying("createdelight:unformed_mega_fluid_cell_housing", [
      "createdelight:initial_processing_of_mega_fluid_cell_housing",
      "createdelight:quartz_vibrant_glass_parts",
    ])
    .id("createdelight:unformed_mega_fluid_cell_housing_deploying");

  // 元件外壳
  vintageimprovements
    .curving("ae2:item_cell_housing", "createdelight:unformed_item_cell_housing")
    .mode(2)
    .id("ae2:item_cell_housing_1");
  vintageimprovements
    .curving("ae2:fluid_cell_housing", "createdelight:unformed_fluid_cell_housing")
    .mode(2)
    .id("ae2:fluid_cell_housing_1");
  vintageimprovements
    .curving("megacells:mega_item_cell_housing", "createdelight:unformed_mega_item_cell_housing")
    .mode(2)
    .id("megacells:mega_item_cell_housing_1");
  vintageimprovements
    .curving("megacells:mega_fluid_cell_housing", "createdelight:unformed_mega_fluid_cell_housing")
    .mode(2)
    .id("megacells:mega_fluid_cell_housing_1");

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
    .damageIngredient("#ae2:knife", "114514");

  // 杀元件外壳配方
  event.remove({ id: "ae2:network/cells/item_cell_housing" })
  event.remove({ id: "ae2:network/cells/fluid_cell_housing" })
  event.remove({ id: "megacells:cells/mega_item_cell_housing" })
  event.remove({ id: "megacells:cells/mega_fluid_cell_housing" })
});
