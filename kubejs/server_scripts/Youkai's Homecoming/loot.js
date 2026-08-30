LootJS.modifiers(e => {
  e.addEntityLootModifier("youkaishomecoming:tuna")
    .replaceLoot("minecraft:bone_meal", "crabbersdelight:fish_bones")
  e.addEntityLootModifier("alexsmobs:catfish")
    .addLoot("crabbersdelight:fish_bones")
})