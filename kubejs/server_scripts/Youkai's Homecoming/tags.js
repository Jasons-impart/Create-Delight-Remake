ServerEvents.tags("minecraft:item", e => {
    e.removeAllTagsFrom([
        'youkaishomecoming:green_coffee_bean',
        'abnormals_delight:perch_slice',
        'abnormals_delight:pike_slice'
    ])
    e.add('forge:tea_leaves/green', "farmersrespite:green_tea_leaves")
    e.add('forge:tea_leaves/oolong', "farmersrespite:yellow_tea_leaves")
    e.add('forge:tea_leaves/black', "farmersrespite:black_tea_leaves")
    e.add("minecraft:ice", "youkaishomecoming:ice_cube")
    e.add("forge:roe", [
        'oceanic_delight:salmon_eggs',
        'oceanic_delight:ancient_fish_eggs'
    ])
    e.add("forge:tropical", [
        'minecraft:tropical_fish',
        'crabbersdelight:tropical_fish_slice'
    ])
    e.removeAllTagsFrom([
        'collectorsreap:tiger_prawn_roe',
        'collectorsreap:platinum_bass_roe',
    ])
    e.add("minecraft:fishes", [
        'youkaishomecoming:roasted_lamprey',
        'youkaishomecoming:raw_lamprey_fillet',
        'youkaishomecoming:roasted_lamprey_fillet',
        'youkaishomecoming:raw_tuna',
        'youkaishomecoming:seared_tuna',
        'youkaishomecoming:raw_tuna_slice',
        'youkaishomecoming:seared_tuna_slice',
        'youkaishomecoming:otoro',
        'crabbersdelight:cooked_tropical_fish',
        'farmersdelight:cod_slice',
        'farmersdelight:cooked_cod_slice',
        'crabbersdelight:tropical_fish_slice',
        'crabbersdelight:cooked_tropical_fish_slice',
        'alexsdelight:raw_catfish_slice',
        'alexsdelight:cooked_catfish_slice',
        'farmersdelight:salmon_slice',
        'farmersdelight:cooked_salmon_slice',
    ])
    e.add("forge:raw_fishes", [
        'youkaishomecoming:raw_lamprey',
        'youkaishomecoming:raw_lamprey_fillet',
        'youkaishomecoming:raw_tuna',
        'youkaishomecoming:raw_tuna_slice',
        'youkaishomecoming:otoro',
        'alexsmobs:raw_catfish',
        'alexsdelight:raw_catfish_slice',
        'alexsmobs:flying_fish',
        'alexscaves:tripodfish',
        'alexscaves:lanternfish'
    ])
    e.add("forge:pufferfish", [
        'minecraft:pufferfish',
        'crabbersdelight:pufferfish_slice'
    ])
})
ServerEvents.tags("block", e => {
    e.removeAllTagsFrom([
        'youkaishomecoming:coffea',
    ])
})
