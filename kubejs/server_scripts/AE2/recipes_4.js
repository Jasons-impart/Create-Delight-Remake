ServerEvents.recipes((event) => {
  const { kubejs, vintageimprovements, create, minecraft } = event.recipes;
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
    .id("createdelight:wireless_crafting_terminal_1");
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
    .id("createdelight:wireless_crafting_terminal_2")
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
//   create
//     .sequenced_assembly("ae2:pattern_access_terminal", "#ae2:illuminated_panel", [
//       create.deploying("#ae2:illuminated_panel", [
//         "#ae2:illuminated_panel",
//         "ae2:engineering_processor",
//       ]),
//       create.deploying("#ae2:illuminated_panel", [
//         "#ae2:illuminated_panel",
//         "ae2:cable_pattern_provider",
//       ]),
//     ])
//     .id("createdelight:pattern_access_terminal")
//     .loops(1)
//     .transitionalItem("#ae2:illuminated_panel");
//   event.remove({ id: "ae2:network/parts/terminals_pattern_access" });

//   create
//     .sequenced_assembly("ae2:terminal", "#ae2:illuminated_panel", [
//       create.deploying("#ae2:illuminated_panel", ["#ae2:illuminated_panel", "ae2:formation_core"]),
//       create.deploying("#ae2:illuminated_panel", ["#ae2:illuminated_panel", "ae2:logic_processor"]),
//       create.deploying("#ae2:illuminated_panel", [
//         "#ae2:illuminated_panel",
//         "ae2:annihilation_core",
//       ]),
//     ])
//     .id("createdelight:terminal_2")
//     .loops(1)
//     .transitionalItem("#ae2:illuminated_panel");
//   event.remove({ id: "ae2:network/parts/terminals" });

//   create
//     .sequenced_assembly("ae2:crafting_terminal", "ae2:terminal", [
//       create.deploying("ae2:terminal", ["ae2:terminal", "#forge:workbench"]),
//       create.deploying("ae2:terminal", ["ae2:terminal", "ae2:calculation_processor"]),
//     ])
//     .transitionalItem("ae2:terminal")
//     .id("createdelight:crafting_terminal_2")
//     .loops(1);
//   event.remove({ id: "ae2:network/parts/terminals_crafting" });

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

  // 基础卡
  kubejs.shaped("ae2:basic_card", ["ABB", "CDB", "ABB"], {
    A: "#forge:ingots/gold",
    B: "#forge:plates/iron",
    C: "#forge:dusts/redstone",
    D: "ae2:calculation_processor",
  });
  create
    .sequenced_assembly(Item.of("ae2:basic_card", 8), "ae2:calculation_processor", [
      vintageimprovements.laser_cutting(
        "ae2:calculation_processor",
        "ae2:calculation_processor",
        100
      ),
      create.deploying("ae2:calculation_processor", [
        "ae2:calculation_processor",
        "#forge:ingots/iron",
      ]),
      create.deploying("ae2:calculation_processor", [
        "ae2:calculation_processor",
        "#forge:dusts/redstone",
      ]),
      create.deploying("ae2:calculation_processor", [
        "ae2:calculation_processor",
        "#forge:ingots/gold",
      ]),
    ])
    .transitionalItem("ae2:calculation_processor")
    .loops(1)
    .id("createdelight:basic_card_1");
  event.remove({ id: "ae2:materials/basiccard" });

  // 高级卡
  kubejs.shaped("ae2:advanced_card", ["ABB", "CDB", "ABB"], {
    A: "#forge:gems/diamond",
    B: "#forge:plates/iron",
    C: "#forge:dusts/redstone",
    D: "ae2:calculation_processor",
  });
  create
    .sequenced_assembly(Item.of("ae2:advanced_card", 8), "ae2:calculation_processor", [
      vintageimprovements.laser_cutting(
        "ae2:calculation_processor",
        "ae2:calculation_processor",
        100
      ),
      create.deploying("ae2:calculation_processor", [
        "ae2:calculation_processor",
        "#forge:ingots/iron",
      ]),
      create.deploying("ae2:calculation_processor", [
        "ae2:calculation_processor",
        "#forge:dusts/redstone",
      ]),
      create.deploying("ae2:calculation_processor", [
        "ae2:calculation_processor",
        "#forge:gems/diamond",
      ]),
    ])
    .transitionalItem("ae2:calculation_processor")
    .loops(1)
    .id("createdelight:advanced_card_1");
  event.remove({ id: "ae2:materials/advancedcard" });
});
