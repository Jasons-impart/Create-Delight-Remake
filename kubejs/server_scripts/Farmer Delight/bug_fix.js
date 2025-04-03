ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "farmersdelight:cutting/sugar_cane_alt"
    ])
    cutting(e, 'minecraft:sugar_cane', 
        [
            ['minecraft:sugar'],
            ['minecraft:sugar', 1, 0.25]
        ]
    )
    e.recipes.create.filling(
        'farmersdelight:milk_bottle',
        [
            Fluid.of("minecraft:milk", 250),
            "glass_bottle"
        ]
    ).id("create:filling/compat/farmersdelight/milk_bottle")
})