const $PlatformImpl = Java.loadClass("dev.architectury.platform.forge.PlatformImpl")
ServerEvents.tags("minecraft:item", e => {
    e.removeAllTagsFrom([
        "bakeries:salted_dough",
        "bakeries:whole_wheat_flour",
        'bakeries:tomato',
        'bakeries:ground_coffee',
        "bakeries:whole_egg"
    ])
    e.remove("forge:dough", "bakeries:whole_wheat_dough")
    e.add('some_assembly_required:sandwich_bread', [
        'bakeries:sliced_toast',
        'bakeries:sliced_cheese_cocoa_toast',
        'bakeries:country_bread_slice'
    ])
})