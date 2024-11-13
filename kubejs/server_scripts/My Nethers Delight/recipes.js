ServerEvents.recipes(e => {
    const {create} = e.recipes
    create.milling("minecraft:gunpowder", "mynethersdelight:powder_cannon")
    .id("mynethersdelight:milling/powdery_cannon")
})