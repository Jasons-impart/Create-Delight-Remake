ServerEvents.recipes((e) => {
  [
    // Example of removing an ore vein and its associated recipe
    { id: "createoreexcavation:ore_vein_type/coal" }, // Replace 'ore_vein_type/coal' with the ore vein you want to remove
    { mod: "createoreexcavation", output: "minecraft:coal" }, // Replace 'minecraft:coal' with the corresponding product of the vein

    { id: "createoreexcavation:ore_vein_type/copper" },
    { mod: "createoreexcavation", output: "minecraft:copper" },

    { id: "createoreexcavation:ore_vein_type/diamond" },
    { mod: "createoreexcavation", output: "minecraft:diamond" },

    { id: "createoreexcavation:ore_vein_type/emerald" },
    { mod: "createoreexcavation", output: "minecraft:emerald" },

    { id: "createoreexcavation:ore_vein_type/glowstone" },
    { mod: "createoreexcavation", output: "minecraft:glowstone" },

    { id: "createoreexcavation:ore_vein_type/gold" },
    { mod: "createoreexcavation", output: "minecraft:gold" },

    { id: "createoreexcavation:ore_vein_type/hardened_diamond" },
    { mod: "createoreexcavation", output: "minecraft:hardened_diamond" },

    { id: "createoreexcavation:ore_vein_type/iron" },
    { mod: "createoreexcavation", output: "minecraft:iron" },

    { id: "createoreexcavation:ore_vein_type/lapis" },
    { mod: "createoreexcavation", output: "minecraft:lapis" },

    { id: "createoreexcavation:ore_vein_type/nether_gold" },
    { mod: "createoreexcavation", output: "minecraft:nether_gold" },

    { id: "createoreexcavation:ore_vein_type/netherite" },
    { mod: "createoreexcavation", output: "minecraft:netherite" },

    { id: "createoreexcavation:ore_vein_type/quartz" },
    { mod: "createoreexcavation", output: "minecraft:quartz" },

    { id: "createoreexcavation:ore_vein_type/redstone" },
    { mod: "createoreexcavation", output: "minecraft:redstone" },

    { id: "createoreexcavation:ore_vein_type/zinc" },
    { mod: "createoreexcavation", output: "minecraft:zinc" },

    // Example of removing a fluid vein and its associated recipe
    { id: "createoreexcavation:ore_vein_type/water" }, // Replace 'ore_vein_type/water' with the fluid vein you want to remove
    { mod: "createoreexcavation", output: Fluid.of("minecraft:water") }, // Fluid.of(<fluid>) is required for identifying fluids
  ].forEach((recipe) => {
    e.remove(recipe);
  });
});
