const $FoodList = Java.loadClass("com.tarinoita.solsweetpotato.tracking.FoodList")

let SOLUtil = {}
/**
 * 
 * @param {Internal.Player_} player 
 * @returns {number}
 */
SOLUtil.getFoodDiversity = function(player) {
    return $FoodList.get(player).foodDiversity()
}