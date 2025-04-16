ServerEvents.recipes(e => {
    const {create} = e.recipes
    create.item_application("createdelightcore:forge_steel_casing", ["ad_astra:steel_plating", "art_of_forging:forged_steel_ingot"])
    .id("createdelightcore:forge_steel_casing")
})