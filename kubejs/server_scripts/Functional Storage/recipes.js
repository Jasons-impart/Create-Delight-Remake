ServerEvents.recipes((event) => {
  const { create } = event.recipes;

  let fs_upgrade = (input1, result, a, b, c) => {
    create
      .sequenced_assembly(result, input1, [
        create.deploying(input1, [input1, a]),
        create.deploying(input1, [input1, b]),
        create.deploying(input1, [input1, c]),
      ])
      .loops(1)
      .transitionalItem(input1)
      .id(`${result}_sequenced_assembly`);
  };

  create
    .sequenced_assembly("functionalstorage:copper_upgrade", "#functionalstorage:drawer", [
      create.deploying("createdelight:incomplete_fs_upgrade", [
        "createdelight:incomplete_fs_upgrade",
        "#forge:ingots/copper",
      ]),
      create.deploying("createdelight:incomplete_fs_upgrade", [
        "createdelight:incomplete_fs_upgrade",
        "#forge:storage_blocks/copper",
      ]),
      create.deploying("createdelight:incomplete_fs_upgrade", [
        "createdelight:incomplete_fs_upgrade",
        "#forge:chests/wooden",
      ]),
    ])
    .loops(1)
    .transitionalItem("createdelight:incomplete_fs_upgrade")
    .id("functionalstorage:copper_upgrade_sequenced_assembly");

  fs_upgrade(
    "functionalstorage:copper_upgrade",
    "functionalstorage:gold_upgrade",
    "#forge:ingots/gold",
    "#forge:storage_blocks/gold",
    "#forge:chests/wooden"
  );
  fs_upgrade(
    "functionalstorage:gold_upgrade",
    "functionalstorage:diamond_upgrade",
    "#forge:gems/diamond",
    "#forge:storage_blocks/diamond",
    "#forge:chests/wooden"
  );
  fs_upgrade(
    "#functionalstorage:drawer",
    "functionalstorage:iron_downgrade",
    "#forge:ingots/iron",
    "#forge:ingots/iron",
    "#forge:ingots/iron"
  );

  event.replaceInput(
    { id: 'functionalstorage:compacting_drawer' },
    'minecraft:stone',
    '#forge:stone'
  );
  event.replaceInput(
    { id: 'functionalstorage:simple_compacting_drawer' },
    'minecraft:stone',
    '#forge:stone'
  )
});
