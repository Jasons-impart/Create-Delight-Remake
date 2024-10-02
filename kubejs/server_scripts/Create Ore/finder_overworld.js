const $OreVeinGenerator = Java.loadClass("com.tom.createores.OreVeinGenerator")
const OreVeinAtlasItem = Java.loadClass("com.tom.createores.item.OreVeinAtlasItem")
let veins = [
    ["overworld_metal_ore_cluster", "kubejs:overworld_metal_ore_cluster_ore"],
    ["overworld_noble_metal_ore_cluster", "kubejs:overworld_noble_metal_ore_cluster_ore"],
    ["nether_ore_cluster", "kubejs:nether_ore_cluster"],
    ["moon_ore_cluster", "kubejs:moon_ore_cluster_ore"],
    ["mars_ore_cluster", "kubejs:mars_ore_cluster_ore"],
    ["mars_gemstone_cluster", "kubejs:mars_gemstone_cluster_ore"],
    ["mercury_ore_cluster", "kubejs:mercury_ore_cluster_ore"],
    ["venus_ore_cluster", "kubejs:venus_ore_cluster_ore"],
    ["glacio_ore_cluster", "kubejs:glacio_ore_cluster_ore"]

]

ItemEvents.rightClicked("createdelight:prospector", e => {
    const { player, level } = e
    let excludedVein = []
    player.inventory.allItems.forEach(item => {
        if (item.id == "createoreexcavation:vein_atlas") {
            let nbt = item.nbt
            let exclude = nbt[OreVeinAtlasItem.EXCLUDE]
            console.log(exclude)
            exclude.forEach(tag => {
                excludedVein.push(tag.getAsString())
            })
        }
    })
    // 数字是范围，单位是区块，100就是100区块（100*16格）以内
    let blockPosition = player.blockPosition()
    console.log(excludedVein.toLocaleString())
    let pair = $OreVeinGenerator.getPicker(level).locate(player.blockPosition(), level, 16, (v) => excludedVein.indexOf(v.getId()) == -1)
    let pos = pair.first
    let info = pair.second
    let distance = Math.floor(Math.sqrt((blockPosition.x - pos.x) * (blockPosition.x - pos.x) + (blockPosition.z - pos.z) * (blockPosition.z - pos.z)))
    let direction = getDirection(Math.floor(blockPosition.x / 16), Math.floor(blockPosition.z / 16), Math.floor(pos.x / 16), Math.floor(pos.z / 16))
    player.swing()
    if (direction == 'Same Point') {
        player.setStatusMessage(Component.literal("最近的矿脉是").append(info.getName().color(Color.YELLOW)).append(", §2就在你脚下"))
    } else {
        player.setStatusMessage(Component.literal("最近的矿脉是").append(info.getName().color(Color.YELLOW)).append(", 位于").append(direction.color(Color.YELLOW)).append(`方§e${distance}§r米`))
    }
})
// ItemEvents.rightClicked("stick", e => {
//     const{ server, player, level } = e
//     let veins = [
//         ["coal", "createoreexcavation:ore_vein_type/coal"],
//         ["iron", "createoreexcavation:ore_vein_type/iron"],
//         ["copper", "createoreexcavation:ore_vein_type/copper"]
//     ]
//     if(level.dimension != "minecraft:overworld"){
//         player.swing()
//         player.setStatusMessage("§4受空间扰流影响，无法寻找该维度矿脉")
//     }else{
//         let vein_value = []
//         veins.forEach(vein => {
//             server.runCommandSilent(`execute at ${player.username} run scoreboard objectives add ${vein[0]} dummy`)
//             server.runCommandSilent(`execute at ${player.username} store result score ${player.username} ${vein[0]} run coe locate ${vein[1]}`)
//             let scoreboard = server.getScoreboard().getObjective(vein[0])
//             vein_value.push([
//                 vein[0],
//                 `${scoreboard.getScoreboard().getOrCreatePlayerScore(player.username, scoreboard).getScore()}`
//             ])
//             server.runCommandSilent(`execute at ${player.username} run scoreboard objectives remove ${vein[0]}`)
//         });
//         vein_value.sort((a, b) => {
//             return parseInt(a[1]) - parseInt(b[1])
//         })
//         player.swing()
//         if(parseInt(vein_value[0][1]) < 9){
//             player.setStatusMessage(`最近的矿脉是${vein_value[0][0]}, §2就在你脚下`)
//         }else{
//             player.setStatusMessage(`最近的矿脉是${vein_value[0][0]}, 距离是§e${vein_value[0][1]}§r米`)
//         }
//     }
// })
