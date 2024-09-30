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

  fs_upgrade(
    "#functionalstorage:drawer",
    "functionalstorage:copper_upgrade",
    "#forge:ingots/copper",
    "#forge:storage_blocks/copper",
    "#forge:chests/wooden"
  );
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
});
