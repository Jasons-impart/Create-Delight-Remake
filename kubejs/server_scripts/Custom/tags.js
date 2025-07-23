ServerEvents.tags("minecraft:block", e => {
    e.add("createdelightcore:fan_processing_catalysts/freezing", ["create_connected:fan_freezing_catalyst"])
})
ServerEvents.tags("minecraft:fluid", e => {
    e.add("forge:egg_yolk", [
        "createdelight:egg_yolk",
        "createdelight:artificial_egg_yolk"
    ])
})
ServerEvents.tags("minecraft:item", e => {
    e.add("forge:eggs", [
        'quark:egg_parrot_gray',
        'quark:egg_parrot_yellow_blue',
        'quark:egg_parrot_green',
        'quark:egg_parrot_blue',
        'quark:egg_parrot_red_blue',
        'iceandfire:myrmex_desert_egg',
        'iceandfire:myrmex_jungle_egg',
        'endertrigon:baby_dragon_egg',
    ])
    e.remove("forge:eggs", [
        'iceandfire:deathworm_egg_giant',
        'alexscaves:tremorsaurus_egg',
        'alexscaves:relicheirus_egg',
        'alexscaves:atlatitan_egg',
        'alexscaves:tremorzilla_egg'
    ])
    e.add("forge:bigger_eggs", [
        'iceandfire:deathworm_egg_giant',
        'alexscaves:tremorsaurus_egg',
        'alexscaves:relicheirus_egg',
        'alexscaves:atlatitan_egg',
        'alexsmobs:emu_egg',
        '#forge:dragonegg',
        'minecraft:sniffer_egg',
        'alexscaves:tremorzilla_egg'
    ])
    e.add("forge:cream", [
        'cosmopolitan:cream'
    ])
})