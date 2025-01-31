LootJS.modifiers(e => {
    e.addBlockLootModifier("youkaishomecoming:wild_tea")
    .replaceLoot("youkaishomecoming:tea_seeds", "farmersrespite:tea_seeds")
    e.addBlockLootModifier("youkaishomecoming:wild_coffea")
    .replaceLoot("youkaishomecoming:coffee_berries", "createcafe:coffee_fruit")
    e.addBlockLootModifier("youkaishomecoming:wild_redbean")
    .replaceLoot("youkaishomecoming:redbean", "createdelight:adzuki_beans_seed")
})