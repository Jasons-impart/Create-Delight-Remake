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
/**
 * 
 * @param {Internal.ServerPlayer} player
 * @returns {number}
 */
function GetPlayerDifficulty(player) {
    return $CrossPlatformStuff.INSTANCE.getPlayerDifficultyData(player).get().difficultyLevel
}

FTBQuestsEvents.completed(e => {
    const { object, data, server } = e
    if (object instanceof $Quest) {
        /**@type {Internal.Quest} */
        let quest = object
        if (quest.getRewards().find(reward => reward.tags.find(s => {
            let res = s.split("_")[0]
            return res == "rank" || res == "unrank"
        }) != null) != null) {
            server.scheduleInTicks(1, () => {
                data.changeProgress(quest, pc => pc.setReset(true))
            })
        }
    }
    // if ()
    // data.changeProgress(object.id, progressChange => {
    //     progressChange.reset()
    // })
})

FTBQuestsEvents.customReward(e => {
    const { player, reward } = e
    reward.tags.forEach(s => {
        if (s.split("_")[0] == "rank") {
            UpdateRank(player, s.split("_")[1])
        }
        else if (s.split("_")[0] == "unrank") {
            UpdateRank(player, -s.split("_")[1])
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
    })
})