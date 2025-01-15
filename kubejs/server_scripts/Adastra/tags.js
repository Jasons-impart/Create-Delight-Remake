ServerEvents.tags("fluid", e => {
    e.removeAll("ad_astra:fuel")
})
ServerEvents.tags("minecraft:worldgen/biome", e => {
    e.removeAll("ad_astra:has_structure/oil_well")
})

ServerEvents.tags("minecraft:item", e => {
    e.removeAllTagsFrom("ad_astra:steel_ingot", "ad_astra:steel_rod")
})