/**
 * 
 * @param {Internal.Player} player 
 * @param {number} value 
 */
function UpdateRank(player, value) {
    player.getServer().runCommandSilent(`/improvedmobs difficulty player ${player.username} add ${value}`)
    player.tell(`难度提升了${value}！`)
}

FTBQuestsEvents.customReward(e => {
    
    e.reward.tags.forEach(s => {
        if (s.split("_")[0] == "rank") {
            UpdateRank(e.player, s.split("_")[1])
        }
    })
})