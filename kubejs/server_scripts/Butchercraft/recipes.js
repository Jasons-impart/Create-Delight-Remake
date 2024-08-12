ServerEvents.recipes(e => {
    e.recipes.kubejs.shapeless(
        "minecraft:slime_ball",
        [
            "minecraft:water_bucket",
            'butchercraft:gelatin'
        ]
    ).id("butchercraft:gelatin_to_slime_ball")
    e.recipes.create.mixing(
        "minecraft:slime_ball",
        [
            Fluid.of("water", 250),
            "butchercraft:gelatin"
        ]
    ).id("butchercraft:mixing/gelatin_to_slime_ball")
    // 血肠混合料
    e.custom({
        "type": "minecraft:crafting_shapeless",
        "ingredients": [
            {
                "tag": "forge:ground_meat/raw"
            },
            {
                "tag": "forge:ground_meat/raw"
            },
            {
                "tag": "forge:ground_meat/raw"
            },
            {
                "tag": "forge:ground_meat/raw"
            },
            {
                "tag": "forge:ground_meat/raw"
            },
            {
                "tag": "forge:ground_meat/raw"
            },
            {
                "item": "butchercraft:fat"
            },
            {
                "item": 'ratatouille:wheat_kernels'
            },
            {
                "item": "butchercraft:blood_fluid_bottle"
            }
        ],
        "result": {
            "count": 8,
            "item": "butchercraft:blood_sausage_mix"
        }
    })
    .id("butchercraft:blood_sausage_mix")
})