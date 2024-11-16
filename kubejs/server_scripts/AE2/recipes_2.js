ServerEvents.recipes((event) => {
  const { kubejs, vintageimprovements, create, minecraft } = event.recipes;
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
      create.deploying("createdelight:incomplete_entropy_manipulator", ["createdelight:incomplete_entropy_manipulator", "ae2:energy_cell"]),
      create.deploying("createdelight:incomplete_entropy_manipulator", ["createdelight:incomplete_entropy_manipulator", "ae2:engineering_processor"]),
      create.deploying("createdelight:incomplete_entropy_manipulator", ["createdelight:incomplete_entropy_manipulator", "ae2:fluix_crystal"]),
      vintageimprovements.polishing("createdelight:incomplete_entropy_manipulator", "createdelight:incomplete_entropy_manipulator"),
    ])
    .transitionalItem("createdelight:incomplete_entropy_manipulator")
    .loops(1)
    .id("createdelight:entropy_manipulator");
  event.remove({ id: "ae2:tools/misctools_entropy_manipulator" });

  // 充能手杖
  create
    .sequenced_assembly("ae2:charged_staff", "#forge:rods/iron", [
      create.deploying("createdelight:incomplete_charged_staff", [
        "createdelight:incomplete_charged_staff",
        "ae2:charged_certus_quartz_crystal",
      ]),
      vintageimprovements.polishing("createdelight:incomplete_charged_staff", "createdelight:incomplete_charged_staff"),
    ])
    .transitionalItem("createdelight:incomplete_charged_staff")
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
      create.filling("reatedelight:incomplete_infinity_cell", [
        "reatedelight:incomplete_infinity_cell",
        Fluid.of("minecraft:water", 1000),
      ])
    )
    .loops(512)
    .transitionalItem("createdelight:incomplete_infinity_cell")
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

  // 样板
  event.remove({ id: "ae2:network/crafting/patterns_blank" });
  create
    .sequenced_assembly("4x ae2:blank_pattern", "#forge:plates/iron", [
      create.deploying("#forge:plates/iron", ["#forge:plates/iron", "ae2:certus_quartz_crystal"]),
      create.deploying("#forge:plates/iron", [
        "#forge:plates/iron",
        "#createdelight:quartz_vibrant_glass",
      ]),
      vintageimprovements
        .curving("#forge:plates/iron", "#forge:plates/iron")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .transitionalItem("createdelight:incomplete_blank_pattern")
    .loops(1)
    .id("createdelight:blank_pattern_1");
  create
    .sequenced_assembly("4x ae2:blank_pattern", "#forge:plates/iron", [
      create.deploying("#forge:plates/iron", ["#forge:plates/iron", "ae2:certus_quartz_crystal"]),
      create.deploying("#forge:plates/iron", ["#forge:plates/iron", "#forge:dusts/glowstone"]),
      create.deploying("#forge:plates/iron", ["#forge:plates/iron", "#createdelight:quartz_glass"]),
      vintageimprovements
        .curving("#forge:plates/iron", "#forge:plates/iron")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .transitionalItem("createdelight:incomplete_blank_pattern")
    .loops(1)
    .id("createdelight:blank_pattern_2");

  // 样板修改器
  create
    .sequenced_assembly("expatternprovider:pattern_modifier", "ae2:blank_pattern", [
      create.deploying("ae2:blank_pattern", ["ae2:blank_pattern", "ae2:logic_processor"]),
      create.deploying("ae2:blank_pattern", ["ae2:blank_pattern", "#forge:dyes/green"]),
      vintageimprovements
        .curving("ae2:blank_pattern", "ae2:blank_pattern")
        .head("createdelight:cell_housing_curving_head"),
    ])
    .transitionalItem("createdelight:incomplete_pattern_modifier")
    .loops(1)
    .id("createdelight:pattern_modifier_1");
  event.remove({ id: "expatternprovider:pattern_modifier" });


  // 组件坞
  event.remove({ id: "megacells:network/cell_dock" });
  create
    .deploying(Item.of("megacells:cell_dock", 10), ["ae2:drive", "#forge:ingots/sky_steel"])
    .id("createdelight:cell_dock_1");

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

  // 压印器
  create
    .mechanical_crafting("ae2:inscriber", ["AABAA", "CDEDC", "FGHGF", "CIHIC", "AAAAA"], {
      A: "#forge:ingots/iron",
      B: "#forge:storage_blocks/copper",
      C: "#forge:gems/fluix",
      D: "vintageimprovements:curving_press",
      E: "createaddition:alternator",
      F: "#forge:glass",
      G: "vintageimprovements:concave_curving_head",
      H: "#forge:spring/between_500_2_1000",
      I: "create:depot",
    })
    .id("createdelight:inscriber");
});
