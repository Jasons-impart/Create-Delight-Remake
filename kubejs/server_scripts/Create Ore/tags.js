ServerEvents.tags("minecraft:item", e => {
    e.add("createdelight:ore_cluster", [
        "createdelight:overworld_metal_ore_cluster", 
        "createdelight:overworld_noble_metal_ore_cluster",
        "createdelight:nether_ore_cluster",
        "createdelight:moon_ore_cluster",
        "createdelight:mars_ore_cluster",
        "createdelight:mars_gemstone_cluster",
        "createdelight:mercury_ore_cluster",
        "createdelight:venus_ore_cluster", 
        "createdelight:glacio_ore_cluster"])
    e.add("createoreexcavation:drills_diamonds", 
        "createoreexcavation:diamond_drill",
        "createoreexcavation:netherite_drill"
    )
})