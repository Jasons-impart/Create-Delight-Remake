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
        "create_central_kitchen:compacting/sweet_berry_cookie"
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
        ["4x createdelight:honey_cookie_dough", "minecraft:honeycomb", "farmersdelight:honey_cookie"]
    ]
    recipes.forEach(([result, input, cookie]) => {
        e.recipes.create.mixing(
            result,
            [
                input,
                "minecraft:sugar",
                "#forge:animal_oil",
                "bakeries:flour",
                Fluid.of("createdelight:egg_yolk", 50)
            ]
        ).id(`createdelight:mixing/${result.split(":")[1]}_1`)
        e.recipes.create.mixing(
            result,
            [
                input,
                Fluid.of("create:honey", 50),
                "createdelight:butter",
                "bakeries:flour",
                Fluid.of("createdelight:egg_yolk", 50)
            ]
        ).id(`createdelight:mixing/${result.split(":")[1]}_2`)
        baking(e, result.split(" ")[1], cookie, 4, "food", 100)
    });
})