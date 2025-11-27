// priority: 100

/**
 * 
 * @param {Internal.ServerPlayer} player
 * @returns {number}
 */
function GetPlayerDifficulty(player) {
    return $CrossPlatformStuff.INSTANCE.getPlayerDifficultyData(player).get().difficultyLevel
}