/**
 * @format
 * @param {Internal.RecipesEventJS} e
 * @param {InputItem_[]} transitionItems
 * @param {Internal.FluidStackJS_} fluid
 * @param {number} amount
 */

function make_growing_cluster(e, transitionItems, fluid, amount) {
  for (let index = 1; index < transitionItems.length; index++) {
    let item = transitionItems[index];
    let lastItem = transitionItems[index - 1];
    e.recipes.create
      .sequenced_assembly(item, lastItem, [
        e.recipes.create.filling(lastItem, [lastItem, Fluid.of(fluid, amount)]),
      ])
      .loops(4)
      .transitionalItem(lastItem)
      .id(`${item.split(":")[0]}:compat/filling/${item.split(":")[1]}`);
  }
}

ServerEvents.recipes((event) => {
  const { kubejs, vintageimprovements, create, minecraft } = event.recipes;


  /**
   * 
   * @param {OutputItem_} result 
   * @param {InputItem_} [top]
   * @param {InputItem_} [middle] 
   * @param {InputItem_} [bottom] 
   * @param {string} [mode]
   * @returns 
   */
  let custom_inscribe = (result, top, middle, bottom, mode) => {
    top = Ingredient.of(top || "minecraft:air")
    middle = Ingredient.of(middle || "minecraft:air")
    bottom = Ingredient.of(bottom || "minecraft:air")
    result = Item.of(result || "minecraft:air")
    mode = mode || "press"
    return event.custom({
      type: "ae2:inscriber",
      ingredients: {
        top: top,
        middle: middle,
        bottom: bottom,
      },
      mode: mode,
      result: result,
    })
  }

  /**
*  
* @param {OutputItem_} res 
* @param {Internal.Ingredient[]} ingr
* @returns 
*/
  let transform_explosion = (res, ingr) => {
    res = Item.of(res || "minecraft:air")
    if (!(ingr instanceof Array))
      ingr = [ingr]
    let ingredients = []
    ingr.forEach(ing => {
      ingredients.push(Ingredient.of(ing))
    })
    return event.custom({
      type: "ae2:transform",
      circumstance: {
        type: "explosion"
      },
      ingredients: ingredients,
      result: res
    })
  }

  /**
 *  
 * @param {OutputItem_} res 
 * @param {Special.FluidTag} fluid 
 * @param {Internal.Ingredient[]} ingr
 * @returns 
 */
  let transform_fluid = (res, fluid, ingr) => {
    res = Item.of(res || "minecraft:air")
    if (!(ingr instanceof Array))
      ingr = [ingr]
    let ingredients = []
    ingr.forEach(ing => {
      ingredients.push(Ingredient.of(ing))
    })
    return event.custom({
      type: "ae2:transform",
      circumstance: {
        type: "fluid",
        tag: fluid
      },
      ingredients: ingredients,
      result: res
    })
  }

  event.remove({ id: "create:mixing/compat/ae2/fluix_crystal" })

  event.remove({ id: "expatternprovider:cobblestone_cell" });
  event.remove({ id: "expatternprovider:water_cell" });
  event.remove({ id: "megacells:cells/standard/bulk_item_cell" });

  remove_recipes_id(event, [
    "ae2:network/cells/item_cell_housing",
    "ae2:network/cells/fluid_cell_housing",
    "megacells:cells/mega_item_cell_housing",
    "megacells:cells/mega_fluid_cell_housing",
    "ae2omnicells:cells/housing/omni_cell_housing",
    "ae2omnicells:cells/housing/complex_omni_cell_housing",
    "ae2omnicells:cells/housing/quantum_omni_cell_housing",
    "ae2omnicells:omni_link_print_press",
    "ae2omnicells:complex_link_print_press",
    "ae2omnicells:multidimensional_expansion_print_press"
  ])
  transform_explosion("ae2omnicells:omni_link_print_press", [
    "createdelight:universal_press",
    "createutilities:void_steel_ingot",
    "ae2omnicells:charged_ender_ingot"
  ])
  transform_explosion("ae2omnicells:complex_link_print_press", [
    "createdelight:universal_press",
    "minecraft:netherite_scrap",
    "ae2omnicells:charged_ender_ingot"
  ])
  transform_explosion("ae2omnicells:multidimensional_expansion_print_press", [
    "createdelight:universal_press",
    "ae2:singularity",
    "ae2omnicells:charged_ender_ingot"
  ])

  // 电路板相关配方
  vintageimprovements
    .curving("ae2:printed_silicon", "ae2:silicon")
    .head("createdelight:universal_press")
    .id("createdelight:curving/printed_silicon_from_universal_press");
  vintageimprovements
    .curving("ae2:printed_silicon", "ae2:silicon")
    .head("createdelight:ultimate_universal_press")
    .id("createdelight:curving/printed_silicon_from_ultimate_universal_press");
  custom_inscribe("ae2:printed_silicon", "createdelight:ultimate_universal_press", "ae2:silicon", null, "inscribe")
  custom_inscribe("ae2:printed_silicon", "createdelight:universal_press", "ae2:silicon", null, "inscribe")
  vintageimprovements
    .curving("ae2:printed_silicon", "ae2:silicon")
    .head("ae2:silicon_press")
    .id("createdelight:curving/printed_silicon");
  vintageimprovements
    .curving("createdelight:universal_press", "#forge:storage_blocks/iron")
    .head("createdelight:universal_press")
    .id("createdelight:curving/universal_press_duplicate");
  vintageimprovements
    .curving("createdelight:ultimate_universal_press", "ae2omnicells:singularity_block")
    .head("createdelight:ultimate_universal_press")
    .id("createdelight:curving/ultimate_universal_press_duplicate");
  custom_inscribe("createdelight:universal_press", "createdelight:universal_press", "#forge:storage_blocks/iron", null, "inscribe")
  custom_inscribe("createdelight:ultimate_universal_press", "createdelight:ultimate_universal_press", "ae2omnicells:singularity_block", null, "inscribe")

  // 膏合成
  create
    .mixing("createdelight:redstone_paste", ["32x #forge:dusts/redstone", "#forge:plates/iron"])
    .heated();
  create
    .mixing("createdelight:glowstone_paste", ["32x #forge:dusts/glowstone", "#forge:plates/iron"])
    .heated();
  create
    .mixing("createdelight:sky_stone_paste", ["32x ae2:sky_dust", "#forge:plates/iron"])
    .heated();

  // 通用压印模板的配方
  transform_fluid("5x createdelight:universal_press", "minecraft:water", [
    "ae2:silicon_press",
    "ae2:logic_processor_press",
    "ae2:engineering_processor_press",
    "ae2:calculation_processor_press",
    "megacells:accumulation_processor_press"
  ])
    .id("universal_press_transform_recipe")
  transform_explosion("4x createdelight:ultimate_universal_press", [
    "ae2omnicells:omni_link_print_press",
    "ae2omnicells:complex_link_print_press",
    "ae2omnicells:multidimensional_expansion_print_press",
    ["iceandfire:dragonsteel_fire_block", "iceandfire:dragonsteel_ice_block", "iceandfire:dragonsteel_lightning_block"],
    "createdelight:universal_press"
  ])
    .id("ultimate_universal_press_transform_recipe")
  /**
   * 
   * @param {Internal.Ingredient_[]} items [电路板原材料，电路板，未加工处理器，待压印处理器，处理器]
   * @param {Internal.Ingredient_} dust 
   * @param {Internal.Ingredient_} [paste] 
   * @param {Internal.ItemStack_} press
   * @param {number} [press_level]
   * @param {Internal.Ingredient_} [copy_press]
   */
  function process_processor(items, dust, paste, press, press_level, copy_press) {
    press_level = press_level || 2
    copy_press = copy_press || "#forge:storage_blocks/iron"
    vintageimprovements
      .curving(items[1], items[0])
      .head(press)
      .id(`createdelight:curving/${items[1].split(":")[1]}`)
    vintageimprovements
      .curving(press, copy_press)
      .head(press)
      .id(`createdelight:curving/${press.split(":")[1]}_duplicate`)
    if (press_level > 0) {
      vintageimprovements
        .curving(items[1], items[0])
        .head("createdelight:ultimate_universal_press")
        .id(`createdelight:curving/${items[1].split(":")[1]}_from_ultimate_universal_press`)
      custom_inscribe(items[1], "createdelight:ultimate_universal_press", items[0], null, "inscribe")
      if (press_level > 1) {
        vintageimprovements
          .curving(items[1], items[0])
          .head("createdelight:universal_press")
          .id(`createdelight:curving/${items[1].split(":")[1]}_from_universal_press`)
        custom_inscribe(items[1], "createdelight:universal_press", items[0], null, "inscribe")
      }
    }
    kubejs.shapeless(items[2], [
      items[1],
      Ingredient.of(dust, 2)
    ])
    create
      .sequenced_assembly(
        items[2],
        items[1],
        create.deploying(items[1], [
          items[1],
          dust,
        ])
      )
      .transitionalItem(items[1])
      .loops(2)
      .id(`createdelight:sequenced_assembly/${items[2].split(":")[1]}_from_dust`);

    kubejs.shapeless(items[3], [items[2], "ae2:printed_silicon"])

    create.deploying(items[3], [items[2], "ae2:printed_silicon"])
      .id(`createdelight:deploying/${items[3].split(":")[1]}`);
    vintageimprovements.vacuumizing(items[2], [
      items[1],
      dust
    ])

    vintageimprovements
      .curving(Item.of(items[4], 2), items[3])
      .mode(2)
      .id(`createdelight:curving/${items[4].split(":")[1]}`);
    if (paste != null) {
      create
        .sequenced_assembly(
          items[2],
          items[1],
          create.deploying(items[1], [
            items[1],
            paste,
          ])
        )
        .transitionalItem(items[1])
        .loops(1)
        .id(`createdelight:sequenced_assembly/${items[2].split(":")[1]}_from_paste`);
      kubejs.shapeless(items[2], [
        items[1],
        paste
      ]).damageIngredient(paste)
    }
  }

  /**
   * 
   * @param {OutputItem_} result 
   * @param {InputItem_} A 
   * @param {InputItem_} B 
   * @param {InputItem_} C 
   * @param {InputItem_} D 
   */
  function make_omnicell_component(result, A, B, C, D) {
    create.mechanical_crafting(Item.of(result, 27), [
      "AAAAAAAAA",
      "AAAAAAAAA",
      "BBBBBBBBB",
      "CCCCCCCCC",
      "DDDDDDDDD",
      "CCCCCCCCC",
      "BBBBBBBBB",
      "AAAAAAAAA",
      "AAAAAAAAA"
    ], {
      A: A,
      B: B,
      C: C,
      D: D
    }).id(`createdelight:mechanical_crafting/${result.split(":")[1]}`)
  }
  const OMNI_CELL_TIERS = ["1k", "4k", "16k", "64k", "256k", "1m", "4m", "16m", "64m", "256m"]
  function make_omni_cell_component_chain(cfg) {
    for (let i = 0; i < OMNI_CELL_TIERS.length; i++) {
      make_omnicell_component(
        `${cfg.prefix}${OMNI_CELL_TIERS[i]}`,
        i === 0 ? cfg.first_dust : "minecraft:redstone",
        cfg.processor,
        i === 0 ? cfg.first_input : `${cfg.prefix}${OMNI_CELL_TIERS[i - 1]}`,
        i === 0 ? "ae2:cell_component_1k" : "#createdelight:quartz_glass"
      )
    }
  }

  make_omni_cell_component_chain({
    prefix: "ae2omnicells:omni_cell_component_",
    processor: "ae2omnicells:omni_link_processor",
    first_dust: "minecraft:redstone",
    first_input: "createutilities:void_steel_ingot"
  })

  make_omni_cell_component_chain({
    prefix: "ae2omnicells:complex_omni_cell_component_",
    processor: "ae2omnicells:complex_link_processor",
    first_dust: "minecraft:glowstone_dust",
    first_input: "ae2omnicells:charged_ender_ingot"
  })

  make_omni_cell_component_chain({
    prefix: "ae2omnicells:quantum_omni_cell_component_",
    processor: "ae2omnicells:multidimensional_expansion_processor",
    first_dust: "ae2:ender_dust",
    first_input: "ae2omnicells:charged_ender_ingot"
  })



  // 硅压印板需要单独写复制配方
  vintageimprovements
    .curving("ae2:silicon_press", "#forge:storage_blocks/iron")
    .head("ae2:silicon_press")
    .id(`createdelight:curving/silicon_press_duplicate`)
  process_processor([
    "#forge:gems/diamond",
    "ae2:printed_engineering_processor",
    "createdelight:initial_processing_of_printed_engineering_processor",
    "createdelight:engineering_processor_inscribed",
    "ae2:engineering_processor"
  ], "#forge:dusts/redstone", "createdelight:redstone_paste", "ae2:engineering_processor_press")
  process_processor([
    "ae2:certus_quartz_crystal",
    "ae2:printed_calculation_processor",
    "createdelight:initial_processing_of_printed_calculation_processor",
    "createdelight:calculation_processor_inscribed",
    "ae2:calculation_processor"
  ], "#forge:dusts/redstone", "createdelight:redstone_paste", "ae2:calculation_processor_press")
  process_processor([
    "minecraft:gold_ingot",
    "ae2:printed_logic_processor",
    "createdelight:initial_processing_of_printed_logic_processor",
    "createdelight:logic_processor_inscribed",
    "ae2:logic_processor"
  ], "#forge:dusts/redstone", "createdelight:redstone_paste", "ae2:logic_processor_press")
  process_processor([
    "megacells:sky_steel_ingot",
    "megacells:printed_accumulation_processor",
    "createdelight:initial_processing_of_printed_accumulation_processor",
    "createdelight:accumulation_processor_inscribed",
    "megacells:accumulation_processor"
  ], "#forge:dusts/fluix", null, "megacells:accumulation_processor_press")
  process_processor([
    "createutilities:void_steel_ingot",
    "ae2omnicells:omni_link_circuit_print",
    "createdelight:initial_processing_of_printed_omni_link_processor",
    "createdelight:omni_link_processor_inscribed",
    "ae2omnicells:omni_link_processor"
  ], "#forge:dusts/redstone", "createdelight:redstone_paste", "ae2omnicells:omni_link_print_press", 1, "#forge:storage_blocks/void_steel")
  process_processor([
    "minecraft:netherite_scrap",
    "ae2omnicells:complex_link_circuit_print",
    "createdelight:initial_processing_of_printed_complex_link_processor",
    "createdelight:complex_link_processor_inscribed",
    "ae2omnicells:complex_link_processor"
  ], "#forge:dusts/redstone", "createdelight:redstone_paste", "ae2omnicells:complex_link_print_press", 1, "#forge:storage_blocks/void_steel")
  process_processor([
    "ae2:singularity",
    "ae2omnicells:multidimensional_expansion_circuit_print",
    "createdelight:initial_processing_of_printed_multidimensional_expansion_processor",
    "createdelight:multidimensional_expansion_processor_inscribed",
    "ae2omnicells:multidimensional_expansion_processor"
  ], "#forge:dusts/redstone", "createdelight:redstone_paste", "ae2omnicells:multidimensional_expansion_print_press", 1, "#forge:storage_blocks/void_steel")

  // 陨钢锭
  create
    .mixing("16x megacells:sky_steel_ingot", [
      "8x #forge:ingots/iron",
      "8x ae2:charged_certus_quartz_crystal",
      "8x ae2:sky_stone_block",
      Fluid.of("minecraft:lava", 500),
    ])
    .id("createdelight:sky_steel_ingot");

  // 奇点
  create
    .crushing("ae2:singularity", "create:crushing_wheel")
    .id("createdelight:singularity_2");
  create.mechanical_crafting("ae2:singularity", [
    "AAAAAAAAA",
    "AAAAAAAAA",
    "AAAAAAAAA",
    "AAAAAAAAA",
    "AAAAAAAAA",
    "AAAAAAAAA",
    "AAAAAAAAA",
    "AAAAAAAAA",
    "AAAAAAAAA",
  ], {
    A: "ae2:matter_ball"
  })
    .id("createdelight:mechanical_crafting/singularity")

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
  centrifugation(event,
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
  vintageimprovements
    .curving("4x createdelight:omni_cell_housing_blank", "createutilities:void_steel_ingot")
    .head("createdelight:cell_housing_curving_head")
    .id("createdelight:omni_cell_housing_blank_curving");
  vintageimprovements
    .curving("4x createdelight:complex_omni_cell_housing_blank", "art_of_forging:forged_steel_ingot")
    .head("createdelight:cell_housing_curving_head")
    .id("createdelight:complex_omni_cell_housing_blank_curving");
  vintageimprovements
    .curving("4x createdelight:quantum_omni_cell_housing_blank", "ae2omnicells:charged_ender_ingot")
    .head("createdelight:cell_housing_curving_head")
    .id("createdelight:quantum_omni_cell_housing_blank_curving");

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

  kubejs.shapeless("createdelight:initial_processing_of_omni_cell_housing", [
    "createdelight:omni_cell_housing_blank",
    "3x #forge:dusts/ender_pearl"
  ]);
  kubejs.shapeless("createdelight:initial_processing_of_complex_omni_cell_housing", [
    "createdelight:complex_omni_cell_housing_blank",
    "3x #forge:dusts/ender_pearl",
    "ae2omnicells:complex_link_processor",
  ]);
  kubejs.shapeless("createdelight:initial_processing_of_quantum_omni_cell_housing", [
    "createdelight:quantum_omni_cell_housing_blank",
    "3x #forge:dusts/ender_pearl",
    "ae2omnicells:multidimensional_expansion_processor",
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

  create
    .sequenced_assembly(
      "createdelight:initial_processing_of_omni_cell_housing",
      "createdelight:omni_cell_housing_blank",
      [
        create.deploying("createdelight:omni_cell_housing_blank", [
          "createdelight:omni_cell_housing_blank",
          "#forge:dusts/ender_pearl",
        ])
      ]
    )
    .loops(2)
    .transitionalItem("createdelight:omni_cell_housing_blank")
    .id("createdelight:initial_processing_of_omni_cell_housing_sequenced_assembly");
  create
    .sequenced_assembly(
      "createdelight:initial_processing_of_complex_omni_cell_housing",
      "createdelight:complex_omni_cell_housing_blank",
      [
        create.deploying("createdelight:omni_cell_housing_blank", [
          "createdelight:omni_cell_housing_blank",
          "#forge:dusts/ender_pearl",
        ]),
        create.deploying("createdelight:omni_cell_housing_blank", [
          "createdelight:omni_cell_housing_blank",
          "#forge:dusts/ender_pearl",
        ]),
        create.deploying("createdelight:complex_omni_cell_housing_blank", [
          "createdelight:complex_omni_cell_housing_blank",
          "ae2omnicells:complex_link_processor",
        ]),
      ]
    )
    .loops(1)
    .transitionalItem("createdelight:complex_omni_cell_housing_blank")
    .id("createdelight:initial_processing_of_complex_omni_cell_housing_sequenced_assembly");
  create
    .sequenced_assembly(
      "createdelight:initial_processing_of_quantum_omni_cell_housing",
      "createdelight:quantum_omni_cell_housing_blank",
      [
        create.deploying("createdelight:omni_cell_housing_blank", [
          "createdelight:omni_cell_housing_blank",
          "#forge:dusts/ender_pearl",
        ]),
        create.deploying("createdelight:omni_cell_housing_blank", [
          "createdelight:omni_cell_housing_blank",
          "#forge:dusts/ender_pearl",
        ]),
        create.deploying("createdelight:complex_omni_cell_housing_blank", [
          "createdelight:complex_omni_cell_housing_blank",
          "ae2omnicells:multidimensional_expansion_processor",
        ]),
      ]
    )
    .loops(1)
    .transitionalItem("createdelight:quantum_omni_cell_housing_blank")
    .id("createdelight:initial_processing_of_quantum_omni_cell_housing_sequenced_assembly");

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

  vintageimprovements.vacuumizing("createdelight:initial_processing_of_omni_cell_housing", [
    "createdelight:omni_cell_housing_blank",
    "#forge:dusts/ender_pearl"
  ]);
  vintageimprovements.vacuumizing("createdelight:initial_processing_of_complex_omni_cell_housing", [
    "createdelight:complex_omni_cell_housing_blank",
    "#forge:dusts/ender_pearl",
    "ae2omnicells:complex_link_processor",
  ]);
  vintageimprovements.vacuumizing("createdelight:initial_processing_of_quantum_omni_cell_housing", [
    "createdelight:quantum_omni_cell_housing_blank",
    "#forge:dusts/ender_pearl",
    "ae2omnicells:multidimensional_expansion_processor",
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
  kubejs.shapeless("createdelight:unformed_omni_cell_housing", [
    "createdelight:initial_processing_of_omni_cell_housing",
    "ae2:quartz_vibrant_glass",
    "ae2:quartz_glass",
  ]);
  kubejs.shapeless("createdelight:unformed_complex_omni_cell_housing", [
    "createdelight:initial_processing_of_complex_omni_cell_housing",
    "ae2:quartz_vibrant_glass",
    "ae2:quartz_glass",
  ]);
  kubejs.shapeless("createdelight:unformed_quantum_omni_cell_housing", [
    "createdelight:initial_processing_of_quantum_omni_cell_housing",
    "ae2:quartz_vibrant_glass",
    "ae2:quartz_glass",
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
  kubejs.shapeless("createdelight:unformed_omni_cell_housing", [
    "createdelight:initial_processing_of_omni_cell_housing",
    "createdelight:quartz_vibrant_glass_parts",
    "createdelight:quartz_glass_parts",
  ]);
  kubejs.shapeless("createdelight:unformed_complex_omni_cell_housing", [
    "createdelight:initial_processing_of_complex_omni_cell_housing",
    "createdelight:quartz_vibrant_glass_parts",
    "createdelight:quartz_glass_parts",
  ]);
  kubejs.shapeless("createdelight:unformed_quantum_omni_cell_housing", [
    "createdelight:initial_processing_of_quantum_omni_cell_housing",
    "createdelight:quartz_vibrant_glass_parts",
    "createdelight:quartz_glass_parts",
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



  create
    .sequenced_assembly(
      "createdelight:unformed_omni_cell_housing",
      "createdelight:initial_processing_of_omni_cell_housing",
      [
        create.deploying("createdelight:initial_processing_of_omni_cell_housing", [
          "createdelight:initial_processing_of_omni_cell_housing",
          "createdelight:quartz_vibrant_glass_parts",
        ]),

        create.deploying("createdelight:initial_processing_of_omni_cell_housing", [
          "createdelight:initial_processing_of_omni_cell_housing",
          "createdelight:quartz_glass_parts",
        ])
      ]
    )
    .loops(1)
    .transitionalItem("createdelight:initial_processing_of_omni_cell_housing")
    .id("createdelight:unformed_omni_cell_housing_sequenced_assembly");
  create
    .sequenced_assembly(
      "createdelight:unformed_complex_omni_cell_housing",
      "createdelight:initial_processing_of_complex_omni_cell_housing",
      [
        create.deploying("createdelight:initial_processing_of_omni_cell_housing", [
          "createdelight:initial_processing_of_omni_cell_housing",
          "createdelight:quartz_vibrant_glass_parts",
        ]),

        create.deploying("createdelight:initial_processing_of_omni_cell_housing", [
          "createdelight:initial_processing_of_omni_cell_housing",
          "createdelight:quartz_glass_parts",
        ])
      ]
    )
    .loops(1)
    .transitionalItem("createdelight:initial_processing_of_complex_omni_cell_housing")
    .id("createdelight:unformed_complex_omni_cell_housing_sequenced_assembly");
  create
    .sequenced_assembly(
      "createdelight:unformed_quantum_omni_cell_housing",
      "createdelight:initial_processing_of_quantum_omni_cell_housing",
      [
        create.deploying("createdelight:initial_processing_of_omni_cell_housing", [
          "createdelight:initial_processing_of_omni_cell_housing",
          "createdelight:quartz_vibrant_glass_parts",
        ]),

        create.deploying("createdelight:initial_processing_of_omni_cell_housing", [
          "createdelight:initial_processing_of_omni_cell_housing",
          "createdelight:quartz_glass_parts",
        ])
      ]
    )
    .loops(1)
    .transitionalItem("createdelight:initial_processing_of_quantum_omni_cell_housing")
    .id("createdelight:unformed_quantum_omni_cell_housing_sequenced_assembly");

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
  vintageimprovements
    .curving("ae2omnicells:omni_cell_housing", "createdelight:unformed_omni_cell_housing")
    .head("createdelight:cell_housing_curving_head")
    .id("ae2omnicells:omni_cell_housing_1");
  vintageimprovements
    .curving("ae2omnicells:complex_omni_cell_housing", "createdelight:unformed_complex_omni_cell_housing")
    .head("createdelight:cell_housing_curving_head")
    .id("ae2omnicells:complex_omni_cell_housing_1");
  vintageimprovements
    .curving("ae2omnicells:quantum_omni_cell_housing", "createdelight:unformed_quantum_omni_cell_housing")
    .head("createdelight:cell_housing_curving_head")
    .id("ae2omnicells:quantum_omni_cell_housing_1");

  make_growing_cluster(
    event,
    [
      "ae2:certus_quartz_dust",
      "ae2:small_quartz_bud",
      "ae2:medium_quartz_bud",
      "ae2:large_quartz_bud",
      "ae2:quartz_cluster",
    ],
    "createdelight:spent_liquor",
    50
  );
  create
    .crushing(
      ["4x ae2:certus_quartz_dust", Item.of("ae2:certus_quartz_dust", 4).withChance(0.25)],
      "ae2:quartz_cluster"
    )
    .id("create:compat/crushing/certus_quartz_dust");

  create
    .mixing("16x ae2:certus_quartz_crystal", [
      Fluid.water(500),
      "8x ae2:certus_quartz_dust",
      "8x ae2:charged_certus_quartz_crystal",
    ])
    .id("create:compat/mixing/certus_quartz_crystal");
  create
    .mixing("16x ae2:fluix_crystal", [
      Fluid.water(500),
      "8x minecraft:redstone",
      "8x ae2:charged_certus_quartz_crystal",
      "8x minecraft:quartz"
    ])
    .id("create:mixing/compat/ae2/fluix_crystal");
  // 使用赛特斯石英直接产磨制玫瑰石英
  vintageimprovements
    .pressurizing(
      "create:polished_rose_quartz", [
      FluidIngredients("forge:molten_iron", 90),
      "ae2:certus_quartz_crystal"
    ]
    ).secondaryFluidInput(0)
    .id("vintageimprovements:pressurizing/polished_rose_quartz")
  // 荧石再生
  vintageimprovements
    .pressurizing(
      ["4x minecraft:glowstone_dust", Fluid.of("minecraft:water", 250)],
      Fluid.of("createdelight:sky_solution", 250)
    )
    .heated()
    .id("createdelight:regeneration_of_glowstone_1");
  create
    .mixing(
      ["2x minecraft:glowstone_dust", Fluid.of("minecraft:water", 250)],
      Fluid.of("createdelight:sky_solution", 250)
    )
    .heated()
    .id("createdelight:regeneration_of_glowstone_2");
});
