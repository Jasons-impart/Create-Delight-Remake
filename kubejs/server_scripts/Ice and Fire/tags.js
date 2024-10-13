ServerEvents.tags("item", e => {
    e.add("curios:head", [
        'iceandfire:earplugs',
        'iceandfire:blindfold'
    ])
    e.removeAllTagsFrom([
        'iceandfire:copper_nugget'
    ])
    e.add("createdelight:dragon_flesh", [
        'iceandfire:fire_dragon_flesh', 
        'iceandfire:ice_dragon_flesh', 
        'iceandfire:lightning_dragon_flesh'])
})
