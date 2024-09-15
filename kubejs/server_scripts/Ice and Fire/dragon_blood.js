ServerEvents.recipes(e => {
    e.recipes.create.emptying([
        Fluid.of("createdelight:fire_dragon_blood", 250),
        "minecraft:glass_bottle"
    ],"iceandfire:fire_dragon_blood"
    ).id("createdelight:empting/fire_dragon_blood")
    e.recipes.create.emptying([
        Fluid.of("createdelight:ice_dragon_blood", 250),
        "minecraft:glass_bottle"
    ],"iceandfire:ice_dragon_blood"
    ).id("createdelight:empting/ice_dragon_blood")
    e.recipes.create.emptying([
        Fluid.of("createdelight:lightning_dragon_blood", 250),
        "minecraft:glass_bottle"
    ],"iceandfire:lightning_dragon_blood"
    ).id("createdelight:empting/lightning_dragon_blood")
})