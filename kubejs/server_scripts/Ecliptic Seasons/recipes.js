ServerEvents.recipes(e => {
  const { kubejs } = e.recipes

  remove_recipes_id(e, [
    "eclipticseasons:humidity_tank",
    "eclipticseasons:dehumidifier"
  ])

  kubejs.shaped("eclipticseasons:humidity_tank", [
    "SBS",
    "BCB",
    "SLS"
  ], {
    S: "#minecraft:wooden_slabs",
    B: "#minecraft:planks",
    C: "minecraft:water_bucket",
    L: "#createdelightcore:life_matter"
  })
  .id("createdelight:eclipticseasons/humidity_tank")

  kubejs.shaped("eclipticseasons:dehumidifier", [
    "PLP",
    "PHN",
    "SSS"
  ], {
    P: "#minecraft:planks",
    L: "#createdelightcore:life_matter",
    H: "minecraft:hay_block",
    N: "#minecraft:wooden_slabs",
    S: "minecraft:iron_nugget"
  })
  .id("createdelight:eclipticseasons/dehumidifier")
})
