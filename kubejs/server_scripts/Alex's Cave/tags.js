ServerEvents.tags("item", e => {
    e.add('alexscaves:ferromagnetic_items', [
        'iceandfire:dragonsteel_fire_pickaxe',
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
        'iceandfire:dragonsteel_lightning_hoe',
    ])
    e.add("forge:ingots/uranium", "alexscaves:uranium")
    // e.remove("forge:raw_materials/uranium", "alexscaves:uranium")
    e.add("createdelight:candy_cane", [
        "alexscaves:candy_cane",
    ])
    e.add("forge:gelatin", [
        'alexscaves:gelatin_red',
        'alexscaves:gelatin_green',
        'alexscaves:gelatin_yellow',
        'alexscaves:gelatin_blue',
        'alexscaves:gelatin_pink',
        'butchercraft:gelatin',
    ])
    e.remove("minecraft:fishes", [
        'alexscaves:cooked_radgill',
        'alexscaves:radgill',
    ])
    e.add("create:upright_on_belt", [
        "alexscaves:sulfur_bud_small",
        "alexscaves:sulfur_bud_medium", 
        "alexscaves:sulfur_bud_large",
        "alexscaves:sulfur_cluster",
    ])
    e.add("create_new_age:magnet", [
        "alexscaves:block_of_scarlet_neodymium",
        "alexscaves:block_of_azure_neodymium"
    ])
    e.add("alexscaves:sweetish_fish", [
        "alexscaves:sweetish_fish_blue",
        "alexscaves:sweetish_fish_red",
        "alexscaves:sweetish_fish_yellow",
        "alexscaves:sweetish_fish_green",
        "alexscaves:sweetish_fish_pink"
    ])
    e.add("alexscaves:ice_cream_scoop", [
        "alexscaves:vanilla_ice_cream_scoop",
        "alexscaves:chocolate_ice_cream_scoop",
        "alexscaves:sweetberry_ice_cream_scoop"
    ])
    e.add("alexscaves:ice_cream", [
        "alexscaves:vanilla_ice_cream",
        "alexscaves:chocolate_ice_cream",
        "alexscaves:sweetberry_ice_cream"
    ])
    e.add("createdelight:fish_buckets", [
        "minecraft:cod_bucket",
        "minecraft:salmon_bucket",
        "minecraft:tropical_fish_bucket",
        "minecraft:pufferfish_bucket",
        "minecraft:axolotl_bucket",
        "alexsmobs:lobster_bucket",
        "alexsmobs:blobfish_bucket",
        "alexsmobs:stradpole_bucket",
        "alexsmobs:platypus_bucket",
        "alexsmobs:frilled_shark_bucket",
        "alexsmobs:mimic_octopus_bucket",
        "alexsmobs:terrapin_bucket",
        "alexsmobs:comb_jelly_bucket",
        "alexsmobs:cosmic_cod_bucket",
        "alexsmobs:devils_hole_pupfish_bucket",
        "alexsmobs:small_catfish_bucket",
        "alexsmobs:medium_catfish_bucket",
        "alexsmobs:large_catfish_bucket",
        "alexsmobs:flying_fish_bucket",
        "alexsmobs:mudskipper_bucket",
        "alexsmobs:triops_bucket",
        "alexscaves:trilocaris_bucket",
        "alexscaves:lanternfish_bucket",
        "alexscaves:tripodfish_bucket",
        "alexscaves:sea_pig_bucket",
        "crabbersdelight:crab_bucket",
    ])
    e.add("createdelight:fisson_fuel", [
        'createdelight:enriched_uraniumdust',
        'create_new_age:radioactive_thorium'
    ])
    e.add("createdelight:mint_candy", [
        'neapolitan:mint_candies',
        'alexscaves:frostmint'
    ])
    e.add("alexscaves:ice_cream_scoop", [
        'createdelightcore:strawberry_ice_cream_scoop',
        'createdelightcore:banana_ice_cream_scoop',
        'createdelightcore:mint_ice_cream_scoop',
        'createdelightcore:adzuki_ice_cream_scoop',
        'createdelightcore:pomegranate_ice_cream_scoop',
        'createdelightcore:lime_ice_cream_scoop',
    ])
    e.removeAll("alexscaves:restricted_biome_locators")
    e.remove("alexscaves:ferns", [
        'alexscaves:fiddlehead'
    ])
    e.removeAllTagsFrom("vintageimprovements:sulfur_chunk")
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
    e.add("forge:ice_cream_block", [
        'alexscaves:vanilla_ice_cream',
        'alexscaves:chocolate_ice_cream',
        'alexscaves:sweetberry_ice_cream',
        'neapolitan:strawberry_ice_cream_block',
        'neapolitan:banana_ice_cream_block',
        'neapolitan:banana_ice_cream_block',
        'neapolitan:adzuki_ice_cream_block',
        'collectorsreap:lime_ice_cream_block',
        'collectorsreap:pomegranate_ice_cream_block',
    ])
})