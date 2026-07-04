ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "tetracelium:cutting/tag_dough",
        "create:emptying/compat/neapolitan/milk_bottle",
        "farmersdelight:wheat_dough",
        "create:filling/compat/farmersdelight/milk_bottle",
        "youkaishomecoming:roe",
    ])
    remove_recipes_type(e, [
        "farmersdelight:dough"
    ])
    cutting(e, "minecraft:cod", [
        "2x farmersdelight:cod_slice",
        "crabbersdelight:fish_bones"
    ])
    cutting(e, "minecraft:cooked_cod", [
        "2x farmersdelight:cooked_cod_slice",
        "crabbersdelight:fish_bones"
    ])
    cutting(e, "minecraft:salmon", [
        "2x farmersdelight:salmon_slice",
        Item.of("oceanic_delight:salmon_eggs").withChance(0.5),
        "crabbersdelight:fish_bones"
    ])
    cutting(e, "minecraft:cooked_salmon", [
        "2x farmersdelight:cooked_salmon_slice",
        "crabbersdelight:fish_bones"
    ])
    cutting(e, 'minecraft:tropical_fish', [
        "2x crabbersdelight:tropical_fish_slice",
        "crabbersdelight:fish_bones"
    ])
    cutting(e, 'crabbersdelight:cooked_tropical_fish', [
        "2x crabbersdelight:cooked_tropical_fish_slice",
        "crabbersdelight:fish_bones"
    ])
    cutting(e, 'collectorsreap:platinum_bass', [
        "3x collectorsreap:platinum_bass_slice",
        'collectorsreap:platinum_bass_head',
        "crabbersdelight:fish_bones"
    ])
    cutting(e, 'collectorsreap:cooked_platinum_bass', [
        "3x collectorsreap:cooked_platinum_bass_slice",
        'collectorsreap:cooked_platinum_bass_head',
        "crabbersdelight:fish_bones"
    ])
    cutting(e, 'alexsmobs:small_catfish_bucket', [
        "minecraft:water_bucket",
        Item.of('alexsmobs:raw_catfish').withChance(0.8),
        "crabbersdelight:fish_bones"
    ])
    cutting(e, 'alexsmobs:medium_catfish_bucket', [
        "minecraft:water_bucket",
        '3x alexsmobs:raw_catfish',
        "crabbersdelight:fish_bones"
    ])
    cutting(e, 'alexsmobs:large_catfish_bucket', [
        "minecraft:water_bucket",
        '6x alexsmobs:raw_catfish',
        "crabbersdelight:fish_bones"
    ])
    cutting(e, "alexsmobs:raw_catfish", '2x alexsdelight:raw_catfish_slice')
    cutting(e, "alexsmobs:cooked_catfish", '2x alexsdelight:cooked_catfish_slice')
    cutting(e, 'youkaishomecoming:tuna_bucket', [
        "minecraft:water_bucket",
        '6x youkaishomecoming:raw_tuna',
        'youkaishomecoming:otoro',
        "crabbersdelight:fish_bones"
    ])
    cutting(e, "youkaishomecoming:raw_tuna", '2x youkaishomecoming:raw_tuna_slice')
    cutting(e, "youkaishomecoming:seared_tuna", '2x youkaishomecoming:seared_tuna_slice')
})
