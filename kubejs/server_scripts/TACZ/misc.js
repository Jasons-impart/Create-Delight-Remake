PlayerEvents.tick(e => {

    function linear(val, start, end) {
        return val * (end - start) + start
    }
    const { player, level } = e
    if (level.time % 120 != 0)
        return
    if (global.CDServerJavaClasses.$IGun.mainhandHoldGun(player)) {
        let gun = player.mainHandItem
        let iGun = global.CDServerJavaClasses.$IGun.getIGunOrNull(gun)
        let id = iGun.getGunId(gun)
        if (id == "applied_armorer:moritz_mg_emg_prototype" || id == "applied_armorer:moritz_mg_hmg22") {
            let index = global.CDServerJavaClasses.$TimelessAPI.getCommonGunIndex(id)
            if (index.present) {
                let maxAmmo = global.CDServerJavaClasses.$AttachmentDataUtils.getAmmoCountWithAttachment(gun, index.get().gunData)
                let multipler = index.get().gunData.getAmmoAmount() / maxAmmo * 4
                let neededEnergy = (maxAmmo - iGun.getCurrentAmmoCount(gun)) * 4000 * multipler
                let neededEnergyCopy = neededEnergy
                let items = player.inventory.allItems.filter(item => item.item instanceof global.CDServerJavaClasses.$EnergyCellBlockItem)
                items.sort((a, b) => {
                        /**@type {Internal.EnergyCellBlockItem} */
                        let item = a.item
                        return item.getAECurrentPower(a) - item.getAECurrentPower(b)
                    })
                items.forEach(item => {
                    /**@type {Internal.EnergyCellBlockItem} */
                    let itemClass = item.item
                    if (neededEnergy <= 0 || itemClass.getAECurrentPower(item) <= 0) return
                    if (item.count > 1) {
                        let copy = item.copyWithCount(1)
                        let extracted = itemClass.extractAEPower(copy, neededEnergy, "modulate")
                        neededEnergy -= extracted
                        player.give(copy)
                        item.shrink(1)
                    }
                    else {
                        let extracted = itemClass.extractAEPower(item, neededEnergy, "modulate")
                        neededEnergy -= extracted
                    }
                })
                if (neededEnergyCopy != 0) {
                    let oldAmmoCount = iGun.getCurrentAmmoCount(gun)
                    iGun.setCurrentAmmoCount(gun, linear(1 - neededEnergy / neededEnergyCopy, oldAmmoCount, maxAmmo))
                    let newAmmoCount = iGun.getCurrentAmmoCount(gun)
                    
                    // 如果成功提取了子弹（填充了弹药），显示状态消息
                    if (newAmmoCount > oldAmmoCount) {
                        let extractedCount = Math.floor(newAmmoCount - oldAmmoCount)
                        let currentAmmo = Math.floor(newAmmoCount)
                        let maxCapacity = Math.floor(maxAmmo)
                        let message = Component.translate(
                            "message.tacz.ammo_extracted_notification",
                            Component.literal(extractedCount + "").color(Color.GREEN),
                            Component.literal(currentAmmo + " / " + maxCapacity).color(Color.YELLOW)
                        )
                        player.setStatusMessage(message)
                    }
                }
            }
        }
    }
})
