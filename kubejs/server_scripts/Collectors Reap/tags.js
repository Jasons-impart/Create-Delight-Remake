ServerEvents.tags("minecraft:item", e => {
    e.add("forge:crab_leg", "collectorsreap:chieftain_leg")
    
    e.add("forge:shrimps", [
        "collectorsreap:tiger_prawn",
        "collectorsreap:cooked_tiger_prawn"])
    
    e.add("forge:crab_meat", [
        "collectorsreap:chieftain_claw",
        "collectorsreap:chieftain_leg"])
    e.removeAllTagsFrom([
        'collectorsreap:panettone',
        'collectorsreap:panettone_slice',
    ])
})
ServerEvents.tags("minecraft:block", e => {
    e.add("minecraft:mineable/shovel", 
        "collectorsreap:lucuma_ice_cream_block"
    )
})