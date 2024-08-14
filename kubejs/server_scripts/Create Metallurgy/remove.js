ServerEvents.tags("block", e => {
    e.remove('forge:storage_blocks/steel', [
        'createmetallurgy:coke_block'
    ])
})
ServerEvents.tags("item", e => {
    e.remove('forge:storage_blocks/steel', [
        'createmetallurgy:coke_block'
    ])
    e.removeAllTagsFrom([
        "ad_astra:steel_ingot",
        "ad_astra:steel_rod",
        "ad_astra:steel_block"
    ])
})
ServerEvents.recipes(e => {
    e.remove({type: "createbigcannons:melting"})
    e.replaceInput({mod: "createmetallurgy"}, 'create:andesite_alloy', 'createbigcannons:cast_iron_ingot')
    e.replaceInput({mod: "ad_astra"}, 'ad_astra:steel_rod', 'vintageimprovements:steel_rod')
})