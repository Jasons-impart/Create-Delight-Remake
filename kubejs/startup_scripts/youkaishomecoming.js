let $TableItemManager = Java.loadClass('dev.xkmc.youkaishomecoming.content.pot.table.item.TableItemManager')
let $YHTagGen = Java.loadClass("dev.xkmc.youkaishomecoming.init.data.YHTagGen")

// 统一配置
const createConfig = (types, isTag) => ({
  types: types,
  method: "addMapping(java.lang.String,net.minecraft." + (isTag ? "tags.TagKey" : "world.level.ItemLike") + ")"
});
// 酱汁
const SAUCES = {
  tag: createConfig(['SUSHI_SAUCE', 'HOSOMAKI_SAUCE', 'FUTOMAKI_SAUCE', 'CAL_SAUCE', 'CAL_TOP_SAUCE'], true),
  item: createConfig(['SUSHI_SAUCE', 'HOSOMAKI_SAUCE', 'FUTOMAKI_SAUCE', 'CAL_SAUCE', 'CAL_TOP_SAUCE'], false)
}
// 寿司卷馅料
const ROLLS = {
  tag: createConfig(['HOSOMAKI_INGREDIENT', 'FUTOMAKI_INGREDIENT', 'CAL_INGREDIENT'], true),
  item: createConfig(['HOSOMAKI_INGREDIENT', 'FUTOMAKI_INGREDIENT', 'CAL_INGREDIENT'], false)
}
// 寿司卷盖料
const COVERS = {
  tag: createConfig(['CAL_COVER'], true),
  item: createConfig(['CAL_COVER'], false)
}
// 军舰馅料
const GUNKAN = {
  tag: createConfig(['GUNKAN_TOP'], true),
  item: createConfig(['GUNKAN_TOP'], false)
}

// 映射函数
function addMappings(config, id, param) {
  config.types.forEach(type => { 
    $TableItemManager[type][config.method](id, config.method.includes('TagKey') 
      ? $YHTagGen.forgeItem(param) 
      : param
    )
  })
}

StartupEvents.init(e => {
  // 蛋黄酱
  addMappings(SAUCES.tag, "mayonnaise", "mayonnaise")
  addMappings(COVERS.tag, "roe", "roe")
  addMappings(GUNKAN.tag, "roe", "roe")
  // addMappings(COVERS.item, "salmon_eggs", Item.of("oceanic_delight:salmon_eggs"))
  // addMappings(GUNKAN.item, "salmon_eggs", Item.of("oceanic_delight:salmon_eggs"))
})