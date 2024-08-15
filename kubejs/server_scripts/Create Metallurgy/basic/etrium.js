ServerEvents.recipes(e => {
    metal_production_line(e, 
        [
            "ad_astra:etrium_block",
            "ad_astra:etrium_ingot",
            "ad_astra:etrium_nugget",
            "ad_astra:etrium_plate",
            "createdelight:molten_etrium"
        ], "superheated", 80
    )
})