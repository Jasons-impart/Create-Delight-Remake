let DirectionUtil = {}

/**
 * 返回旋转90°后的方向
 * @param {Internal.Direction} direction 
 */
DirectionUtil.rotation90Direction = function(direction) {
    if (direction == Direction.NORTH) {
        return Direction.EAST
    }
    if (direction == Direction.SOUTH) {
        return Direction.WEST
    }
    if (direction == Direction.EAST) {
        return Direction.SOUTH
    }
    if (direction == Direction.WEST) {
        return Direction.NORTH
    }
}

/**
 * 返回旋转270°后的方向
 * @param {Internal.Direction} direction 
 */
DirectionUtil.rotation270Direction = function(direction) {
    if (direction == Direction.NORTH) {
        return Direction.WEST
    }
    if (direction == Direction.SOUTH) {
        return Direction.EAST
    }
    if (direction == Direction.EAST) {
        return Direction.NORTH
    }
    if (direction == Direction.WEST) {
        return Direction.SOUTH
    }
}


/**
 * 根据两个坐标点计算方向，并返回对应方向的翻译文本（通过Text.translate函数获取）
 * 
 * 值得注意的是，mc的世界坐标系是+y向上的右手坐标系，故+x轴为东方时，+z轴是南方。
 * @param { number } x1 
 * @param { number } y1 
 * @param { number } x2 
 * @param { number } y2 
 * @returns 
 */
function getDirection(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    // 如果两点坐标相同，返回提示文本
    if (dx === 0 && dy === 0) {
        return 'Same Point';
    }
    // 定义各个方向对应的翻译文本常量
    const DIRECTION_NORTH = Text.translate("message.createdelight.north");
    const DIRECTION_SOUTH = Text.translate("message.createdelight.south");
    const DIRECTION_EAST = Text.translate("message.createdelight.east");
    const DIRECTION_WEST = Text.translate("message.createdelight.west");
    const DIRECTION_NORTHEAST = Text.translate("message.createdelight.northeast");
    const DIRECTION_SOUTHEAST = Text.translate("message.createdelight.southeast");
    const DIRECTION_SOUTHWEST = Text.translate("message.createdelight.southwest");
    const DIRECTION_NORTHWEST = Text.translate("message.createdelight.northwest");

    // tan(pi/8)，用于判断方向是否更接近 正方位
    const thres = 2^(1/2) - 1

    // 当dy绝对值显著大于（> tan(pi/8)）dx绝对值时，为南/北方向
    if (Math.abs(dy) > thres * Math.abs(dx)) {
        return dy > 0? DIRECTION_SOUTH : DIRECTION_NORTH;
    }
    // 当dx绝对值显著大于（> tan(pi/8)）dy绝对值时，为东/西方向
    if (Math.abs(dx) > thres * Math.abs(dy)) {
        return dx > 0? DIRECTION_EAST : DIRECTION_WEST;
    }
    // 根据dx和dy的正负情况判断斜向方向
    // 注意+z指向南方而-z指向北方
    if (dx > 0 && dy > 0) {
        return DIRECTION_SOUTHEAST;
    }
    if (dx > 0 && dy < 0) {
        return DIRECTION_NORTHEAST;
    }
    if (dx < 0 && dy > 0) {
        return DIRECTION_SOUTHWEST;
    }
    if (dx < 0 && dy < 0) {
        return DIRECTION_NORTHWEST;
    }
}
