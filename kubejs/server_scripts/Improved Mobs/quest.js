//想用任务增加难度系数的，在奖励里加一个自定义，然后加上标签：rank_难度等级，比如rank_1就会增加一级

/**
 * 
 * @param {Internal.Player} player 
 * @param {number} value 
 */
function UpdateRank(player, value) {
    player.getServer().runCommandSilent(`/improvedmobs difficulty player ${player.username} add ${value}`)
    if (value < 0)
        player.tell(`难度降低了${-value}！`)
    else
        player.tell(`难度提升了${value}！`)
}
/**
 * 
 * @param {Internal.ServerPlayer} player 
 * @returns {number}
 */
function GetPlayerDifficulty(player) {
    return player.nbt.getCompound("ForgeCaps").getCompound("improvedmobs:player_cap").getFloat("IMDifficulty")
}

FTBQuestsEvents.customReward(e => {
    
    e.reward.tags.forEach(s => {
        if (s.split("_")[0] == "rank") {
            UpdateRank(e.player, s.split("_")[1])
        }
    })
})