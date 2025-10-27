
const $LootParams$Builder = Java.loadClass("net.minecraft.world.level.storage.loot.LootParams$Builder")
const $LootContextParamSets = Java.loadClass("net.minecraft.world.level.storage.loot.parameters.LootContextParamSets")

let LootUtils = {}
/**
 * 
 * @param {Special.LootTable} id 
 * @param {Internal.Level} level 
 * @returns {Internal.ObjectArrayList<Internal.ItemStack>}
 */
LootUtils.getLootItems = function(id, level) {
    let param = new $LootParams$Builder(level).create($LootContextParamSets.EMPTY)
    return level.server.lootData.getLootTable(id).getRandomItems(param)
}