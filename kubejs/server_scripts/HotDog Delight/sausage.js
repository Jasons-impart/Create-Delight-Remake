ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "hotdog_delight:codcook_1",
        "hotdog_delight:salcook_1",
        "hotdog_delight:porkcook",
        "hotdog_delight:codrecp_2",
    ])
    e.recipes.create.cutting(
        "2x ratatouille:sausage_casing",
        "minecraft:slime_ball"
    ).id("create:cutting/sausage")
    
    // 创建一个函数来简化香肠配方的定义
    function addSausageRecipe(output, ingredient, recipeId) {
        e.recipes.ratatouille.squeezing(
            output,
            [
                "ratatouille:sausage_casing",
                ingredient,
                Fluid.of("luncheonmeatsdelight:flesh_mud", 250)
            ]
        ).id(recipeId)
    }
    
    // 使用函数添加所有香肠配方
    addSausageRecipe("hotdog_delight:cod_sausage", '#forge:raw_fishes/cod', "hotdog_delight:codsrecp")
    addSausageRecipe("hotdog_delight:salmon_sausage", '#forge:raw_fishes/salmon', "hotdog_delight:salmonsrecp")
    addSausageRecipe("hotdog_delight:pork_sausage", '#forge:pork/raw', "hotdog_delight:porksaurecp")
    addSausageRecipe("hotdog_delight:squid_ink_sausage", 'oceanic_delight:squid_tentacles', "hotdog_delight:inksrecp")
    addSausageRecipe("hotdog_delight:glow_squid_ink_sausage", 'oceanic_delight:glow_squid_tentacles', "hotdog_delight:glorecp")
    addSausageRecipe("hotdog_delight:pumpkin_sausage", 'farmersdelight:pumpkin_slice', "hotdog_delight:pumpkinrecp")
    e.recipes.ratatouille.squeezing(
        "dungeonsdelight:snifferwurst",
        [
            "ratatouille:sausage_casing",
            Fluid.of("createdelightcore:slime", 250),
            'dungeonsdelight:sniffer_shank'
        ]
    ).id("dungeonsdelight:monster_cooking/misc/snifferwurst")
})