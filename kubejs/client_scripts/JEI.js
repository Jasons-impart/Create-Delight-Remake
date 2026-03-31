const $ArrayList = Java.loadClass('java.util.ArrayList')
const $Minecraft = Java.loadClass('net.minecraft.client.Minecraft')
const $VanillaTypes = Java.loadClass('mezz.jei.api.constants.VanillaTypes')
const $CreateConnectedJEI = Java.loadClass('com.hlysine.create_connected.compat.CreateConnectedJEI')

const forcedJeiItems = [
  'create_connected:fan_freezing_catalyst'
]

function syncForcedJeiItems() {
  const manager = $CreateConnectedJEI.MANAGER
  if (manager == null) return false

  const stacks = new $ArrayList()
  forcedJeiItems.forEach(id => stacks.add(Item.of(id)))

  manager.removeIngredientsAtRuntime($VanillaTypes.ITEM_STACK, stacks)
  manager.addIngredientsAtRuntime($VanillaTypes.ITEM_STACK, stacks)
  return true
}

JEIEvents.addItems(e => {
  e.add(forcedJeiItems)
})

let jeiSyncCooldown = 0
let jeiSyncDone = false
let jeiLastLevel = null

ClientEvents.tick(() => {
  const level = $Minecraft.getInstance().level

  if (level !== jeiLastLevel) {
    jeiLastLevel = level
    jeiSyncDone = false
    jeiSyncCooldown = level == null ? 0 : 20
  }

  if (level == null || jeiSyncDone) return

  if (jeiSyncCooldown > 0) {
    jeiSyncCooldown--
    return
  }

  // 每次进存档后重新补一次；JEI runtime 未就绪时短周期重试，成功后停止。
  jeiSyncDone = syncForcedJeiItems()
  jeiSyncCooldown = jeiSyncDone ? 0 : 20
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