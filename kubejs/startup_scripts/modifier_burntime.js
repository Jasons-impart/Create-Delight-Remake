ItemEvents.modification(e => {
    e.modify('createdieselgenerators:ethanol_bucket', item => {
        item.burnTime = 3333
    })
    e.modify('createdieselgenerators:plant_oil_bucket', item => {
        item.burnTime = 5000
    })
    e.modify('createdieselgenerators:crude_oil_bucket', item => {
        item.burnTime = 10000
    })
    e.modify('createdieselgenerators:biodiesel_bucket', item => {
        item.burnTime = 10000
    })
    e.modify('createdieselgenerators:diesel_bucket', item => {
        item.burnTime = 40000
    })
    e.modify('createdieselgenerators:gasoline_bucket', item => {
        item.burnTime = 40000
    })
    e.modify('createdelight:fuel_mixtures_bucket', item => {
        item.burnTime = 50000
    })
    e.modify('ad_astra:fuel_bucket', item => {
        item.burnTime = 60000
    })
    e.modify('ad_astra:cryo_fuel_bucket', item => {
        item.burnTime = 30000
    })

})