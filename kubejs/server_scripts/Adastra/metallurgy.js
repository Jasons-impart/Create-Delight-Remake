ServerEvents.recipes(e => {
    e.replaceOutput({type: "create:crushing", output: "ad_astra:raw_desh" }, "ad_astra:raw_desh", "createdelight:crushed_raw_desh")
    e.replaceOutput({type: "create:crushing", output: "ad_astra:raw_ostrum" }, "ad_astra:raw_ostrum", "createdelight:crushed_raw_ostrum")
    e.replaceOutput({type: "create:crushing", output: "ad_astra:raw_calorite" }, "ad_astra:raw_calorite", "createdelight:crushed_raw_calorite")
    metal_production_line_6(e, [
        "ad_astra:desh_block",
        "ad_astra:desh_ingot",
        "ad_astra:desh_nugget",
        "ad_astra:desh_plate",
        "vintageimprovements:desh_rod",
        "vintageimprovements:desh_wire",
        "createdelight:molten_desh"],
        "heated",
        80)
    metal_production_line_6(e, [
        "ad_astra:ostrum_block",
        "ad_astra:ostrum_ingot",
        "ad_astra:ostrum_nugget",
        "ad_astra:ostrum_plate",
        "vintageimprovements:ostrum_rod",
        "vintageimprovements:ostrum_wire",
        "createdelight:molten_ostrum"],
        "heated",
        80)
    metal_production_line_6(e, [
        "ad_astra:calorite_block",
        "ad_astra:calorite_ingot",
        "ad_astra:calorite_nugget",
        "ad_astra:calorite_plate",
        "vintageimprovements:calorite_rod",
        "vintageimprovements:calorite_wire",
        "createdelight:molten_calorite"],
        "heated",
        80)
    
})