ServerEvents.tags("minecraft:item", e => {
    e.add("create:blaze_burner_fuel/special", [
        "mynethersdelight:magma_cake_slice",
        "mynethersdelight:hot_cream_cone"
    ])
})

ServerEvents.tags("minecraft:fluid", e => {
    e.add("create:bottomless/allow", [
        "ratatouille:cocoa_liquor",
        "createdelight:egg_yolk",
        "createcafe:melted_sugar",
        "create:honey",
        "createdelight:vinegar",
        "#forge:molten_materials"
    ])
})