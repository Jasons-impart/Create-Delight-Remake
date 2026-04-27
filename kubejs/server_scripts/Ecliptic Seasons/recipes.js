ServerEvents.recipes(e => {
  const{create} = e.recipes
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