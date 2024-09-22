/**
 * @param { number } x1 
 * @param { number } y1 
 * @param { number } x2 
 * @param { number } y2 
 * @returns 
 */
function getDirection(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;

    if (dx === 0 && dy === 0) {
        return 'Same Point';
    }

    if (dx === 0) return dy > 0 ? Text.translate("message.createdelight.south") : Text.translate("message.createdelight.north");
    if (dy === 0) return dx > 0 ? Text.translate("message.createdelight.east") : Text.translate("message.createdelight.west");

    if (dx > 0 && dy > 0) {
        return Text.translate("message.createdelight.southeast");
    }

    if (dx > 0 && dy < 0) {
        return Text.translate("message.createdelight.northeast");
    }

    if (dx < 0 && dy > 0) {
        return Text.translate("message.createdelight.southwest");
    }

    if (dx < 0 && dy < 0) {
        return Text.translate("message.createdelight.northwest");
    }
}
