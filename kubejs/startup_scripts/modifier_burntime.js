ItemEvents.modification(e => {
    /**
     * 
     * @param {Special.Item} id 
     * @param {number} burnTime 
     * @param {Internal.Item_} remainItem
     */
    function modify(id, burnTime, remainItem) {
        e.modify(id, item => {
            item.burnTime = burnTime
            if (remainItem != null) {
                item.craftingRemainingItem = remainItem
                item.setCraftingRemainingItemFTBL(remainItem)
            }
        })
    }

    modify("createdieselgenerators:ethanol_bucket", 3333, "minecraft:bucket")
    modify("createdieselgenerators:plant_oil_bucket", 5000, "minecraft:bucket")
    modify("createdieselgenerators:crude_oil_bucket", 10000, "minecraft:bucket")
    modify("createdieselgenerators:biodiesel_bucket", 10000, "minecraft:bucket")
    modify("createdieselgenerators:diesel_bucket", 40000, "minecraft:bucket")
    modify("createdieselgenerators:gasoline_bucket", 40000, "minecraft:bucket")
    modify("createdelight:fuel_mixtures_bucket", 50000, "minecraft:bucket")
    modify("ad_astra:cryo_fuel_bucket", 30000, "minecraft:bucket")
    modify("createmetallurgy:coke_block", 18000)
    modify('createaddition:biomass_pellet', 0)
    modify('createaddition:biomass_pellet_block', 0)
    modify("mynethersdelight:magma_cake_slice", 5000)
    modify("mynethersdelight:hot_cream_cone", 3000)
    modify('createdelight:fuel_hotcream', 10000)
})
