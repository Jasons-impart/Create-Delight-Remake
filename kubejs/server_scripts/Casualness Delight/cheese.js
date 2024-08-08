ServerEvents.recipes(e => {
    // 幻翼泡芙
    e.recipes.farmersdelight.cooking(
        [
            "phantom_membrane",
            "#forge:cheese",
            "#forge:milk"
        ], "2x casualness_delight:phantom_puff", 1.0,200
    ).id("casualness_delight:cooking/phantom_puff")
    // 奶酪相关
})