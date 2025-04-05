ServerEvents.recipes(e => {
    const {create, vintageimprovements, createdelightcore} = e.recipes
    createdelightcore.fan_freezing("minecraft:leather", "createdelight:unfinished_leather")
    .id("createdelight:fan_freezing/unfinished_leather")
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