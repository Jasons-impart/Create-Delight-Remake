ServerEvents.recipes(e => {
    //屠宰室核心
    e.shaped("mbd2:butchery_room", [
        "ABA",
        "BCB",
        "ABA"
    ], {
        A: "create:industrial_iron_block",
        B: "create:andesite_alloy",
        C: "create:precision_mechanism"
    })
        .id("mbd2:butchery_room")
    //屠宰入口
    e.shaped("mbd2:butchery_in", [
        "ABA",
        "BCB",
        "ABA"
    ], {
        A: "create:industrial_iron_block",
        B: "create:andesite_alloy",
        C: "vintageimprovements:redstone_module"
    })
        .id("mbd2:butchery_in")
    //屠宰出口
    e.shaped("mbd2:butchery_out", [
        "ABA",
        "BCB",
        "ABA"
    ], {
        A: "create:andesite_alloy",
        B: "create:industrial_iron_block",
        C: "create:precision_mechanism"
    })
        .id("mbd2:butchery_out")
    e.shaped("mbd2:create_in", [
        " A ",
        "ABA",
        " A "
    ], {
        A: "create:cogwheel",
        B: "create:gearbox"
    })
        .id("mbd2:create_in")
    e.recipes.create.mechanical_crafting("mbd2:hydropower_station", [
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
        .id("mbd2:mechanical_crafting/hydropower_station")

    e.recipes.create.mechanical_crafting("mbd2:hydropower_station_fan", [
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
        .id("mbd2:mechanical_crafting/hydropower_station_fan")
})