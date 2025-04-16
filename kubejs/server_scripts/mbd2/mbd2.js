ServerEvents.recipes(e => {
    //安山总线
    e.recipes.create.item_application(
        "createdelight:andesite_import_bus", 
        [
            "create:andesite_casing",
            "functionalstorage:controller_extension"
        ]
    )
        .id("createdelight:andesite_import_bus")
    e.recipes.kubejs.shapeless(
        "createdelight:andesite_export_bus",
        "createdelight:andesite_import_bus"
    )
        .id("createdelight:andesite_export_bus_from_import_bus")
    e.recipes.kubejs.shapeless(
        "createdelight:andesite_import_bus",
        "createdelight:andesite_export_bus"
    )
        .id("createdelight:andesite_import_bus_from_export_bus")
    //锻造钢总线
    e.recipes.create.item_application(
        "createdelight:forged_steel_import_bus",
        [
            "createdelightcore:forge_steel_casing",
            "functionalstorage:controller_extension"
        ]
    )
        .id("createdelight:forged_steel_import_bus")
    e.recipes.kubejs.shapeless(
        "createdelight:forged_steel_export_bus",
        "createdelight:forged_steel_import_bus"
    )
        .id("createdelight:forged_steel_export_bus_from_import_bus")
    e.recipes.kubejs.shapeless(
        "createdelight:forged_steel_import_bus",
        "createdelight:forged_steel_export_bus"
    )
        .id("createdelight:forged_steel_import_bus_from_export_bus")
    //屠宰室核心
    e.shaped("createdelight:butchery_room", [
        "ABA",
        "BCB",
        "ABA"
    ], {
        A: "create:andesite_casing",
        B: "create:andesite_alloy",
        C: "create:precision_mechanism"
    })
        .id("createdelight:butchery_room")
    e.shaped("createdelight:create_in", [
        " A ",
        "ABA",
        " A "
    ], {
        A: "create:cogwheel",
        B: "create:gearbox"
    })
        .id("createdelight:create_in")
    e.recipes.create.mechanical_crafting("createdelight:hydropower_station", [
        "AAAAA",
        "ABBCA",
        "ABDCA",
        "ABCCA",
        "AAAAA"
    ], {
        A: "ae2:sky_stone_brick",
        B: "ae2:fluix_crystal",
        C: "minecraft:quartz",
        D: "vintageimprovements:redstone_module"
    })
        .id("createdelight:mechanical_crafting/hydropower_station")

    e.recipes.create.mechanical_crafting("createdelight:hydropower_station_fan", [
        " A A ",
        "ABBBA",
        " BCB ",
        "ABBBA",
        " A A "
    ], {
        A: "ad_astra:steel_plate",
        B: "ae2:sky_dust",
        C: "create:shaft"
    })
        .id("createdelight:mechanical_crafting/hydropower_station_fan")

    //合金电炉
    e.recipes.create.mechanical_crafting("createdelight:alloy_electric_furnace", [
        "ABBBA",
        "ACCCA",
        "ADEDA",
        "AFFFA",
        "AAAAA"
    ], {
        A: "#forge:plates/steel",
        B: "#forge:plates/bronze",
        C: "#forge:plates/bronze",
        D: "minecraft:blast_furnace",
        E: "vintageimprovements:redstone_module",
        F: "create:sturdy_sheet"
    })
        .id("createdelight:mechanical_crafting/alloy_electric_furnace")

    e.recipes.create.mechanical_crafting("createdelight:hydropower_amplifier", [
        "AABAA",
        "ACDCA",
        "BDEDB",
        "ACDCA",
        "AABAA"
    ], {
        A: "createdelight:sky_steel_casing",
        B: "ad_astra:fan",
        C: "createdelight:forged_steel_sheet",
        D: "ad_astra:steel_engine",
        E: "createdelightcore:forged_steel_block"
    })
        .id("createdelight:mechanical_crafting/hydropower_amplifier")
})