ServerEvents.recipes(e => {
})

ServerEvents.tags("minecraft:worldgen/biome", e => {
    e.add("createdelight:has_cryo_fuel", "ad_astra:glacio_ice_peaks")
    e.add("createdelight:has_oil", ["deeperdarker:overcast_columns", "deeperdarker:deeplands", "deeperdarker:echoing_forest"])
})