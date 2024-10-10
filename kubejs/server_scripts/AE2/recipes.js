ServerEvents.recipes((event) => {
  const { kubejs, vintageimprovements, create, minecraft } = event.recipes;

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
    .id("createdelight:cell_component_1k_1");

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
    .id("createdelight:cell_component_1k_2");

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
    .id("createdelight:cell_component_1k_3");

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
    .id("createdelight:cell_component_4k_1")
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
    .id("createdelight:cell_component_4k_2")
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
    .id("createdelight:cell_component_4k_3")
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
    .id("createdelight:cell_component_4k_4")
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
    .id("createdelight:cell_component_4k_5")
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
    .id("createdelight:cell_component_4k_6")
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
    .id("createdelight:cell_component_16k_1")
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
    .id("createdelight:cell_component_16k_2")
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
    .id("createdelight:cell_component_16k_3")
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
    .id("createdelight:cell_component_16k_4")
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
    .id("createdelight:cell_component_16k_5")
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
    .id("createdelight:cell_component_16k_6")
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
    .id("createdelight:cell_component_64k_1")
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
    .id("createdelight:cell_component_64k_2")
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
    .id("createdelight:cell_component_64k_3")
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
    .id("createdelight:cell_component_64k_4")
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
    .id("createdelight:cell_component_64k_5")
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
    .id("createdelight:cell_component_64k_6")
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
    .id("createdelight:cell_component_256k_1")
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
    .id("createdelight:cell_component_256k_2")
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
    .id("createdelight:cell_component_256k_3")
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
    .id("createdelight:cell_component_256k_4")
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
    .id("createdelight:cell_component_256k_5")
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
    .id("createdelight:cell_component_256k_6")
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
    .id("createdelight:cell_component_1m_1")
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
    .id("createdelight:cell_component_1m_2")
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
    .id("createdelight:cell_component_1m_3")
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
    .id("createdelight:cell_component_1m_4")
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
    .id("createdelight:cell_component_1m_5")
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
    .id("createdelight:cell_component_1m_6")
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
    .id("createdelight:cell_component_4m_1")
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
    .id("createdelight:cell_component_4m_3")
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
    .id("createdelight:cell_component_4m_4")
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
    .id("createdelight:cell_component_4m_6")
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
    .id("createdelight:cell_component_16m_1")
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
    .id("createdelight:cell_component_16m_3")
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
    .id("createdelight:cell_component_16m_4")
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
    .id("createdelight:cell_component_16m_6")
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
    .id("createdelight:cell_component_64m_1")
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
    .id("createdelight:cell_component_64m_3")
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
    .id("createdelight:cell_component_64m_4")
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
    .id("createdelight:cell_component_64m_6")
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
    .id("createdelight:cell_component_256m_1")
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
    .id("createdelight:cell_component_256m_3")
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
    .id("createdelight:cell_component_256m_4")
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
    .id("createdelight:cell_component_256m_6")
    .loops(1)
    .transitionalItem("megacells:cell_component_64m");
});
