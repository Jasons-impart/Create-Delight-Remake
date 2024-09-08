const $OreVeinGenerator = Java.loadClass("com.tom.createores.OreVeinGenerator");

let veins = [
    ["coal", "createoreexcavation:ore_vein_type/coal"],
    ["iron", "createoreexcavation:ore_vein_type/iron"],
    ["copper", "createoreexcavation:ore_vein_type/copper"],
    ["water", "createoreexcavation:ore_vein_type/water"],
    ["diamond", "createoreexcavation:ore_vein_type/diamond"],
    ["emerald" ,"createoreexcavation:ore_vein_type/emerald"],
    ["gold" ,"createoreexcavation:ore_vein_type/gold"],
    ["hardened_diamond" ,"createoreexcavation:ore_vein_type/hardened_diamond"],
    ["lapis" ,"createoreexcavation:ore_vein_type/lapis"],
    ["redstone" ,"createoreexcavation:ore_vein_type/redstone"],
    ["zinc" ,"createoreexcavation:ore_vein_type/zinc"]
]

ItemEvents.rightClicked("stick", e => {
    const{ player, level } = e
    if (level.dimension != "minecraft:overworld") {
        player.swing()
        player.setStatusMessage("§4受空间扰流影响,无法寻找该维度矿脉")
    } else {
        let vein_value = []
        veins.forEach(vein => {
            // 数字是范围，单位是区块，100就是100区块（100*16格）以内
            let blockPosition = player.blockPosition()
            let pos = $OreVeinGenerator.getPicker(level).locate(vein[1], blockPosition, level, 100)
            let info = $OreVeinGenerator.getPicker(level).locate(player.blockPosition(), level, 100, () => true)
            let distance = Math.floor(Math.sqrt((blockPosition.x - pos.x)*(blockPosition.x - pos.x) + (blockPosition.z - pos.z)*(blockPosition.z - pos.z)))
            let direction = getDirection(Math.floor(blockPosition.x/16), Math.floor(blockPosition.z/16), Math.floor(pos.x/16), Math.floor(pos.z/16))
            vein_value.push([info.getSecond().getName(), distance, direction])
        });
        vein_value.sort((a, b) => {
            return a[1] - b[1]
        })
        player.swing()
        if(vein_value[0][2] == 'Same Point'){
            player.setStatusMessage(Component.literal("最近的矿脉是").append(vein_value[0][0].color(Color.YELLOW)).append(", §2就在你脚下"))
        }else{
            player.setStatusMessage(Component.literal("最近的矿脉是").append(vein_value[0][0].color(Color.YELLOW)).append(", 位于").append(vein_value[0][2].color(Color.YELLOW)).append(`方§e${vein_value[0][1]}§r米`))
        }
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
