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

    e.add("northstar:venus_biomes",
        "northstar:venus_fungal_caverns",
        "northstar:venus_fungal_forest",
        "northstar:venus_lava_caves",
        "northstar:venus_sulfuric_caverns",
        "northstar:venusian_plains",
        "northstar:venusian_wastes"
    )
    e.add("northstar:mars_biomes",
        "northstar:martian_crimsite_caverns",
        "northstar:martian_dunes",
        "northstar:martian_highlands",
        "northstar:martian_magmatic_caves",
        "northstar:martian_overgrown_caverns",
        "northstar:martian_peaks"
    )
    e.add("northstar:mercury_biomes",
        "northstar:mercury_basins",
        "northstar:mercury_hills",
        "northstar:mercury_icy_caverns",
        "northstar:mercury_magmatic_caverns")
})
