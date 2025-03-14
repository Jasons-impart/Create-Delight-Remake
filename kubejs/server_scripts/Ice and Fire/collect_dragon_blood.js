const $EntityDragonBase = Java.loadClass("com.github.alexthe666.iceandfire.entity.EntityDragonBase")

ItemEvents.entityInteracted("createdelight:blood_collection_device", e => {
    if (e.player.cooldowns.getCooldowns().get("createdelight:blood_collection_device") > 0)
        return
    console.log("开始了")
    let entity = e.target
    if (!entity || !entity.living)
        return
    //限制主手使用
    if (!e.player.mainHandItem == "createdelight:blood_collection_device" || !e.player.offHandItem == "minecraft:glass_bottle")
        return

    console.log("检查完了")
    if (entity instanceof $EntityDragonBase) {
        /**
         * @type {Internal.EntityDragonBase}
         */
        let dragon = entity
        console.log("到龙这里了")
        if (dragon.isTame() && dragon.isAlive()) {
            console.log("判断是驯服的龙了")
            let maxhp = dragon.maxHealth
            let damage = Math.max(50, maxhp * 0.1)
            e.server.runCommandSilent(`damage ${dragon.uuid} ${damage}`)
            e.player.doHurtTarget(entity)
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
            e.player.offHandItem.shrink(1)
        }
    }
})