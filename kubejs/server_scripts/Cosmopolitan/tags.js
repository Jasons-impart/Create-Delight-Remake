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
})