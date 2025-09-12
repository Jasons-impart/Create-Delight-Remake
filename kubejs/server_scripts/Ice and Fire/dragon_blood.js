ServerEvents.recipes(e => {
    remove_recipes_id(e, [
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
    // 火龙
    e.recipes.create.mixing(
        Fluid.of("createdelight:fire_dragon_blood", 30),
        'iceandfire:fire_dragon_flesh'
    ).id("createdelight:mixing/fire_dragon_blood_1")
    e.recipes.create.mixing(
        Fluid.of("createdelight:fire_dragon_blood", 90),
        'iceandfire:fire_dragon_heart'
    ).id("createdelight:mixing/fire_dragon_blood_2")
    e.recipes.create.filling(
        'iceandfire:dragonbone_sword_fire',
        [
            'iceandfire:dragonbone_sword',
            Fluid.of("createdelight:fire_dragon_blood", 250)
        ]
    ).id("iceandfire:dragonbone_sword_fire")
    e.recipes.create.filling(
        'iceandfire:fire_dragon_blood',
        [
            'minecraft:glass_bottle',
            Fluid.of("createdelight:fire_dragon_blood", 250)
        ]
    ).id("iceandfire:fire_dragon_blood")
    // 冰龙
    e.recipes.create.emptying([
        Fluid.of("createdelight:fire_dragon_blood", 250),
        "minecraft:glass_bottle"
    ], "iceandfire:fire_dragon_blood"
    ).id("createdelight:empting/fire_dragon_blood")
    e.recipes.create.mixing(
        Fluid.of("createdelight:ice_dragon_blood", 30),
        'iceandfire:ice_dragon_flesh'
    ).id("createdelight:mixing/ice_dragon_blood_1")
    e.recipes.create.mixing(
        Fluid.of("createdelight:ice_dragon_blood", 90),
        'iceandfire:ice_dragon_heart'
    ).id("createdelight:mixing/ice_dragon_blood_2")
    e.recipes.create.filling(
        'iceandfire:dragonbone_sword_ice',
        [
            'iceandfire:dragonbone_sword',
            Fluid.of("createdelight:ice_dragon_blood", 250)
        ]
    ).id("iceandfire:dragonbone_sword_ice")
    e.recipes.create.filling(
        'iceandfire:ice_dragon_blood',
        [
            'minecraft:glass_bottle',
            Fluid.of("createdelight:ice_dragon_blood", 250)
        ]
    ).id("iceandfire:ice_dragon_blood")
    // 电龙
    e.recipes.create.emptying([
        Fluid.of("createdelight:ice_dragon_blood", 250),
        "minecraft:glass_bottle"
    ], "iceandfire:ice_dragon_blood"
    ).id("createdelight:empting/ice_dragon_blood")
    e.recipes.create.mixing(
        Fluid.of("createdelight:lightning_dragon_blood", 30),
        'iceandfire:lightning_dragon_flesh'
    ).id("createdelight:mixing/lightning_dragon_blood_1")
    e.recipes.create.mixing(
        Fluid.of("createdelight:lightning_dragon_blood", 90),
        'iceandfire:lightning_dragon_heart'
    ).id("createdelight:mixing/lightning_dragon_blood_2")
    e.recipes.create.emptying([
        Fluid.of("createdelight:lightning_dragon_blood", 250),
        "minecraft:glass_bottle"
    ], "iceandfire:lightning_dragon_blood"
    ).id("createdelight:empting/lightning_dragon_blood")
    e.recipes.create.filling(
        'iceandfire:dragonbone_sword_lightning',
        [
            'iceandfire:dragonbone_sword',
            Fluid.of("createdelight:lightning_dragon_blood", 250)
        ]
    ).id("iceandfire:dragonbone_sword_lightning")
    e.recipes.create.filling(
        'iceandfire:lightning_dragon_blood',
        [
            'minecraft:glass_bottle',
            Fluid.of("createdelight:lightning_dragon_blood", 250)
        ]
    ).id("iceandfire:lightning_dragon_blood")
    e.recipes.create.mixing(Fluid.of("createdelight:fire_dragon_blood", 500), [
        "iceandfire:fire_lily", 
        Fluid.of("createdelightcore:nuclear_waste", 100), 
        Fluid.of("createdelight:fire_dragon_blood", 250)])
    .heatRequirement("superheated")
    .id("createdelight:mixing/fire_dragon_blood_from_nuclear_waste")
    e.recipes.create.mixing(Fluid.of("createdelight:ice_dragon_blood", 500), [
        "iceandfire:frost_lily", 
        Fluid.of("createdelightcore:nuclear_waste", 100), 
        Fluid.of("createdelight:ice_dragon_blood", 250)])
    .heatRequirement("frozen")
    .id("createdelight:mixing/ice_dragon_blood_from_nuclear_waste")
    e.recipes.create.mixing(Fluid.of("createdelight:lightning_dragon_blood", 500), [
        "iceandfire:lightning_lily", 
        Fluid.of("createdelightcore:nuclear_waste", 100), 
        Fluid.of("createdelight:lightning_dragon_blood", 250)])
    .id("createdelight:mixing/lightning_dragon_blood_from_nuclear_waste")
})
