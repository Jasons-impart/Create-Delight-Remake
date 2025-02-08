ServerEvents.recipes(e => {
    const {create, iceandfire} = e.recipes
    create.filling("ends_delight:raw_dragon_meat", ["#createdelight:dragon_flesh", Fluid.of("create_central_kitchen:dragon_breath", 250)])
    e.replaceInput({id: "iceandfire:dragon_meal"}, "#iceandfire:dragon_food_meat", "#forge:meat/raw")
    create.haunting(Item.of("iceandfire:rotten_egg").withChance(0.25), "minecraft:egg").id("iceandfire:haunting/rotten_egg")
    iceandfire.dragonforge(
        "minecraft:dragon_breath",
        "ends_delight:dried_chorus_flower", "minecraft:glass_bottle", "fire", 400)
        .id("iceandfire:dragonforge/dragon_breath_fire")
    iceandfire.dragonforge(
        "minecraft:dragon_breath",
        "ends_delight:dried_chorus_flower", "minecraft:glass_bottle", "ice", 400)
        .id("iceandfire:dragonforge/dragon_breath_ice")
    iceandfire.dragonforge(
        "minecraft:dragon_breath",
        "ends_delight:dried_chorus_flower", "minecraft:glass_bottle", "lightning", 400)
        .id("iceandfire:dragonforge/dragon_breath_lightning")
})