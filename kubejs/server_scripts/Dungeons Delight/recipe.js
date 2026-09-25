ServerEvents.recipes(e => {
    remove_recipes_output(e, [
        "dungeonsdelight:soft_serve_sniffer_egg"
    ])
    remove_recipes_id(e, [
        "farmersdelight:cutting/sculk_mayo_block"
    ])
    const {create, ratatouille} = e.recipes
    create.filling("dungeonsdelight:soft_serve_sniffer_egg",
         ["trailandtales_delight:cooked_sniffer_egg_block", Fluid.of("cosmopolitan:adzuki_ice_cream", 1000)])
         .id("createdelight:filling/soft_serve_sniffer_egg")
    cutting(e, "dungeonsdelight:ghast_calamari", "mynethersdelight:ghasta")
    threshing(e, "dungeonsdelight:gunk", [
        "dungeonsdelight:wormroot_tendrils",
        Item.of("dungeonsdelight:wormroot_tendrils").withChance(0.5),
        "farmersdelight:straw",
        Item.of("2x minecraft:slime_ball").withChance(0.4)
    ], 400)
    ratatouille.squeezing(
        "dungeonsdelight:snifferwurst",
        [
            "ratatouille:sausage_casing",
            Fluid.of("createdelightcore:slime", 250),
            'dungeonsdelight:sniffer_shank'
        ]
    ).id("createdelight:monster_cooking/misc/snifferwurst")

    // 怪物烹饪配方（原为 kubejs/data/dungeonsdelight/recipes/monster_cooking/ 下的数据包配方）
    e.recipes.dungeonsdelight.monster_cooking(
        "dungeonsdelight:bloody_mary",
        [
            "dungeonsdelight:gritty_flesh",
            "dungeonsdelight:gritty_flesh",
            "#createdelight:silverfish_meat",
            "#forge:crops/cabbage"
        ],
        200, 1.0, "drinks"
    ).id("dungeonsdelight:monster_cooking/drinks/bloody_mary")
    e.recipes.dungeonsdelight.monster_cooking(
        "dungeonsdelight:silverfish_fried_rice",
        [
            "#createdelight:silverfish_meat",
            "minecraft:carrot",
            "#forge:crops/cabbage",
            "farmersdelight:rice",
            "#forge:cooked_eggs"
        ],
        200, 1.0, "meals"
    ).id("dungeonsdelight:monster_cooking/meals/silverfish_fried_rice")
})


