ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "create:crafting/kinetics/encased_chain_drive",
        "create:crafting/kinetics/encased_chain_drive_from_zinc",
    ])
    e.shapeless("3x create:encased_chain_drive",
        ["create:andesite_casing", "createaddition:iron_rod"],
    ).id("create_connected:crafting/kinetics/encased_chain_drive")
    e.shapeless("3x create:encased_chain_drive",
        ["create:andesite_casing", "vintageimprovements:zinc_rod"],
    ).id("create_connected:crafting/kinetics/encased_chain_drive_from_zinc")
    e.recipes.create.item_application("create_connected:fan_freezing_catalyst", [
        "create_connected:empty_fan_catalyst",
        "minecraft:powder_snow_bucket"
    ])
    .id("create_connected:item_application/kinetics/fan_freezing_catalyst_from_empty")
    e.recipes.kubejs.shapeless("create_connected:empty_fan_catalyst", "create_connected:fan_freezing_catalyst")
    .id("create_connected:crafting/kinetics/empty_fan_catalyst_from_fan_freezing")
})