ServerEvents.recipes((event) => {
  const { kubejs, vintageimprovements, create, minecraft } = event.recipes;
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
    .transitionalItem("createdelight:incomplete_crystal_fixer")
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
    .transitionalItem("createdelight:incomplete_decompression_module")
    .loops(1)
    .id("createdelight:decompression_module");
  event.remove({ id: "megacells:crafting/decompression_module" });

  // 人造钻石
  let coal_64 = [Fluid.of("minecraft:lava", 250)];
  for (let i = 0; i < 8; i++) {
    coal_64.push("minecraft:coal_block");
  }
  vintageimprovements
    .pressurizing("createdelight:mmd_diamond", coal_64)
    .superheated()
    .id("createdelight:mmd_diamond_1");

  // 能源元件
  create
    .sequenced_assembly("ae2:energy_cell", "#createdelight:quartz_glass", [
      create.deploying("ae2:quartz_glass", ["ae2:quartz_glass", "#forge:dusts/fluix"]),
      create.deploying("ae2:quartz_glass", ["ae2:quartz_glass", "#forge:gems/certus_quartz"]),
      create.deploying("ae2:quartz_glass", ["ae2:quartz_glass", "#forge:dusts/fluix"]),
      create.deploying("ae2:quartz_glass", ["ae2:quartz_glass", "#forge:gems/certus_quartz"]),
    ])
    .transitionalItem("createdelight:incomplete_energy_cell")
    .loops(1)
    .id("createdelight:energy_cell_1");
  //   create
  //     .sequenced_assembly("ae2:energy_cell", "createdelight:quartz_glass_parts", [
  //       create.deploying("createdelight:quartz_glass_parts", [
  //         "createdelight:quartz_glass_parts",
  //         "#forge:dusts/fluix",
  //       ]),
  //       create.deploying("createdelight:quartz_glass_parts", [
  //         "createdelight:quartz_glass_parts",
  //         "#forge:gems/certus_quartz",
  //       ]),
  //       create.deploying("createdelight:quartz_glass_parts", [
  //         "createdelight:quartz_glass_parts",
  //         "#forge:dusts/fluix",
  //       ]),
  //       create.deploying("createdelight:quartz_glass_parts", [
  //         "createdelight:quartz_glass_parts",
  //         "#forge:gems/certus_quartz",
  //       ]),
  //     ])
  //     .id("createdelight:energy_cell_2")
  //     .transitionalItem("createdelight:quartz_glass_parts")
  //     .loops(1);

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
    .transitionalItem("createdelight:incomplete_dense_energy_cell")
    .loops(4)
    .id("createdelight:dense_energy_cell");

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
    .transitionalItem("createdelight:incomplete_mega_energy_cell")
    .loops(4)
    .id("createdelight:mega_energy_cell");

  // 无限圆石配方
  create
    .mechanical_crafting(
      Item.of(
        "expatternprovider:infinity_cell",
        '{record:{"#c":"ae2:i",id:"minecraft:cobblestone"}}'
      ),
      ["AAAAA", "BCDCB", "BEFGB", "BHIHB", "AAAAA"],
      {
        A: "createdelight:space_casing",
        B: "cobblefordays:tier_5",
        C: "ae2:singularity",
        D: "ae2:interface",
        E: Item.of(
          "expatternprovider:infinity_cell",
          '{record:{"#c":"ae2:f",id:"minecraft:water"}}'
        ).weakNBT(),
        F: "ae2:annihilation_plane",
        G: Item.of(
          "expatternprovider:infinity_cell",
          '{display:{Lore:[\'{"italic":false,"color":"white","extra":[{"text":""},{"text":"手持 "},{"color":"blue","text":"1k ME存储组件"},{"text":" 对装有大于1万桶熔岩的1x1流体抽屉蹲下右键获取"}],"text":""}\']},record:{"#c":"ae2:f",id:"minecraft:lava"}}'
        ).weakNBT(),
        H: "ae2:spatial_cell_component_128",
        I: "megacells:bulk_cell_component",
      }
    )
    .id("createdelight:inf_cobblestone");
});
