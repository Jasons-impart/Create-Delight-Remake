ServerEvents.tags("item", e => {
    e.add("curios:head", [
        'iceandfire:earplugs',
        'iceandfire:blindfold'
    ])
    e.removeAllTagsFrom([
        'iceandfire:copper_nugget'
    ])
})
