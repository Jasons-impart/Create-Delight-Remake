ServerEvents.recipes(e => {
    remove_recipes_output(e, [
        "dungeonsdelight:soft_serve_sniffer_egg"
    ])
    const {create} = e.recipes
    create.filling("dungeonsdelight:soft_serve_sniffer_egg",
         ["trailandtales_delight:cooked_sniffer_egg_block", Fluid.of("createdelightcore:adzuki_ice_cream", 1000)])
         .id("dungeonsdelight:filling/soft_serve_sniffer_egg")
    cutting_2(e, "dungeonsdelight:ghast_calamari", [["mynethersdelight:ghasta"]])
})