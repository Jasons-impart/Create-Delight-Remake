ServerEvents.recipes(e => {
  const{youkaishomecoming} = e.recipes
  youkaishomecoming.cuisine_mixed(
    "youkaishomecoming:california_roll",
    "youkaishomecoming:california",
    "create_bic_bit:mayonnaise_bottle",
    [
      '#forge:slices/cucumber',
      "youkaishomecoming:tamagoyaki_slice",
      "youkaishomecoming:imitation_crab"
    ]
  ).id("youkaishomecoming:california_roll")
})