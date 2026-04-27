ServerEvents.tags("minecraft:item", e => {
    e.remove("create_new_age:nuclear/hazmat_suit", [
        [
            "minecraft:leather_helmet",
            "minecraft:leather_chestplate",
            "minecraft:leather_leggings", 
            "minecraft:leather_boots"
        ]
    ])
    e.add("create_new_age:nuclear/hazmat_suit", [
        [
            "alexscaves:hazmat_mask",
            "alexscaves:hazmat_chestplate",
            "alexscaves:hazmat_leggings",
            "alexscaves:hazmat_boots"
        ]
    ])
    e.add("createaddition:high_current_spools", [
        'createaddition:gold_spool',
        'createaddition:electrum_spool'
    ])
})
ServerEvents.tags("block", e => {
    e.add("create_new_age:stops_radiation", [
        "createdelightcore:forge_steel_casing"
    ])
})