ServerEvents.recipes(e => {
    // 序列合成：填馅土豆
    e.recipes.create.sequenced_assembly("farmersdelight:stuffed_potato", "minecraft:potato", [
        e.recipes.createDeploying("createdelight:potato_stew_beef", ["minecraft:potato", "#forge:cooked_beef"]),
        e.recipes.createFilling("farmersdelight:stuffed_potato", ["createdelight:potato_stew_beef", Fluid.of("minecraft:milk", 50)]),
    ])
        .transitionalItem("createdelight:potato_stew_beef")
        .loops(1)
})
