ItemEvents.modification(e => {
    function modify(id, burnTime) {
        e.modify(id, item => {
            item.burnTime = burnTime
        })
    }

    modify("createdieselgenerators:ethanol_bucket", 3333)
    modify("createdieselgenerators:plant_oil_bucket", 5000)
    modify("createdieselgenerators:crude_oil_bucket", 10000)
    modify("createdieselgenerators:biodiesel_bucket", 10000)
    modify("createdieselgenerators:diesel_bucket", 40000)
    modify("createdieselgenerators:gasoline_bucket", 40000)
    modify("createdelight:fuel_mixtures_bucket", 50000)
    modify("ad_astra:cryo_fuel_bucket", 30000)
    modify("createaddition:biomass_pellet", 0)
    modify("createaddition:biomass_pellet_block", 0)
})
