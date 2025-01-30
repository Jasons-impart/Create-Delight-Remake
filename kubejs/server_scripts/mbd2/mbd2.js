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

    //核反应堆
    e.recipes.kubejs.shaped("mbd2:reactor_vent", [
        "AAA",
        "BAB",
        "BCB"
    ], {
        A: "alexscaves:polymer_plate",
        B: "create_new_age:reactor_casing",
        C: "createaddition:modular_accumulator"
    })
        .id("mbd2:reactor_vent")

    e.recipes.create.mechanical_crafting("mbd2:reactor", [
        "AAAAA",
        "ABCBA",
        "ACDCA",
        "ABCBA",
        "AAAAA"
    ], {
        A: "create_new_age:reactor_casing",
        B: "alexscaves:polymer_plate",
        C: "vintageimprovements:uranium_sheet",
        D: "mbd2:reactor_rod"
    })
        .id("mbd2:mechanical_crafting/reactor")

    e.recipes.create.mechanical_crafting("mbd2:reactor_rod", [
        "ABBBA",
        " CDC ",
        " CDC ",
        "ABBBA"
    ], {
        A: "create_new_age:reactor_casing",
        B: "alexscaves:polymer_plate",
        C: "create_new_age:reactor_glass",
        D: "alexscaves:uranium_rod"
    })
        .id("mbd2:mechanical_crafting/reactor_rod")

    //合金电炉
    e.recipes.create.mechanical_crafting("mbd2:alloy_electric_furnace", [
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
        .id("mbd2:mechanical_crafting/alloy_electric_furnace")

    //能量输入口
    e.shaped("mbd2:energy_in", [
        "CAC",
        "ABA",
        "CAC"
    ], {
        A: "createaddition:capacitor",
        B: "createaddition:modular_accumulator",
        C: "create:brass_sheet"
    })
        .id("mbd2:energy_in")
})