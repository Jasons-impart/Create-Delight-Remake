ServerEvents.tags("fluid", event => {
    event.removeAll("ad_astra:fuel");
});

ServerEvents.tags("minecraft:worldgen/biome", event => {
    event.removeAll("ad_astra:has_structure/oil_well");
});
