StartupEvents.registry("minecraft:mob_effect", e => {
  e.create("createdelight:daredevil_form")
    .modifyAttribute("minecraft:generic.max_health", "daredevilFormHealthDecrease", -0.01, "multiply_total")
    .modifyAttribute("minecraft:generic.armor", "daredevilFormArmorDecrease", -0.01, "multiply_total")
    .modifyAttribute("minecraft:generic.attack_damage", "daredevilFormAttackIncrease", 0.02, "multiply_total")
    .modifyAttribute("minecraft:generic.attack_speed", "daredevilFormAttackSpeedIncrease", 0.02, "multiply_total")

  e.create("createdelight:dragon_breath_resistance")
    .beneficial()
    .color(Color.rgba(43, 10, 61, 255))

  // Independent display effect for Tetra sun light materials. The original
  // Black Knight Armor effect is removed every tick unless the player wears
  // the mod's complete Solar Flare armor set.
  e.create("createdelight:solar_guard")
    .beneficial()
    .color(Color.rgba(255, 190, 64, 255))

})
