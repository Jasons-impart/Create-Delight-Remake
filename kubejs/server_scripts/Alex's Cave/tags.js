ServerEvents.tags("item", e => {
    e.add('alexscaves:ferromagnetic_items', 
        ['iceandfire:dragonsteel_fire_pickaxe',
        'iceandfire:dragonsteel_ice_pickaxe',
        'iceandfire:dragonsteel_lightning_pickaxe',
        'iceandfire:dragonsteel_fire_shovel',
        'iceandfire:dragonsteel_ice_shovel',
        'iceandfire:dragonsteel_lightning_shovel',
        'iceandfire:dragonsteel_fire_axe',
        'iceandfire:dragonsteel_ice_axe',
        'iceandfire:dragonsteel_lightning_axe',
        'iceandfire:dragonsteel_fire_sword',
        'iceandfire:dragonsteel_ice_sword',
        'iceandfire:dragonsteel_lightning_sword',
        'iceandfire:dragonsteel_fire_hoe',
        'iceandfire:dragonsteel_ice_hoe',
        'iceandfire:dragonsteel_lightning_hoe'])
    
    e.add('alexscaves:galena_gauntlet_crystallization_items',
        ['aether:zanite_sword',
        'aether:zanite_shovel',
        'aether:zanite_pickaxe',
        'aether:zanite_axe',
        'aether:zanite_hoe',
        'aether:gravitite_sword',
        'aether:gravitite_shovel',
        'aether:gravitite_pickaxe',
        'aether:gravitite_axe',
        'aether:gravitite_hoe']
    )

    e.add("forge:ingots/uranium", "alexscaves:uranium")
    e.remove("forge:raw_materials/uranium", "alexscaves:uranium")
})

ServerEvents.tags("worldgen/biome", e => {
    e.remove("minecraft:is_deep_ocean", "alexscaves:abyssal_chasm");
})