ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "farmersdelight:cutting/sugar_cane_alt"
    ])
    cutting(e, 'minecraft:sugar_cane', [
        '2x cosmopolitan:sugarcane_pieces',
        Item.of('minecraft:sugar').withChance(0.5)
    ])
    e.recipes.create.filling(
        'farmersdelight:milk_bottle',
        [
            Fluid.of("minecraft:milk", 250),
            "glass_bottle"
        ]
    ).id("createdelight:filling/compat/farmersdelight/milk_bottle")
})
