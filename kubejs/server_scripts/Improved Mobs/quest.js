//想用任务增加难度系数的，在奖励里加一个自定义，然后加上标签：rank_small / rank_medium / rank_large / rank_massive / rank_enormous

const $CrossPlatformStuff = Java.loadClass("io.github.flemmli97.improvedmobs.platform.CrossPlatformStuff")
const $Quest = Java.loadClass("dev.ftb.mods.ftbquests.quest.Quest")
const $ProgressChange = Java.loadClass("dev.ftb.mods.ftbquests.util.ProgressChange")

const rankValueMap = {
    "small": 1,
    "medium": 3,
    "large": 5,
    "massive": 10,
    "enormous": 15
}

function getProgressBar(rawValue) {
    let tier = Difficulty.getTierFromValue(rawValue)
    let process
    if (tier == 0) {
        process = 0
    } else if (tier < Difficulty.tierThreshold.length) {
        process = (rawValue - Difficulty.tierThreshold[tier - 1]) / (Difficulty.tierThreshold[tier] - Difficulty.tierThreshold[tier - 1])
    } else {
        process = 1
    }
    process = Math.max(0, Math.min(1, process))
    let filled = Math.round(process * 10)
    let bar = ""
    for (let i = 0; i < 10; i++) {
        if (i < filled) bar += "§a■"
        else bar += "§8■"
    }
    return bar
}

/**
 * 
 * @param {Internal.Player} player 
 * @param {number} value 
 * @param {string} [source] - "death" for death penalty, undefined otherwise
 */
function UpdateRank(player, value, source) {
    value = parseInt(value)
    let diffData = $CrossPlatformStuff.INSTANCE.getPlayerDifficultyData(player).get()
    if (!diffData || player.persistentData.getBoolean("disableRankChange"))
        return
    value = (Difficulty.getPlayerRawValue(player) + value) < 0 ? -Difficulty.getPlayerRawValue(player) : value

    let oldTier = Difficulty.getPlayerTier(player)
    Difficulty.setPlayerRawValue(player, parseInt(Difficulty.getPlayerRawValue(player)) + parseInt(value))
    let newTier = Difficulty.getPlayerTier(player)
    let newRaw = Difficulty.getPlayerRawValue(player)
    let bar = getProgressBar(newRaw)
    let tierKey = Difficulty.tierLangKeys[newTier]

    if (value > 0) {
        if (newTier > oldTier) {
            player.server.runCommandSilent(`title ${player.username} title {"translate":"${tierKey}","color":"gold","bold":true}`)
            player.server.runCommandSilent(`title ${player.username} subtitle {"translate":"difficulty.createdelight.tier_up_subtitle","color":"gray"}`)
            player.playSound("minecraft:ui.toast.challenge_complete")
        } else {
            player.playSound("minecraft:entity.experience_orb.pickup")
        }
        let msg = Text.of("§a▲ ").append(Text.translatable(tierKey)).append(Text.of(` §8[${bar}§8]`))
        player.displayClientMessage(msg, true)
    } else {
        if (source == "death") {
            let msg = Text.translatable("difficulty.createdelight.death_penalty").append(Text.of(" §7→ ")).append(Text.translatable(tierKey)).append(Text.of(` §8[${bar}§8]`))
            player.displayClientMessage(msg, true)
            if (newTier < oldTier) {
                player.server.runCommandSilent(`title ${player.username} subtitle {"translate":"difficulty.createdelight.tier_down_subtitle","color":"dark_red"}`)
                player.playSound("minecraft:entity.wither.spawn")
            }
        } else {
            let msg = Text.of("§c▼ ").append(Text.translatable(tierKey)).append(Text.of(` §8[${bar}§8]`))
            player.displayClientMessage(msg, true)
            if (newTier < oldTier) {
                player.server.runCommandSilent(`title ${player.username} subtitle {"translate":"difficulty.createdelight.tier_down_subtitle","color":"dark_red"}`)
                player.playSound("minecraft:entity.wither.spawn")
            }
        }
    }
}

FTBQuestsEvents.customReward(e => {
    const { player, reward, server } = e
    reward.tags.forEach(s => {
        let strings = s.split("_")
        let start = strings[0]
        let mid = strings[1]
        let end = strings[strings.length - 1]
        if (start == "rank") {
            let value = rankValueMap[end]
            if (value == null) value = parseInt(end)
            if (isNaN(value)) return
            UpdateRank(player, value)
        }
        else if (start == "unrank") {
            let value = rankValueMap[end]
            if (value == null) value = parseInt(end)
            if (isNaN(value)) return
            UpdateRank(player, -value)
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