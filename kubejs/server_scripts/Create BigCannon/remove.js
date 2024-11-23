ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "createbigcannons:compacting/forge_nethersteel_nugget",
        "createbigcannons:mixing/alloy_nethersteel_steel",
        "createbigcannons:compacting/forge_nethersteel_ingot",
        "createbigcannons:mixing/alloy_nethersteel_cast_iron"
    ])
    e.remove({type: "createbigcannons:melting"})
})