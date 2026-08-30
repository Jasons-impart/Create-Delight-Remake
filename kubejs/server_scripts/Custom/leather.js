ServerEvents.recipes(e => {
    const {create, vintageimprovements, createdelightcore} = e.recipes
    dragonPlusFreezing(e, "createdelight:unfinished_leather", "minecraft:leather", "createdelight:fan_freezing/unfinished_leather")
    vintageimprovements.pressurizing("createdelight:unfinished_leather", [Fluid.of("createdelightcore:slime", 45), "#createdelight:leather_ingredient"])
    .heated()
    .id("createdelight:pressurizing/unfinished_leather")
})

ServerEvents.tags("minecraft:item", e => {
    e.add("createdelight:leather_ingredient", [
        "minecraft:cactus",
        "minecraft:rotten_flesh",
        "fruitsdelight:pineapple_sapling",
        "farmersdelight:canvas"])
})
