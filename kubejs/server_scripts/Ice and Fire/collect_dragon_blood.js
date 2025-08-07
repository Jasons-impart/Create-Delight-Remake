const $EntityDragonBase = Java.loadClass("com.github.alexthe666.iceandfire.entity.EntityDragonBase")
ItemEvents.entityInteracted("createdelight:blood_collection_device", e => {
    if (e.player.cooldowns.isOnCooldown("createdelight:blood_collection_device"))
        return
    let entity = e.target
    if (!entity || !entity.living)
        return
    //限制主手使用
    if (!e.player.mainHandItem == "createdelight:blood_collection_device" || !e.player.offHandItem == "minecraft:glass_bottle")
        return

    if (entity instanceof $EntityDragonBase) {
        /**
         * @type {Internal.EntityDragonBase}
         */
        let dragon = entity
        if (dragon.isTame() && dragon.isAlive() && !dragon.isDeadOrDying()) {
            let maxhp = dragon.maxHealth
            let damage = Math.max(50, maxhp * 0.1)
            dragon.attack(e.player.damageSources().genericKill(), damage)
            if (dragon.type == "iceandfire:fire_dragon") {
                e.player.give("iceandfire:fire_dragon_blood")
            }
            else if (dragon.type == "iceandfire:ice_dragon") {
                e.player.give("iceandfire:ice_dragon_blood")
            }
            else if (dragon.type == "iceandfire:lightning_dragon") {
                e.player.give("iceandfire:lightning_dragon_blood")
            }
            e.player.cooldowns.addCooldown(e.player.mainHandItem.item, 60)
            e.player.mainHandItem.shrink(1)
            e.player.offHandItem.shrink(1)
            player.swing()
        }
    }
})