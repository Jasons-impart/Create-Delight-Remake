ServerEvents.tags("minecraft:item", e => {
    e.removeAllTagsFrom("brewinandchewin:flaxen_cheese_wedge")
    e.add("forge:cheese", "brewinandchewin:scarlet_cheese_wedge")
})
ServerEvents.tags("minecraft:block", e => {
    e.add("brewinandchewin:freeze_sources", [
        'ratatouille:frozen_block',
        'cmr:snowman_cooler',
        "#forge:ice_cream_block"
    ])
})