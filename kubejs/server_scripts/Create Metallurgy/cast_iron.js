ServerEvents.recipes(e => {
    metal_production_line(e, [
        'createbigcannons:cast_iron_block',
        'createbigcannons:cast_iron_ingot',
        'createbigcannons:cast_iron_nugget',
        'vintageimprovements:cast_iron_sheet',
        "createbigcannons:molten_cast_iron"
    ], "heated", 80)
})
ServerEvents.tags("fluid", e => {
    e.add("forge:molten_materials", [
        "createbigcannons:molten_cast_iron",
        "createbigcannons:flowing_molten_cast_iron"
    ])
})