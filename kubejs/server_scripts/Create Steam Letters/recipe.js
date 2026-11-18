ServerEvents.recipes(e => {
    if (!Platform.isLoaded("steam_letters")) return

    const { create, steam_letters } = e.recipes

    remove_recipes_id(e, [
        "steam_letters:pressing/material/bronze/plate",
        "steam_letters:crafting/shapeless/material/tin_ingot_block",
        "steam_letters:crafting/shaped/material/tin_ingot_nugget",
        "steam_letters:mixing/material/bronze/ingot",
        "steam_letters:crushing/material/tin/nugget/deepslate",
        "steam_letters:milling/material/tin/nugget/deepslate",
        "steam_letters:crafting/shaped/material/bronze_block_ingot",
        "steam_letters:crafting/shapeless/material/tin_nugget_ingot",
        "steam_letters:crafting/shapeless/material/bronze_ingot_block",
        "steam_letters:crafting/shaped/material/tin_block_ingot",
        "steam_letters:crafting/shaped/steam/boiler",
        "steam_letters:crafting/shaped/bronze/basin/ingot",
        "steam_letters:crafting/shaped/bronze/basin/ingot_update",
        "steam_letters:crafting/shaped/flywheel"
    ])

    create.filling(
        "steam_letters:bronze_boiler",
        [
            "create:fluid_tank",
            Fluid.of("createmetallurgy:molten_bronze", 270)
        ]
    ).id("createdelight:bronze_boiler")

    // 沿用现有液体燃料配置：30 tick/mB，1000 mB 共燃烧 30000 tick。
    steam_letters.fluid_fuel("createdelight:cryo_fuel", 30000, true)
        .id("createdelight:steam_letters/fluid_fuel/cryo_fuel")
})
