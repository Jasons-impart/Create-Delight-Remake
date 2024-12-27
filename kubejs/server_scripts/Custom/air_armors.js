/** @format */

ServerEvents.recipes((event) => {
  const { create, vintageimprovements, minecraft } = event.recipes;
  ["helmet", "chestplate", "leggings", "boots"].forEach((a) => {
    vintageimprovements
      .pressurizing(
        [Item.of(`createdelight:air_${a}`, 1, { Damage: 0, Unbreakable: 1 })],
        [
          `minecraft:leather_${a}`,
          "ae2:quantum_entangled_singularity",
          "ae2:quantum_entangled_singularity",
        ]
      )
      .superheated()
      .id(`createdelight:air_${a}`);
  });
});
