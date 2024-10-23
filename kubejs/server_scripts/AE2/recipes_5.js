ServerEvents.recipes((event) => {
  const { kubejs, vintageimprovements, create, minecraft } = event.recipes; // 染料复制
  let colours = [
    "white",
    "orange",
    "magenta",
    "light_blue",
    "lime",
    "pink",
    "purple",
    "light_gray",
    "gray",
    "cyan",
    "brown",
    "green",
    "blue",
    "red",
    "black",
    "yellow",
  ];

  colours.forEach((c) => {
    create.mixing(`4x minecraft:${c}_dye`, [`minecraft:${c}_dye`, "ae2:matter_ball"]).id(`createdelight:${c}_dye_matter`);
  });

  // 破坏核心
  kubejs.shaped("ae2:annihilation_core", ["AAA", "BCD", "AAA"], {
    A: "#forge:nuggets/iron",
    B: "#forge:gems/quartz",
    C: "#forge:dusts/fluix",
    D: "ae2:logic_processor",
  });
  create
    .sequenced_assembly("ae2:annihilation_core", "minecraft:iron_nugget", [
      create.deploying("minecraft:iron_nugget", ["minecraft:iron_nugget", "ae2:logic_processor"]),
      create.deploying("minecraft:iron_nugget", ["minecraft:iron_nugget", "#forge:dusts/fluix"]),
      create.deploying("minecraft:iron_nugget", ["minecraft:iron_nugget", "#forge:gems/quartz"]),
    ])
    .id("createdelight:annihilation_core_1")
    .loops(1)
    .transitionalItem("minecraft:iron_nugget");
  event.remove({ id: "ae2:materials/annihilationcore" });

  // 成型核心
  kubejs.shaped("ae2:formation_core", ["AAA", "BCD", "AAA"], {
    A: "#forge:nuggets/iron",
    B: "#forge:gems/certus_quartz",
    C: "#forge:dusts/fluix",
    D: "ae2:logic_processor",
  });
  create
    .sequenced_assembly("ae2:formation_core", "minecraft:iron_nugget", [
      create.deploying("minecraft:iron_nugget", ["minecraft:iron_nugget", "ae2:logic_processor"]),
      create.deploying("minecraft:iron_nugget", ["minecraft:iron_nugget", "#forge:dusts/fluix"]),
      create.deploying("minecraft:iron_nugget", [
        "minecraft:iron_nugget",
        "#forge:gems/certus_quartz",
      ]),
    ])
    .id("createdelight:formation_core_1")
    .loops(1)
    .transitionalItem("minecraft:iron_nugget");
  event.remove({ id: "ae2:materials/formationcore" });

  // ME量子链接仓
  create
    .mechanical_crafting("ae2:quantum_link", ["AABAA", "ACDCA", "BEFEB", "ACGCA", "AABAA"], {
      A: "ae2:quartz_glass",
      B: "#ae2:glass_cable",
      C: "ae2:fluix_pearl",
      D: "ae2:singularity",
      E: "ae2:dense_energy_cell",
      F: "ae2:controller",
      G: "ae2:interface",
    })
    .id("createdelight:quantum_link_1");
  event.remove({ id: "ae2:network/blocks/quantum_link" });

  // ME量子环
  create
    .item_application("ae2:quantum_ring", ["createdelight:space_casing", "ae2:controller"])
    .id("createdelight:quantum_ring_1");
  event.remove({ id: "ae2:network/blocks/quantum_ring" });

  // 空间外壳
  kubejs.shaped("createdelight:space_casing", ["ABA", "CDC", "ACA"], {
    A: "createdelight:phase_transition_iron",
    B: "ae2:singularity",
    C: "ae2:fluix_pearl",
    D: "#forge:storage_blocks/sky_steel",
  });

  // 铁外壳
  minecraft.stonecutting("4x createdelight:iron_casing", "#forge:storage_blocks/iron");

  // 陨钢外壳
  minecraft.stonecutting("4x createdelight:sky_steel_casing", "#forge:storage_blocks/sky_steel");

  // 量子桥卡
  create
    .sequenced_assembly("ae2wtlib:quantum_bridge_card", "ae2:advanced_card", [
      create.deploying("ae2:advanced_card", ["ae2:advanced_card", "ae2:quantum_ring"]),
      create.deploying("ae2:advanced_card", ["ae2:advanced_card", "ae2:quantum_ring"]),
      create.deploying("ae2:advanced_card", ["ae2:advanced_card", "ae2:quantum_ring"]),
      create.deploying("ae2:advanced_card", ["ae2:advanced_card", "ae2:quantum_ring"]),
      create.deploying("ae2:advanced_card", ["ae2:advanced_card", "ae2:quantum_link"]),
    ])
    .id("createdelight:quantum_bridge_card")
    .transitionalItem("ae2:advanced_card")
    .loops(1);
  event.remove({ id: "ae2wtlib:quantum_bridge_card" });

  // ME样板供应器
  create
    .sequenced_assembly("2x ae2:pattern_provider", "createdelight:iron_casing", [
      create.deploying("createdelight:iron_casing", [
        "createdelight:iron_casing",
        "ae2:annihilation_core",
      ]),
      create.deploying("createdelight:iron_casing", [
        "createdelight:iron_casing",
        "#forge:workbench",
      ]),
      create.deploying("createdelight:iron_casing", [
        "createdelight:iron_casing",
        "ae2:formation_core",
      ]),
    ])
    .id("createdelight:pattern_provider")
    .loops(1)
    .transitionalItem("createdelight:iron_casing");
  event.replaceInput(
    { id: "ae2:network/blocks/pattern_providers_interface" },
    "#forge:ingots/iron",
    "#forge:plates/iron"
  );

  // 分子装配室
  create
    .sequenced_assembly("2x ae2:molecular_assembler", "createdelight:iron_casing", [
      create.deploying("createdelight:iron_casing", [
        "createdelight:iron_casing",
        "ae2:annihilation_core",
      ]),
      create.deploying("createdelight:iron_casing", [
        "createdelight:iron_casing",
        "ae2:formation_core",
      ]),
      create.deploying("createdelight:iron_casing", [
        "createdelight:iron_casing",
        "#forge:workbench",
      ]),
      create.deploying("createdelight:iron_casing", [
        "createdelight:iron_casing",
        "#createdelight:quartz_glass",
      ]),
    ])
    .id("createdelight:molecular_assembler_1")
    .loops(1)
    .transitionalItem("createdelight:iron_casing");

  event.replaceInput(
    { id: "ae2:network/crafting/molecular_assembler" },
    "#forge:ingots/iron",
    "#forge:plates/iron"
  );

  // ME接口
  create
    .sequenced_assembly("2x ae2:interface", "createdelight:iron_casing", [
      create.deploying("createdelight:iron_casing", [
        "createdelight:iron_casing",
        "ae2:annihilation_core",
      ]),
      create.deploying("createdelight:iron_casing", [
        "createdelight:iron_casing",
        "ae2:formation_core",
      ]),
      create.deploying("createdelight:iron_casing", ["createdelight:iron_casing", "#forge:glass"]),
    ])
    .id("createdelight:interface")
    .loops(1)
    .transitionalItem("createdelight:iron_casing");

  event.replaceInput(
    { id: "ae2:network/blocks/interfaces_interface" },
    "#forge:ingots/iron",
    "#forge:plates/iron"
  );

  // P2P通道
  create
    .sequenced_assembly("2x ae2:me_p2p_tunnel", "#forge:ingots/iron", [
      create.deploying("#forge:ingots/iron", ["#forge:ingots/iron", "ae2:engineering_processor"]),
      create.deploying("#forge:ingots/iron", ["#forge:ingots/iron", "ae2:singularity"]),
      create.deploying("#forge:ingots/iron", ["#forge:ingots/iron", "#forge:gems/fluix"]),
    ])
    .id("createdelight:me_p2p_tunnel")
    .transitionalItem("#forge:ingots/iron")
    .loops(1);
  event.remove({ id: "ae2:network/parts/tunnels_me" });
  kubejs.shaped("ae2:me_p2p_tunnel", ["ABA", "BCB", "DDD"], {
    A: "ae2:singularity",
    B: "create:iron_sheet",
    C: "ae2:engineering_processor",
    D: "#forge:gems/fluix",
  });

  // 空间IO端口
  create
    .item_application("ae2:spatial_io_port", ["createdelight:space_casing", "ae2:io_port"])
    .id("createdelight:spatial_io_port");
  event.remove({ id: "ae2:network/blocks/spatial_io_port" });

  // 充能器
  create.item_application("ae2:charger", ["createdelight:iron_casing", "minecraft:copper_ingot"]);
  event.replaceInput(
    { id: "ae2:network/blocks/crystal_processing_charger" },
    "#forge:ingots/iron",
    "#forge:plates/iron"
  );

  // ME控制器
  create
    .sequenced_assembly("ae2:controller", "createdelight:sky_steel_casing", [
      create.deploying("createdelight:sky_steel_casing", [
        "createdelight:sky_steel_casing",
        "#forge:storage_blocks/sky_steel",
      ]),
      create.deploying("createdelight:sky_steel_casing", [
        "createdelight:sky_steel_casing",
        "#forge:gems/fluix",
      ]),
      create.deploying("createdelight:sky_steel_casing", [
        "createdelight:sky_steel_casing",
        "ae2:engineering_processor",
      ]),
      create.deploying("createdelight:sky_steel_casing", [
        "createdelight:sky_steel_casing",
        "#forge:gems/fluix",
      ]),
      create.deploying("createdelight:sky_steel_casing", [
        "createdelight:sky_steel_casing",
        "#forge:storage_blocks/sky_steel",
      ]),
    ])
    .id("createdelight:controller")
    .transitionalItem("createdelight:sky_steel_casing")
    .loops(1);
  event.replaceInput(
    { id: "ae2:network/blocks/controller" },
    "ae2:smooth_sky_stone_block",
    "#forge:storage_blocks/sky_steel"
  );

  // 物质聚合器
  create.item_application("ae2:condenser", [
    "createdelight:iron_casing",
    "trashcans:ultimate_trash_can",
  ]);
  event.remove({ id: "ae2:network/blocks/io_condenser" });

  // 累积压印模板
  vintageimprovements
    .pressurizing("megacells:accumulation_processor_press", [
      "ae2:engineering_processor_press",
      "ae2:singularity",
      "ae2:calculation_processor_press",
      Fluid.of("minecraft:lava", 250),
    ])
    .id("createdelight:accumulation_processor_press");

  // 石英纤维
  create
    .mixing("16x ae2:quartz_fiber", ["4x #forge:glass", "4x #forge:gems/certus_quartz"])
    .heated()
    .id("createdelight:quartz_fiber");

  // 杀物质炮
  event.remove({ id: "ae2:tools/matter_cannon" });

  // 空间锚
  create
    .mechanical_crafting("ae2:spatial_anchor", ["AABAA", "ACGEA", "BDFDB", "AEGCA", "AABAA"], {
      A: "createdelight:space_casing",
      B: "#ae2:smart_dense_cable",
      C: "ae2:fluix_block",
      D: "ae2:spatial_cell_component_128",
      E: "ae2:singularity",
      F: "megacells:mega_energy_cell",
      G: "ae2:controller",
    })
    .id("createdelight:spatial_anchor");
  event.remove({ id: "ae2:network/blocks/spatial_anchor" });

  // 合成单元
  create
    .sequenced_assembly("2x ae2:crafting_unit", "createdelight:iron_casing", [
      create.deploying("createdelight:iron_casing", [
        "createdelight:iron_casing",
        "#ae2:p2p_attunements/me_p2p_tunnel",
      ]),
      create.deploying("createdelight:iron_casing", [
        "createdelight:iron_casing",
        "ae2:calculation_processor",
      ]),
      create.deploying("createdelight:iron_casing", [
        "createdelight:iron_casing",
        "ae2:logic_processor",
      ]),
    ])
    .id("createdelight:crafting_unit")
    .loops(1)
    .transitionalItem("createdelight:iron_casing");

  // ME驱动器
  create
    .sequenced_assembly("ae2:drive", "createdelight:iron_casing", [
      vintageimprovements.turning("createdelight:iron_casing", [
        "createdelight:iron_casing",
        "createdelight:iron_casing",
      ]),
      create.deploying("createdelight:iron_casing", [
        "createdelight:iron_casing",
        "#ae2:p2p_attunements/me_p2p_tunnel",
      ]),
      create.deploying("createdelight:iron_casing", [
        "createdelight:iron_casing",
        "ae2:engineering_processor",
      ]),
    ])
    .id("createdelight:drive")
    .transitionalItem("createdelight:iron_casing")
    .loops(1);

  // MEGA合成单元
  create
    .sequenced_assembly("2x megacells:mega_crafting_unit", "ae2:crafting_unit", [
      create.deploying("ae2:crafting_unit", [
        "ae2:crafting_unit",
        "#ae2:p2p_attunements/me_p2p_tunnel",
      ]),
      create.deploying("ae2:crafting_unit", [
        "ae2:crafting_unit",
        "megacells:accumulation_processor",
      ]),
      create.deploying("ae2:crafting_unit", [
        "ae2:crafting_unit",
        "createdelight:bleak_electron_tube",
      ]),
    ])
    .id("createdelight:mega_crafting_unit")
    .transitionalItem("ae2:crafting_unit")
    .loops(1);
  event.replaceInput(
    { id: "megacells:crafting/mega_crafting_unit" },
    "ae2:fluix_smart_cable",
    "createdelight:bleak_electron_tube"
  );

  // ME扩展IO端口
  event.replaceInput(
    { id: "expatternprovider:ex_io_port" },
    "ae2:speed_card",
    "createdelight:bleak_electron_tube"
  );

  // 扩展分子装配室
  event.replaceInput(
    { id: "expatternprovider:ex_molecular_assembler" },
    "#forge:gems/fluix",
    "createdelight:bleak_electron_tube"
  );

  // 杀扩展驱动器
  event.remove({ id: "expatternprovider:ex_drive" });

  // ME无线连接器
  event.replaceInput(
    { id: "expatternprovider:wireless_connector" },
    "ae2:sky_dust",
    "ae2:smooth_sky_stone_block"
  );
  event.replaceInput(
    { id: "expatternprovider:wireless_connector" },
    "ae2:engineering_processor",
    "ae2:controller"
  );

  // 杀压印器
  event.remove({ id: "ae2:network/blocks/inscribers" });

  // 无限熔岩盘
  create
    .sequenced_assembly(
      Item.of(
        "expatternprovider:infinity_cell",
        '{display:{Lore:[\'{"italic":false,"color":"white","extra":[{"text":""},{"text":"手持 "},{"color":"blue","text":"1k ME存储组件"},{"text":" 对装有大于1万桶熔岩的1x1流体抽屉蹲下右键获取"}],"text":""}\']},record:{"#c":"ae2:f",id:"minecraft:lava"}}'
      ),
      "ae2:cell_component_1k",
      create.filling(Item.of("ae2:cell_component_1k"), [
        "ae2:cell_component_1k",
        Fluid.of("minecraft:lava", 1000),
      ])
    )
    .loops(10000)
    .id("createdelight:infinity_cell_lava")
    .transitionalItem("ae2:cell_component_1k");
});
