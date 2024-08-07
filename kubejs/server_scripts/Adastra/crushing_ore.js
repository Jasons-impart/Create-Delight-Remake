ServerEvents.recipes(e => {
    // adastra的**矿物兼容粉碎轮
    e.recipes.create.crushing([
        'create:crushed_raw_iron',
        Item.of('create:crushed_raw_iron')
            .withChance(0.75),
        Item.of('create:experience_nugget')
            .withChance(0.75),
        Item.of('ad_astra:moon_cobblestone')
            .withChance(0.12)
    ], 'ad_astra:moon_iron_ore')
    e.recipes.create.crushing([
        'create:crushed_raw_iron',
        Item.of('create:crushed_raw_iron')
            .withChance(0.75),
        Item.of('create:experience_nugget')
            .withChance(0.75),
        Item.of('ad_astra:glacio_cobblestone')
            .withChance(0.12)
    ], 'ad_astra:glacio_iron_ore')
    e.recipes.create.crushing([
        'create:crushed_raw_iron',
        Item.of('create:crushed_raw_iron')
            .withChance(0.75),
        Item.of('create:experience_nugget')
            .withChance(0.75),
        Item.of('ad_astra:mars_cobblestone')
            .withChance(0.12)
    ], 'ad_astra:mars_iron_ore')
    e.recipes.create.crushing([
        "create:crushed_raw_iron",
        Item.of('create:crushed_raw_iron')
            .withChance(0.75),
        Item.of('create:experience_nugget')
            .withChance(0.75),
        Item.of('ad_astra:mercury_cobblestone')
            .withChance(0.12)
    ], 'ad_astra:mercury_iron_ore')
    e.recipes.create.crushing([
        'minecraft:coal',
        Item.of('minecraft:coal')
            .withChance(0.75),
        Item.of('create:experience_nugget')
            .withChance(0.75),
        Item.of('ad_astra:venus_cobblestone')
            .withChance(0.12)
    ], 'ad_astra:venus_coal_ore')
    e.recipes.create.crushing([
        'minecraft:coal',
        Item.of('minecraft:coal')
            .withChance(0.75),
        Item.of('create:experience_nugget')
            .withChance(0.75),
        Item.of('ad_astra:glacio_cobblestone')
            .withChance(0.12)
    ], 'ad_astra:glacio_coal_ore')
    e.recipes.create.crushing([
        'create:crushed_raw_gold',
        Item.of('create:crushed_raw_gold')
            .withChance(0.75),
        Item.of('2x create:experience_nugget')
            .withChance(0.75),
        Item.of('ad_astra:venus_cobblestone')
            .withChance(0.12)
    ], 'ad_astra:venus_gold_ore')
    e.recipes.create.crushing([
        '5x create:crushed_raw_copper',
        Item.of('create:crushed_raw_copper')
            .withChance(0.25),
        Item.of('create:experience_nugget')
            .withChance(0.75),
        Item.of('ad_astra:glacio_cobblestone')
            .withChance(0.12)
    ], 'ad_astra:glacio_copper_ore')
    e.recipes.create.crushing([
        '10x minecraft:lapis_lazuli',
        Item.of('minecraft:lapis_lazuli')
            .withChance(0.50),
        Item.of('create:experience_nugget')
            .withChance(0.75),
        Item.of('ad_astra:glacio_cobblestone')
            .withChance(0.12)
    ], 'ad_astra:glacio_lapis_ore')
    e.recipes.create.crushing([
        'diamond',
        Item.of('diamond')
            .withChance(0.75),
        Item.of('create:experience_nugget')
            .withChance(0.75),
        Item.of('ad_astra:venus_cobblestone')
            .withChance(0.12)
    ], 'ad_astra:venus_diamond_ore')
    e.recipes.create.crushing([
        'diamond',
        Item.of('diamond')
            .withChance(0.75),
        Item.of('create:experience_nugget')
            .withChance(0.75),
        Item.of('ad_astra:mars_cobblestone')
            .withChance(0.12)
    ], 'ad_astra:mars_diamond_ore')
})
