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
/**
 * 
 * @param { Internal.ItemTooltipEventJS } event 
 * @param { Internal.ItemStack_[] } items 
 */
function addCtrlTooltip(event, items) {
    items.forEach(item => {
        event.addAdvanced(item, (item, advanced, text) => {
            if (!event.ctrl) {
                text.add(1, Text.translatable("tooltip.createdelight.hold_ctrl_to_see_more_info"))
            } else {
                text.add(1, Text.translatable("tooltip.createdelight.hold_ctrl"))
                text.add(2, Text.translatable(`tooltip.createdelight.ctrl_${item.getId().split(":")[1]}`))
            }
        })
    })
}
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
function addAir(event, items) {
    items.forEach(item => {
        event.addAdvanced(item, (item, advanced, text) => {
            let Air = item.nbt.Air
            let air = parseInt(Air)
            if(isNaN(air)){
                air = 0
            }
            text.add(Text.translate("tooltip.createdelight.air", air))
        })
    });
}
