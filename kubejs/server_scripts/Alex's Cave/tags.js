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
    // e.remove("forge:raw_materials/uranium", "alexscaves:uranium")
    e.add("createdelight:candy_cane", [
        "aether:candy_cane",
        "alexscaves:candy_cane",
        "create_confectionery:candy_cane"])
    e.add("forge:gelatin", [
        'alexscaves:gelatin_red',
        'alexscaves:gelatin_green',
        'alexscaves:gelatin_yellow',
        'alexscaves:gelatin_blue',
        'alexscaves:gelatin_pink',
        'butchercraft:gelatin'])
    e.remove("minecraft:fishes", [
        'alexscaves:cooked_radgill',
        'alexscaves:radgill'
    ])
    e.add("create:upright_on_belt", [
        "alexscaves:sulfur_bud_small",
        "alexscaves:sulfur_bud_medium", 
        "alexscaves:sulfur_bud_large",
        "alexscaves:sulfur_cluster"])
    e.add("create_new_age:magnet", [
        "alexscaves:block_of_scarlet_neodymium",
        "alexscaves:block_of_azure_neodymium"
    ])
    e.removeAll("alexscaves:restricted_biome_locators")
})

ServerEvents.tags("minecraft:block", e => {
    e.add("minecraft:logs", ["alexscaves:licoroot"])
    e.add("create_new_age:custom_magnet", [
        "alexscaves:block_of_scarlet_neodymium",
        "alexscaves:block_of_azure_neodymium"
    ])
    e.add("create_new_age:magnets/strength_16", [
        "alexscaves:block_of_scarlet_neodymium",
        "alexscaves:block_of_azure_neodymium"
    ])
})