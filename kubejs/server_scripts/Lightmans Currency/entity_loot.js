const $Mob = Java.loadClass("net.minecraft.world.entity.Mob")
const $MobSpawnType = Java.loadClass("net.minecraft.world.entity.MobSpawnType")
EntityEvents.drops(e => {
    const { entity, source } = e
    let player = source.player
    if (player == null || !player.isPlayer() || player.isFake())
        return
    // player.tell(`${entity instanceof $Mob}`)
    if (entity instanceof $Mob) {
        /**
         * @type {Internal.Mob}
         */
        let mob = entity
        if (mob.spawnType == $MobSpawnType.SPAWNER)
            return
        if (!mob.monster && !mob.aggressive)
            return
        let baseValue = 1
        let baseHealth = 20
        let baseDmg = 4.5
        let dmg = mob.getAttribute("generic.attack_damage").getValue()
        let armor = mob.getAttribute("generic.armor").getValue() / 2 + mob.getAttribute("generic.armor_toughness").getValue()
        let maxhp = mob.maxHealth
        //血量乘算
        let multipler = Math.sqrt(maxhp / baseHealth)
        //伤害乘算
        multipler *= dmg / baseDmg
        //护甲乘算
        multipler *= Math.sqrt(armor + 1)
        multipler /= 2
        let itemStack = player.mainHandItem
        if (itemStack.item instanceof $ModularItem && TetraUtil.itemHasEffect(itemStack, "createdelight:greedy")) {
            let level = TetraUtil.getEffectLevel(itemStack, "createdelight:greedy")
            multipler *= (1 + level / 100)
        }
        let list = MoneyUtil.convertBaseValueToItems(baseValue * multipler)
        list.forEach(item => {
            e.addDrop(item)
        })
    }
})