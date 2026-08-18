ItemEvents.tooltip(e => {
    global.Order.supplyCatalog.forEach(entry => {
        e.addAdvanced(entry.item, (item, advanced, text) => {
            text.add(Text.translate(
                "tooltip.createdelight.supply_commission.catalog",
                Text.translate(`tooltip.createdelight.order_draft.seal.${entry.race}`)
            ))
            text.add(Text.translate("tooltip.createdelight.supply_commission.batch", entry.count))
            text.add(Text.translate(
                "tooltip.createdelight.supply_commission.cost",
                entry.tickets,
                global.MoneyUtil.convertBaseValueToString(entry.money)
            ))
            text.add(Text.translate("tooltip.createdelight.supply_commission.lead_time", entry.days))
            text.add(Text.translate("tooltip.createdelight.supply_commission.unlock").darkGray())
        })
    })
})

JEIEvents.information(e => {
    global.Order.supplyCatalog.forEach(entry => {
        e.addItem(entry.item, Text.translate("jei.createdelight.supply_commission.catalog"))
    })
    e.addItem("createdelightcore:supply_commission_table", Text.translate("jei.createdelight.supply_commission.table"))
})
