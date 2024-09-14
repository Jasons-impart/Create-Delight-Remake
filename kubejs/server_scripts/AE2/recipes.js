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
    .head("createdelight:universal_press");
  vintageimprovements
    .curving("megacells:printed_accumulation_processor", "megacells:sky_steel_ingot")
    .head("createdelight:universal_press");
  vintageimprovements
    .curving("ae2:printed_calculation_processor", "ae2:certus_quartz_crystal")
    .head("createdelight:universal_press");
  vintageimprovements
    .curving("ae2:printed_logic_processor", "minecraft:gold_ingot")
    .head("createdelight:universal_press");
  vintageimprovements
    .curving("ae2:printed_silicon", "ae2:silicon")
    .head("createdelight:universal_press");
  vintageimprovements
    .curving("createdelight:universal_press", "minecraft:iron_block")
    .head("createdelight:universal_press");

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
    .transitionalItem("ae2:printed_logic_processor")
    .loops(2);

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
  create.deploying("createdelight:engineering_processor_inscribed", [
    "createdelight:initial_processing_of_printed_engineering_processor",
    "ae2:printed_silicon",
  ]);
  create.deploying("createdelight:calculation_processor_inscribed", [
    "createdelight:initial_processing_of_printed_calculation_processor",
    "ae2:printed_silicon",
  ]);
  create.deploying("createdelight:logic_processor_inscribed", [
    "createdelight:initial_processing_of_printed_logic_processor",
    "ae2:printed_silicon",
  ]);

  // 处理器配方
  vintageimprovements
    .curving("ae2:engineering_processor", "createdelight:engineering_processor_inscribed")
    .mode(2);
  vintageimprovements
    .curving("ae2:calculation_processor", "createdelight:calculation_processor_inscribed")
    .mode(2);
  vintageimprovements
    .curving("ae2:logic_processor", "createdelight:logic_processor_inscribed")
    .mode(2);

  // 陨钢锭
  create.mixing("2x megacells:sky_steel_ingot", [
    "#forge:ingots/iron",
    "ae2:charged_certus_quartz_crystal",
    "ae2:sky_stone_block",
    Fluid.of("minecraft:lava", 250),
  ]);
});
