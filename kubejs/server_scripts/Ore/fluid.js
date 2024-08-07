ServerEvents.recipes(e => {
    // 石油开采
    e.recipes.createoreexcavation.extracting("createdieselgenerators:crude_oil 100", "{\"text\":\"富石油层\"}", 100, 1500)
        .biomeWhitelist("createdelight:has_oil")
        .id("createoreexcavation:oil")
        .drill("createoreexcavation:diamond_drill")
        .stress(512)
        .veinSize(6, 10)
    // 凛冰燃油开采
    e.recipes.createoreexcavation.extracting("ad_astra:cryo_fuel 100", "{\"text\":\"富凛冰石油层\"}", 100, 1500)
        .biomeWhitelist("createdelight:has_cryo_fuel")
        .id("createoreexcavation:cryo_fuel_oil")
        .drill("createoreexcavation:netherite_drill")
        .stress(1024)
        .veinSize(3, 8)
})

ServerEvents.tags("minecraft:worldgen/biome", e => {
    e.add("createdelight:has_cryo_fuel", "ad_astra:glacio_ice_peaks")
    e.add("createdelight:has_oil", ["deeperdarker:overcast_columns", "deeperdarker:deeplands", "deeperdarker:echoing_forest"])
})