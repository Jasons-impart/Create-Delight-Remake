const $FeatureToggle = Java.loadClass('com.hlysine.create_connected.config.FeatureToggle')
const $ResourceLocation = Java.loadClass('net.minecraft.resources.ResourceLocation')

const forcedJeiItems = [
  'create_connected:fan_freezing_catalyst'
]

// Create Connected 给该触媒加了兼容模组条件，进入世界后刷新可见性时会把它判成 disabled。
// 当前整合包并没有这些兼容模组，直接移除条件即可避免 JEI 和创造搜索被再次过滤。
forcedJeiItems.forEach(id => {
  $FeatureToggle.FEATURE_CONDITIONS.remove(new $ResourceLocation(id))
})

JEIEvents.addItems(e => {
  e.add(forcedJeiItems)
})

JEIEvents.addFluids(e => {
  e.add([
    "minecraft:milk"
  ])
})
JEIEvents.hideItems(e => {
  e.hide([
    // 使用创造模式物品栏移除一直失败，被迫使用JEI隐藏。
    // 其他情况下，能用创造模式物品栏移除就用创造模式物品栏移除
    'createdeco:gold_coinstack',
    'createdeco:netherite_coinstack',
    'createdeco:brass_coin',
    'createdeco:brass_coinstack',
    'createdeco:iron_coinstack',
    'createdeco:copper_coinstack',
    'createdeco:industrial_iron_coin',
    'createdeco:industrial_iron_coinstack',
    'createdeco:zinc_coin',
    'createdeco:zinc_coinstack',
  ])
})