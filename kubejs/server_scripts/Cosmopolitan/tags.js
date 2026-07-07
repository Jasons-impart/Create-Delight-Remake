ServerEvents.tags("minecraft:block", e => {
    e.add("cosmopolitan:cooling_sources", [
        'ratatouille:frozen_block', 
        'iceandfire:dragonscale_blue', 
        'cmr:snowman_cooler', 
        'brewinandchewin:ice_crate'
    ])
})
ServerEvents.tags("minecraft:item", e => {
    e.add("cosmopolitan:carotene_sources", [
        'createdelight:enchanted_golden_carrot',
        "create_bic_bit:stamppot_bowl"
    ])
    e.add("forge:cookies", [
        'ends_delight:chorus_cookie',
        'farmersdelight:sweet_berry_cookie',
        'farmersdelight:honey_cookie',
        'farmersrespite:green_tea_cookie',
        'fruitsdelight:persimmon_cookie',
        'fruitsdelight:lemon_cookie',
        'fruitsdelight:cranberry_cookie',
        'fruitsdelight:bayberry_cookie',
        'vintagedelight:oatmeal_cookie',
        'collectorsreap:lime_cookie',
        'cavedelight:star_cookie',
        'miners_delight:bat_cookie',
        'cosmopolitan:arbutus_berry_cookie',
        'cosmopolitan:birch_cookie',
        'cosmopolitan:howling_cookie',
        'cosmopolitan:molasses_cookie',
        'cosmopolitan:paw_cookie',
        "cosmopolitan:herbal_cookie"
    ])
})