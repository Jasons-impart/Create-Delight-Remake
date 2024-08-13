ServerEvents.recipes(e => {
    metal_production_line(e, [
        "create:brass_block",
        "create:brass_ingot",
        "create:brass_nugget",
        "create:brass_sheet",
        "createmetallurgy:molten_brass"
    ], "heated", 40)
})