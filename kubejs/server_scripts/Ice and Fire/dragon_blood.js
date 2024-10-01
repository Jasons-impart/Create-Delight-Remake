ServerEvents.recipes(e => {
    remove_recipes_id(e ,[
        "iceandfire:armor_copper_metal_helmet",
        "iceandfire:armor_copper_metal_chestplate",
        "iceandfire:armor_copper_metal_leggings",
        "iceandfire:armor_copper_metal_boots",
        "iceandfire:copper_sword",
        "iceandfire:copper_shovel",
        "iceandfire:copper_pickaxe",
        "iceandfire:copper_pickaxe",
        "iceandfire:copper_axe",
        "iceandfire:copper_hoe"
    ])
    remove_recipes_output(e, [
        "iceandfire:copper_nugget"
    ])
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