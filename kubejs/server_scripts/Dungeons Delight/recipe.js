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
         .id("dungeonsdelight:filling/soft_serve_sniffer_egg")
    cutting_2(e, "dungeonsdelight:ghast_calamari", [["mynethersdelight:ghasta"]])
    e.recipes.ratatouille.threshing(
        [
            "dungeonsdelight:wormroot_tendrils",
            Item.of("2x minecraft:bone_meal").withChance(0.6),
            Item.of("2x minecraft:slime_ball").withChance(0.4),
            "2x farmersdelight:straw"
        ],
        "dungeonsdelight:gunk", 400
    ).id("dungeonsdelight:threshing/gunk")
    ratatouille.squeezing(
        "dungeonsdelight:snifferwurst",
        [
            "ratatouille:sausage_casing",
            Fluid.of("createdelightcore:slime", 250),
            'dungeonsdelight:sniffer_shank'
        ]
    ).id("dungeonsdelight:monster_cooking/misc/snifferwurst")
})