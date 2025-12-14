
const $ClientboundSetTitleTextPacket = Java.loadClass("net.minecraft.network.protocol.game.ClientboundSetTitleTextPacket")
const $ClientboundSetSubtitleTextPacket = Java.loadClass("net.minecraft.network.protocol.game.ClientboundSetSubtitleTextPacket")

MBDMachineEvents.onTick("createdelight:sell_bin", e => {
    const {machine} = e.event
    if ((machine.level.dayTime() % 24000) != 20) return
    let player = machine.level.getPlayerByUUID(machine.customData.getUUID("owner"))
    if (player == null) return
    let itemSlots = machine.getCapability(ForgeCapabilities.ITEM_HANDLER).orElse(null)
    let materials = global.MaterialTrade
    let meats = global.MeatTrade
    let roasts = global.RoastTrade
    let vegetables = global.VegatablesTrade
    let values = 0
    let tradeList = []
    itemSlots.allItems.forEach(itemSlot => {
        let slotValue = 0
        let trade = Component.of("")
        if(global.TradeData[itemSlot.id] != undefined) {
            let Quality = $QualityUtils.getQuality(itemSlot)
            let Qlevel = Quality.level()
            let multiplier = Math.round(Math.sqrt(2 / (Qlevel != 0 ? $QualityConfig.getChance(Quality) : 1)))
            slotValue = itemSlot.count * multiplier * global.TradeData[itemSlot.id]
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
        } else {
            if(itemSlot.item.getFoodProperties() != null) {
                // let num = 1
                // effects.forEach(eff => {
                //     let effect = eff.first
                //     num = num + 2 + effect.amplifier
                // })
                // let effMultipler = Math.sqrt(num)
                slotValue = itemSlot.count * MoneyUtil.calculateFoodValue(itemSlot)
                trade = Component.of(itemSlot.hoverName)
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
    let coinValue = $CoinValue["fromNumber(java.lang.String,long)"](COIN_CHAIN_MAIN_VALUE, values)
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
            $MoneyAPI.API.GetPlayersMoneyHandler(player).insertMoney(coinValue, false)
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

//基础逻辑
// MBDMachineEvents.onTick("createdelight:sell_bin", e => {
//     const {machine} = e.event
//     if ((machine.level.dayTime() % 24000) != 1000) return

//     let player = machine.level.getPlayerByUUID(machine.customData.getUUID("owner"))
//     if (player == null) return
//     let items = machine.getCapability(ForgeCapabilities.ITEM_HANDLER).orElse(null)

//     let values = 0
//     let traderId = [4, 5, 9, 13]
//     traderId.forEach(id => {
//         TradeUtil.getTradeAPI().GetTrader(false, id).getTradeData().forEach(tradeData => {
//             /**@type {Internal.ItemTradeData} */
//             let itemTradeData = tradeData
//             let first = itemTradeData.getSellItem(0)
//             let second = itemTradeData.getSellItem(1)

//             /**
//              * 
//              * @param {Internal.ItemStack} item 
//              * @returns {Internal.ItemStack}
//              */
//             function getMaxCountItem(item) {
//                 if (item == null) return false
//                 let max = -1
//                 let maxi = -1
//                 for (let index = 0; index < items.slots; index++) {
//                     let element = items.getStackInSlot(index)
//                     if (element != null && element.count > max && element.is(item)) {
//                         maxi = index
//                         max = element.count
//                     }
//                 }
//                 if (maxi == -1)
//                     return false
//                 return items.getStackInSlot(maxi)
//             }
//             // 循环减少物品
//             while (true) {
//                 let decreasedFirst = first != null ? getMaxCountItem(first) : null; // 若 first 为 null，则结果为 null
//                 let decreasedSecond = second != null ? getMaxCountItem(second) : null; // 若 second 为 null，则结果为 null
//                 let firstQuality = $QualityUtils.getQuality(decreasedFirst)
//                 let secondQuality = $QualityUtils.getQuality(decreasedSecond)
//                 let firstRate = decreasedFirst ? (decreasedFirst.count / (first?.count || 1)) : Infinity;
//                 let secondRate = decreasedSecond ? (decreasedSecond.count / (second?.count || 1)) : Infinity;
//                 firstRate = (first != null && firstRate === Infinity) ? 0 : firstRate;
//                 secondRate = (second != null && secondRate === Infinity) ? 0 : secondRate;

//                 let minRate = Math.min(firstRate, secondRate);
//                 let firstCount = decreasedFirst ? Math.floor((first?.count || 0) * minRate) : 0;
//                 let secondCount = decreasedSecond ? Math.floor((second?.count || 0) * minRate) : 0;
//                 // player.tell(`minRate: ${minRate}, firstCount: ${firstCount}, secondCount: ${secondCount}`)
//                 // 如果没有任何减少，结束交易
//                 if (firstCount === 0 && secondCount === 0) break;

//                 // 减少库存中的物品数量
//                 if (decreasedFirst && firstCount > 0) {
//                     decreasedFirst.shrink(firstCount);
//                 }
//                 if (decreasedSecond && secondCount > 0) {
//                     decreasedSecond.shrink(secondCount);
//                 }
//                 // player.tell(`firstQuality: ${firstQuality} secondQuality: ${secondQuality}`)
//                 let multiplier = Math.floor(JavaMath.sqrt(2 / (
//                     (firstQuality.level() != 0 ? $QualityConfig.getChance(firstQuality) : (secondQuality.level() != 0 ? $QualityConfig.getChance(secondQuality) : 1))
//                     + (secondQuality.level() != 0 ? $QualityConfig.getChance(secondQuality) : (firstQuality.level() != 0 ? $QualityConfig.getChance(firstQuality) : 1)))) + 0.5)
//                 values += minRate * multiplier * tradeData.getCost().coreValue * 4
//             }
//         })
//     })
//     //直接出售食物
//     let baseNutrition = 6
//     let baseSaturationModifier = 0.6
//     /**
//      * @type {Internal.List<Internal.Item>}
//      */
//     let itemList = Utils.newList()
//     items.allItems.forEach(item => {
//         itemList.add(item.item)
//     })
//     let types = itemList.stream()
//     .distinct()
//     .filter(item => item.getFoodProperties() != null)
//     .toList()
//     .length
//     for (let index = 0; index < items.slots; index++) {
//         let element = items.getStackInSlot(index)
//         let prop = element.getFoodProperties(player)
//         if (prop != null) {
            
//             let { nutrition, saturationModifier, effects } = prop
//             let num = 1
//             effects.forEach(eff => {
//                 let effect = eff.first
//                 num = num + 2 + effect.amplifier
//             })
//             let effMultipler = Math.sqrt(num)
//             values += nutrition / baseNutrition * saturationModifier / baseSaturationModifier * effMultipler * element.count * 3 * Math.sqrt(types + 1)
//             element.setCount(0)
//         }
//     }
//     let coinValue = $CoinValue["fromNumber(java.lang.String,long)"](COIN_CHAIN_MAIN_VALUE, values)
//     if (!coinValue.empty)
//         player.tell(Component.translate("message.createdelight.sell_bin_hint", machine.pos.toShortString(), coinValue.getText().getString()))
//     $MoneyAPI.API.GetPlayersMoneyHandler(player).insertMoney(coinValue, false)

// })

// ItemEvents.rightClicked(e => {
//     // let prop = e.item.getFoodProperties(null)
//     // if (prop == null)
//     //     return
//     // const { nutrition, saturationModifier, effects } = prop

//     // e.player.tell(`${nutrition}, ${saturationModifier}`)
//     // effects.forEach(eff => {
//     //     let effect = eff.first
//     //     let num = eff.second
//     //     e.player.tell(`${effect.amplifier}, ${effect.duration}, ${num}`)
//     // })
// })