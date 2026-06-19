// priority: 100

/**
 * 
 * @param {Internal.ServerPlayer} player
 * @returns {number}
 */
function GetPlayerDifficulty(player) {
    return global.CDServerJavaClasses.$CrossPlatformStuff.INSTANCE.getPlayerDifficultyData(player).get().difficultyLevel
}