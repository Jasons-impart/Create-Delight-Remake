ItemEvents.modification(e => {
    e.modify("deeperdarker:heart_of_the_deep", item => {
        item.maxStackSize = 64
    })
    // 饱和度计算公式为hunger*saturation*2
    let hungers = [
        ["vintagedelight:cheese_pizza_slice", 5, 0.7],
    ]
    hungers.forEach(hunger => {
        e.modify(hunger[0], item => {
            item.foodProperties = food => {
                food.hunger(hunger[1])
                food.saturation(hunger[2])
            }
        });
    })
    // 参数含义分别为，食物id，effectid，持续时间（tick），强度，获得效果的概率
    let effects = [
        ["vintagedelight:surstromming", "minecraft:nausea", 1200, 2, 1.0],
        ["culturaldelights:squid", "minecraft:darkness", 120, 1, 1.0],
        ["culturaldelights:glow_squid", "minecraft:glowing", 120, 1, 1.0],
        ["mynethersdelight:ghast_dough", "minecraft:levitation", 120, 1, 1.0],
        ["culturaldelights:pickle", "farmersdelight:nourishment", 600, 1, 1.0],
        ["culturaldelights:cut_pickle", "farmersdelight:nourishment", 300, 1, 1],

    ]
    effects.forEach(effect => {
        e.modify(effect[0], item => {
            item.foodProperties = food => {
                food.effect(effect[1], effect[2], effect[3], effect[4])
            }
        })
    });
})
