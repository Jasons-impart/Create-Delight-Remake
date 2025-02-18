ServerEvents.tags("entity_type", e => {
    e.add("createdelight:can_survive_ad_astra", [
        "iceandfire:mob_skull",
        "iceandfire:cyclops",
        "minecraft:sheep",     
        "minecraft:chicken",
        "iceandfire:gorgon",
        "iceandfire:deathworm",
        "iceandfire:cockatrice",
        "iceandfire:myrmex_egg",
        "iceandfire:myrmex_queen",
        "iceandfire:myrmex_royal",
        "iceandfire:myrmex_sentinel",
        "iceandfire:myrmex_soldier",
        "iceandfire:myrmex_swarmer",
        "iceandfire:myrmex_worker",
        "iceandfire:dragon_egg",
        "iceandfire:dragon_skull",
        "iceandfire:fire_dragon",
        "iceandfire:stymphalian_bird",
        "iceandfire:amphithere",
        "iceandfire:hydra",
        "iceandfire:lightning_dragon",
        "alexsmobs:cosmic_cod",
        "ad_astra:glacian_ram"
    ])
})

EntityEvents.spawned(e => {
    /**
     * @type {Special.EntityType[]}
     */
    let IgnoreGravityEntityList = [
        "minecraft:chicken",
        "alexsmobs:cosmic_cod"
    ]
    IgnoreGravityEntityList.forEach(entity => {
        if (e.entity.type == entity) {
            e.entity.setItemSlot("feet", Item.of('createdelight:air_boots', '{Damage:0,RepairCost:1,Unbreakable:1b}').enchant('ad_astra_giselle_addon:gravity_normalizing', 1).enchant('minecraft:vanishing_curse', 1))
        }
    })
})

PlayerEvents.tick(e => {
    if (e.player.vehicle && e.player.vehicle.getType() == "ad_astra:lander" && e.player.deltaMovement > 0) {
        e.player.potionEffects.add("minecraft:resistance", 20)
    }
})