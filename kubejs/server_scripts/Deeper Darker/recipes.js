ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "deeperdarker:sonorous_staff"
    ])
    e.recipes.farmersdelight.cutting(
        "deeperdarker:heart_of_the_deep",
        "#forge:tools/wrench",
        "2x silentsdelight:warden_heart"
    ).id("silentsdelight:warden_heart")
    // 增加配方：强化深板岩
    e.shaped("4x minecraft:reinforced_deepslate", [
        "ABA",
        "BCB",
        "ABA"
    ], {
        A: "minecraft:ancient_debris",
        B: "minecraft:deepslate",
        C: "minecraft:nether_star"
    })
})