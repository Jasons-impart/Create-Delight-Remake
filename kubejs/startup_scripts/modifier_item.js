ItemEvents.modification(e => {
    e.modify('deeperdarker:heart_of_the_deep', item => {
        item.maxStackSize = 64
    })
    e.modify('vintagedelight:surstromming', item => {
        item.foodProperties = food => {
            food.effect("minecraft:nausea", 1200, 2, 1.0)
        }
    })
})