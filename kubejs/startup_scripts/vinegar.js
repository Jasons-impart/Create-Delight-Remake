// priority: 1075
global.CDVinegar = {
    item: "northeast_china_delight:vinegar",
    fluid: "createdelight:vinegar",
    amount: 250,
    container: "minecraft:glass_bottle",
    barrel: {
        id: "createdelight:tavern_barrel/vinegar",
        ingredients: [
            {ingredient: "northeast_china_delight:soy_residue", count: 5},
            {ingredient: ["#forge:seeds/corn", "#forge:crops/buckwheat"], count: 5},
            {ingredient: "createdelight:dry_yeast", count: 16}
        ],
        servings: 16,
        unitTime: 11520
    },
    vat: {id: "northeast_china_delight:vat/vinegar", waterLayers: 3, seconds: 360, yeastCount: 10}
}

if (global.CDStartupJavaClasses.$TavernBarrelRecipes) {
    global.CDStartupJavaClasses.$TavernBarrelRecipes.registerFixedBatch(
        global.CDVinegar.barrel.id,
        global.CDVinegar.barrel.ingredients.map(input => input.count)
    )
}

ItemEvents.modification(event => {
    event.modify(global.CDVinegar.item, item => {
        item.foodProperties = food => {
            food.hunger(0)
            food.saturation(0)
            food.alwaysEdible()
            food.effect("minecraft:blindness", 200, 0, 0.25)
            food.effect("minecraft:slowness", 200, 0, 0.25)
            food.effect("minecraft:mining_fatigue", 200, 0, 0.25)
            food.effect("minecraft:speed", 200, 0, 0.15)
            food.effect("minecraft:jump_boost", 200, 0, 0.15)
        }
    })
})
