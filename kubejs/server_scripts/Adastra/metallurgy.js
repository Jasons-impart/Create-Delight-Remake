ServerEvents.recipes(e => {
    const { createmetallurgy } = e.recipes
    e.replaceOutput({ type: "create:crushing", output: "ad_astra:raw_desh" }, "ad_astra:raw_desh", "createdelight:crushed_raw_desh")
    e.replaceOutput({ type: "create:crushing", output: "ad_astra:raw_ostrum" }, "ad_astra:raw_ostrum", "createdelight:crushed_raw_ostrum")
    e.replaceOutput({ type: "create:crushing", output: "ad_astra:raw_calorite" }, "ad_astra:raw_calorite", "createdelight:crushed_raw_calorite")
    metal_production_line_6(e, [
        "ad_astra:desh_block",
        "ad_astra:desh_ingot",
        "ad_astra:desh_nugget",
        "ad_astra:desh_plate",
        "vintageimprovements:desh_rod",
        "vintageimprovements:desh_wire",
        "createdelightcore:molten_desh"],
        "heated",
        80)
    metal_production_line_6(e, [
        "ad_astra:ostrum_block",
        "ad_astra:ostrum_ingot",
        "ad_astra:ostrum_nugget",
        "ad_astra:ostrum_plate",
        "vintageimprovements:ostrum_rod",
        "vintageimprovements:ostrum_wire",
        "createdelightcore:molten_ostrum"],
        "heated",
        80)
    metal_production_line_6(e, [
        "ad_astra:calorite_block",
        "ad_astra:calorite_ingot",
        "ad_astra:calorite_nugget",
        "ad_astra:calorite_plate",
        "vintageimprovements:calorite_rod",
        "vintageimprovements:calorite_wire",
        "createdelightcore:molten_calorite"],
        "heated",
        80)
    createmetallurgy.melting([Fluid.of("createdelightcore:molten_desh", 90), Fluid.of("createmetallurgy:molten_slag", 30)], "createdelight:dirty_desh_dust")
        .heatRequirement("heated")
        .processingTime(40)
        .id("createmetallurgy:melting/molten_desh_from_dirty_desh_dust")
    createmetallurgy.melting([Fluid.of("createdelightcore:molten_ostrum", 90), Fluid.of("createmetallurgy:molten_slag", 30)], "createdelight:dirty_ostrum_dust")
        .heatRequirement("heated")
        .processingTime(40)
        .id("createmetallurgy:melting/molten_ostrum_from_dirty_ostrum_dust")

    createmetallurgy.melting([Fluid.of("createdelightcore:molten_calorite", 90), Fluid.of("createmetallurgy:molten_slag", 30)], "createdelight:dirty_calorite_dust")
        .heatRequirement("heated")
        .processingTime(40)
        .id("createmetallurgy:melting/molten_calorite_from_dirty_calorite_dust")
    createmetallurgy.melting([Fluid.of("createdelightcore:molten_desh", 90), Fluid.of("createmetallurgy:molten_slag", 45)], "#forge:raw_materials/desh")
        .heatRequirement("heated")
        .processingTime(40)
        .id("createmetallurgy:melting/molten_desh_from_raw_desh")
    createmetallurgy.melting([Fluid.of("createdelightcore:molten_ostrum", 90), Fluid.of("createmetallurgy:molten_slag", 45)], "#forge:raw_materials/ostrum")
        .heatRequirement("heated")
        .processingTime(40)
        .id("createmetallurgy:melting/molten_ostrum_from_raw_ostrum")

    createmetallurgy.melting([Fluid.of("createdelightcore:molten_calorite", 90), Fluid.of("createmetallurgy:molten_slag", 45)], "#forge:raw_materials/calorite")
        .heatRequirement("heated")
        .processingTime(40)
        .id("createmetallurgy:melting/molten_calorite_from_raw_calorite")

})