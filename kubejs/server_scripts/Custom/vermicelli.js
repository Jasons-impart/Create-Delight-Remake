ServerEvents.recipes(e => {
    // 挂面合成
    e.custom({
        type: "ratatouille:squeezing",
        ingredients: [
            {
                item: "create:dough"
            }
        ],
        results: [
            {
                item: "createdelight:vermicelli"
            }
        ]
    }).id("ratatouille:squeezing/vermicelli")
    // 挂面相关
    e.recipes.farmersdelight.cooking(
        [
            "minecraft:carrot",
            "minecraft:brown_mushroom",
            'createdelight:vermicelli',
            "#forge:salad_ingredients",
            "#forge:vegetables"
        ], "farmersdelight:vegetable_noodles", 1.0, 200
    )
    .id("farmersdelight:cooking/vegetable_noodles")
    .container("bowl")
    e.recipes.farmersdelight.cooking(
        [
            'createdelight:vermicelli',
            "#forge:cooked_eggs",
            "minecraft:dried_kelp",
            "forge:raw_pork"
        ], "farmersdelight:noodle_soup", 1.0, 200
    )
    .id("farmersdelight:cooking/noodle_soup")
    .container("bowl")
    e.recipes.farmersdelight.cooking(
        [
            'butchercraft:cubed_beef',
            'butchercraft:cubed_beef',
            'createdelight:board_noodles',
            "#forge:vegetables/carrot",
            "#forge:vegetables/cabbage",
            "#forge:vegetables/onion"
        ], 'casualness_delight:beef_noodles', 1.0, 200
    )
    .id("casualness_delight:cooking/beef_noodles")
    .container("bowl")
    // 板面相关
    e.recipes.create.sequenced_assembly('2x createdelight:board_noodles', 'create:dough', [
        e.recipes.create.pressing('create:dough', 'create:dough'),
        e.recipes.create.cutting('create:dough', 'create:dough')
    ])
    .transitionalItem('create:dough')
    .loops(2)
    .id("createdelight:recipes/board_noodles")
})