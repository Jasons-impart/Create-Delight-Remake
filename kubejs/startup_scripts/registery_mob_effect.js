StartupEvents.registry("minecraft:mob_effect", e => {
  e.create("createdelight:daredevil_form")
  .modifyAttribute("minecraft:generic.max_health", "daredevilFormHealthDecrease", -0.01, "multiply_total")
  .modifyAttribute("minecraft:generic.armor", "daredevilFormArmorDecrease", -0.01, "multiply_total")
  .modifyAttribute("minecraft:generic.attack_damage", "daredevilFormAttackIncrease", 0.02, "multiply_total")
  .modifyAttribute("minecraft:generic.attack_speed", "daredevilFormAttackSpeedIncrease", 0.02, "multiply_total")
})