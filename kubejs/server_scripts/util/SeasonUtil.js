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

/**
 * 寻找方块下方第一个固体方块并返回Y
 * @param {Internal.Level} level level
 * @param {BlockPos} pos blockpos
 * @param {number} maxRange number
 */
SeasonUtil.belowSolidBlockY = function(level, pos, maxRange) {
    let solidBlockPosY = pos.y - 1
    for(let i = 1; i < maxRange && solidBlockPosY >= -64; i++) {
        let block = level.getBlock(pos.x, solidBlockPosY, pos.z)
        if (block.blockState.isAir()) {
            solidBlockPosY -= 1
            continue
        } else {
            return solidBlockPosY
        }
    }
}