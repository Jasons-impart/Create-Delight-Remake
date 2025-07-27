ItemEvents.rightClicked("createdelight:quality_absorber", e => {
    const {player} = e
    if (player == null || !player.isPlayer())
        return
    let items = player.getCapability(ForgeCapabilities.ITEM_HANDLER).orElse(null)
    let amount = 0
    items.allItems.forEach(item => {
        let quality = $QualityUtils.getQuality(item)
        if (quality.level() > 0) {
            amount += Math.pow(2, quality.level() - 1) * item.count
            item.nbt.remove($QualityUtils.QUALITY_TAG)
        }
    })
    if (amount == 0)
        return
    let money = $CoinValue.fromNumber(COIN_CHAIN_MAIN_VALUE, amount)
    $MoneyAPI.API.GetPlayersMoneyHandler(player).insertMoney(money, false)
    player.tell(Component.of("将物品栏中的所有品质去除，并将其转化为了").append(money.getText()))

})