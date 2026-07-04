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
})
