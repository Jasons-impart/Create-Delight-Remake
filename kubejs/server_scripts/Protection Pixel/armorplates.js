// armor, toughness, weight
const armorplate = {
    "createdelight:fire_dragonsteel_armorplate": [2.5, 1.5, 1.5],
    "createdelight:ice_dragonsteel_armorplate": [2.5, 1.5, 1.5],
    "createdelight:lightning_dragonsteel_armorplate": [2.5, 1.5, 1.5]
}

PlayerEvents.inventoryOpened(e => {
    e.server.scheduleInTicks(5, () => {
        e.getInventoryContainer().items.forEach(item => {
            //使用比较蠢的方法一定程度的修复自定义插板信息丢失
            if (item.hasTag("protection_pixel:plates")) {
                if (item.getOrCreateTag().get("weight") == null) {
                    let id = item.getId().toString()
                    if (armorplate[id] != null)
                        item.getOrCreateTag().merge({
                            armor: armorplate[id][0],
                            toughness: armorplate[id][1],
                            weight: armorplate[id][2],
                        })
                }
            }
        })
    })
})


//因为kubejs没法做到减少受到伤害，所以将受击减伤托管给forgeevent
/**
 * 
 * @param {Internal.LivingHurtEvent} e 
 */
global.ArmorplateHurtEvent = function (e) {
    const { entity, source } = e
    let zero = [0, 0, 0, 0]
    let [fire_count, ice_count, lightning_count, dragonsteel_count] = zero
    function linear(val, start, end) {
        return val * (end - start) + start
    }
    let returnFlag = true
    entity.getArmorSlots().forEach(item => {
        returnFlag = false
        if (item.hasTag("protection_pixel:protection")) {
            let slot_count = 1
            let nbt = item.nbt
            while (true) {
                let id = nbt.get(`slot${slot_count}`)
                if (id == null)
                    break
                if (id == "createdelight:fire_dragonsteel_armorplate") {
                    fire_count++
                    dragonsteel_count++
                }
                if (id == "createdelight:ice_dragonsteel_armorplate") {
                    ice_count++
                    dragonsteel_count++
                }
                if (id == "createdelight:lightning_dragonsteel_armorplate") {
                    lightning_count++
                    dragonsteel_count++
                }
                slot_count++
            }

        }
    })
    if (returnFlag)
        return

    let damage_multi = 1
    if (source.getType() == "dragon_fire") {
        damage_multi = linear(dragonsteel_count / 13, 1, 0.8) * linear(fire_count / 13, 1, 0.6)
    }

    if (source.getType() == "dragon_ice") {
        damage_multi = linear(dragonsteel_count / 13, 1, 0.8) * linear(ice_count / 13, 1, 0.6)
    }

    if (source.getType() == "dragon_lightning") {
        damage_multi = linear(dragonsteel_count / 13, 1, 0.8) * linear(lightning_count / 13, 1, 0.6)
    }
    // console.log(`damage_multi:${damage_multi}, damagetype:${source.getType()}, originaldamage:${e.getAmount()}`)
    e.setAmount(e.getAmount() * damage_multi)
}
