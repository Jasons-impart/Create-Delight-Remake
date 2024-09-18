/*
额todo：
杀压印器改压印器配方到较后
材质
e 配方id

*/

ServerEvents.recipes((event) => {
  const { kubejs, vintageimprovements, create } = event.recipes;

  remove_recipes_output(event, "ae2:inscriber");

  // 电路板配方
  vintageimprovements
    .curving("ae2:printed_engineering_processor", "minecraft:diamond")
    .head("createdelight:universal_press")
    .id("createdelight_universal_press_1");
  vintageimprovements
    .curving("megacells:printed_accumulation_processor", "megacells:sky_steel_ingot")
    .head("createdelight:universal_press")
    .id("createdelight_universal_press_2");
  vintageimprovements
    .curving("ae2:printed_calculation_processor", "ae2:certus_quartz_crystal")
    .head("createdelight:universal_press")
    .id("createdelight_universal_press_3");
  vintageimprovements
    .curving("ae2:printed_logic_processor", "minecraft:gold_ingot")
    .head("createdelight:universal_press")
    .id("createdelight_universal_press_4");
  vintageimprovements
    .curving("ae2:printed_silicon", "ae2:silicon")
    .head("createdelight:universal_press")
    .id("createdelight_universal_press_5");
  vintageimprovements
    .curving("createdelight:universal_press", "minecraft:iron_block")
    .head("createdelight:universal_press")
    .id("createdelight_universal_press_6");

  let custom_inscribe = (result, middle) => {
    event
      .custom({
        type: "ae2:inscriber",
        ingredients: {
          middle: {
            item: middle,
          },
          top: {
            item: "createdelight:universal_press",
          },
        },
        mode: "inscribe",
        result: {
          item: result,
        },
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
        {
          item: "ae2:silicon_press",
        },
        {
          item: "ae2:logic_processor_press",
        },
        {
          item: "ae2:engineering_processor_press",
        },
        {
          item: "ae2:calculation_processor_press",
        },
        {
          item: "megacells:accumulation_processor_press",
        },
      ],
      result: {
        count: 5,
        item: "createdelight:universal_press",
      },
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
    .id("createdelight_initial_processing_of_printed_processor_1")
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
    .id("createdelight_initial_processing_of_printed_processor_2")
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
    .id("createdelight_initial_processing_of_printed_processor_3")
    .transitionalItem("ae2:printed_logic_processor")
    .loops(2);
  kubejs
    .shapeless("createdelight:initial_processing_of_printed_engineering_processor", [
      "ae2:printed_engineering_processor",
      "createdelight:redstone_paste",
    ])
    .damageIngredient({ id: "createdelight:redstone_paste" });
  kubejs
    .shapeless("createdelight:initial_processing_of_printed_calculation_processor", [
      "ae2:printed_calculation_processor",
      "createdelight:redstone_paste",
    ])
    .damageIngredient({ id: "createdelight:redstone_paste" });
  kubejs
    .shapeless("createdelight:initial_processing_of_printed_logic_processor", [
      "ae2:printed_logic_processor",
      "createdelight:redstone_paste",
    ])
    .damageIngredient({ id: "createdelight:redstone_paste" });

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
    .id("createdelight_processor_inscribed_1");
  create
    .deploying("createdelight:calculation_processor_inscribed", [
      "createdelight:initial_processing_of_printed_calculation_processor",
      "ae2:printed_silicon",
    ])
    .id("createdelight_processor_inscribed_2");
  create
    .deploying("createdelight:logic_processor_inscribed", [
      "createdelight:initial_processing_of_printed_logic_processor",
      "ae2:printed_silicon",
    ])
    .id("createdelight_processor_inscribed_3");

  // 红石膏合成
  create
    .mixing("createdelight:redstone_paste", ["64x #forge:dusts/redstone", "#forge:plates/iron"])
    .heated();

  // 处理器配方
  vintageimprovements
    .curving("ae2:engineering_processor", "createdelight:engineering_processor_inscribed")
    .mode(2)
    .id("createdelight_processor_inscribed_4");
  vintageimprovements
    .curving("ae2:calculation_processor", "createdelight:calculation_processor_inscribed")
    .mode(2)
    .id("createdelight_processor_inscribed_5");
  vintageimprovements
    .curving("ae2:logic_processor", "createdelight:logic_processor_inscribed")
    .mode(2)
    .id("createdelight_processor_inscribed_6");

  // 陨钢锭
  create
    .mixing("2x megacells:sky_steel_ingot", [
      "#forge:ingots/iron",
      "ae2:charged_certus_quartz_crystal",
      "ae2:sky_stone_block",
      Fluid.of("minecraft:lava", 250),
    ])
    .id("createdelight_sky_steel_ingot");

  // 奇点
  create.cutting("ae2:singularity", "create:mechanical_saw").id("createdelight_singularity_1");
  create.crushing("ae2:singularity", "create:crushing_wheel").id("createdelight_singularity_2");
  create.milling("ae2:singularity", "create:millstone").id("createdelight_singularity_3");

  // 陨石再生
  create.milling("4x ae2:sky_dust", "ae2:sky_stone_block").id("createdelight_sky_dust_1");
  create
    .crushing(
      ["4x ae2:sky_dust", Item.of("ae2:sky_dust", 2).withChance(0.1)],
      "ae2:sky_stone_block"
    )
    .id("createdelight_sky_dust_2");
  create
    .mixing("createdelight:bigger_sky_stone_block", [
      "ae2:sky_stone_block",
      "#forge:dusts/redstone",
    ])
    .id("createdelight_bigger_sky_stone_block");
  create
    .pressing(
      [
        "2x ae2:sky_dust",
        Item.of("ae2:sky_dust", 2).withChance(0.1),
        Item.of("ae2:sky_dust", 2).withChance(0.1),
      ],
      "createdelight:bigger_sky_stone_block"
    )
    .id("createdelight_sky_dust_3");

  // 移除配方
  event.remove({ id: "create:milling/compat/ae2/sky_stone_block" });

  // 红石再生
  create.mixing(Fluid.of("createdelight:sky_solution", 250), [
    Fluid.of("minecraft:water", 250),
    "ae2:sky_dust",
  ]);
  vintageimprovements.centrifugation(
    ["4x #forge:dusts/redstone", Fluid.of("createdelight:spent_liquor", 250)],
    Fluid.of("createdelight:sky_solution", 250)
  );
  create.mixing(["2x #forge:dusts/redstone", Fluid.of("createdelight:spent_liquor", 250)],
    Fluid.of("createdelight:sky_solution", 250)
  )

  //线缆锚
  vintageimprovements.turning(Item.of('ae2:cable_anchor', 64), "#forge:ingots/iron")
});
