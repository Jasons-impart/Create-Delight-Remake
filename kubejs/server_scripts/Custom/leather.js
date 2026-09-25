ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "youkaishomecoming:leather_from_rotten_flesh_drying",

    ])
    const {create, vintageimprovements, create_dragons_plus} = e.recipes
    create_dragons_plus.freezing("minecraft:leather", "createdelight:unfinished_leather")
        .id("createdelight:fan_freezing/unfinished_leather")
    vintageimprovements.pressurizing("createdelight:unfinished_leather", [Fluid.of("createdelightcore:slime", 45), "#createdelight:leather_ingredient"])
        .heated().id("createdelight:pressurizing/unfinished_leather")
})

ServerEvents.tags("minecraft:item", e => {
    e.add("createdelight:leather_ingredient", [
        "minecraft:cactus",
        "minecraft:rotten_flesh",
        "fruitsdelight:pineapple_sapling",
        "farmersdelight:canvas",
    ])
})
