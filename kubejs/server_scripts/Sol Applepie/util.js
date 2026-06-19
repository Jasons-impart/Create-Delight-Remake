let SOLUtil = {}
/**
 * 
 * @param {Internal.Player_} player 
 * @returns {number}
 */
SOLUtil.getFoodDiversity = function(player) {
    return global.CDServerJavaClasses["$FoodList"].get(player).foodDiversity()
}