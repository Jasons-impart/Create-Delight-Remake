/**
 * 
 * @param { Internal.ItemTooltipEventJS } event 
 * @param { Internal.ItemStack_[] } items 
 */
function clearAddShiftTooltip(event, items) {
    items.forEach(item => {
        event.addAdvanced(item, (item, advanced, text) => {
            text.clear()
            text.add(Text.translate(`item.${item.getId().split(":")[0]}.${item.getId().split(":")[1]}`))
            if (!event.shift) {
                text.add(1, Text.translatable("tooltip.createdelight.hold_shift_to_see_more_info"))
            } else {
                text.add(1, Text.translatable("tooltip.createdelight.hold_shift"))
                text.add(2, Text.translatable(`tooltip.createdelight.shift_${item.getId().split(":")[1]}`))
            }
        })
    })
}
/**
 * 
 * @param { Internal.ItemTooltipEventJS } event 
 * @param { Internal.ItemStack_[] } items 
 */
function addShiftTooltip(event, items) {
    items.forEach(item => {
        event.addAdvanced(item, (item, advanced, text) => {
            if (!event.shift) {
                text.add(1, Text.translatable("tooltip.createdelight.hold_shift_to_see_more_info"))
            } else {
                text.add(1, Text.translatable("tooltip.createdelight.hold_shift"))
                text.add(2, Text.translatable(`tooltip.createdelight.shift_${item.getId().split(":")[1]}`))
            }
        })
    })
}
/**
 * 
 * @param { Internal.ItemTooltipEventJS } event 
 * @param { Internal.ItemStack_[] } items 
 */
function clearAddCtrlTooltip(event, items) {
    items.forEach(item => {
        event.addAdvanced(item, (item, advanced, text) => {
            text.clear()
            text.add(Text.translate(`item.${item.getId().split(":")[0]}.${item.getId().split(":")[1]}`))
            if (!event.ctrl) {
                text.add(1, Text.translatable("tooltip.createdelight.hold_ctrl_to_see_more_info"))
            } else {
                text.add(1, Text.translatable("tooltip.createdelight.hold_ctrl"))
                text.add(2, Text.translatable(`tooltip.createdelight.ctrl_${item.getId().split(":")[1]}`))
            }
        })
    })
}
/**
 * 
 * @param { Internal.ItemTooltipEventJS } event 
 * @param { Internal.ItemStack_[] } items 
 */
function clearAddShiftCtrlTooltip(event, items) {
    items.forEach(item => {
        event.addAdvanced(item, (item, advanced, text) => {
            text.clear()
            text.add(Text.translate(`item.${item.getId().split(":")[0]}.${item.getId().split(":")[1]}`))
            if (!event.ctrl) {
                text.add(1, Text.translatable("tooltip.createdelight.hold_ctrl_to_see_more_info"))
            } else {
                text.add(1, Text.translatable("tooltip.createdelight.hold_ctrl"))
                text.add(2, Text.translatable(`tooltip.createdelight.ctrl_${item.getId().split(":")[1]}`))
            }
            if (!event.shift) {
                text.add(1, Text.translatable("tooltip.createdelight.hold_shift_to_see_more_info"))
            } else {
                text.add(1, Text.translatable("tooltip.createdelight.hold_shift"))
                text.add(2, Text.translatable(`tooltip.createdelight.shift_${item.getId().split(":")[1]}`))
            }
        })
    })
}
/**
 * 
 * @param { Internal.ItemTooltipEventJS } event 
 * @param { Internal.ItemStack_[] } items 
 */
function addFuelAndWater(event, items) {
    items.forEach(item => {
        event.addAdvanced(item, (item, advanced, text) => {
            let fuel = item.nbt.tagFuel
            if(fuel == undefined){
                fuel = 0
            }
            let water = item.nbt.tagWater
            if(water == undefined){
                water = 0
            }
            text.add(Text.translate("tooltip.createdelight.water", water))
            text.add(Text.translate("tooltip.createdelight.fuel", fuel))
        })
    });
}
/**
 * 
 * @param { Internal.ItemTooltipEventJS } event 
 * @param { Internal.ItemStack_[] } items 
 */
function addFuel(event, items) {
    items.forEach(item => {
        event.addAdvanced(item, (item, advanced, text) => {
            let fuel = item.nbt.tagFuel
            if(fuel == undefined){
                fuel = 0
            }
            text.add(Text.translate("tooltip.createdelight.fuel", fuel))
        })
    });
}
/**
 * 
 * @param { Internal.ItemTooltipEventJS } event 
 * @param { Internal.ItemStack_[] } items 
 */
function addWater(event, items) {
    items.forEach(item => {
        event.addAdvanced(item, (item, advanced, text) => {
            let water = item.nbt.tagWater
            if(water == undefined){
                water = 0
            }
            text.add(Text.translate("tooltip.createdelight.water", water))
        })
    });
}
/**
 * 
 * @param { Internal.ItemTooltipEventJS } event 
 * @param { Internal.ItemStack_[] } items 
 */
function addStock1(event, items) {
    items.forEach(item => {
        event.addAdvanced(item, (item, advanced, text) => {
            let stock = item.nbt.tagStock
            if(stock == undefined){
                stock = 0
            }
            text.add(Text.translate("tooltip.createdelight.stock1", stock))
        })
    });
}
/**
 * 
 * @param { Internal.ItemTooltipEventJS } event 
 * @param { Internal.ItemStack_[] } items 
 */
function addStock2(event, items) {
    items.forEach(item => {
        event.addAdvanced(item, (item, advanced, text) => {
            let stock = item.nbt.tagStock
            if(stock == undefined){
                stock = 0
            }
            text.add(Text.translate("tooltip.createdelight.stock2", stock))
        })
    });
}
/**
 * 
 * @param { Internal.ItemTooltipEventJS } event 
 * @param { Internal.ItemStack_[] } items 
 */
function addStock3(event, items) {
    items.forEach(item => {
        event.addAdvanced(item, (item, advanced, text) => {
            let stock = item.nbt.tagStock
            if(stock == undefined){
                stock = 0
            }
            text.add(Text.translate("tooltip.createdelight.stock3", stock))
        })
    });
}
