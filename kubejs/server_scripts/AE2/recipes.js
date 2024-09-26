/*
额todo：
杀压印器改压印器配方到较后
材质
e 配方id
纸的制造
P2P奇点
空间元件
红石互动生成陨石
Jason的相变铁世界生成
人造钻石适配
*/

ServerEvents.recipes((event) => {
  const { kubejs, vintageimprovements, create } = event.recipes;

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
    event
      .custom({
        type: "ae2:inscriber",
        ingredients: {
          middle: { item: middle },
          top: { item: "createdelight:universal_press" },
        },
        mode: "inscribe",
        result: { item: result },
      })
      .id(`${result}_recipe`);
  };

  custom_inscribe("ae2:printed_engineering_processor", "minecraft:diamond");
  custom_inscribe("megacells:printed_accumulation_processor", "megacells:sky_steel_ingot");
  custom_inscribe("ae2:printed_logic_processor", "minecraft:gold_ingot");
  custom_inscribe("ae2:printed_silicon", "ae2:silicon");
  custom_inscribe("ae2:printed_calculation_processor", "ae2:certus_quartz_crystal");
  custom_inscribe("createdelight:universal_press", "minecraft:iron_block");

  // 通用压印模板的配方
  event
    .custom({
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
    })
    .id("universal_press_transform_recipe");

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
  kubejs.shapeless("createdelight:initial_processing_of_printed_accumulation_processor", [
    "megacells:printed_accumulation_processor",
    "2x #forge:dusts/fluix",
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
  vintageimprovements.vacuumizing(
    "createdelight:initial_processing_of_printed_accumulation_processor",
    ["megacells:printed_accumulation_processor", "#forge:dusts/fluix"]
  );
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
  create
    .sequenced_assembly(
      "createdelight:initial_processing_of_printed_accumulation_processor",
      "megacells:printed_accumulation_processor",
      create.deploying("megacells:printed_accumulation_processor", [
        "megacells:printed_accumulation_processor",
        "#forge:dusts/fluix",
      ])
    )
    .id("createdelight:initial_processing_of_printed_processor_4")
    .transitionalItem("megacells:printed_accumulation_processor")
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
  kubejs.shapeless("createdelight:accumulation_processor_inscribed", [
    "createdelight:initial_processing_of_printed_accumulation_processor",
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
  create
    .deploying("createdelight:accumulation_processor_inscribed", [
      "createdelight:initial_processing_of_printed_accumulation_processor",
      "ae2:printed_silicon",
    ])
    .id("createdelight:processor_inscribed_7");

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
  vintageimprovements
    .curving("megacells:accumulation_processor", "createdelight:accumulation_processor_inscribed")
    .mode(2)
    .id("createdelight:processor_inscribed_8");

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

  // 未加工的元件外壳
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
    "3x ae2:sky_dust",
  ]);
  kubejs.shapeless("createdelight:initial_processing_of_mega_fluid_cell_housing", [
    "createdelight:mega_fluid_cell_housing_blank",
    "3x #forge:dusts/redstone",
    "3x ae2:sky_dust",
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
      "createdelight:sky_stone_paste",
    ])
    .damageIngredient("createdelight:redstone_paste")
    .damageIngredient("createdelight:sky_stone_paste");

  kubejs
    .shapeless("createdelight:initial_processing_of_mega_fluid_cell_housing", [
      "createdelight:mega_fluid_cell_housing_blank",
      "createdelight:redstone_paste",
      "createdelight:sky_stone_paste",
    ])
    .damageIngredient("createdelight:redstone_paste")
    .damageIngredient("createdelight:sky_stone_paste");

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
      [
        create.deploying("createdelight:mega_item_cell_housing_blank", [
          "createdelight:mega_item_cell_housing_blank",
          "#forge:dusts/redstone",
        ]),
        create.deploying("createdelight:mega_item_cell_housing_blank", [
          "createdelight:mega_item_cell_housing_blank",
          "ae2:sky_dust",
        ]),
      ]
    )
    .loops(2)
    .transitionalItem("createdelight:mega_item_cell_housing_blank")
    .id("createdelight:initial_processing_of_mega_item_cell_housing_sequenced_assembly");
  create
    .sequenced_assembly(
      "createdelight:initial_processing_of_mega_fluid_cell_housing",
      "createdelight:mega_fluid_cell_housing_blank",
      [
        create.deploying("createdelight:mega_item_cell_housing_blank", [
          "createdelight:mega_item_cell_housing_blank",
          "#forge:dusts/redstone",
        ]),
        create.deploying("createdelight:mega_item_cell_housing_blank", [
          "createdelight:mega_item_cell_housing_blank",
          "ae2:sky_dust",
        ]),
      ]
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
    "ae2:sky_dust",
  ]);
  vintageimprovements.vacuumizing("createdelight:initial_processing_of_mega_fluid_cell_housing", [
    "createdelight:mega_fluid_cell_housing_blank",
    "#forge:dusts/redstone",
    "ae2:sky_dust",
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
    .head("createdelight:cell_housing_curving_head")
    .id("ae2:item_cell_housing_1");
  vintageimprovements
    .curving("ae2:fluid_cell_housing", "createdelight:unformed_fluid_cell_housing")
    .head("createdelight:cell_housing_curving_head")
    .id("ae2:fluid_cell_housing_1");
  vintageimprovements
    .curving("megacells:mega_item_cell_housing", "createdelight:unformed_mega_item_cell_housing")
    .head("createdelight:cell_housing_curving_head")
    .id("megacells:mega_item_cell_housing_1");
  vintageimprovements
    .curving("megacells:mega_fluid_cell_housing", "createdelight:unformed_mega_fluid_cell_housing")
    .head("createdelight:cell_housing_curving_head")
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
    .damageIngredient("#ae2:knife");

  // 杀部分元件(说真的用啥循环手写直接硬写多好的（)
  let cel1s_v = ["_256m", "_64m", "_16m", "_4m", "_1m", "_256k", "_64k", "_16k", "_4k", "_1k"];
  let cel1s_type = ["item_", "fluid_"];
  let cel1s_spname = ["ae2:", "megacells:"];

  cel1s_spname.forEach((spname) => {
    cel1s_type.forEach((type1) => {
      cel1s_v.forEach((v) => {
        event.remove({
          output: `${spname + type1}storage_cell${v}`,
          type: "minecraft:crafting_shaped",
        });
      });
    });
  });

  event.remove({ id: "expatternprovider:cobblestone_cell" });
  event.remove({ id: "expatternprovider:water_cell" });
  event.remove({ id: "megacells:cells/standard/bulk_item_cell" });

  // 杀元件外壳配方
  event.remove({ id: "ae2:network/cells/item_cell_housing" });
  event.remove({ id: "ae2:network/cells/fluid_cell_housing" });
  event.remove({ id: "megacells:cells/mega_item_cell_housing" });
  event.remove({ id: "megacells:cells/mega_fluid_cell_housing" });

  // 聚能石英玻璃
  create
    .mixing(Item.of("ae2:quartz_vibrant_glass", 4), [
      "4x ae2:quartz_glass",
      "#forge:dusts/glowstone",
    ])
    .id("createdelight:quartz_vibrant_glass");

  // 石英玻璃
  create
    .mixing("4x ae2:quartz_glass", ["4x #forge:glass", "#forge:dusts/certus_quartz"])
    .id("createdelight:quartz_glass");

  // 熵变机械臂
  create
    .sequenced_assembly("ae2:entropy_manipulator", "#forge:rods/iron", [
      create.deploying("#forge:rods/iron", ["#forge:rods/iron", "ae2:energy_cell"]),
      create.deploying("#forge:rods/iron", ["#forge:rods/iron", "ae2:engineering_processor"]),
      create.deploying("#forge:rods/iron", ["#forge:rods/iron", "ae2:fluix_crystal"]),
      vintageimprovements.polishing("#forge:rods/iron", "#forge:rods/iron"),
    ])
    .transitionalItem("createaddition:iron_rod")
    .loops(1)
    .id("createdelight:entropy_manipulator");
  event.remove({ id: "ae2:tools/misctools_entropy_manipulator" });

  // 充能手杖
  create
    .sequenced_assembly("ae2:charged_staff", "#forge:rods/iron", [
      create.deploying("#forge:rods/iron", [
        "#forge:rods/iron",
        "ae2:charged_certus_quartz_crystal",
      ]),
      vintageimprovements.polishing("#forge:rods/iron", "#forge:rods/iron"),
    ])
    .transitionalItem("createaddition:iron_rod")
    .loops(1)
    .id("createdelight:charged_staff");
  event.remove({ id: "ae2:tools/misctools_charged_staff" });

  // 陨石罗盘
  kubejs
    .shapeless("ae2:meteorite_compass", [
      "#forge:plates/copper",
      "minecraft:baked_potato",
      "#forge:plates/zinc",
      "#minecraft:compasses",
    ])
    .keepIngredient("#forge:plates/copper")
    .keepIngredient("#forge:plates/zinc")
    .keepIngredient("minecraft:baked_potato");

  // AE指南
  kubejs
    .shapeless("ae2:guide", [
      "#forge:plates/copper",
      "minecraft:baked_potato",
      "#forge:plates/zinc",
      "#forge:books",
    ])
    .keepIngredient("#forge:plates/copper")
    .keepIngredient("#forge:plates/zinc")
    .keepIngredient("minecraft:baked_potato");

  // 充能石英火把
  kubejs.shaped("4x ae2:quartz_fixture", ["A", "B"], {
    A: "ae2:charged_certus_quartz_crystal",
    B: "ae2:cable_anchor",
  });
  event.remove({ id: "ae2:decorative/quartz_fixture_from_anchors" });

  // 杀mega部分
  event.remove({ output: "megacells:mega_interface" });
  event.remove({ output: "megacells:mega_pattern_provider" });

  // 鱼大嘿嘿
  vintageimprovements
    .centrifugation("expatternprovider:fishbig", "minecraft:pufferfish")
    .id("createdelight:fishbig");

  // 无限水元件
  create
    .sequenced_assembly(
      Item.of("expatternprovider:infinity_cell", '{record:{"#c":"ae2:f",id:"minecraft:water"}}'),
      "ae2:cell_component_1k",
      create.filling("ae2:cell_component_1k", [
        "ae2:cell_component_1k",
        Fluid.of("minecraft:water", 1000),
      ])
    )
    .loops(512)
    .transitionalItem("ae2:cell_component_1k")
    .id("createdelight:infinity_water_cell");

  // 大宗存储组件
  event.replaceInput(
    { id: "megacells:crafting/bulk_cell_component" },
    "megacells:cell_component_1m",
    "functionalstorage:copper_upgrade"
  );
  event.replaceInput(
    { id: "megacells:crafting/bulk_cell_component" },
    "ae2:spatial_cell_component_2",
    "functionalstorage:copper_upgrade"
  );

  // 大宗元件
  kubejs.shapeless("megacells:bulk_item_cell", [
    "megacells:bulk_cell_component",
    "megacells:mega_item_cell_housing",
  ]);

  // 陨石储罐
  create
    .item_application("ae2:sky_stone_tank", ["ae2:quartz_glass", "ae2:sky_stone_block"])
    .id("createdelight:sky_stone_tank");
  kubejs.shapeless("ae2:sky_stone_tank", ["ae2:quartz_glass", "ae2:sky_stone_block"]);

  // 原料缓存器
  create
    .item_application("expatternprovider:ingredient_buffer", [
      "ae2:quartz_glass",
      "ae2:cell_component_1k",
    ])
    .id("createdelight:ingredient_buffer");
  kubejs.shapeless("expatternprovider:ingredient_buffer", [
    "ae2:quartz_glass",
    "ae2:cell_component_1k",
  ]);
  event.remove({ id: "expatternprovider:ingredient_buffer" });

  // β-正交晶系六方铁
  let iron_blocks_64 = ["mynethersdelight:bullet_pepper"];
  for (let i = 0; i < 64; i++) {
    iron_blocks_64.push("#forge:storage_blocks/iron");
  }

  vintageimprovements
    .pressurizing("createdelight:phase_transition_iron", iron_blocks_64)
    .id("createdelight:phase_transition_iron_A");

  // event.custom({
  //   type: "ae2:transform",
  //   circumstance: {
  //     type: "explosion",
  //   },
  //   ingredients: [
  //     {
  //       count: 64,
  //       tag: "forge:storage_blocks/iron",
  //     },

  //   ],
  //   result: {
  //     count: 1,
  //     item: "createdelight:phase_transition_iron",
  //   },
  // });

  // 样板
  event.remove({ id: "ae2:network/crafting/patterns_blank" });
  create
    .sequenced_assembly("4x ae2:blank_pattern", "#forge:plates/iron", [
      create.deploying("#forge:plates/iron", ["#forge:plates/iron", "ae2:certus_quartz_crystal"]),
      create.deploying("#forge:plates/iron", [
        "#forge:plates/iron",
        "createdelight:quartz_vibrant_glass_parts",
      ]),
      vintageimprovements
        .curving("#forge:plates/iron", "#forge:plates/iron")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .transitionalItem("#forge:plates/iron")
    .loops(1)
    .id("createdelight:blank_pattern_A");
  create
    .sequenced_assembly("4x ae2:blank_pattern", "#forge:plates/iron", [
      create.deploying("#forge:plates/iron", ["#forge:plates/iron", "ae2:certus_quartz_crystal"]),
      create.deploying("#forge:plates/iron", ["#forge:plates/iron", "#forge:dusts/glowstone"]),
      create.deploying("#forge:plates/iron", [
        "#forge:plates/iron",
        "createdelight:quartz_glass_parts",
      ]),
      vintageimprovements
        .curving("#forge:plates/iron", "#forge:plates/iron")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .transitionalItem("#forge:plates/iron")
    .loops(1)
    .id("createdelight:blank_pattern_B");
  create
    .sequenced_assembly("4x ae2:blank_pattern", "#forge:plates/iron", [
      create.deploying("#forge:plates/iron", ["#forge:plates/iron", "ae2:certus_quartz_crystal"]),
      create.deploying("#forge:plates/iron", ["#forge:plates/iron", "#forge:dusts/glowstone"]),
      create.deploying("#forge:plates/iron", ["#forge:plates/iron", "#forge:dusts/glowstone"]),
      create.deploying("#forge:plates/iron", ["#forge:plates/iron", "ae2:quartz_glass"]),
      create.deploying("#forge:plates/iron", ["#forge:plates/iron", "ae2:quartz_glass"]),
      vintageimprovements
        .curving("#forge:plates/iron", "#forge:plates/iron")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .transitionalItem("#forge:plates/iron")
    .loops(1)
    .id("createdelight:blank_pattern_C");
  create
    .sequenced_assembly("4x ae2:blank_pattern", "#forge:plates/iron", [
      create.deploying("#forge:plates/iron", ["#forge:plates/iron", "ae2:certus_quartz_crystal"]),
      create.deploying("#forge:plates/iron", ["#forge:plates/iron", "ae2:quartz_vibrant_glass"]),
      create.deploying("#forge:plates/iron", ["#forge:plates/iron", "ae2:quartz_vibrant_glass"]),
      vintageimprovements
        .curving("#forge:plates/iron", "#forge:plates/iron")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .transitionalItem("#forge:plates/iron")
    .loops(1)
    .id("createdelight:blank_pattern_D");

  // 样板修改器
  create
    .sequenced_assembly("expatternprovider:pattern_modifier", "ae2:blank_pattern", [
      create.deploying("ae2:blank_pattern", ["ae2:blank_pattern", "ae2:logic_processor"]),
      create.deploying("ae2:blank_pattern", ["ae2:blank_pattern", "#forge:dyes/green"]),
      vintageimprovements
        .curving("ae2:blank_pattern", "ae2:blank_pattern")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:pattern_modifier_1")
    .transitionalItem("ae2:blank_pattern")
    .loops(1);
  event.remove({ id: "expatternprovider:pattern_modifier" });

  // 扩展样板管理终端
  create
    .sequenced_assembly("expatternprovider:ex_pattern_access_part", "ae2:pattern_access_terminal", [
      create.deploying("ae2:pattern_access_terminal", [
        "ae2:pattern_access_terminal",
        "ae2:logic_processor",
      ]),
      create.deploying("ae2:pattern_access_terminal", [
        "ae2:pattern_access_terminal",
        "minecraft:redstone_lamp",
      ]),
    ])
    .transitionalItem("ae2:pattern_access_terminal")
    .loops(1)
    .id("createdelight:ex_pattern_access_part_1");

  // 组件坞
  event.remove({ id: "megacells:network/cell_dock" });
  create
    .deploying(Item.of("megacells:cell_dock", 10), ["ae2:drive", "#forge:ingots/sky_steel"])
    .id("createdelight:cell_dock_1");

  // 1K存储元件
  create
    .sequenced_assembly("ae2:cell_component_1k", "ae2:certus_quartz_crystal", [
      vintageimprovements.polishing("ae2:certus_quartz_crystal", "ae2:certus_quartz_crystal"),
      create.deploying("ae2:certus_quartz_crystal", [
        "ae2:certus_quartz_crystal",
        "#forge:dusts/redstone",
      ]),
      create.deploying("ae2:certus_quartz_crystal", [
        "ae2:certus_quartz_crystal",
        "#forge:dusts/redstone",
      ]),
      create.deploying("ae2:certus_quartz_crystal", [
        "ae2:certus_quartz_crystal",
        "#forge:dusts/redstone",
      ]),
      create.deploying("ae2:certus_quartz_crystal", [
        "ae2:certus_quartz_crystal",
        "#forge:dusts/redstone",
      ]),
      create.deploying("ae2:certus_quartz_crystal", [
        "ae2:certus_quartz_crystal",
        "ae2:certus_quartz_crystal",
      ]),
      create.deploying("ae2:certus_quartz_crystal", [
        "ae2:certus_quartz_crystal",
        "ae2:logic_processor",
      ]),
      vintageimprovements
        .curving("ae2:certus_quartz_crystal", "ae2:certus_quartz_crystal")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .loops(1)
    .transitionalItem("ae2:certus_quartz_crystal")
    .id("createdelight:cell_component_1k_A");

  create
    .sequenced_assembly("ae2:cell_component_1k", "ae2:certus_quartz_crystal", [
      vintageimprovements.polishing("ae2:certus_quartz_crystal", "ae2:certus_quartz_crystal"),
      create.deploying("ae2:certus_quartz_crystal", [
        "ae2:certus_quartz_crystal",
        "createdelight:redstone_paste",
      ]),
      create.deploying("ae2:certus_quartz_crystal", [
        "ae2:certus_quartz_crystal",
        "createdelight:redstone_paste",
      ]),
      create.deploying("ae2:certus_quartz_crystal", [
        "ae2:certus_quartz_crystal",
        "ae2:certus_quartz_crystal",
      ]),
      create.deploying("ae2:certus_quartz_crystal", [
        "ae2:certus_quartz_crystal",
        "ae2:logic_processor",
      ]),
      vintageimprovements
        .curving("ae2:certus_quartz_crystal", "ae2:certus_quartz_crystal")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .loops(1)
    .transitionalItem("ae2:certus_quartz_crystal")
    .id("createdelight:cell_component_1k_B");

  create
    .sequenced_assembly("ae2:cell_component_1k", "ae2:certus_quartz_crystal", [
      vintageimprovements.polishing("ae2:certus_quartz_crystal", "ae2:certus_quartz_crystal"),
      vintageimprovements.vacuumizing("ae2:certus_quartz_crystal", [
        "ae2:certus_quartz_crystal",
        "#forge:dusts/redstone",
        "#forge:dusts/redstone",
      ]),
      create.deploying("ae2:certus_quartz_crystal", [
        "ae2:certus_quartz_crystal",
        "ae2:certus_quartz_crystal",
      ]),
      create.deploying("ae2:certus_quartz_crystal", [
        "ae2:certus_quartz_crystal",
        "ae2:logic_processor",
      ]),
      vintageimprovements
        .curving("ae2:certus_quartz_crystal", "ae2:certus_quartz_crystal")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .loops(1)
    .transitionalItem("ae2:certus_quartz_crystal")
    .id("createdelight:cell_component_1k_C");

  // 4K存储元件
  create
    .sequenced_assembly("ae2:cell_component_4k", "ae2:cell_component_1k", [
      vintageimprovements.polishing("ae2:certus_quartz_crystal", "ae2:certus_quartz_crystal"),
      create.deploying("ae2:cell_component_1k", ["ae2:cell_component_1k", "#forge:dusts/redstone"]),
      create.deploying("ae2:cell_component_1k", ["ae2:cell_component_1k", "#forge:dusts/redstone"]),
      create.deploying("ae2:cell_component_1k", ["ae2:cell_component_1k", "ae2:cell_component_1k"]),

      create.deploying("ae2:cell_component_1k", [
        "ae2:cell_component_1k",
        "ae2:calculation_processor",
      ]),
      create.deploying("ae2:cell_component_1k", ["ae2:cell_component_1k", "ae2:quartz_glass"]),
      vintageimprovements
        .curving("ae2:cell_component_1k", "ae2:cell_component_1k")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_4k_A")
    .loops(1)
    .transitionalItem("ae2:cell_component_1k");

  create
    .sequenced_assembly("ae2:cell_component_4k", "ae2:cell_component_1k", [
      vintageimprovements.polishing("ae2:certus_quartz_crystal", "ae2:certus_quartz_crystal"),
      create.deploying("ae2:cell_component_1k", [
        "ae2:cell_component_1k",
        "createdelight:redstone_paste",
      ]),
      create.deploying("ae2:cell_component_1k", ["ae2:cell_component_1k", "ae2:cell_component_1k"]),

      create.deploying("ae2:cell_component_1k", [
        "ae2:cell_component_1k",
        "ae2:calculation_processor",
      ]),
      create.deploying("ae2:cell_component_1k", ["ae2:cell_component_1k", "ae2:quartz_glass"]),
      vintageimprovements
        .curving("ae2:certus_quartz_crystal", "ae2:certus_quartz_crystal")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_4k_B")
    .loops(1)
    .transitionalItem("ae2:cell_component_1k");

  create
    .sequenced_assembly("ae2:cell_component_4k", "ae2:cell_component_1k", [
      vintageimprovements.polishing("ae2:cell_component_1k", "ae2:cell_component_1k"),
      vintageimprovements.vacuumizing("ae2:cell_component_1k", [
        "ae2:cell_component_1k",
        "#forge:dusts/redstone",
      ]),
      create.deploying("ae2:cell_component_1k", ["ae2:cell_component_1k", "ae2:cell_component_1k"]),
      create.deploying("ae2:cell_component_1k", [
        "ae2:cell_component_1k",
        "ae2:calculation_processor",
      ]),
      create.deploying("ae2:cell_component_1k", ["ae2:cell_component_1k", "ae2:quartz_glass"]),
      vintageimprovements
        .curving("ae2:cell_component_1k", "ae2:cell_component_1k")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_4k_C")
    .loops(1)
    .transitionalItem("ae2:cell_component_1k");

  create
    .sequenced_assembly("ae2:cell_component_4k", "ae2:cell_component_1k", [
      vintageimprovements.polishing("ae2:cell_component_1k", "ae2:cell_component_1k"),
      create.deploying("ae2:cell_component_1k", ["ae2:cell_component_1k", "#forge:dusts/redstone"]),
      create.deploying("ae2:cell_component_1k", ["ae2:cell_component_1k", "#forge:dusts/redstone"]),
      create.deploying("ae2:cell_component_1k", ["ae2:cell_component_1k", "ae2:cell_component_1k"]),
      create.deploying("ae2:cell_component_1k", [
        "ae2:cell_component_1k",
        "ae2:calculation_processor",
      ]),
      create.deploying("ae2:cell_component_1k", [
        "ae2:cell_component_1k",
        "createdelight:quartz_glass_parts",
      ]),
      vintageimprovements
        .curving("ae2:cell_component_1k", "ae2:cell_component_1k")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_4k_D")
    .loops(1)
    .transitionalItem("ae2:cell_component_1k");

  create
    .sequenced_assembly("ae2:cell_component_4k", "ae2:cell_component_1k", [
      vintageimprovements.polishing("ae2:cell_component_1k", "ae2:cell_component_1k"),
      create.deploying("ae2:cell_component_1k", [
        "ae2:cell_component_1k",
        "createdelight:redstone_paste",
      ]),
      create.deploying("ae2:cell_component_1k", ["ae2:cell_component_1k", "ae2:cell_component_1k"]),
      create.deploying("ae2:cell_component_1k", [
        "ae2:cell_component_1k",
        "ae2:calculation_processor",
      ]),
      create.deploying("ae2:cell_component_1k", [
        "ae2:cell_component_1k",
        "createdelight:quartz_glass_parts",
      ]),
      vintageimprovements
        .curving("ae2:cell_component_1k", "ae2:cell_component_1k")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_4k_E")
    .loops(1)
    .transitionalItem("ae2:cell_component_1k");

  create
    .sequenced_assembly("ae2:cell_component_4k", "ae2:cell_component_1k", [
      vintageimprovements.polishing("ae2:cell_component_1k", "ae2:cell_component_1k"),
      vintageimprovements.vacuumizing("ae2:certus_quartz_crystal", [
        "ae2:certus_quartz_crystal",
        "#forge:dusts/redstone",
      ]),
      create.deploying("ae2:cell_component_1k", ["ae2:cell_component_1k", "ae2:cell_component_1k"]),
      create.deploying("ae2:cell_component_1k", [
        "ae2:cell_component_1k",
        "ae2:calculation_processor",
      ]),
      create.deploying("ae2:cell_component_1k", [
        "ae2:cell_component_1k",
        "createdelight:quartz_glass_parts",
      ]),
      vintageimprovements
        .curving("ae2:cell_component_1k", "ae2:cell_component_1k")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_4k_F")
    .loops(1)
    .transitionalItem("ae2:cell_component_1k");

  // 16K存储元件
  create
    .sequenced_assembly("ae2:cell_component_16k", "ae2:cell_component_4k", [
      vintageimprovements.polishing("ae2:cell_component_4k", "ae2:cell_component_4k"),
      create.deploying("ae2:cell_component_4k", [
        "ae2:cell_component_4k",
        "#forge:dusts/glowstone",
      ]),
      create.deploying("ae2:cell_component_4k", [
        "ae2:cell_component_4k",
        "#forge:dusts/glowstone",
      ]),
      create.deploying("ae2:cell_component_4k", [
        "ae2:cell_component_4k",
        "#forge:dusts/glowstone",
      ]),
      create.deploying("ae2:cell_component_4k", [
        "ae2:cell_component_4k",
        "#forge:dusts/glowstone",
      ]),
      create.deploying("ae2:cell_component_4k", ["ae2:cell_component_4k", "ae2:cell_component_4k"]),
      create.deploying("ae2:cell_component_4k", [
        "ae2:cell_component_4k",
        "ae2:calculation_processor",
      ]),
      create.deploying("ae2:cell_component_4k", ["ae2:cell_component_4k", "ae2:quartz_glass"]),
      vintageimprovements
        .curving("ae2:cell_component_4k", "ae2:cell_component_4k")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_16k_A")
    .loops(1)
    .transitionalItem("ae2:cell_component_4k");

  create
    .sequenced_assembly("ae2:cell_component_16k", "ae2:cell_component_4k", [
      vintageimprovements.polishing("ae2:cell_component_4k", "ae2:cell_component_4k"),
      create.deploying("ae2:cell_component_4k", [
        "ae2:cell_component_4k",
        "createdelight:glowstone_paste",
      ]),
      create.deploying("ae2:cell_component_4k", [
        "ae2:cell_component_4k",
        "createdelight:glowstone_paste",
      ]),
      create.deploying("ae2:cell_component_4k", ["ae2:cell_component_4k", "ae2:cell_component_4k"]),
      create.deploying("ae2:cell_component_4k", [
        "ae2:cell_component_4k",
        "ae2:calculation_processor",
      ]),
      create.deploying("ae2:cell_component_4k", ["ae2:cell_component_4k", "ae2:quartz_glass"]),
      vintageimprovements
        .curving("ae2:cell_component_4k", "ae2:cell_component_4k")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_16k_B")
    .loops(1)
    .transitionalItem("ae2:cell_component_4k");

  create
    .sequenced_assembly("ae2:cell_component_16k", "ae2:cell_component_4k", [
      vintageimprovements.polishing("ae2:cell_component_4k", "ae2:cell_component_4k"),
      vintageimprovements.vacuumizing("ae2:cell_component_4k", [
        "ae2:cell_component_4k",
        "#forge:dusts/glowstone",
        "#forge:dusts/glowstone",
      ]),
      create.deploying("ae2:cell_component_4k", ["ae2:cell_component_4k", "ae2:cell_component_4k"]),
      create.deploying("ae2:cell_component_4k", [
        "ae2:cell_component_4k",
        "ae2:calculation_processor",
      ]),
      create.deploying("ae2:cell_component_4k", ["ae2:cell_component_4k", "ae2:quartz_glass"]),
      vintageimprovements
        .curving("ae2:cell_component_4k", "ae2:cell_component_4k")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_16k_C")
    .loops(1)
    .transitionalItem("ae2:cell_component_4k");

  create
    .sequenced_assembly("ae2:cell_component_16k", "ae2:cell_component_4k", [
      vintageimprovements.polishing("ae2:cell_component_4k", "ae2:cell_component_4k"),
      create.deploying("ae2:cell_component_4k", [
        "ae2:cell_component_4k",
        "#forge:dusts/glowstone",
      ]),
      create.deploying("ae2:cell_component_4k", [
        "ae2:cell_component_4k",
        "#forge:dusts/glowstone",
      ]),
      create.deploying("ae2:cell_component_4k", [
        "ae2:cell_component_4k",
        "#forge:dusts/glowstone",
      ]),
      create.deploying("ae2:cell_component_4k", [
        "ae2:cell_component_4k",
        "#forge:dusts/glowstone",
      ]),
      create.deploying("ae2:cell_component_4k", ["ae2:cell_component_4k", "ae2:cell_component_4k"]),
      create.deploying("ae2:cell_component_4k", [
        "ae2:cell_component_4k",
        "ae2:calculation_processor",
      ]),
      create.deploying("ae2:cell_component_4k", [
        "ae2:cell_component_4k",
        "createdelight:quartz_glass_parts",
      ]),
      vintageimprovements
        .curving("ae2:cell_component_4k", "ae2:cell_component_4k")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_16k_D")
    .loops(1)
    .transitionalItem("ae2:cell_component_4k");

  create
    .sequenced_assembly("ae2:cell_component_16k", "ae2:cell_component_4k", [
      vintageimprovements.polishing("ae2:cell_component_4k", "ae2:cell_component_4k"),
      create.deploying("ae2:cell_component_4k", [
        "ae2:cell_component_4k",
        "createdelight:glowstone_paste",
      ]),
      create.deploying("ae2:cell_component_4k", [
        "ae2:cell_component_4k",
        "createdelight:glowstone_paste",
      ]),
      create.deploying("ae2:cell_component_4k", ["ae2:cell_component_4k", "ae2:cell_component_4k"]),
      create.deploying("ae2:cell_component_4k", [
        "ae2:cell_component_4k",
        "ae2:calculation_processor",
      ]),
      create.deploying("ae2:cell_component_4k", [
        "ae2:cell_component_4k",
        "createdelight:quartz_glass_parts",
      ]),
      vintageimprovements
        .curving("ae2:cell_component_4k", "ae2:cell_component_4k")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_16k_E")
    .loops(1)
    .transitionalItem("ae2:cell_component_4k");

  create
    .sequenced_assembly("ae2:cell_component_16k", "ae2:cell_component_4k", [
      vintageimprovements.polishing("ae2:cell_component_4k", "ae2:cell_component_4k"),
      vintageimprovements.vacuumizing("ae2:cell_component_4k", [
        "ae2:cell_component_4k",
        "#forge:dusts/glowstone",
        "#forge:dusts/glowstone",
      ]),
      create.deploying("ae2:cell_component_4k", ["ae2:cell_component_4k", "ae2:cell_component_4k"]),
      create.deploying("ae2:cell_component_4k", [
        "ae2:cell_component_4k",
        "ae2:calculation_processor",
      ]),
      create.deploying("ae2:cell_component_4k", [
        "ae2:cell_component_4k",
        "createdelight:quartz_glass_parts",
      ]),
      vintageimprovements
        .curving("ae2:cell_component_4k", "ae2:cell_component_4k")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_16k_F")
    .loops(1)
    .transitionalItem("ae2:cell_component_4k");

  // 64K存储元件
  create
    .sequenced_assembly("ae2:cell_component_64k", "ae2:cell_component_16k", [
      vintageimprovements.polishing("ae2:cell_component_4k", "ae2:cell_component_16k"),
      create.deploying("ae2:cell_component_16k", [
        "ae2:cell_component_16k",
        "#forge:dusts/glowstone",
      ]),
      create.deploying("ae2:cell_component_16k", [
        "ae2:cell_component_16k",
        "#forge:dusts/glowstone",
      ]),
      create.deploying("ae2:cell_component_16k", [
        "ae2:cell_component_16k",
        "#forge:dusts/glowstone",
      ]),
      create.deploying("ae2:cell_component_16k", [
        "ae2:cell_component_16k",
        "#forge:dusts/glowstone",
      ]),
      create.deploying("ae2:cell_component_16k", [
        "ae2:cell_component_16k",
        "ae2:cell_component_16k",
      ]),
      create.deploying("ae2:cell_component_16k", [
        "ae2:cell_component_16k",
        "ae2:calculation_processor",
      ]),
      create.deploying("ae2:cell_component_16k", ["ae2:cell_component_16k", "ae2:quartz_glass"]),
      vintageimprovements
        .curving("ae2:cell_component_16k", "ae2:cell_component_16k")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_64k_A")
    .loops(1)
    .transitionalItem("ae2:cell_component_16k");

  create
    .sequenced_assembly("ae2:cell_component_64k", "ae2:cell_component_16k", [
      vintageimprovements.polishing("ae2:cell_component_16k", "ae2:cell_component_16k"),
      create.deploying("ae2:cell_component_16k", [
        "ae2:cell_component_16k",
        "createdelight:glowstone_paste",
      ]),
      create.deploying("ae2:cell_component_16k", [
        "ae2:cell_component_16k",
        "createdelight:glowstone_paste",
      ]),
      create.deploying("ae2:cell_component_16k", [
        "ae2:cell_component_16k",
        "ae2:cell_component_16k",
      ]),
      create.deploying("ae2:cell_component_16k", [
        "ae2:cell_component_16k",
        "ae2:calculation_processor",
      ]),
      create.deploying("ae2:cell_component_16k", ["ae2:cell_component_16k", "ae2:quartz_glass"]),
      vintageimprovements
        .curving("ae2:cell_component_16k", "ae2:cell_component_16k")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_64k_B")
    .loops(1)
    .transitionalItem("ae2:cell_component_16k");

  create
    .sequenced_assembly("ae2:cell_component_64k", "ae2:cell_component_16k", [
      vintageimprovements.polishing("ae2:cell_component_16k", "ae2:cell_component_16k"),
      vintageimprovements.vacuumizing("ae2:cell_component_16k", [
        "ae2:cell_component_16k",
        "#forge:dusts/glowstone",
        "#forge:dusts/glowstone",
      ]),
      create.deploying("ae2:cell_component_16k", [
        "ae2:cell_component_16k",
        "ae2:cell_component_16k",
      ]),
      create.deploying("ae2:cell_component_16k", [
        "ae2:cell_component_16k",
        "ae2:calculation_processor",
      ]),
      create.deploying("ae2:cell_component_16k", ["ae2:cell_component_16k", "ae2:quartz_glass"]),
      vintageimprovements
        .curving("ae2:cell_component_16k", "ae2:cell_component_16k")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_64k_C")
    .loops(1)
    .transitionalItem("ae2:cell_component_16k");

  create
    .sequenced_assembly("ae2:cell_component_64k", "ae2:cell_component_16k", [
      vintageimprovements.polishing("ae2:cell_component_16k", "ae2:cell_component_16k"),
      create.deploying("ae2:cell_component_16k", [
        "ae2:cell_component_16k",
        "#forge:dusts/glowstone",
      ]),
      create.deploying("ae2:cell_component_16k", [
        "ae2:cell_component_16k",
        "#forge:dusts/glowstone",
      ]),
      create.deploying("ae2:cell_component_16k", [
        "ae2:cell_component_16k",
        "#forge:dusts/glowstone",
      ]),
      create.deploying("ae2:cell_component_16k", [
        "ae2:cell_component_16k",
        "#forge:dusts/glowstone",
      ]),
      create.deploying("ae2:cell_component_16k", [
        "ae2:cell_component_16k",
        "ae2:cell_component_16k",
      ]),
      create.deploying("ae2:cell_component_16k", [
        "ae2:cell_component_16k",
        "ae2:calculation_processor",
      ]),
      create.deploying("ae2:cell_component_16k", [
        "ae2:cell_component_16k",
        "createdelight:quartz_glass_parts",
      ]),
      vintageimprovements
        .curving("ae2:cell_component_16k", "ae2:cell_component_16k")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_64k_D")
    .loops(1)
    .transitionalItem("ae2:cell_component_16k");

  create
    .sequenced_assembly("ae2:cell_component_64k", "ae2:cell_component_16k", [
      vintageimprovements.polishing("ae2:cell_component_16k", "ae2:cell_component_16k"),
      create.deploying("ae2:cell_component_16k", [
        "ae2:cell_component_16k",
        "createdelight:glowstone_paste",
      ]),
      create.deploying("ae2:cell_component_16k", [
        "ae2:cell_component_16k",
        "createdelight:glowstone_paste",
      ]),
      create.deploying("ae2:cell_component_16k", [
        "ae2:cell_component_16k",
        "ae2:cell_component_16k",
      ]),
      create.deploying("ae2:cell_component_16k", [
        "ae2:cell_component_16k",
        "ae2:calculation_processor",
      ]),
      create.deploying("ae2:cell_component_16k", [
        "ae2:cell_component_16k",
        "createdelight:quartz_glass_parts",
      ]),
      vintageimprovements
        .curving("ae2:cell_component_16k", "ae2:cell_component_16k")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_64k_E")
    .loops(1)
    .transitionalItem("ae2:cell_component_16k");

  create
    .sequenced_assembly("ae2:cell_component_64k", "ae2:cell_component_16k", [
      vintageimprovements.polishing("ae2:cell_component_16k", "ae2:cell_component_16k"),
      vintageimprovements.vacuumizing("ae2:cell_component_16k", [
        "ae2:cell_component_16k",
        "#forge:dusts/glowstone",
        "#forge:dusts/glowstone",
      ]),
      create.deploying("ae2:cell_component_16k", [
        "ae2:cell_component_16k",
        "ae2:cell_component_16k",
      ]),
      create.deploying("ae2:cell_component_16k", [
        "ae2:cell_component_16k",
        "ae2:calculation_processor",
      ]),
      create.deploying("ae2:cell_component_16k", [
        "ae2:cell_component_16k",
        "createdelight:quartz_glass_parts",
      ]),
      vintageimprovements
        .curving("ae2:cell_component_16k", "ae2:cell_component_16k")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_64k_F")
    .loops(1)
    .transitionalItem("ae2:cell_component_16k");

  // 256K存储元件
  create
    .sequenced_assembly("ae2:cell_component_256k", "ae2:cell_component_64k", [
      vintageimprovements.polishing("ae2:cell_component_64k", "ae2:cell_component_64k"),
      create.deploying("ae2:cell_component_64k", ["ae2:cell_component_64k", "ae2:sky_dust"]),
      create.deploying("ae2:cell_component_64k", ["ae2:cell_component_64k", "ae2:sky_dust"]),
      create.deploying("ae2:cell_component_64k", ["ae2:cell_component_64k", "ae2:sky_dust"]),
      create.deploying("ae2:cell_component_64k", ["ae2:cell_component_64k", "ae2:sky_dust"]),
      create.deploying("ae2:cell_component_64k", [
        "ae2:cell_component_64k",
        "ae2:cell_component_64k",
      ]),
      create.deploying("ae2:cell_component_64k", [
        "ae2:cell_component_64k",
        "ae2:calculation_processor",
      ]),
      create.deploying("ae2:cell_component_64k", ["ae2:cell_component_64k", "ae2:quartz_glass"]),
      vintageimprovements
        .curving("ae2:cell_component_64k", "ae2:cell_component_64k")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_256k_A")
    .loops(1)
    .transitionalItem("ae2:cell_component_64k");

  create
    .sequenced_assembly("ae2:cell_component_256k", "ae2:cell_component_64k", [
      vintageimprovements.polishing("ae2:cell_component_64k", "ae2:cell_component_64k"),
      create.deploying("ae2:cell_component_64k", [
        "ae2:cell_component_64k",
        "createdelight:sky_stone_paste",
      ]),
      create.deploying("ae2:cell_component_64k", [
        "ae2:cell_component_64k",
        "createdelight:sky_stone_paste",
      ]),
      create.deploying("ae2:cell_component_64k", [
        "ae2:cell_component_64k",
        "ae2:cell_component_64k",
      ]),
      create.deploying("ae2:cell_component_64k", [
        "ae2:cell_component_64k",
        "ae2:calculation_processor",
      ]),
      create.deploying("ae2:cell_component_64k", ["ae2:cell_component_64k", "ae2:quartz_glass"]),
      vintageimprovements
        .curving("ae2:cell_component_64k", "ae2:cell_component_64k")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_256k_B")
    .loops(1)
    .transitionalItem("ae2:cell_component_64k");

  create
    .sequenced_assembly("ae2:cell_component_256k", "ae2:cell_component_64k", [
      vintageimprovements.polishing("ae2:cell_component_64k", "ae2:cell_component_64k"),
      vintageimprovements.vacuumizing("ae2:cell_component_64k", [
        "ae2:cell_component_64k",
        "ae2:sky_dust",
        "ae2:sky_dust",
      ]),
      create.deploying("ae2:cell_component_64k", [
        "ae2:cell_component_64k",
        "ae2:cell_component_64k",
      ]),
      create.deploying("ae2:cell_component_64k", [
        "ae2:cell_component_64k",
        "ae2:calculation_processor",
      ]),
      create.deploying("ae2:cell_component_64k", ["ae2:cell_component_64k", "ae2:quartz_glass"]),
      vintageimprovements
        .curving("ae2:cell_component_64k", "ae2:cell_component_64k")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_256k_C")
    .loops(1)
    .transitionalItem("ae2:cell_component_64k");

  create
    .sequenced_assembly("ae2:cell_component_256k", "ae2:cell_component_64k", [
      vintageimprovements.polishing("ae2:cell_component_64k", "ae2:cell_component_64k"),
      create.deploying("ae2:cell_component_64k", ["ae2:cell_component_64k", "ae2:sky_dust"]),
      create.deploying("ae2:cell_component_64k", ["ae2:cell_component_64k", "ae2:sky_dust"]),
      create.deploying("ae2:cell_component_64k", ["ae2:cell_component_64k", "ae2:sky_dust"]),
      create.deploying("ae2:cell_component_64k", ["ae2:cell_component_64k", "ae2:sky_dust"]),
      create.deploying("ae2:cell_component_64k", [
        "ae2:cell_component_64k",
        "ae2:cell_component_64k",
      ]),
      create.deploying("ae2:cell_component_64k", [
        "ae2:cell_component_64k",
        "ae2:calculation_processor",
      ]),
      create.deploying("ae2:cell_component_64k", [
        "ae2:cell_component_64k",
        "createdelight:quartz_glass_parts",
      ]),
      vintageimprovements
        .curving("ae2:cell_component_64k", "ae2:cell_component_64k")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_256k_D")
    .loops(1)
    .transitionalItem("ae2:cell_component_64k");

  create
    .sequenced_assembly("ae2:cell_component_256k", "ae2:cell_component_64k", [
      vintageimprovements.polishing("ae2:cell_component_64k", "ae2:cell_component_64k"),
      create.deploying("ae2:cell_component_64k", [
        "ae2:cell_component_64k",
        "createdelight:sky_stone_paste",
      ]),
      create.deploying("ae2:cell_component_64k", [
        "ae2:cell_component_64k",
        "createdelight:sky_stone_paste",
      ]),
      create.deploying("ae2:cell_component_64k", [
        "ae2:cell_component_64k",
        "ae2:cell_component_64k",
      ]),
      create.deploying("ae2:cell_component_64k", [
        "ae2:cell_component_64k",
        "ae2:calculation_processor",
      ]),
      create.deploying("ae2:cell_component_64k", [
        "ae2:cell_component_64k",
        "createdelight:quartz_glass_parts",
      ]),
      vintageimprovements
        .curving("ae2:cell_component_64k", "ae2:cell_component_64k")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_256k_E")
    .loops(1)
    .transitionalItem("ae2:cell_component_64k");

  create
    .sequenced_assembly("ae2:cell_component_256k", "ae2:cell_component_64k", [
      vintageimprovements.polishing("ae2:cell_component_64k", "ae2:cell_component_64k"),
      vintageimprovements.vacuumizing("ae2:cell_component_64k", [
        "ae2:cell_component_64k",
        "ae2:sky_dust",
        "ae2:sky_dust",
      ]),
      create.deploying("ae2:cell_component_64k", [
        "ae2:cell_component_64k",
        "ae2:cell_component_64k",
      ]),
      create.deploying("ae2:cell_component_64k", [
        "ae2:cell_component_64k",
        "ae2:calculation_processor",
      ]),
      create.deploying("ae2:cell_component_64k", [
        "ae2:cell_component_64k",
        "createdelight:quartz_glass_parts",
      ]),
      vintageimprovements
        .curving("ae2:cell_component_64k", "ae2:cell_component_64k")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_256k_F")
    .loops(1)
    .transitionalItem("ae2:cell_component_64k");

  //1M存储组件
  create
    .sequenced_assembly("megacells:cell_component_1m", "ae2:cell_component_256k", [
      vintageimprovements.polishing("ae2:cell_component_256k", "ae2:cell_component_256k"),
      create.deploying("ae2:cell_component_256k", ["ae2:cell_component_256k", "ae2:sky_dust"]),
      create.deploying("ae2:cell_component_256k", ["ae2:cell_component_256k", "ae2:sky_dust"]),
      create.deploying("ae2:cell_component_256k", ["ae2:cell_component_256k", "ae2:sky_dust"]),
      create.deploying("ae2:cell_component_256k", ["ae2:cell_component_256k", "ae2:sky_dust"]),
      create.deploying("ae2:cell_component_256k", [
        "ae2:cell_component_256k",
        "ae2:cell_component_256k",
      ]),
      create.deploying("megacells:cell_component_1m", [
        "megacells:cell_component_1m",
        "megacells:accumulation_processor",
      ]),
      create.deploying("ae2:cell_component_256k", [
        "ae2:cell_component_256k",
        "ae2:quartz_vibrant_glass",
      ]),
      vintageimprovements
        .curving("ae2:cell_component_256k", "ae2:cell_component_256k")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_1m_A")
    .loops(1)
    .transitionalItem("ae2:cell_component_256k");

  create
    .sequenced_assembly("megacells:cell_component_1m", "ae2:cell_component_256k", [
      vintageimprovements.polishing("ae2:cell_component_256k", "ae2:cell_component_256k"),
      create.deploying("ae2:cell_component_256k", [
        "ae2:cell_component_256k",
        "createdelight:sky_stone_paste",
      ]),
      create.deploying("ae2:cell_component_256k", [
        "ae2:cell_component_256k",
        "createdelight:sky_stone_paste",
      ]),
      create.deploying("ae2:cell_component_256k", [
        "ae2:cell_component_256k",
        "ae2:cell_component_256k",
      ]),
      create.deploying("megacells:cell_component_1m", [
        "megacells:cell_component_1m",
        "megacells:accumulation_processor",
      ]),
      create.deploying("ae2:cell_component_256k", [
        "ae2:cell_component_256k",
        "ae2:quartz_vibrant_glass",
      ]),
      vintageimprovements
        .curving("ae2:cell_component_256k", "ae2:cell_component_256k")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_1m_B")
    .loops(1)
    .transitionalItem("ae2:cell_component_256k");

  create
    .sequenced_assembly("megacells:cell_component_1m", "ae2:cell_component_256k", [
      vintageimprovements.polishing("ae2:cell_component_256k", "ae2:cell_component_256k"),
      vintageimprovements.vacuumizing("ae2:cell_component_256k", [
        "ae2:cell_component_256k",
        "ae2:sky_dust",
        "ae2:sky_dust",
      ]),
      create.deploying("ae2:cell_component_256k", [
        "ae2:cell_component_256k",
        "ae2:cell_component_256k",
      ]),
      create.deploying("megacells:cell_component_1m", [
        "megacells:cell_component_1m",
        "megacells:accumulation_processor",
      ]),
      create.deploying("ae2:cell_component_256k", [
        "ae2:cell_component_256k",
        "ae2:quartz_vibrant_glass",
      ]),
      vintageimprovements
        .curving("ae2:cell_component_256k", "ae2:cell_component_256k")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_1m_C")
    .loops(1)
    .transitionalItem("ae2:cell_component_256k");

  create
    .sequenced_assembly("megacells:cell_component_1m", "ae2:cell_component_256k", [
      vintageimprovements.polishing("ae2:cell_component_256k", "ae2:cell_component_256k"),
      create.deploying("ae2:cell_component_256k", ["ae2:cell_component_256k", "ae2:sky_dust"]),
      create.deploying("ae2:cell_component_256k", ["ae2:cell_component_256k", "ae2:sky_dust"]),
      create.deploying("ae2:cell_component_256k", ["ae2:cell_component_256k", "ae2:sky_dust"]),
      create.deploying("ae2:cell_component_256k", ["ae2:cell_component_256k", "ae2:sky_dust"]),
      create.deploying("ae2:cell_component_256k", [
        "ae2:cell_component_256k",
        "ae2:cell_component_256k",
      ]),
      create.deploying("megacells:cell_component_1m", [
        "megacells:cell_component_1m",
        "megacells:accumulation_processor",
      ]),
      create.deploying("ae2:cell_component_256k", [
        "ae2:cell_component_256k",
        "createdelight:quartz_vibrant_glass_parts",
      ]),
      vintageimprovements
        .curving("ae2:cell_component_256k", "ae2:cell_component_256k")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_1m_D")
    .loops(1)
    .transitionalItem("ae2:cell_component_256k");

  create
    .sequenced_assembly("megacells:cell_component_1m", "ae2:cell_component_256k", [
      vintageimprovements.polishing("ae2:cell_component_256k", "ae2:cell_component_256k"),
      create.deploying("ae2:cell_component_256k", [
        "ae2:cell_component_256k",
        "createdelight:sky_stone_paste",
      ]),
      create.deploying("ae2:cell_component_256k", [
        "ae2:cell_component_256k",
        "createdelight:sky_stone_paste",
      ]),
      create.deploying("ae2:cell_component_256k", [
        "ae2:cell_component_256k",
        "ae2:cell_component_256k",
      ]),
      create.deploying("megacells:cell_component_1m", [
        "megacells:cell_component_1m",
        "megacells:accumulation_processor",
      ]),
      create.deploying("ae2:cell_component_256k", [
        "ae2:cell_component_256k",
        "createdelight:quartz_vibrant_glass_parts",
      ]),
      vintageimprovements
        .curving("ae2:cell_component_256k", "ae2:cell_component_256k")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_1m_E")
    .loops(1)
    .transitionalItem("ae2:cell_component_256k");

  create
    .sequenced_assembly("megacells:cell_component_1m", "ae2:cell_component_256k", [
      vintageimprovements.polishing("ae2:cell_component_256k", "ae2:cell_component_256k"),
      vintageimprovements.vacuumizing("ae2:cell_component_256k", [
        "ae2:cell_component_256k",
        "ae2:sky_dust",
        "ae2:sky_dust",
      ]),
      create.deploying("ae2:cell_component_256k", [
        "ae2:cell_component_256k",
        "ae2:cell_component_256k",
      ]),
      create.deploying("megacells:cell_component_1m", [
        "megacells:cell_component_1m",
        "megacells:accumulation_processor",
      ]),
      create.deploying("ae2:cell_component_256k", [
        "ae2:cell_component_256k",
        "createdelight:quartz_vibrant_glass_parts",
      ]),
      vintageimprovements
        .curving("ae2:cell_component_256k", "ae2:cell_component_256k")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_1m_F")
    .loops(1)
    .transitionalItem("ae2:cell_component_256k");

  // 4M存储组件
  create
    .sequenced_assembly("megacells:cell_component_4m", "megacells:cell_component_1m", [
      vintageimprovements.polishing("megacells:cell_component_1m", "megacells:cell_component_1m"),
      create.deploying("megacells:cell_component_1m", [
        "megacells:cell_component_1m",
        "#forge:dusts/ender_pearl",
      ]),
      create.deploying("megacells:cell_component_1m", [
        "megacells:cell_component_1m",
        "#forge:dusts/ender_pearl",
      ]),
      create.deploying("megacells:cell_component_1m", [
        "megacells:cell_component_1m",
        "#forge:dusts/ender_pearl",
      ]),
      create.deploying("megacells:cell_component_1m", [
        "megacells:cell_component_1m",
        "#forge:dusts/ender_pearl",
      ]),
      create.deploying("megacells:cell_component_1m", [
        "megacells:cell_component_1m",
        "megacells:cell_component_1m",
      ]),
      create.deploying("megacells:cell_component_1m", [
        "megacells:cell_component_1m",
        "megacells:accumulation_processor",
      ]),
      create.deploying("megacells:cell_component_1m", [
        "megacells:cell_component_1m",
        "ae2:quartz_vibrant_glass",
      ]),
      vintageimprovements
        .curving("megacells:cell_component_1m", "megacells:cell_component_1m")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_4m_A")
    .loops(1)
    .transitionalItem("megacells:cell_component_1m");

  create
    .sequenced_assembly("megacells:cell_component_4m", "megacells:cell_component_1m", [
      vintageimprovements.polishing("megacells:cell_component_1m", "megacells:cell_component_1m"),
      vintageimprovements.vacuumizing("megacells:cell_component_1m", [
        "megacells:cell_component_1m",
        "#forge:dusts/ender_pearl",
        "#forge:dusts/ender_pearl",
      ]),
      create.deploying("megacells:cell_component_1m", [
        "megacells:cell_component_1m",
        "megacells:cell_component_1m",
      ]),
      create.deploying("megacells:cell_component_1m", [
        "megacells:cell_component_1m",
        "megacells:accumulation_processor",
      ]),
      create.deploying("megacells:cell_component_1m", [
        "megacells:cell_component_1m",
        "ae2:quartz_vibrant_glass",
      ]),
      vintageimprovements
        .curving("megacells:cell_component_1m", "megacells:cell_component_1m")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_4m_C")
    .loops(1)
    .transitionalItem("megacells:cell_component_1m");

  create
    .sequenced_assembly("megacells:cell_component_4m", "megacells:cell_component_1m", [
      vintageimprovements.polishing("megacells:cell_component_1m", "megacells:cell_component_1m"),
      create.deploying("megacells:cell_component_1m", [
        "megacells:cell_component_1m",
        "#forge:dusts/ender_pearl",
      ]),
      create.deploying("megacells:cell_component_1m", [
        "megacells:cell_component_1m",
        "#forge:dusts/ender_pearl",
      ]),
      create.deploying("megacells:cell_component_1m", [
        "megacells:cell_component_1m",
        "#forge:dusts/ender_pearl",
      ]),
      create.deploying("megacells:cell_component_1m", [
        "megacells:cell_component_1m",
        "#forge:dusts/ender_pearl",
      ]),
      create.deploying("megacells:cell_component_1m", [
        "megacells:cell_component_1m",
        "megacells:cell_component_1m",
      ]),
      create.deploying("megacells:cell_component_1m", [
        "megacells:cell_component_1m",
        "megacells:accumulation_processor",
      ]),
      create.deploying("megacells:cell_component_1m", [
        "megacells:cell_component_1m",
        "createdelight:quartz_vibrant_glass_parts",
      ]),
      vintageimprovements
        .curving("megacells:cell_component_1m", "megacells:cell_component_1m")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_4m_D")
    .loops(1)
    .transitionalItem("megacells:cell_component_1m");

  create
    .sequenced_assembly("megacells:cell_component_4m", "megacells:cell_component_1m", [
      vintageimprovements.polishing("megacells:cell_component_1m", "megacells:cell_component_1m"),
      vintageimprovements.vacuumizing("megacells:cell_component_1m", [
        "megacells:cell_component_1m",
        "#forge:dusts/ender_pearl",
        "#forge:dusts/ender_pearl",
      ]),
      create.deploying("megacells:cell_component_1m", [
        "megacells:cell_component_1m",
        "megacells:accumulation_processor",
      ]),
      create.deploying("megacells:cell_component_1m", [
        "megacells:cell_component_1m",
        "megacells:cell_component_1m",
      ]),
      create.deploying("megacells:cell_component_1m", [
        "megacells:cell_component_1m",
        "createdelight:quartz_vibrant_glass_parts",
      ]),
      vintageimprovements
        .curving("megacells:cell_component_1m", "megacells:cell_component_1m")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_4m_F")
    .loops(1)
    .transitionalItem("megacells:cell_component_1m");

  // 16M存储组件
  create
    .sequenced_assembly("megacells:cell_component_16m", "megacells:cell_component_4m", [
      vintageimprovements.polishing("megacells:cell_component_4m", "megacells:cell_component_4m"),
      create.deploying("megacells:cell_component_4m", [
        "megacells:cell_component_4m",
        "#forge:dusts/ender_pearl",
      ]),
      create.deploying("megacells:cell_component_4m", [
        "megacells:cell_component_4m",
        "#forge:dusts/ender_pearl",
      ]),
      create.deploying("megacells:cell_component_4m", [
        "megacells:cell_component_4m",
        "#forge:dusts/ender_pearl",
      ]),
      create.deploying("megacells:cell_component_4m", [
        "megacells:cell_component_4m",
        "#forge:dusts/ender_pearl",
      ]),
      create.deploying("megacells:cell_component_4m", [
        "megacells:cell_component_4m",
        "megacells:cell_component_4m",
      ]),
      create.deploying("megacells:cell_component_4m", [
        "megacells:cell_component_4m",
        "megacells:accumulation_processor",
      ]),
      create.deploying("megacells:cell_component_4m", [
        "megacells:cell_component_4m",
        "ae2:quartz_vibrant_glass",
      ]),
      vintageimprovements
        .curving("megacells:cell_component_4m", "megacells:cell_component_4m")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_16m_A")
    .loops(1)
    .transitionalItem("megacells:cell_component_4m");

  create
    .sequenced_assembly("megacells:cell_component_16m", "megacells:cell_component_4m", [
      vintageimprovements.polishing("megacells:cell_component_4m", "megacells:cell_component_4m"),
      vintageimprovements.vacuumizing("megacells:cell_component_4m", [
        "megacells:cell_component_4m",
        "#forge:dusts/ender_pearl",
        "#forge:dusts/ender_pearl",
      ]),
      create.deploying("megacells:cell_component_4m", [
        "megacells:cell_component_4m",
        "megacells:cell_component_4m",
      ]),
      create.deploying("megacells:cell_component_4m", [
        "megacells:cell_component_4m",
        "megacells:accumulation_processor",
      ]),
      create.deploying("megacells:cell_component_4m", [
        "megacells:cell_component_4m",
        "ae2:quartz_vibrant_glass",
      ]),
      vintageimprovements
        .curving("megacells:cell_component_4m", "megacells:cell_component_4m")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_16m_C")
    .loops(1)
    .transitionalItem("megacells:cell_component_4m");

  create
    .sequenced_assembly("megacells:cell_component_16m", "megacells:cell_component_4m", [
      vintageimprovements.polishing("megacells:cell_component_4m", "megacells:cell_component_4m"),
      create.deploying("megacells:cell_component_4m", [
        "megacells:cell_component_4m",
        "#forge:dusts/ender_pearl",
      ]),
      create.deploying("megacells:cell_component_4m", [
        "megacells:cell_component_4m",
        "#forge:dusts/ender_pearl",
      ]),
      create.deploying("megacells:cell_component_4m", [
        "megacells:cell_component_4m",
        "#forge:dusts/ender_pearl",
      ]),
      create.deploying("megacells:cell_component_4m", [
        "megacells:cell_component_4m",
        "#forge:dusts/ender_pearl",
      ]),
      create.deploying("megacells:cell_component_4m", [
        "megacells:cell_component_4m",
        "megacells:cell_component_4m",
      ]),
      create.deploying("megacells:cell_component_4m", [
        "megacells:cell_component_4m",
        "megacells:accumulation_processor",
      ]),
      create.deploying("megacells:cell_component_4m", [
        "megacells:cell_component_4m",
        "createdelight:quartz_vibrant_glass_parts",
      ]),
      vintageimprovements
        .curving("megacells:cell_component_4m", "megacells:cell_component_4m")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_16m_D")
    .loops(1)
    .transitionalItem("megacells:cell_component_4m");

  create
    .sequenced_assembly("megacells:cell_component_16m", "megacells:cell_component_4m", [
      vintageimprovements.polishing("megacells:cell_component_4m", "megacells:cell_component_4m"),
      vintageimprovements.vacuumizing("megacells:cell_component_4m", [
        "megacells:cell_component_4m",
        "#forge:dusts/ender_pearl",
        "#forge:dusts/ender_pearl",
      ]),
      create.deploying("megacells:cell_component_4m", [
        "megacells:cell_component_4m",
        "megacells:accumulation_processor",
      ]),
      create.deploying("megacells:cell_component_4m", [
        "megacells:cell_component_4m",
        "megacells:cell_component_4m",
      ]),
      create.deploying("megacells:cell_component_4m", [
        "megacells:cell_component_4m",
        "createdelight:quartz_vibrant_glass_parts",
      ]),
      vintageimprovements
        .curving("megacells:cell_component_4m", "megacells:cell_component_4m")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_16m_F")
    .loops(1)
    .transitionalItem("megacells:cell_component_4m");

  // 64M存储组件
  create
    .sequenced_assembly("megacells:cell_component_64m", "megacells:cell_component_16m", [
      vintageimprovements.polishing("megacells:cell_component_16m", "megacells:cell_component_16m"),
      create.deploying("megacells:cell_component_16m", [
        "megacells:cell_component_16m",
        "ae2:matter_ball",
      ]),
      create.deploying("megacells:cell_component_16m", [
        "megacells:cell_component_16m",
        "ae2:matter_ball",
      ]),
      create.deploying("megacells:cell_component_16m", [
        "megacells:cell_component_16m",
        "ae2:matter_ball",
      ]),
      create.deploying("megacells:cell_component_16m", [
        "megacells:cell_component_16m",
        "ae2:matter_ball",
      ]),
      create.deploying("megacells:cell_component_16m", [
        "megacells:cell_component_16m",
        "megacells:cell_component_16m",
      ]),
      create.deploying("megacells:cell_component_16m", [
        "megacells:cell_component_16m",
        "megacells:accumulation_processor",
      ]),
      create.deploying("megacells:cell_component_16m", [
        "megacells:cell_component_16m",
        "ae2:quartz_vibrant_glass",
      ]),
      vintageimprovements
        .curving("megacells:cell_component_16m", "megacells:cell_component_16m")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_64m_A")
    .loops(1)
    .transitionalItem("megacells:cell_component_16m");

  create
    .sequenced_assembly("megacells:cell_component_64m", "megacells:cell_component_16m", [
      vintageimprovements.polishing("megacells:cell_component_16m", "megacells:cell_component_16m"),
      vintageimprovements.vacuumizing("megacells:cell_component_16m", [
        "megacells:cell_component_16m",
        "ae2:matter_ball",
        "ae2:matter_ball",
      ]),
      create.deploying("megacells:cell_component_16m", [
        "megacells:cell_component_16m",
        "megacells:cell_component_16m",
      ]),
      create.deploying("megacells:cell_component_16m", [
        "megacells:cell_component_16m",
        "megacells:accumulation_processor",
      ]),
      create.deploying("megacells:cell_component_16m", [
        "megacells:cell_component_16m",
        "ae2:quartz_vibrant_glass",
      ]),
      vintageimprovements
        .curving("megacells:cell_component_16m", "megacells:cell_component_16m")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_64m_C")
    .loops(1)
    .transitionalItem("megacells:cell_component_16m");

  create
    .sequenced_assembly("megacells:cell_component_64m", "megacells:cell_component_16m", [
      vintageimprovements.polishing("megacells:cell_component_16m", "megacells:cell_component_16m"),
      create.deploying("megacells:cell_component_16m", [
        "megacells:cell_component_16m",
        "ae2:matter_ball",
      ]),
      create.deploying("megacells:cell_component_16m", [
        "megacells:cell_component_16m",
        "ae2:matter_ball",
      ]),
      create.deploying("megacells:cell_component_16m", [
        "megacells:cell_component_16m",
        "ae2:matter_ball",
      ]),
      create.deploying("megacells:cell_component_16m", [
        "megacells:cell_component_16m",
        "ae2:matter_ball",
      ]),
      create.deploying("megacells:cell_component_16m", [
        "megacells:cell_component_16m",
        "megacells:cell_component_16m",
      ]),
      create.deploying("megacells:cell_component_16m", [
        "megacells:cell_component_16m",
        "megacells:accumulation_processor",
      ]),
      create.deploying("megacells:cell_component_16m", [
        "megacells:cell_component_16m",
        "createdelight:quartz_vibrant_glass_parts",
      ]),
      vintageimprovements
        .curving("megacells:cell_component_16m", "megacells:cell_component_16m")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_64m_D")
    .loops(1)
    .transitionalItem("megacells:cell_component_16m");

  create
    .sequenced_assembly("megacells:cell_component_64m", "megacells:cell_component_16m", [
      vintageimprovements.polishing("megacells:cell_component_16m", "megacells:cell_component_16m"),
      vintageimprovements.vacuumizing("megacells:cell_component_16m", [
        "megacells:cell_component_16m",
        "ae2:matter_ball",
        "ae2:matter_ball",
      ]),
      create.deploying("megacells:cell_component_16m", [
        "megacells:cell_component_16m",
        "megacells:accumulation_processor",
      ]),
      create.deploying("megacells:cell_component_16m", [
        "megacells:cell_component_16m",
        "megacells:cell_component_16m",
      ]),
      create.deploying("megacells:cell_component_16m", [
        "megacells:cell_component_16m",
        "createdelight:quartz_vibrant_glass_parts",
      ]),
      vintageimprovements
        .curving("megacells:cell_component_16m", "megacells:cell_component_16m")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_64m_F")
    .loops(1)
    .transitionalItem("megacells:cell_component_16m");

  // 256M存储组件
  create
    .sequenced_assembly("megacells:cell_component_256m", "megacells:cell_component_64m", [
      vintageimprovements.polishing("megacells:cell_component_64m", "megacells:cell_component_64m"),
      create.deploying("megacells:cell_component_64m", [
        "megacells:cell_component_64m",
        "ae2:matter_ball",
      ]),
      create.deploying("megacells:cell_component_64m", [
        "megacells:cell_component_64m",
        "ae2:matter_ball",
      ]),
      create.deploying("megacells:cell_component_64m", [
        "megacells:cell_component_64m",
        "ae2:matter_ball",
      ]),
      create.deploying("megacells:cell_component_64m", [
        "megacells:cell_component_64m",
        "ae2:matter_ball",
      ]),
      create.deploying("megacells:cell_component_64m", [
        "megacells:cell_component_64m",
        "megacells:cell_component_64m",
      ]),

      create.deploying("megacells:cell_component_64m", [
        "megacells:cell_component_64m",
        "megacells:accumulation_processor",
      ]),
      create.deploying("megacells:cell_component_64m", [
        "megacells:cell_component_64m",
        "ae2:quartz_vibrant_glass",
      ]),
      vintageimprovements
        .curving("megacells:cell_component_64m", "megacells:cell_component_64m")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_256m_A")
    .loops(1)
    .transitionalItem("megacells:cell_component_64m");

  create
    .sequenced_assembly("megacells:cell_component_256m", "megacells:cell_component_64m", [
      vintageimprovements.polishing("megacells:cell_component_64m", "megacells:cell_component_64m"),
      vintageimprovements.vacuumizing("megacells:cell_component_64m", [
        "megacells:cell_component_64m",
        "ae2:matter_ball",
        "ae2:matter_ball",
      ]),
      create.deploying("megacells:cell_component_64m", [
        "megacells:cell_component_64m",
        "megacells:cell_component_64m",
      ]),

      create.deploying("megacells:cell_component_64m", [
        "megacells:cell_component_64m",
        "megacells:accumulation_processor",
      ]),
      create.deploying("megacells:cell_component_64m", [
        "megacells:cell_component_64m",
        "ae2:quartz_vibrant_glass",
      ]),
      vintageimprovements
        .curving("megacells:cell_component_64m", "megacells:cell_component_64m")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_256m_C")
    .loops(1)
    .transitionalItem("megacells:cell_component_64m");

  create
    .sequenced_assembly("megacells:cell_component_256m", "megacells:cell_component_64m", [
      vintageimprovements.polishing("megacells:cell_component_64m", "megacells:cell_component_64m"),
      create.deploying("megacells:cell_component_64m", [
        "megacells:cell_component_64m",
        "ae2:matter_ball",
      ]),
      create.deploying("megacells:cell_component_64m", [
        "megacells:cell_component_64m",
        "ae2:matter_ball",
      ]),
      create.deploying("megacells:cell_component_64m", [
        "megacells:cell_component_64m",
        "ae2:matter_ball",
      ]),
      create.deploying("megacells:cell_component_64m", [
        "megacells:cell_component_64m",
        "ae2:matter_ball",
      ]),
      create.deploying("megacells:cell_component_64m", [
        "megacells:cell_component_64m",
        "megacells:cell_component_64m",
      ]),
      create.deploying("megacells:cell_component_64m", [
        "megacells:cell_component_64m",
        "megacells:accumulation_processor",
      ]),
      create.deploying("megacells:cell_component_64m", [
        "megacells:cell_component_64m",
        "createdelight:quartz_vibrant_glass_parts",
      ]),
      vintageimprovements
        .curving("megacells:cell_component_64m", "megacells:cell_component_64m")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_256m_D")
    .loops(1)
    .transitionalItem("megacells:cell_component_64m");

  create
    .sequenced_assembly("megacells:cell_component_256m", "megacells:cell_component_64m", [
      vintageimprovements.polishing("megacells:cell_component_64m", "megacells:cell_component_64m"),
      vintageimprovements.vacuumizing("megacells:cell_component_64m", [
        "megacells:cell_component_64m",
        "ae2:matter_ball",
        "ae2:matter_ball",
      ]),
      create.deploying("megacells:cell_component_64m", [
        "megacells:cell_component_64m",
        "megacells:accumulation_processor",
      ]),
      create.deploying("megacells:cell_component_64m", [
        "megacells:cell_component_64m",
        "megacells:cell_component_64m",
      ]),
      create.deploying("megacells:cell_component_64m", [
        "megacells:cell_component_64m",
        "createdelight:quartz_vibrant_glass_parts",
      ]),
      vintageimprovements
        .curving("megacells:cell_component_64m", "megacells:cell_component_64m")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .id("createdelight:cell_component_256m_F")
    .loops(1)
    .transitionalItem("megacells:cell_component_64m");

  // 存储组件动力合成
  create
    .mechanical_crafting("ae2:cell_component_1k", ["ABA", "BCB", "ABA"], {
      A: "#forge:dusts/redstone",
      B: "#forge:gems/certus_quartz",
      C: "ae2:logic_processor",
    })
    .id("createdelight:mechanical_crafting_1k");
  create
    .mechanical_crafting("ae2:cell_component_4k", ["ABA", "CDC", "ACA"], {
      A: "#forge:dusts/redstone",
      B: "ae2:calculation_processor",
      C: "ae2:cell_component_1k",
      D: "ae2:quartz_glass",
    })
    .id("createdelight:mechanical_crafting_4k");
  create
    .mechanical_crafting("ae2:cell_component_16k", ["ABA", "CDC", "ACA"], {
      A: "#forge:dusts/glowstone",
      B: "ae2:calculation_processor",
      C: "ae2:cell_component_4k",
      D: "ae2:quartz_glass",
    })
    .id("createdelight:mechanical_crafting_16k");
  create
    .mechanical_crafting("ae2:cell_component_64k", ["ABA", "CDC", "ACA"], {
      A: "#forge:dusts/glowstone",
      B: "ae2:calculation_processor",
      C: "ae2:cell_component_16k",
      D: "ae2:quartz_glass",
    })
    .id("createdelight:mechanical_crafting_64k");
  create
    .mechanical_crafting("ae2:cell_component_256k", ["ABA", "CDC", "ACA"], {
      A: "ae2:sky_dust",
      B: "ae2:calculation_processor",
      C: "ae2:cell_component_64k",
      D: "ae2:quartz_glass",
    })
    .id("createdelight:mechanical_crafting_256k");
  create
    .mechanical_crafting("megacells:cell_component_1m", ["ABA", "CDC", "ACA"], {
      A: "ae2:sky_dust",
      B: "megacells:accumulation_processor",
      C: "ae2:cell_component_256k",
      D: "ae2:quartz_vibrant_glass",
    })
    .id("createdelight:mechanical_crafting_1m");
  create
    .mechanical_crafting("megacells:cell_component_4m", ["ABA", "CDC", "ACA"], {
      A: "#forge:dusts/ender_pearl",
      B: "megacells:accumulation_processor",
      C: "megacells:cell_component_1m",
      D: "ae2:quartz_vibrant_glass",
    })
    .id("createdelight:mechanical_crafting_4m");
  create
    .mechanical_crafting("megacells:cell_component_16m", ["ABA", "CDC", "ACA"], {
      A: "#forge:dusts/ender_pearl",
      B: "megacells:accumulation_processor",
      C: "megacells:cell_component_4m",
      D: "ae2:quartz_vibrant_glass",
    })
    .id("createdelight:mechanical_crafting_16m");
  create
    .mechanical_crafting("megacells:cell_component_64m", ["ABA", "CDC", "ACA"], {
      A: "ae2:matter_ball",
      B: "megacells:accumulation_processor",
      C: "megacells:cell_component_16m",
      D: "ae2:quartz_vibrant_glass",
    })
    .id("createdelight:mechanical_crafting_64m");
  create
    .mechanical_crafting("megacells:cell_component_256m", ["ABA", "CDC", "ACA"], {
      A: "ae2:matter_ball",
      B: "megacells:accumulation_processor",
      C: "megacells:cell_component_64m",
      D: "ae2:quartz_vibrant_glass",
    })
    .id("createdelight:mechanical_crafting_256m");

  event.remove({ id: "ae2:network/cells/item_storage_components_cell_1k_part" });
  event.remove({ id: "ae2:network/cells/item_storage_components_cell_4k_part" });
  event.remove({ id: "ae2:network/cells/item_storage_components_cell_16k_part" });
  event.remove({ id: "ae2:network/cells/item_storage_components_cell_64k_part" });
  event.remove({ id: "ae2:network/cells/item_storage_components_cell_256k_part" });
  event.remove({ id: "megacells:cells/cell_component_1m" });
  event.remove({ id: "megacells:cells/cell_component_4m" });
  event.remove({ id: "megacells:cells/cell_component_16m" });
  event.remove({ id: "megacells:cells/cell_component_64m" });
  event.remove({ id: "megacells:cells/cell_component_256m" });

  // 水晶修复器
  create
    .sequenced_assembly("expatternprovider:crystal_fixer", "#forge:storage_blocks/iron", [
      create.pressing("#forge:storage_blocks/iron", "#forge:storage_blocks/iron"),
      create.deploying("#forge:storage_blocks/iron", [
        "#forge:storage_blocks/iron",
        "#forge:gems/fluix",
      ]),
      create.deploying("#forge:storage_blocks/iron", [
        "#forge:storage_blocks/iron",
        "#forge:rods/iron",
      ]),
      create.deploying("#forge:storage_blocks/iron", [
        "#forge:storage_blocks/iron",
        "#forge:rods/iron",
      ]),
      create.deploying("#forge:storage_blocks/iron", [
        "#forge:storage_blocks/iron",
        "#forge:gems/certus_quartz",
      ]),
      create.deploying("#forge:storage_blocks/iron", [
        "#forge:storage_blocks/iron",
        "#forge:gems/certus_quartz",
      ]),
    ])
    .transitionalItem("#forge:storage_blocks/iron")
    .id("createdelight:crystal_fixer")
    .loops(1);
  event.remove({ id: "expatternprovider:crystal_fixer" });

  // MEGA解压缩模块
  create
    .sequenced_assembly("megacells:decompression_module", "#forge:ingots/sky_steel", [
      create.pressing("#forge:ingots/sky_steel", "#forge:ingots/sky_steel"),
      create.deploying("#forge:ingots/sky_steel", [
        "#forge:ingots/sky_steel",
        "megacells:compression_card",
      ]),
      create.deploying("#forge:ingots/sky_steel", [
        "#forge:ingots/sky_steel",
        "ae2:logic_processor",
      ]),
      create.deploying("#forge:ingots/sky_steel", [
        "#forge:ingots/sky_steel",
        "ae2:calculation_processor",
      ]),
      create.deploying("#forge:ingots/sky_steel", [
        "#forge:ingots/sky_steel",
        "megacells:accumulation_processor",
      ]),
      create.deploying("#forge:ingots/sky_steel", [
        "#forge:ingots/sky_steel",
        "ae2:engineering_processor",
      ]),
    ])
    .id("createdelight:decompression_module")
    .transitionalItem("#forge:ingots/sky_steel")
    .loops(1);
  event.remove({ id: "megacells:crafting/decompression_module" });

  // 人工钻石
  let coal_64 = [Fluid.of("minecraft:lava", 250)];
  for (let i = 0; i < 64; i++) {
    coal_64.push("minecraft:coal");
  }
  vintageimprovements
    .pressurizing("createdelight:mmd_diamond", coal_64)
    .heated()
    .id("createdelight:mmd_diamond_A");

  // 能源元件
  create
    .sequenced_assembly("ae2:energy_cell", "ae2:quartz_glass", [
      create.deploying("ae2:quartz_glass", ["ae2:quartz_glass", "#forge:dusts/fluix"]),
      create.deploying("ae2:quartz_glass", ["ae2:quartz_glass", "#forge:gems/certus_quartz"]),
      create.deploying("ae2:quartz_glass", ["ae2:quartz_glass", "#forge:dusts/fluix"]),
      create.deploying("ae2:quartz_glass", ["ae2:quartz_glass", "#forge:gems/certus_quartz"]),
    ])
    .id("createdelight:energy_cell_A")
    .transitionalItem("ae2:quartz_glass")
    .loops(1);
  create
    .sequenced_assembly("ae2:energy_cell", "createdelight:quartz_glass_parts", [
      create.deploying("createdelight:quartz_glass_parts", [
        "createdelight:quartz_glass_parts",
        "#forge:dusts/fluix",
      ]),
      create.deploying("createdelight:quartz_glass_parts", [
        "createdelight:quartz_glass_parts",
        "#forge:gems/certus_quartz",
      ]),
      create.deploying("createdelight:quartz_glass_parts", [
        "createdelight:quartz_glass_parts",
        "#forge:dusts/fluix",
      ]),
      create.deploying("createdelight:quartz_glass_parts", [
        "createdelight:quartz_glass_parts",
        "#forge:gems/certus_quartz",
      ]),
    ])
    .id("createdelight:energy_cell_B")
    .transitionalItem("createdelight:quartz_glass_parts")
    .loops(1);

  // 致密能源元件
  create
    .sequenced_assembly(
      "ae2:dense_energy_cell",
      "ae2:calculation_processor",
      create.deploying("ae2:calculation_processor", [
        "ae2:calculation_processor",
        "ae2:energy_cell",
      ])
    )
    .id("createdelight:dense_energy_cell")
    .transitionalItem("ae2:calculation_processor")
    .loops(4);

  // 超密能源元件
  create
    .sequenced_assembly(
      "megacells:mega_energy_cell",
      "megacells:accumulation_processor",
      create.deploying("megacells:accumulation_processor", [
        "megacells:accumulation_processor",
        "ae2:energy_cell",
      ])
    )
    .id("createdelight:mega_energy_cell")
    .transitionalItem("megacells:accumulation_processor")
    .loops(4);

  // 福鲁伊克斯珍珠
  create
    .mixing("ae2:fluix_pearl", ["#forge:ender_pearls", "2x #forge:gems/fluix"])
    .id("createdelight:fluix_pearl_A");
  create
    .mixing("ae2:fluix_pearl", ["#forge:ender_pearls", "2x #forge:dusts/fluix"])
    .id("createdelight:fluix_pearl_B");
  create
    .mixing("ae2:fluix_pearl", ["#forge:ender_pearls", "#forge:gems/fluix", "#forge:dusts/fluix"])
    .id("createdelight:fluix_pearl_C");

  // 无线终端
  create
    .sequenced_assembly("ae2:wireless_terminal", "ae2:terminal", [
      create.deploying("ae2:terminal", ["ae2:terminal", "ae2:dense_energy_cell"]),
      create.deploying("ae2:terminal", ["ae2:terminal", "ae2:wireless_receiver"]),
      create.deploying("ae2:terminal", ["ae2:terminal", "#ae2:quartz_wrench"]).keepHeldItem(),
    ])
    .loops(1)
    .transitionalItem("ae2:terminal")
    .id("createdelight:wireless_terminal");
  event.remove({ id: "ae2:network/wireless_terminal" });

  create
    .sequenced_assembly("ae2:wireless_crafting_terminal", "ae2:crafting_terminal", [
      create.deploying("ae2:crafting_terminal", ["ae2:crafting_terminal", "ae2:dense_energy_cell"]),
      create.deploying("ae2:crafting_terminal", ["ae2:crafting_terminal", "ae2:wireless_receiver"]),
      create
        .deploying("ae2:crafting_terminal", ["ae2:crafting_terminal", "#ae2:quartz_wrench"])
        .keepHeldItem(),
    ])
    .loops(1)
    .transitionalItem("ae2:crafting_terminal")
    .id("createdelight:wireless_crafting_terminal_A");
  event.remove({ id: "ae2:network/wireless_crafting_terminal" });

  create
    .sequenced_assembly(
      "ae2wtlib:wireless_pattern_access_terminal",
      "ae2:pattern_access_terminal",
      [
        create.deploying("ae2:pattern_access_terminal", [
          "ae2:pattern_access_terminal",
          "ae2:dense_energy_cell",
        ]),
        create.deploying("ae2:pattern_access_terminal", [
          "ae2:pattern_access_terminal",
          "ae2:wireless_receiver",
        ]),
        create
          .deploying("ae2:pattern_access_terminal", [
            "ae2:pattern_access_terminal",
            "#ae2:quartz_wrench",
          ])
          .keepHeldItem(),
      ]
    )
    .loops(1)
    .transitionalItem("ae2:pattern_access_terminal")
    .id("createdelight:wireless_pattern_access_terminal");
  event.remove({ id: "ae2wtlib:pattern_access/wireless_pattern_access_terminal" });

  create
    .sequenced_assembly(
      "ae2wtlib:wireless_pattern_encoding_terminal",
      "ae2:pattern_encoding_terminal",
      [
        create.deploying("ae2:pattern_encoding_terminal", [
          "ae2:pattern_encoding_terminal",
          "ae2:dense_energy_cell",
        ]),
        create.deploying("ae2:pattern_encoding_terminal", [
          "ae2:pattern_encoding_terminal",
          "ae2:wireless_receiver",
        ]),
        create
          .deploying("ae2:pattern_encoding_terminal", [
            "ae2:pattern_encoding_terminal",
            "#ae2:quartz_wrench",
          ])
          .keepHeldItem(),
      ]
    )
    .loops(1)
    .transitionalItem("ae2:pattern_encoding_terminal")
    .id("createdelight:wireless_pattern_encoding_terminal");
  event.remove({ id: "ae2wtlib:pattern_encoding/wireless_pattern_encoding_terminal" });

  create
    .sequenced_assembly(
      "expatternprovider:wireless_ex_pat",
      "expatternprovider:ex_pattern_access_part",
      [
        create.deploying("expatternprovider:ex_pattern_access_part", [
          "expatternprovider:ex_pattern_access_part",
          "ae2:dense_energy_cell",
        ]),
        create.deploying("expatternprovider:ex_pattern_access_part", [
          "expatternprovider:ex_pattern_access_part",
          "ae2:wireless_receiver",
        ]),
        create
          .deploying("expatternprovider:ex_pattern_access_part", [
            "expatternprovider:ex_pattern_access_part",
            "#ae2:quartz_wrench",
          ])
          .keepHeldItem(),
      ]
    )
    .loops(1)
    .transitionalItem("expatternprovider:ex_pattern_access_part")
    .id("createdelight:wireless_ex_pat");
  event.remove({ id: "expatternprovider:wireless_ex_pat" });

  create
    .sequenced_assembly("ae2:wireless_crafting_terminal", "ae2:wireless_terminal", [
      create.deploying("ae2:wireless_terminal", ["ae2:wireless_terminal", "#forge:workbench"]),
      create.deploying("ae2:wireless_terminal", [
        "ae2:wireless_terminal",
        "ae2:calculation_processor",
      ]),
    ])
    .transitionalItem("ae2:wireless_terminal")
    .id("createdelight:wireless_crafting_terminal_B")
    .loops(1);
  event.remove({ id: "ae2:network/upgrade_wireless_crafting_terminal" });

  // 无线接收器
  kubejs.shaped("ae2:wireless_receiver", ["A", "B", "C"], {
    A: "ae2:fluix_pearl",
    B: "#ae2:p2p_attunements/me_p2p_tunnel",
    C: "#forge:plates/iron",
  });
  event.replaceInput(
    { id: "ae2:network/wireless_part" },
    "ae2:quartz_fiber",
    "#ae2:p2p_attunements/me_p2p_tunnel"
  );

  // 终端
  create
    .sequenced_assembly("ae2:pattern_access_terminal", "#ae2:illuminated_panel", [
      create.deploying("#ae2:illuminated_panel", [
        "#ae2:illuminated_panel",
        "ae2:engineering_processor",
      ]),
      create.deploying("#ae2:illuminated_panel", [
        "#ae2:illuminated_panel",
        "ae2:cable_pattern_provider",
      ]),
    ])
    .id("createdelight:pattern_access_terminal")
    .loops(1)
    .transitionalItem("#ae2:illuminated_panel");
  event.remove({ id: "ae2:network/parts/terminals_pattern_access" });

  create
    .sequenced_assembly("ae2:terminal", "#ae2:illuminated_panel", [
      create.deploying("#ae2:illuminated_panel", ["#ae2:illuminated_panel", "ae2:formation_core"]),
      create.deploying("#ae2:illuminated_panel", ["#ae2:illuminated_panel", "ae2:logic_processor"]),
      create.deploying("#ae2:illuminated_panel", [
        "#ae2:illuminated_panel",
        "ae2:annihilation_core",
      ]),
    ])
    .id("createdelight:terminal_2")
    .loops(1)
    .transitionalItem("#ae2:illuminated_panel");
  event.remove({ id: "ae2:network/parts/terminals" });

  create
    .sequenced_assembly("ae2:crafting_terminal", "ae2:terminal", [
      create.deploying("ae2:terminal", ["ae2:terminal", "#forge:workbench"]),
      create.deploying("ae2:terminal", ["ae2:terminal", "ae2:calculation_processor"]),
    ])
    .transitionalItem("ae2:terminal")
    .id("createdelight:terminal_B")
    .loops(1);
  event.remove({ id: "ae2:network/parts/terminals_crafting" });
});
