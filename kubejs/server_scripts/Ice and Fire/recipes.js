ServerEvents.recipes(e => {
    const {create} = e.recipes
    create.filling("ends_delight:raw_dragon_meat", ["#createdelight:dragon_flesh", Fluid.of("create_central_kitchen:dragon_breath", 250)])
    e.replaceInput({id: "iceandfire:dragon_meal"}, "#iceandfire:dragon_food_meat", "#forge:meat/raw")
    create.haunting(Item.of("iceandfire:rotten_egg").withChance(0.25), "minecraft:egg").id("iceandfire:haunting/rotten_egg")
})