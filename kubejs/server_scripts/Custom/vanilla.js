ServerEvents.recipes(e => {
    const {vintageimprovements} = e.recipes
    vintageimprovements.pressurizing("minecraft:glowstone_dust", "minecraft:glow_berries")
    .heated()
    .id("createdelight:pressurizing/glowstone_dust")
})