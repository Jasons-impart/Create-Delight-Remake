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
    // 当dx为0时，根据dy的正负判断南北方向
    if (dx === 0) {
        return dy > 0? DIRECTION_SOUTH : DIRECTION_NORTH;
    }
    // 当dy为0时，根据dx的正负判断东西方向
    if (dy === 0) {
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
