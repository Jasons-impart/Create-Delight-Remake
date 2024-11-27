ServerEvents.recipes(e => {
    e.recipes.create.item_application("create_connected:fan_freezing_catalyst", [
        "create_connected:empty_fan_catalyst",
        "minecraft:powder_snow_bucket"
    ])
    .id("create_connected:item_application/kinetics/fan_freezing_catalyst_from_empty")
    e.recipes.kubejs.shapeless("create_connected:empty_fan_catalyst", "create_connected:fan_freezing_catalyst")
    .id("create_connected:crafting/kinetics/empty_fan_catalyst_from_fan_freezing")
})