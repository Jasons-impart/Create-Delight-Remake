ItemEvents.modification(e => {
    e.modify("ad_astra:fuel_bucket", item => {
        item.burnTime = 3600
    })
})