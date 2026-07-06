ServerEvents.recipes(e => {
  const{create, kubejs} = e.recipes

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
{
  let iner = 'eclipticseasons:spring_greenhouse_essence'
  create.sequenced_assembly('2x eclipticseasons:spring_greenhouse_essence', 'eclipticseasons:spring_greenhouse_essence', 
    [
      create.deploying(iner, [iner, 'create:blaze_burner']),
      create.deploying(iner, [iner, 'cmr:snowman_cooler']),
      create.filling(iner, [iner, Fluid.of("create_enchantment_industry:experience", 250)])
    ]
  )
    .loops(1)
    .transitionalItem(iner)
    .id("createdelight:spring_greenhouse_essence")
}
{
  let iner = 'eclipticseasons:summer_greenhouse_essence'
  create.sequenced_assembly('2x eclipticseasons:summer_greenhouse_essence', 'eclipticseasons:summer_greenhouse_essence',
    [
      create.deploying(iner, [iner, 'create:blaze_burner']),
      create.deploying(iner, [iner, 'cmr:snowman_cooler']),
      create.filling(iner, [iner, Fluid.of("create_enchantment_industry:experience", 250)])  
    ]
  )
    .loops(1)
    .transitionalItem(iner)
    .id("createdelight:summer_greenhouse_essence")
}
{
  let iner = 'eclipticseasons:autumn_greenhouse_essence'
  create.sequenced_assembly('2x eclipticseasons:autumn_greenhouse_essence', 'eclipticseasons:autumn_greenhouse_essence',
    [
      create.deploying(iner, [iner, 'create:blaze_burner']),
      create.deploying(iner, [iner, 'cmr:snowman_cooler']),
      create.filling(iner, [iner, Fluid.of("create_enchantment_industry:experience", 250)])
    ]
  )
    .loops(1)
    .transitionalItem(iner)
    .id("createdelight:autumn_greenhouse_essence")
}
{
  let iner = 'eclipticseasons:winter_greenhouse_essence'
  create.sequenced_assembly('2x eclipticseasons:winter_greenhouse_essence', 'eclipticseasons:winter_greenhouse_essence',
    [
      create.deploying(iner, [iner, 'create:blaze_burner']),
      create.deploying(iner, [iner, 'cmr:snowman_cooler']),
      create.filling(iner, [iner, Fluid.of("create_enchantment_industry:experience", 250)])   
    ]
  )
    .loops(1)
    .transitionalItem(iner)
    .id("createdelight:winter_greenhouse_essence")
}
})
