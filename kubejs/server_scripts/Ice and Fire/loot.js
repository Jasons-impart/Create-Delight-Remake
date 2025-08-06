LootJS.modifiers(e => {
    e.addEntityLootModifier("iceandfire:stymphalian_bird")
        .replaceLoot("iceandfire:copper_nugget", 'create:copper_nugget')
    e.addLootTableModifier("idas:chests/dread_citadel/dread_citadel_throne")
        .addLoot("createdelight:dread_upgrade_smithing_template")
})
