
let LootUtils = {}
/**
 * 
 * @param {Special.LootTable} id 
 * @param {Internal.Level} level 
 * @returns {Internal.ObjectArrayList<Internal.ItemStack>}
 */
LootUtils.getLootItems = function(id, level) {
    let param = new global.CDServerJavaClasses.$LootParams$Builder(level).create(global.CDServerJavaClasses.$LootContextParamSets.EMPTY)
    return level.server.lootData.getLootTable(id).getRandomItems(param)
}