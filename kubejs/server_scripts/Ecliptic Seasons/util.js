const $SolarHolder = Java.loadClass("com.teamtea.eclipticseasons.common.core.SolarHolders")
const $HumidityControlProvider = Java.loadClass("com.teamtea.eclipticseasons.common.core.crop.HumidityControlProvider")
let SeasonUtil = {}
/**
 * 
 * @param {Internal.Level_} level 
 * @returns 
 */
SeasonUtil.getSaveData = function(level) {
    return $SolarHolder.getSaveData(level)
}
/**
 * 
 * @param {number} level 湿度等级（正数为增加负数为减少）
 * @param {number} range 范围
 * @param {number} remainTime 存续时间
 */
SeasonUtil.createHumidityControlProvider = function(level, range, remainTime) {
    return new $HumidityControlProvider(level, range, remainTime)
}