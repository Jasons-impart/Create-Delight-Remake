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
