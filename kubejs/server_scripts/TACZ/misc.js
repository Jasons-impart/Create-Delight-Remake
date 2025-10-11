const $IGun = Java.loadClass("com.tacz.guns.api.item.IGun")
const $TimelessAPI = Java.loadClass("com.tacz.guns.api.TimelessAPI")
const $AttachmentDataUtils = Java.loadClass("com.tacz.guns.util.AttachmentDataUtils")
const $EnergyCellBlockItem = Java.loadClass("appeng.block.networking.EnergyCellBlockItem")
PlayerEvents.tick(e => {

    function linear(val, start, end) {
        return val * (end - start) + start
    }
    const { player, level } = e
    if (level.time % 20 != 0)
        return
    if ($IGun.mainhandHoldGun(player)) {
        let gun = player.mainHandItem
        let iGun = $IGun.getIGunOrNull(gun)
        let id = iGun.getGunId(gun)
        if (id == "applied_armorer:moritz_mg_emg_prototype" || id == "applied_armorer:moritz_mg_hmg22") {
            let index = $TimelessAPI.getClientGunIndex(id)
            if (index.present) {
                let maxAmmo = $AttachmentDataUtils.getAmmoCountWithAttachment(gun, index.get().gunData)
                let multipler = index.get().gunData.getAmmoAmount() / maxAmmo * 4
                let neededEnergy = (maxAmmo - iGun.getCurrentAmmoCount(gun)) * 4000 * multipler
                let neededEnergyCopy = neededEnergy
                let items = player.inventory.allItems.filter(item => item.item instanceof $EnergyCellBlockItem)
                items.sort((a, b) => {
                        /**@type {Internal.EnergyCellBlockItem} */
                        let item = a.item
                        return item.getAECurrentPower(a) - item.getAECurrentPower(b)
                    })
                items.forEach(item => {
                    /**@type {Internal.EnergyCellBlockItem} */
                    let itemClass = item.item
                    if (neededEnergy == 0) return
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
                if (neededEnergyCopy != 0)
                    iGun.setCurrentAmmoCount(gun, linear(1 - neededEnergy / neededEnergyCopy, iGun.getCurrentAmmoCount(gun), maxAmmo))
            }
        }
    }
})
