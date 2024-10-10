ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "createutilities:shaped/gearcube",
        "createutilities:shaped/void_chest"
    ])
    metal_production_line_3(e, [
        "createutilities:void_steel_block",
        "createutilities:void_steel_ingot",
        "createutilities:void_steel_sheet",
        "createmetallurgy:molten_void_steel"
    ],
    "heated",
    60
    )
    let iner = "createdelight:incomplete_graviton_tube"
    e.recipes.create.sequenced_assembly("4x createutilities:graviton_tube", "createutilities:void_steel_sheet", [
        e.recipes.create.deploying(iner, [iner, "#forge:wires/electric"]),
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
        "createutilities:void_motor",
        [
            "createutilities:void_casing",
            "createutilities:graviton_tube"
        ]
    ).id("createutilities:shaped/void_motor")
})