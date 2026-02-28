/**
 * Whether createdelight:sell_bin would accept(i.e. purchase) the itemStack.
 * This function is here apart from the sell bin logic in server_scripts,
 * tooltip price render logic in client_scripts also needs it.
 * @param itemStack {$ItemStack_}
 * @return {boolean}
 */
global.isAcceptableToSellBin = function (itemStack) {
    return itemStack.getFoodProperties(null) != null;
}