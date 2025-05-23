/**
 * 
 * @param {Internal.Player} player
 * @returns {Internal.List<Internal.IEnergyStorage>}
 */
function getEnergyStuffFromPlayerInventory(player) {
    let list = Utils.newList()
    player.inventory.allItems.forEach(item => {
        let energyStorage = item.getCapability(ForgeCapabilities.ENERGY).orElse(null)
        if (energyStorage != null) {
            list.push(energyStorage)
        }
    })
    return list
}