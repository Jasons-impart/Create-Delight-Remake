ServerEvents.tags("minecraft:item", e => {
    e.removeAllTagsFrom([
        "bakeries:salted_dough",
        "bakeries:salt",
        "bakeries:whole_wheat_flour",
        'bakeries:bottle_milk',
        'bakeries:tomato'
    ])
    e.remove("forge:dough", "bakeries:whole_wheat_dough")
    e.add('some_assembly_required:sandwich_bread', [
        'bakeries:sliced_toast',
        'bakeries:sliced_cheese_cocoa_toast',
        'bakeries:country_bread_slice'
    ])
})