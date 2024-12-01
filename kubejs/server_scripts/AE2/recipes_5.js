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
      create.deploying(iner, [iner, "ae2:logic_processor"]),
      create.deploying(iner, [iner, "#forge:dusts/fluix"]),
      create.deploying(iner, [iner, "#forge:gems/quartz"]),
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
      create.deploying(iner_2, [iner_2, "ae2:logic_processor"]),
      create.deploying(iner_2, [iner_2, "#forge:dusts/fluix"]),
      create.deploying(iner_2, [iner_2, "#forge:gems/certus_quartz"]),
    ])
      .transitionalItem(iner_2)
      .loops(1)
      .id("createdelight:formation_core_1")

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
      create.deploying(iner_4, [iner_4, "ae2:annihilation_core"]),
      create.deploying(iner_4, [iner_4, "#forge:workbench"]),
      create.deploying(iner_4, [iner_4, "ae2:formation_core"]),
    ])
      .loops(1)
      .transitionalItem(iner_4)
      .id("createdelight:pattern_provider")
  event.replaceInput({ id: "ae2:network/blocks/pattern_providers_interface" },"#forge:ingots/iron","#forge:plates/iron")

  // 分子装配室
  let iner_5 = "createdelight:incomplete_molecular_assembler"
  create.sequenced_assembly("2x ae2:molecular_assembler", "createdelight:iron_casing", [
      create.deploying(iner_5, [iner_5, "ae2:annihilation_core"]),
      create.deploying(iner_5, [iner_5, "ae2:formation_core"]),
      create.deploying(iner_5, [iner_5, "#forge:workbench"]),
      create.deploying(iner_5, [iner_5, "#createdelight:quartz_glass"]),
    ])
      .loops(1)
      .transitionalItem(iner_5)
      .id("createdelight:molecular_assembler_1")

  event.replaceInput({ id: "ae2:network/crafting/molecular_assembler" }, "#forge:ingots/iron", "#forge:plates/iron")

  // ME接口
  let iner_6 = "createdelight:incomplete_interface"
  create.sequenced_assembly("2x ae2:interface", "createdelight:iron_casing", [
      create.deploying(iner_6, [iner_6, "ae2:annihilation_core"]),
      create.deploying(iner_6, [iner_6, "ae2:formation_core"]),
      create.deploying(iner_6, [iner_6, "#forge:glass"]),
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

  // 累积压印模板
  vintageimprovements.pressurizing(
    "megacells:accumulation_processor_press",
    [
      "ae2:engineering_processor_press",
      "ae2:singularity",
      "ae2:calculation_processor_press",
      Fluid.of("minecraft:lava", 250),
  ]).id("createdelight:accumulation_processor_press")

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

  // 无限熔岩盘
  let iner_b = "createdelight:incomplete_infinity_cell"
  create.sequenced_assembly(
      Item.of("expatternprovider:infinity_cell",'{record:{"#c":"ae2:f",id:"minecraft:lava"}}'),
      "ae2:cell_component_1k",
      create.filling(iner_b, [iner_b, Fluid.of("minecraft:lava", 1000)])
    )
      .loops(512)
      .transitionalItem(iner_b)
      .id("createdelight:infinity_cell_lava")
})
