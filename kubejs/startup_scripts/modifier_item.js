ItemEvents.modification(e => {
    e.modify('deeperdarker:heart_of_the_deep', item => {
        item.maxStackSize = 64
    })
    e.modify('vintagedelight:surstromming', item => {
        item.foodProperties = food => {
            food.effect("minecraft:nausea", 1200, 2, 1.0)
        }
    })
    e.modify('vintagedelight:cheese_pizza_slice', item => {
        item.foodProperties = food => {
            food.hunger(5)
            food.saturation(0.7)
        }
    })
    e.modify('culturaldelights:squid', item => {
        item.foodProperties = food => {
            food.effect("minecraft:darkness", 120, 1, 1.0)
        }
    })
    e.modify('culturaldelights:glow_squid', item => {
        item.foodProperties = food => {
            food.effect("minecraft:glowing", 120, 1, 1.0)
        }
    })
    e.modify('mynethersdelight:ghast_dough', item => {
        item.foodProperties = food => {
            food.effect("minecraft:levitation", 120, 1, 1)
        }
    })
})