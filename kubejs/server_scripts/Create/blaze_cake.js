ItemEvents.foodEaten("create:blaze_cake", e => {
    e.entity.nbt.putInt("Fire", 200)
})