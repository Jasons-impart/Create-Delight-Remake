ServerEvents.tags("minecraft:item", e => {
    e.removeAllTagsFrom(
        "createbigcannons:steel_scrap",
        "createbigcannons:bronze_scrap"
    )
})
ServerEvents.tags("minecraft:fluid", e => {
    e.removeAllTagsFrom("createbigcannons:molten_bronze")
    e.add("createdelight:acid", 
        "vintageimprovements:sulfuric_acid",
    "alexscaves:acid")
})

