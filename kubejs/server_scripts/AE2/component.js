ServerEvents.recipes((event) => {

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


  const { create, vintageimprovements } = event.recipes;
  let i1k = "ae2:cell_component_1k";
  let i4k = "ae2:cell_component_4k";
  let i16k = "ae2:cell_component_16k";
  let i64k = "ae2:cell_component_64k";
  let i256k = "ae2:cell_component_256k";
  let i1m = "megacells:cell_component_1m";
  let i4m = "megacells:cell_component_4m";
  let i16m = "megacells:cell_component_16m";
  let i64m = "megacells:cell_component_64m";
  let i256m = "megacells:cell_component_256m";

  // 乱码生成
  // function generateRandomStringWithNumbers(length) {
  //   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  //   let result = '';
  //   for (let i = 0; i < length; i++) {
  //     const randomIndex = Math.floor(Math.random() * characters.length);
  //     result += characters[randomIndex];
  //   }
  //   return result;
  // }

  // const ran_str = generateRandomStringWithNumbers(4);

  function seq_1(input, output, a, b, c, d, e) {
    let iner = "createdelight:incomplete_" + output.split(":")[1]
    create
      .sequenced_assembly(output, input, [
        // vintageimprovements.polishing(iner, input),
        create.deploying(iner, [iner, a]),
        create.deploying(iner, [iner, b]),
        create.deploying(iner, [iner, c]),
        create.deploying(iner, [iner, d]),
        vintageimprovements.curving(iner, iner).head("createdelight:cell_housing_curving_head"),
      ])
      .loops(1)
      .transitionalItem(iner)
      .id(`${output}_sequenced_assembly_a`);

    create
      .sequenced_assembly(output, input, [
        // vintageimprovements.polishing(iner, input),
        create.deploying(iner, [iner, e]),
        create.deploying(iner, [iner, e]),
        create.deploying(iner, [iner, b]),
        create.deploying(iner, [iner, c]),
        create.deploying(iner, [iner, d]),
        vintageimprovements.curving(iner, iner).head("createdelight:cell_housing_curving_head"),
      ])
      .loops(1)
      .transitionalItem(iner)
      .id(`${output}_sequenced_assembly_b`);

    create
      .sequenced_assembly(output, input, [
        // vintageimprovements.polishing(iner, iner),
        vintageimprovements.vacuumizing(iner, [iner, e]),
        create.deploying(iner, [iner, b]),
        create.deploying(iner, [iner, c]),
        create.deploying(iner, [iner, d]),
        vintageimprovements.curving(iner, iner).head("createdelight:cell_housing_curving_head"),
      ])
      .loops(1)
      .transitionalItem(iner)
      .id(`${output}_sequenced_assembly_c`);
  }

  function seq_2(input, output, b, c, d, e) {
    let iner = "createdelight:incomplete_" + output.split(":")[1]
    create
      .sequenced_assembly(output, input, [
        // vintageimprovements.polishing(iner, iner),
        create.deploying(iner, [iner, e]),
        create.deploying(iner, [iner, e]),
        create.deploying(iner, [iner, b]),
        create.deploying(iner, [iner, c]),
        create.deploying(iner, [iner, d]),
        vintageimprovements.curving(iner, iner).head("createdelight:cell_housing_curving_head"),
      ])
      .loops(1)
      .transitionalItem(iner)
      .id(`${output}_sequenced_assembly_a`);

    create
      .sequenced_assembly(output, input, [
        // vintageimprovements.polishing(iner, iner),
        vintageimprovements.vacuumizing(iner, [iner, e]),
        create.deploying(iner, [iner, b]),
        create.deploying(iner, [iner, c]),
        create.deploying(iner, [iner, d]),
        vintageimprovements.curving(iner, iner).head("createdelight:cell_housing_curving_head"),
      ])
      .loops(1)
      .transitionalItem(iner)
      .id(`${output}_sequenced_assembly_b`);
  }

  /**
   * 
   * @param {OutputItem_} result 
   * @param {InputItem_} ingr1 
   * @param {InputItem_} ingr2 
   * @param {InputItem_} ingr3 
   * @param {InputItem_} ingr4 
   */
  function craft_shaped(result, ingr1, ingr2, ingr3, ingr4) {
    event.recipes.kubejs.shaped(result, [
      "ADA",
      "CBC",
      "ACA"
    ],
      {
        A: ingr1,
        B: ingr2,
        C: ingr3,
        D: ingr4
      })
      .id(`${result}_shaped`)
  }

  craft_shaped(i1k, "ae2:certus_quartz_crystal", "#createdelight:quartz_glass", "#forge:dusts/redstone", "ae2:logic_processor")
  craft_shaped(i4k, i1k, "#createdelight:quartz_glass", "#forge:dusts/redstone", "ae2:calculation_processor")
  craft_shaped(i16k, i4k, "#createdelight:quartz_glass", "#forge:dusts/glowstone", "ae2:calculation_processor")
  craft_shaped(i64k, i16k, "#createdelight:quartz_glass", "#forge:dusts/glowstone", "ae2:calculation_processor")
  craft_shaped(i256k, i64k, "#createdelight:quartz_glass", "ae2:sky_dust", "ae2:calculation_processor")
  craft_shaped(i1m, i256k, "#createdelight:quartz_vibrant_glass", "ae2:sky_dust", "megacells:accumulation_processor")
  craft_shaped(i4m, i1m, "#createdelight:quartz_vibrant_glass", "#forge:dusts/ender_pearl", "megacells:accumulation_processor")
  craft_shaped(i16m, i4m, "#createdelight:quartz_vibrant_glass", "#forge:dusts/ender_pearl", "megacells:accumulation_processor")
  craft_shaped(i64m, i16m, "#createdelight:quartz_vibrant_glass", "ae2:matter_ball", "megacells:accumulation_processor")
  craft_shaped(i256m, i64m, "#createdelight:quartz_vibrant_glass", "ae2:matter_ball", "megacells:accumulation_processor")

  // 1k ME存储组件
  seq_1(
    "ae2:certus_quartz_crystal",
    i1k,
    "createdelight:redstone_paste",
    "ae2:certus_quartz_crystal",
    "ae2:logic_processor",
    "#createdelight:quartz_glass",
    "#forge:dusts/redstone"
  );

  // 4k ME存储组件
  seq_1(
    i1k,
    i4k,
    "createdelight:redstone_paste",
    i1k,
    "ae2:calculation_processor",
    "#createdelight:quartz_glass",
    "#forge:dusts/redstone"
  );

  // 16k ME存储组件
  seq_1(
    i4k,
    i16k,
    "createdelight:glowstone_paste",
    i4k,
    "ae2:calculation_processor",
    "#createdelight:quartz_glass",
    "#forge:dusts/glowstone"
  );

  // 64k ME存储组件
  seq_1(
    i16k,
    i64k,
    "createdelight:glowstone_paste",
    i16k,
    "ae2:calculation_processor",
    "#createdelight:quartz_glass",
    "#forge:dusts/glowstone"
  );

  // 256k ME存储组件
  seq_1(
    i64k,
    i256k,
    "createdelight:sky_stone_paste",
    i64k,
    "ae2:calculation_processor",
    "#createdelight:quartz_glass",
    "ae2:sky_dust"
  );

  // 1m ME存储组件
  seq_1(
    i256k,
    i1m,
    "createdelight:sky_stone_paste",
    i256k,
    "megacells:accumulation_processor",
    "#createdelight:quartz_vibrant_glass",
    "ae2:sky_dust"
  );

  // 4m ME存储组件
  seq_2(
    i1m,
    i4m,
    i1m,
    "megacells:accumulation_processor",
    "#createdelight:quartz_vibrant_glass",
    "#forge:dusts/ender_pearl"
  );

  // 16m ME存储组件
  seq_2(
    i4m,
    i16m,
    i4m,
    "megacells:accumulation_processor",
    "#createdelight:quartz_vibrant_glass",
    "#forge:dusts/ender_pearl"
  );

  // 64m ME存储组件
  seq_2(
    i16m,
    i64m,
    i16m,
    "megacells:accumulation_processor",
    "#createdelight:quartz_vibrant_glass",
    "ae2:matter_ball"
  );

  // 256m ME存储组件
  seq_2(
    i64m,
    i256m,
    i64m,
    "megacells:accumulation_processor",
    "#createdelight:quartz_vibrant_glass",
    "ae2:matter_ball"
  );

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
});
