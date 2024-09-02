ServerEvents.recipes(e => {
    metal_production_line_2(e, 
        [
            "iceandfire:silver_block",
            "iceandfire:silver_ingot",
            "iceandfire:silver_nugget",
            "vintageimprovements:silver_sheet",
            "createdelight:molten_sliver"
        ], "heated", 40
    )
    blast_and_smelting(e, "create:crushed_raw_silver", "iceandfire:silver_ingot", 0.1, 100)
})