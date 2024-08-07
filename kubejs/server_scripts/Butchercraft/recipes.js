ServerEvents.recipes(e => {
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