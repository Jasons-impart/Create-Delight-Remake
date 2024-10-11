ServerEvents.recipes((event) => {
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
    create
      .sequenced_assembly(output, input, [
        vintageimprovements.polishing(input, input),
        create.deploying(input, [input, a]),
        create.deploying(input, [input, b]),
        create.deploying(input, [input, c]),
        create.deploying(input, [input, d]),
        vintageimprovements.curving(input, input).head("createdelight:cell_housing_curving_head"),
      ])
      .loops(1)
      .transitionalItem(input)
      .id(`${output}_sequenced_assembly_a`);

    create
      .sequenced_assembly(output, input, [
        vintageimprovements.polishing(input, input),
        create.deploying(input, [input, e]),
        create.deploying(input, [input, e]),
        create.deploying(input, [input, b]),
        create.deploying(input, [input, c]),
        create.deploying(input, [input, d]),
        vintageimprovements.curving(input, input).head("createdelight:cell_housing_curving_head"),
      ])
      .loops(1)
      .transitionalItem(input)
      .id(`${output}_sequenced_assembly_b`);

    create
      .sequenced_assembly(output, input, [
        vintageimprovements.polishing(input, input),
        vintageimprovements.vacuumizing(input, [input, e]),
        create.deploying(input, [input, b]),
        create.deploying(input, [input, c]),
        create.deploying(input, [input, d]),
        vintageimprovements.curving(input, input).head("createdelight:cell_housing_curving_head"),
      ])
      .loops(1)
      .transitionalItem(input)
      .id(`${output}_sequenced_assembly_c`);
  }

  function seq_2(input, output, b, c, d, e) {
    create
      .sequenced_assembly(output, input, [
        vintageimprovements.polishing(input, input),
        create.deploying(input, [input, e]),
        create.deploying(input, [input, e]),
        create.deploying(input, [input, b]),
        create.deploying(input, [input, c]),
        create.deploying(input, [input, d]),
        vintageimprovements.curving(input, input).head("createdelight:cell_housing_curving_head"),
      ])
      .loops(1)
      .transitionalItem(input)
      .id(`${output}_sequenced_assembly_a`);

    create
      .sequenced_assembly(output, input, [
        vintageimprovements.polishing(input, input),
        vintageimprovements.vacuumizing(input, [input, e]),
        create.deploying(input, [input, b]),
        create.deploying(input, [input, c]),
        create.deploying(input, [input, d]),
        vintageimprovements.curving(input, input).head("createdelight:cell_housing_curving_head"),
      ])
      .loops(1)
      .transitionalItem(input)
      .id(`${output}_sequenced_assembly_b`);
  }

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
    i64k,
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
});
