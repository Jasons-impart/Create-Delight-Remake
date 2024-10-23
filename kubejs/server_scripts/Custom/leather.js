ServerEvents.recipes(e => {
    const {create, vintageimprovements} = e.recipes
    create.cutting("2x minecraft:leather", "createdelight:unfinished_leather").id("createdelight:pressing/leather")
    vintageimprovements.pressurizing("createdelight:unfinished_leather", [Fluid.of("createdelight:slime", 45), "#createdelight:leather_ingredient"])
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