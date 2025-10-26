ServerEvents.tags("fluid", e => {
    e.removeAll("ad_astra:fuel")
})
ServerEvents.tags("minecraft:worldgen/biome", e => {
    e.removeAll("ad_astra:has_structure/oil_well")
})
ServerEvents.tags("minecraft:item", e => {
    e.add("createdelight:plates/ad_astra", 
        "ad_astra:desh_plate",
        "ad_astra:ostrum_plate",
        "ad_astra:calorite_plate"
    )
    e.add("createdelight:ingots/ad_astra", 
        "ad_astra:desh_ingot",
        "ad_astra:ostrum_ingot",
        "ad_astra:calorite_ingot"
    )
})