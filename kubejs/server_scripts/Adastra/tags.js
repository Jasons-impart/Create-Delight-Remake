ServerEvents.tags("fluid", e => {
    e.removeAll("ad_astra:fuel")
})
ServerEvents.tags("minecraft:worldgen/biome", e => {
    e.removeAll("ad_astra:has_structure/oil_well")
})