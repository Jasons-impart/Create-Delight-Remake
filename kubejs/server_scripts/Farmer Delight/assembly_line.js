ServerEvents.recipes(e => {
    // 序列合成：填馅土豆
    {
        let iner = "createdelight:potato_stew_beef"
        e.recipes.create.sequenced_assembly("farmersdelight:stuffed_potato", "minecraft:potato", [
            e.recipes.create.deploying(iner, [iner, "#forge:beef/cooked"]),
            e.recipes.create.filling(iner, [iner, FluidIngredients("forge:milk", 50)])
        ])
        .loops(1)
        .transitionalItem(iner)
        .id("createdelight:stuffed_potato")
    }
})
