ServerEvents.tags("minecraft:item", e => {
    e.removeAllTagsFrom("createbigcannons:steel_scrap")
})
ServerEvents.tags("minecraft:fluid", e => {
    e.removeAllTagsFrom("createbigcannons:molten_bronze")
})