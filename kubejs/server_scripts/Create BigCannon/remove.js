ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "createbigcannons:compacting/forge_nethersteel_nugget",
        "createbigcannons:mixing/alloy_nethersteel_steel",
        "createbigcannons:compacting/forge_nethersteel_ingot",
        "createbigcannons:mixing/alloy_nethersteel_cast_iron",
        "createbigcannons:compacting/forge_cast_iron_ingot",
        "createbigcannons:compacting/forge_cast_iron_nugget",
        "createbigcannons:compacting/forge_bronze_ingot"
    ])
    e.remove({type: "createbigcannons:melting"})
})