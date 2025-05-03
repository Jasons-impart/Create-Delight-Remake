ServerEvents.recipes(e => {
    const {farmersdelight} = e.recipes
    remove_recipes_input(e, [
        "miners_delight:baked_tentacles",
        "miners_delight:tentacles", 
        "miners_delight:squid", 
        "miners_delight:glow_squid", 
        "miners_delight:baked_squid"
    ])
    remove_recipes_id(e, [
        "miners_delight:string_from_gossypium"
    ])
    farmersdelight.cutting("miners_delight:gossypium", "#forge:shears", [
        "kinetic_pixel:graycotton", 
        Item.of("kinetic_pixel:graycotton").withChance(0.25)])
        .id("miners_delight:cutting/graycotton")
        
})