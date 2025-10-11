ServerEvents.tags("item", e => {
    e.add("supplementaries:cookies", [
        "vintagedelight:oatmeal_cookie",
        "fruitsdelight:persimmon_cookie",
        "fruitsdelight:lemon_cookie",
        "fruitsdelight:cranberry_cookie",
        "fruitsdelight:bayberry_cookie"
    ])
})

ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "quark:tweaks/crafting/utility/bent/cookie",
        "minecraft:cookie",
        "create_central_kitchen:compacting/cookie",
        "fruitsdelight:persimmon_cookie",
        "fruitsdelight:lemon_cookie",
        "fruitsdelight:cranberry_cookie",
        "fruitsdelight:bayberry_cookie",
        "farmersrespite:green_tea_cookie",
        "farmersdelight:honey_cookie",
        "create_central_kitchen:compacting/honey_cookie",
        "farmersdelight:sweet_berry_cookie",
        "create_central_kitchen:compacting/sweet_berry_cookie",
        "miners_delight:bat_cookie",
        "cosmopolitan:farmersdelight/paw_cookie",
        "cosmopolitan:farmersdelight/birch_cookie"
    ])
    let recipes = [
        ["4x createdelight:oatmeal_cookie_dough", "vintagedelight:raw_oats", "vintagedelight:oatmeal_cookie"],
        ["4x createdelight:chocolate_cookie_dough", "#forge:bars/chocolate", "minecraft:cookie"],
        ["4x createdelight:persimmon_cookie_dough", "fruitsdelight:dried_persimmon", "fruitsdelight:persimmon_cookie"],
        ["4x createdelight:lemon_cookie_dough", "fruitsdelight:lemon_slice", "fruitsdelight:lemon_cookie"],
        ["4x createdelight:cranberry_cookie_dough", "fruitsdelight:cranberry", "fruitsdelight:cranberry_cookie"],
        ["4x createdelight:bayberry_cookie_dough", "fruitsdelight:bayberry", "fruitsdelight:bayberry_cookie"],
        ["4x createdelight:green_tea_cookie_dough", "farmersrespite:green_tea_leaves", "farmersrespite:green_tea_cookie"],
        ["4x createdelight:sweet_berry_cookie_dough", "minecraft:sweet_berries", "farmersdelight:sweet_berry_cookie"],
        ["4x createdelight:honey_cookie_dough", "minecraft:honeycomb", "farmersdelight:honey_cookie"],
        ["4x createdelight:lime_cookie_dough", "#forge:fruits/lime", "collectorsreap:lime_cookie"],
        ["4x createdelight:chorus_cookie_dough", '#forge:chorus_fruits', 'ends_delight:chorus_cookie']
    ]
    recipes.forEach(([result, input, cookie]) => {
        e.recipes.create.mixing(
            result,
            [
                input,
                "#forge:animal_oil",
                Fluid.of("createdelight:cake_batter", 100)
            ]
        ).id(`createdelight:mixing/${result.split(":")[1]}`)
        baking(e, result.split(" ")[1], cookie, 4, "food", 100)
    });
    // 蝙蝠曲奇
    e.recipes.create.filling(
        "createdelight:bat_cookie_dough",
        [
            Fluid.of("createdelight:cake_batter", 100),
            '#miners_delight:bat_wing'
        ]
    ).id("createdelight:filling/bat_cookie_dough")
    baking(e, "createdelight:bat_cookie_dough", 'miners_delight:bat_cookie', 1, "food", 100)
    //猫爪曲奇
    e.recipes.create.mixing(
        "4x createdelight:paw_cookie_dough",
        [
            'cosmopolitan:wheatgrass',
            "#minecraft:fishes",
            Fluid.of("createdelight:cake_batter", 100)
        ]
    ).id("createdelight:mixing/paw_cookie_dough")
    baking(e, "createdelight:paw_cookie_dough", 'cosmopolitan:paw_cookie', 4, "food", 100)
    //白桦曲奇
    e.recipes.create.filling(
        'cosmopolitan:birch_cookie',
        [
            'minecraft:cookie',
            Fluid.of("cosmopolitan:birch_sap", 250)
        ]
    ).id("cosmopolitan:general/birch_cookie")
})
    // 白桦曲奇清除挖掘疲劳
    ItemEvents.foodEaten("cosmopolitan:birch_cookie", e => {
        if(e.player.getActiveEffects().toString().search("mining_fatigue") != -1){
            e.player.removeEffect("minecraft:mining_fatigue")
        }
        return
    })