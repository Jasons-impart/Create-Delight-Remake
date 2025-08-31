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