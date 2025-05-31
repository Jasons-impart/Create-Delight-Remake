ServerEvents.recipes(e => {
    const {kubejs, create} = e.recipes
    create.item_application("createdelightcore:forge_steel_casing", ["ad_astra:steel_plating", "art_of_forging:forged_steel_ingot"])
    .id("createdelightcore:forge_steel_casing")
    create.item_application("createdelightcore:steel_casing", ["create:andesite_casing", "#forge:ingots/steel"])
    .id("createdelightcore:steel_casing")
    kubejs.shaped(
        'createdelightcore:steel_glass_casing',
        [
            'createdelightcore:steel_casing',
            "create:framed_glass"
        ]
    ).id("createdelightcore:shaped/steel_glass_casing")
    kubejs.shaped(
        'createdelightcore:steel_clear_glass_casing',
        [
            'createdelightcore:steel_glass_casing',
            "create:framed_glass"
        ]
    ).id("createdelightcore:shaped/steel_clear_glass_casing")
})