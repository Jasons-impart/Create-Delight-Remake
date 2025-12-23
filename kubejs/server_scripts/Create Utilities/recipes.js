ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "createutilities:shaped/gearcube",
        "createutilities:shaped/void_chest",
        "createmetallurgy:alloying/void_steel",
        "createutilities:mixing/void_steel_ingot",
        "functionalstorage:ender_drawer"
    ])
    metal_production_line_3(e, [
        "createutilities:void_steel_block",
        "createutilities:void_steel_ingot",
        "createutilities:void_steel_sheet",
        "createmetallurgy:molten_void_steel"
    ],
        "heated", 60)
    e.replaceInput({id: "createutilities:item_application/void_casing"}, "minecraft:obsidian", "ae2:smooth_sky_stone_block")
    e.recipes.createmetallurgy.alloying(
        Fluid.of("createmetallurgy:molten_void_steel", 90),
        [
            "ae2:ender_dust",
            Fluid.of("createmetallurgy:molten_steel", 90)
        ], 180, "superheated"
    ).id("createmetallurgy:alloying/molten_void_steel")
    
    e.recipes.createmetallurgy.casting_in_basin(
        "createutilities:void_casing",
        ["ae2:smooth_sky_stone_block", Fluid.of("createmetallurgy:molten_void_steel", 90)], 70, true)
        .id("createutilities:casting_in_basin/void_casing")
    let iner = "createdelight:incomplete_graviton_tube"
    e.recipes.create.sequenced_assembly("4x createutilities:graviton_tube", "createutilities:void_steel_sheet", [
        e.recipes.create.deploying(iner, [iner, "ae2:ender_dust"]),
        e.recipes.create.filling(iner, [iner, Fluid.of("createmetallurgy:molten_tin", 10)]),
        e.recipes.create.deploying(iner, [iner, "createutilities:polished_amethyst"]),
        e.recipes.create.cutting(iner, iner)
    ])
        .transitionalItem(iner)
        .loops(1)
        .id("createutilities:shaped/graviton_tube")
    e.recipes.create.item_application(
        "createutilities:void_battery",
        [
            "createaddition:modular_accumulator",
            "createutilities:graviton_tube"
        ]
    ).id("createutilities:shaped/void_battery")
    e.recipes.create.item_application(
        "createutilities:void_tank",
        [
            "create:fluid_tank",
            "createutilities:graviton_tube"
        ]
    ).id("createutilities:shaped/void_tank")
    e.recipes.create.item_application(
        "functionalstorage:ender_drawer",
        [
            "#functionalstorage:drawer",
            "createutilities:graviton_tube"
        ]
    ).id("functionalstorage:ender_drawer")
    e.recipes.create.deploying(
        "createutilities:void_motor",
        [
            "createutilities:void_casing",
            "createutilities:graviton_tube"
        ]
    ).id("createutilities:void_motor")
})