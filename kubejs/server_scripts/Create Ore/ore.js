ServerEvents.tags("minecraft:worldgen/biome", e => {
    e.add("createdelight:is_moon", "ad_astra:lunar_wastelands")
    e.add("createdelight:is_mars", [
        "ad_astra:martian_polar_caps",
        "ad_astra:martian_wastelands",
        "ad_astra:martian_canyon_creek",
    ])
    e.add("createdelight:is_venus", [
        "ad_astra:infernal_venus_barrens",
        "ad_astra:venus_wastelands"
    ])
    e.add("createdelight:is_mercury", "ad_astra:mercury_deltas")
    e.add("createdelight:is_glacio", [
        "ad_astra:glacio_snowy_barrens",
        "ad_astra:glacio_ice_peaks"
    ])
})
