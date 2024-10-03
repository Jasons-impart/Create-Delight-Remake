ServerEvents.tags("fluid", e => {
    e.add("forge:molten_materials", [
        "createbigcannons:molten_bronze",
        "createbigcannons:flowing_molten_bronze"
    ])
})
ServerEvents.tags("block", e => {
    e.add("forge:storage_blocks", "createdelight:bronze_block")
    e.add("forge:storage_blocks/bronze", "createdelight:bronze_block")
})
ServerEvents.tags("item", e => {
    e.add("balm:ingots", "createdelight:bronze_ingot")
    e.add("forge:ingots", "createdelight:bronze_ingot")
    e.add("forge:ingots/bronze", "createdelight:bronze_ingot")
    e.add("forge:plates", "createdelight:bronze_sheet")
    e.add("forge:plates/bronze", "createdelight:bronze_sheet")
    e.add("createbigcannons:sheet_bronze", "createdelight:bronze_sheet")
    e.add("forge:nuggets", "createdelight:bronze_nugget")
    e.add("forge:nuggets/bronze", "createdelight:bronze_nugget")
})
ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "createbigcannons:compacting/forge_bronze_ingot",
        "vintageimprovements:pressing/bronze_ingot"
    ])
    e.replaceInput({ id: "vintageimprovements:rolling/bronze_plate" }, "vintageimprovements:bronze_sheet", "createdelight:bronze_sheet")
    e.replaceOutput({ id: "vintageimprovements:pressing/bronze_ingot" }, "vintageimprovements:bronze_sheet", "createdelight:bronze_sheet")
    e.recipes.createmetallurgy.alloying(
        Fluid.of("createbigcannons:molten_bronze", 90),
        [
            Fluid.of("createdelight:molten_tin", 45),
            Fluid.of("createmetallurgy:molten_copper", 45)
        ], "heated", 30
    ).id("createmetallurgy:alloying/alloying_bronze")
    e.recipes.create.mixing(
        Fluid.of("createbigcannons:molten_bronze", 30),
        [
            Fluid.of("createdelight:molten_tin", 15),
            Fluid.of("createmetallurgy:molten_copper", 15)
        ], 150, "heated"
    ).id("createmetallurgy:mixing/alloying_bronze")
    metal_production_line(e,
        [
            "createdelight:bronze_block",
            "createdelight:bronze_ingot",
            "createdelight:bronze_nugget",
            "createdelight:bronze_sheet",
            "createbigcannons:molten_bronze"
        ], "heated", 80
    )
    e.recipes.create.pressing(
        "createdelight:bronze_sheet",
        "createdelight:bronze_ingot",
    ).id("create:pressing/bronze_sheet")
})