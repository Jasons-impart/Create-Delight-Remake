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
        "ad_astra:steel_nugget",
        "ad_astra:steel_rod",
        "ad_astra:steel_block"
    ])
})
ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "createbigcannons:mixing/alloy_nethersteel_cast_iron",
        "createbigcannons:cast_iron_block",
        "createbigcannons:cast_iron_ingot_from_block",
        "createbigcannons:cast_iron_ingot_from_nuggets",
        "createbigcannons:compacting/forge_cast_iron_ingot",
        "createbigcannons:compacting/forge_cast_iron_nugget",
        "create:mixing/brass_ingot",
        "ad_astra:alloying/steel_ingot_from_alloying_iron_ingot_and_coals",
        "ad_astra:steel_ingot_from_steel_block",
        "ad_astra:steel_ingot",
        "ad_astra:steel_rod",
        "ad_astra:steel_nugget"
    ])
    e.remove({type: "createbigcannons:melting"})
    e.replaceInput({mod: "createmetallurgy"}, 'create:andesite_alloy', 'createbigcannons:cast_iron_ingot')
    e.replaceInput({mod: "ad_astra"}, 'ad_astra:steel_rod', 'vintageimprovements:steel_rod')
})