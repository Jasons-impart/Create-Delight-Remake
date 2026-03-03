
const $ClientboundSetTitleTextPacket = Java.loadClass("net.minecraft.network.protocol.game.ClientboundSetTitleTextPacket")
const $ClientboundSetSubtitleTextPacket = Java.loadClass("net.minecraft.network.protocol.game.ClientboundSetSubtitleTextPacket")
const $CoinValue = Java.loadClass("io.github.lightman314.lightmanscurrency.api.money.value.builtin.CoinValue")
let MoneyUtil = global.MoneyUtil

MBDMachineEvents.onTick("createdelight:sell_bin", e => {
    const {machine} = e.event
    if ((machine.level.dayTime() % 24000) != 20) return
    let player = machine.level.getPlayerByUUID(machine.customData.getUUID("owner"))
    if (player == null) return
    let itemSlots = machine.getCapability(ForgeCapabilities.ITEM_HANDLER).orElse(null)
    let values = 0
    let tradeList = []
    itemSlots.allItems
        .filter(global.isAcceptableToSellBin)
        .forEach(itemSlot => {
        let slotValue = 0
        let trade = Component.of("")
        
        let baseValue = MoneyUtil.calculateFoodValue(itemSlot)

        if (baseValue > 0) {
            let Quality = $QualityUtils.getQuality(itemSlot)
            let Qlevel = Quality.level()
            slotValue = itemSlot.count * baseValue
            trade = Component.of(itemSlot.hoverName)
            switch(Qlevel) {
                case 1:
                    trade.append(" ★     ")
                    break
                case 2:
                    trade.append(" ★★   ")
                    break
                case 3:
                    trade.append(" ★★★ ")
                    break
            }
        }
        values = values + slotValue
        if(slotValue > 1 && slotValue != 0) {
            trade.append(MoneyUtil.convertBaseValueToString(slotValue))
            tradeList.push(trade)
            itemSlot.shrink(itemSlot.count)
        } 
        // else if(slotValue != 0) {
        //     trade.append(" <1\uAA01")
        //     tradeList.push(trade)
        //     itemSlot.shrink(itemSlot.count)
        // }
    })
    let coinValue = $CoinValue["fromNumber(java.lang.String,long)"]("main", values)
    if (!coinValue.empty) {
        if (player != null) {
            if (player instanceof $ServerPlayer) {
                let severPlayer = player
                severPlayer.connection.send(new $ClientboundSetTitleTextPacket(Component.translate("message.createdelight.sell_bin_hint").color(Color.GOLD)))
                severPlayer.connection.send(new $ClientboundSetSubtitleTextPacket( MoneyUtil.convertBaseValueToString(values).color(Color.GOLD)))
            }
            player.sendData("kubejs_player_playsound", {soundEvent: "iceandfire:gold_pile_step"})
            player.tell(Component.of("§f             §6出货单  §r"));
            player.tell(Component.of("§e-----------------------"))
            tradeList.forEach(trade => {
                player.tell(trade)
            })
            let total = Component.translate("message.createdelight.sell_bin_total", MoneyUtil.convertBaseValueToString(values))
            player.tell(total)
            player.tell(Component.of("§e-----------------------"))
            $MoneyAPI.getApi().GetPlayersMoneyHandler(player).insertMoney(coinValue, false)
        } else {
            MoneyUtil.convertBaseValueToItems(values).forEach(coin => {
                itemSlots.insertItem(coin, false)
            })
        }
    }
})
//初始化存储玩家数据
MBDMachineEvents.onPlaced("createdelight:sell_bin", e => {
    const {machine} = e.event
    /**@type {Internal.Player} */
    let player = e.event.player
    if (!player.player || player.fake) return
    machine.customData.putUUID("owner", player.uuid)
})