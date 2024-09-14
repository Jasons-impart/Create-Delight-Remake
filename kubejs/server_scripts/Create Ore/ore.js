ServerEvents.tags("minecraft:worldgen/biome", e => {
    e.add("createdelight:has_astrumm", "ulterlands:parapax_general")
    e.add("createdelight:has_desh", "ad_astra:lunar_wastelands")
    e.add("createdelight:has_ostrum", [
        "ad_astra:martian_polar_caps",
        "ad_astra:martian_wastelands",
        "ad_astra:martian_canyon_creek",
    ])
    e.add("createdelight:has_calorite", [
        "ad_astra:mercury_deltas",
        "ad_astra:venus_wastelands",
        "ad_astra:infernal_venus_barrens",
    ])
})
