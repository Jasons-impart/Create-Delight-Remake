// armor, toughness, weight
const armorplate = {
    "createdelight:fire_dragonsteel_armorplate": [2.5, 1.5, 1.5],
    "createdelight:ice_dragonsteel_armorplate": [2.5, 1.5, 1.5],
    "createdelight:lightning_dragonsteel_armorplate": [2.5, 1.5, 1.5]
}

PlayerEvents.inventoryOpened(e => {
    e.getInventoryContainer().items.forEach(item => {
        //使用比较蠢的方法一定程度的修复自定义插板信息丢失
        if (item.hasTag("protection_pixel:plates")) {
            if (item.nbt.get("weight") == null) {
                let id = item.getId().toString()
                item.nbt.merge({
                    armor: armorplate[id][0],
                    toughness: armorplate[id][1],
                    weight: armorplate[id][2],
                })
            }
        }
        // console.log(`id: ${item.id}, nbt: ${item.nbt}`)
    })
})

EntityEvents.hurt(e => {
    let entity = e.getEntity()
    let source = e.getSource()
    let fire_count = 0
    let ice_count = 0
    let lightning_count = 0
    let dragonsteel_count = 0
    function linear(val, start, end) {
        return val * (end - start) + start
    }
    entity.getArmorSlots().forEach(item => {
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
    
    let damage_multi = 1
    if (source.getType() == "dragon_fire") {
        damage_multi = linear(dragonsteel_count / 13, 1, 0.8) * linear(fire_count / 13, 1, 0.8)
    }
    
    if (source.getType() == "dragon_ice") {
        damage_multi = linear(dragonsteel_count / 13, 1, 0.8) * linear(ice_count / 13, 1, 0.8)
    }
    
    if (source.getType() == "dragon_lightning") {
        damage_multi = linear(dragonsteel_count / 13, 1, 0.8) * linear(lightning_count / 13, 1, 0.8)
    }
    // console.log(`damage_multi:${damage_multi}, damagetype:${source.getType()}, originaldamage:${e.getDamage()}`)
    e.getEntity().heal(e.getDamage() * (1 - damage_multi))
})