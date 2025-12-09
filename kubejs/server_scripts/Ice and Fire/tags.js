ServerEvents.tags("item", e => {
    e.add("curios:head", [
        'iceandfire:earplugs',
        'iceandfire:blindfold'
    ])
    e.add("createdelight:dragon_flesh", [
        'iceandfire:fire_dragon_flesh', 
        'iceandfire:ice_dragon_flesh', 
        'iceandfire:lightning_dragon_flesh'])
})

ServerEvents.tags("block", e => {
    e.add("minecraft:logs", "iceandfire:dreadwood_log")
})

ServerEvents.tags("fluid", e => {
    e.add("createdelight:molten_dragon_steel", [
        "createdelightcore:molten_fire_steel",
        "createdelightcore:molten_ice_steel",
        "createdelightcore:molten_lightning_steel"
    ])
})