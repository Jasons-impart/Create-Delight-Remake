//想用任务增加难度系数的，在奖励里加一个自定义，然后加上标签：rank_难度等级，比如rank_1就会增加一级

const $CrossPlatformStuff = Java.loadClass("io.github.flemmli97.improvedmobs.platform.CrossPlatformStuff")
const $Quest = Java.loadClass("dev.ftb.mods.ftbquests.quest.Quest")
const $ProgressChange = Java.loadClass("dev.ftb.mods.ftbquests.util.ProgressChange")
/**
 * 
 * @param {Internal.Player} player 
 * @param {number} value 
 */
function UpdateRank(player, value) {
    let diffData = $CrossPlatformStuff.INSTANCE.getPlayerDifficultyData(player).get()
    if (!diffData || player.persistentData.getBoolean("disableRankChange"))
        return
    value = (GetPlayerDifficulty(player) + value) < 0 ? -GetPlayerDifficulty(player) : value
    player.getServer().runCommandSilent(`/improvedmobs difficulty player ${player.username} add ${value}`)
    if (value < 0)
        player.tell(`难度降低了${-value}！`)
    else
        player.tell(`难度提升了${value}！`)
}

FTBQuestsEvents.customReward(e => {
    const { player, reward, server } = e
    reward.tags.forEach(s => {
        let strings = s.split("_")
        let start = strings[0]
        let mid = strings[1]
        let end = strings[strings.length - 1]
        if (start == "rank") {
            UpdateRank(player, end)
        }
        else if (start == "unrank") {
            UpdateRank(player, -end)
        }
        else if (s == "change_rank_change_state") {
            let disableRankChange = player.persistentData.getBoolean("disableRankChange")
            if (disableRankChange == null)
                player.persistentData.putBoolean("disableRankChange", true)
            else
                player.persistentData.putBoolean("disableRankChange", !disableRankChange)
            if (!disableRankChange)
                player.tell("已关闭难度变化！")
            else
                player.tell("已开启难度变化！")
        }
        if (mid != "unrepeatable") {
            // Client.tell(`${player.uuid}, ${reward.quest}`)
            server.runCommand(`/execute as ${player.uuid} run ftbquests change_progress @s reset ${reward.quest}`)
        }
    })
    
})