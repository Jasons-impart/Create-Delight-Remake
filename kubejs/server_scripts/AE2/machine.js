ServerEvents.recipes((event) => {
  remove_recipes_id(event, [
    "ae2:materials/annihilationcore",
    "ae2:materials/formationcore",
    "ae2:network/blocks/quantum_link",
    "ae2:network/blocks/quantum_ring",
    "ae2wtlib:quantum_bridge_card",
    "ae2:network/parts/tunnels_me",
    "ae2:network/blocks/spatial_io_port",
    "ae2:network/blocks/io_condenser",
    "ae2:tools/matter_cannon",
    "ae2:network/blocks/spatial_anchor",
    "expatternprovider:ex_drive",
    "ae2:network/blocks/inscribers",
    "expatternprovider:assembler_matrix_crafter",
    "expatternprovider:assembler_matrix_frame",
    "expatternprovider:assembler_matrix_pattern",
    "expatternprovider:assembler_matrix_speed",
    "expatternprovider:assembler_matrix_wall"
  ])

  const { kubejs, vintageimprovements, create, minecraft } = event.recipes
  // 染料复制
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
  ]

  colours.forEach((c) => {
    create.mixing(
      `4x minecraft:${c}_dye`,
      [
        `minecraft:${c}_dye`, "ae2:matter_ball"
      ]
    ).id(`createdelight:${c}_dye_matter`)
  })

  // ME量子链接仓
  create.mechanical_crafting(
    "ae2:quantum_link",
    [
      "AABAA",
      "ACDCA",
      "BEFEB",
      "ACGCA",
      "AABAA"
    ], {
    A: "ae2:quartz_glass",
    B: "#ae2:glass_cable",
    C: "ae2:fluix_pearl",
    D: "ae2:singularity",
    E: "ae2:dense_energy_cell",
    F: "ae2:controller",
    G: "ae2:interface",
  }).id("createdelight:quantum_link_1")

  // ME量子环
  create.item_application(
    "ae2:quantum_ring",
    [
      "createdelight:space_casing",
      "ae2:controller"
    ]).id("createdelight:quantum_ring_1")



  // 量子桥卡
  let iner_3 = "createdelight:incomplete_quantum_bridge_card"
  create.sequenced_assembly("ae2wtlib:quantum_bridge_card", "ae2:advanced_card", [
    create.deploying(iner_3, [iner_3, "ae2:quantum_ring"]),
    create.deploying(iner_3, [iner_3, "ae2:quantum_ring"]),
    create.deploying(iner_3, [iner_3, "ae2:quantum_ring"]),
    create.deploying(iner_3, [iner_3, "ae2:quantum_ring"]),
    create.deploying(iner_3, [iner_3, "ae2:quantum_link"]),
  ])
    .transitionalItem(iner_3)
    .loops(1)
    .id("createdelight:quantum_bridge_card")

  // ME样板供应器
  let iner_4 = "createdelight:incomplete_pattern_provider"
  create.sequenced_assembly("2x ae2:pattern_provider", "createdelight:iron_casing", [
    create.deploying(iner_4, [iner_4, "minecraft:crafting_table"]),
    create.deploying(iner_4, [iner_4, "ae2:annihilation_core"]),
    create.deploying(iner_4, [iner_4, "ae2:formation_core"]),
  ])
    .loops(1)
    .transitionalItem(iner_4)
    .id("createdelight:pattern_provider")
  event.replaceInput({ id: "ae2:network/blocks/pattern_providers_interface" }, "#forge:ingots/iron", "#forge:plates/iron")

  // 分子装配室
  let iner_5 = "createdelight:incomplete_molecular_assembler"
  create.sequenced_assembly("2x ae2:molecular_assembler", "createdelight:iron_casing", [
    create.deploying(iner_5, [iner_5, "#createdelight:quartz_glass"]),
    create.deploying(iner_5, [iner_5, "minecraft:crafting_table"]),
    create.deploying(iner_5, [iner_5, "ae2:annihilation_core"]),
    create.deploying(iner_5, [iner_5, "ae2:formation_core"]),
  ])
    .loops(1)
    .transitionalItem(iner_5)
    .id("createdelight:molecular_assembler_1")

  event.replaceInput({ id: "ae2:network/crafting/molecular_assembler" }, "#forge:ingots/iron", "#forge:plates/iron")

  // ME接口
  let iner_6 = "createdelight:incomplete_interface"
  create.sequenced_assembly("2x ae2:interface", "createdelight:iron_casing", [
    create.deploying(iner_6, [iner_6, "#forge:glass"]),
    create.deploying(iner_6, [iner_6, "ae2:annihilation_core"]),
    create.deploying(iner_6, [iner_6, "ae2:formation_core"]),
  ])
    .loops(1)
    .transitionalItem(iner_6)
    .id("createdelight:interface")

  event.replaceInput({ id: "ae2:network/blocks/interfaces_interface" }, "#forge:ingots/iron", "#forge:plates/iron")

  // P2P通道
  create.sequenced_assembly("2x ae2:me_p2p_tunnel", "#forge:ingots/iron", [
    create.deploying("#forge:ingots/iron", ["#forge:ingots/iron", "ae2:engineering_processor"]),
    create.deploying("#forge:ingots/iron", ["#forge:ingots/iron", "ae2:singularity"]),
    create.deploying("#forge:ingots/iron", ["#forge:ingots/iron", "#forge:gems/fluix"]),
  ])
    .transitionalItem("createdelight:incomplete_me_p2p_tunnel")
    .loops(1)
    .id("createdelight:me_p2p_tunnel")
  kubejs.shaped("ae2:me_p2p_tunnel",
    [
      "ABA",
      "BCB",
      "DDD"
    ], {
    A: "ae2:singularity",
    B: "create:iron_sheet",
    C: "ae2:engineering_processor",
    D: "#forge:gems/fluix",
  }).id("ae2:shaped/me_p2p_tunnel")

  // 空间IO端口
  create.item_application(
    "ae2:spatial_io_port",
    [
      "createdelight:space_casing",
      "ae2:io_port"
    ]).id("createdelight:spatial_io_port")

  // 充能器
  create.item_application(
    "ae2:charger",
    [
      "createdelight:iron_casing",
      "minecraft:copper_ingot"
    ]).id("ae2:item_application/charger")
  event.replaceInput({ id: "ae2:network/blocks/crystal_processing_charger" }, "#forge:ingots/iron", "#forge:plates/iron")

  // ME控制器
  let iner_7 = "createdelight:incomplete_controller"
  create.sequenced_assembly("ae2:controller", "createdelight:sky_steel_casing", [
    create.deploying(iner_7, [iner_7, "#forge:storage_blocks/sky_steel"]),
    create.deploying(iner_7, [iner_7, "#forge:gems/fluix"]),
    create.deploying(iner_7, [iner_7, "ae2:engineering_processor"]),
    create.deploying(iner_7, [iner_7, "#forge:gems/fluix"]),
    create.deploying(iner_7, [iner_7, "#forge:storage_blocks/sky_steel"]),
  ])
    .transitionalItem("createdelight:incomplete_controller")
    .loops(1)
    .id("createdelight:controller")
  event.replaceInput({ id: "ae2:network/blocks/controller" }, "ae2:smooth_sky_stone_block", "#forge:storage_blocks/sky_steel")

  // 物质聚合器
  create.item_application(
    "ae2:condenser",
    [
      "createdelight:iron_casing",
      "trashcans:ultimate_trash_can",
    ]).id("ae2:item_application/condenser")



  // 石英纤维
  create.mixing(
    "16x ae2:quartz_fiber",
    [
      "4x #forge:glass",
      "4x #forge:gems/certus_quartz"
    ]).heated().id("createdelight:quartz_fiber")


  // 空间锚
  create.mechanical_crafting(
    "ae2:spatial_anchor",
    [
      "AABAA",
      "ACGEA",
      "BDFDB",
      "AEGCA",
      "AABAA"
    ], {
    A: "createdelight:space_casing",
    B: "#ae2:smart_dense_cable",
    C: "ae2:fluix_block",
    D: "ae2:spatial_cell_component_128",
    E: "ae2:singularity",
    F: "megacells:mega_energy_cell",
    G: "ae2:controller",
  }
  ).id("createdelight:spatial_anchor")

  // 合成单元
  let iner_8 = "createdelight:incomplete_crafting_unit"
  create.sequenced_assembly("2x ae2:crafting_unit", "createdelight:iron_casing", [
    create.deploying(iner_8, [iner_8, "#ae2:p2p_attunements/me_p2p_tunnel"]),
    create.deploying(iner_8, [iner_8, "ae2:calculation_processor"]),
    create.deploying(iner_8, [iner_8, "ae2:logic_processor"]),
  ])
    .loops(1)
    .transitionalItem(iner_8)
    .id("createdelight:crafting_unit")

  // ME驱动器
  let iner_9 = "createdelight:incomplete_drive"
  create.sequenced_assembly("ae2:drive", "createdelight:iron_casing", [
    vintageimprovements.turning(iner_9, iner_9),
    create.deploying(iner_9, [iner_9, "#ae2:p2p_attunements/me_p2p_tunnel"]),
    create.deploying(iner_9, [iner_9, "ae2:engineering_processor"]),
  ])
    .transitionalItem(iner_9)
    .loops(1)
    .id("createdelight:drive")

  // MEGA合成单元
  let iner_a = "createdelight:incomplete_mega_crafting_unit"
  create.sequenced_assembly("2x megacells:mega_crafting_unit", "ae2:crafting_unit", [
    create.deploying(iner_a, [iner_a, "#ae2:p2p_attunements/me_p2p_tunnel"]),
    create.deploying(iner_a, [iner_a, "megacells:accumulation_processor"]),
    create.deploying(iner_a, [iner_a, "createdelight:bleak_electron_tube"]),
  ])
    .transitionalItem(iner_a)
    .loops(1)
    .id("createdelight:mega_crafting_unit")
  event.replaceInput({ id: "megacells:crafting/mega_crafting_unit" }, "ae2:fluix_smart_cable", "createdelight:bleak_electron_tube")

  // ME扩展IO端口
  event.replaceInput({ id: "expatternprovider:ex_io_port" }, "ae2:speed_card", "createdelight:bleak_electron_tube")

  // 扩展分子装配室
  event.replaceInput({ id: "expatternprovider:ex_molecular_assembler" }, "#forge:gems/fluix", "createdelight:bleak_electron_tube")

  // ME无线连接器
  event.replaceInput({ id: "expatternprovider:wireless_connector" }, "ae2:sky_dust", "ae2:smooth_sky_stone_block")
  event.replaceInput({ id: "expatternprovider:wireless_connector" }, "ae2:engineering_processor", "ae2:controller")

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
  // MEGA解压缩模块
  create
    .sequenced_assembly("megacells:decompression_module", "#forge:ingots/sky_steel", [
      create.pressing("createdelight:incomplete_decompression_module", "createdelight:incomplete_decompression_module"),
      create.deploying("createdelight:incomplete_decompression_module", [
        "createdelight:incomplete_decompression_module",
        "megacells:compression_card",
      ]),
      create.deploying("createdelight:incomplete_decompression_module", [
        "createdelight:incomplete_decompression_module",
        "ae2:logic_processor",
      ]),
      create.deploying("createdelight:incomplete_decompression_module", [
        "createdelight:incomplete_decompression_module",
        "ae2:calculation_processor",
      ]),
      create.deploying("createdelight:incomplete_decompression_module", [
        "createdelight:incomplete_decompression_module",
        "megacells:accumulation_processor",
      ]),
      create.deploying("createdelight:incomplete_decompression_module", [
        "createdelight:incomplete_decompression_module",
        "ae2:engineering_processor",
      ]),
    ])
    .transitionalItem("createdelight:incomplete_decompression_module")
    .loops(1)
    .id("createdelight:decompression_module");
  event.remove({ id: "megacells:crafting/decompression_module" });



  // 能源元件
  create
    .sequenced_assembly("ae2:energy_cell", "#createdelight:quartz_glass", [
      create.deploying("createdelight:incomplete_energy_cell", ["createdelight:incomplete_energy_cell", "#forge:dusts/fluix"]),
      create.deploying("createdelight:incomplete_energy_cell", ["createdelight:incomplete_energy_cell", "#forge:gems/certus_quartz"]),
      create.deploying("createdelight:incomplete_energy_cell", ["createdelight:incomplete_energy_cell", "#forge:dusts/fluix"]),
      create.deploying("createdelight:incomplete_energy_cell", ["createdelight:incomplete_energy_cell", "#forge:gems/certus_quartz"]),
    ])
    .transitionalItem("createdelight:incomplete_energy_cell")
    .loops(1)
    .id("createdelight:energy_cell_1");

  // 致密能源元件
  create
    .sequenced_assembly(
      "ae2:dense_energy_cell",
      "ae2:calculation_processor",
      create.deploying("createdelight:incomplete_dense_energy_cell", [
        "createdelight:incomplete_dense_energy_cell",
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
      create.deploying("createdelight:incomplete_mega_energy_cell", [
        "createdelight:incomplete_mega_energy_cell",
        "ae2:dense_energy_cell",
      ])
    )
    .transitionalItem("createdelight:incomplete_mega_energy_cell")
    .loops(4)
    .id("createdelight:mega_energy_cell");

  // 水晶修复器
  create
    .sequenced_assembly("expatternprovider:crystal_fixer", "#forge:storage_blocks/iron", [
      create.pressing("createdelight:incomplete_crystal_fixer", "createdelight:incomplete_crystal_fixer"),
      create.deploying("createdelight:incomplete_crystal_fixer", [
        "createdelight:incomplete_crystal_fixer",
        "#forge:gems/fluix",
      ]),
      create.deploying("createdelight:incomplete_crystal_fixer", [
        "createdelight:incomplete_crystal_fixer",
        "#forge:rods/iron",
      ]),
      create.deploying("createdelight:incomplete_crystal_fixer", [
        "createdelight:incomplete_crystal_fixer",
        "#forge:rods/iron",
      ]),
      create.deploying("createdelight:incomplete_crystal_fixer", [
        "createdelight:incomplete_crystal_fixer",
        "#forge:gems/certus_quartz",
      ]),
      create.deploying("createdelight:incomplete_crystal_fixer", [
        "createdelight:incomplete_crystal_fixer",
        "#forge:gems/certus_quartz",
      ]),
    ])
    .transitionalItem("createdelight:incomplete_crystal_fixer")
    .id("createdelight:crystal_fixer")
    .loops(1);
  event.remove({ id: "expatternprovider:crystal_fixer" });

  // 陨石储罐
  create
    .item_application("ae2:sky_stone_tank", ["ae2:quartz_glass", "ae2:sky_stone_block"])
    .id("createdelight:sky_stone_tank");
  kubejs.shapeless("ae2:sky_stone_tank", ["ae2:quartz_glass", "ae2:sky_stone_block"]).id("ae2:misc/tank_sky_stone");

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

  // 组件坞
  event.remove({ id: "megacells:network/cell_dock" });
  create
    .deploying(Item.of("megacells:cell_dock", 10), ["ae2:drive", "#forge:ingots/sky_steel"])
    .id("createdelight:cell_dock_1");
})
