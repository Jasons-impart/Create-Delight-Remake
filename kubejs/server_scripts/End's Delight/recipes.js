ServerEvents.recipes(e => {
    remove_recipes_id(e, [
       "ends_delight:food/chorus_fruit_milk_tea" 
    ])
    e.recipes.create.mixing(Fluid.of("create_central_kitchen:chorus_fruit_wine", 250), [
        "minecraft:sugar", Ingredient.of("#forge:chorus_fruits", 2)
    ])
    .heated()
    .id("ends_delight:mixing/chorus_fruit_wine")
    e.replaceInput({id: "ends_delight:crack_non_hatchable_dragon_egg"}, "ends_delight:non_hatchable_dragon_egg", "#forge:dragonegg")
    //紫颂果珍珠奶茶
    e.custom({
        type: "create:mixing",
        heatRequirement: "heated",
        ingredients: [
            {
                tag: "forge:chorus_fruits"
            },
            {
                item: "ends_delight:ender_pearl_grain"
            },
            {
                item: "minecraft:sugar"
            },
            {
                amount: 200,
                fluidTag: "forge:milk"
            },
            {
                amount: 100,
                fluid: "farmersrespite:black_tea",
                nbt: {}
            }
        ],
        results: [
            {
                amount: 500,
                fluid: "create_central_kitchen:chorus_fruit_bubble_tea"
            }
        ]
    }).id("ends_delight:food/bubble_tea")
    let milktea_list = [
        "chorus_fruit_milk_tea",
        "chorus_fruit_wine"
    ]
    milktea_list.forEach(milktea => {
        e.recipes.create.filling(`ends_delight:${milktea}`, ["minecraft:glass_bottle", Fluid.of(`create_central_kitchen:${milktea}`, 250)])
            .id(`ends_delight:filling/${milktea}`)
        e.recipes.create.emptying(["minecraft:glass_bottle", Fluid.of(`create_central_kitchen:${milktea}`, 250)], `ends_delight:${milktea}`)
            .id(`ends_delight:emptying/${milktea}`) 
    })
    e.recipes.create.filling(`ends_delight:bubble_tea`, ["minecraft:glass_bottle", Fluid.of(`create_central_kitchen:chorus_fruit_bubble_tea`, 250)])
        .id(`ends_delight:filling/bubble_tea`)
    e.recipes.create.emptying(["minecraft:glass_bottle", Fluid.of(`create_central_kitchen:chorus_fruit_bubble_tea`, 250)], `ends_delight:bubble_tea`)
        .id(`ends_delight:emptying/bubble_tea`) 

    brewing(e, "create_central_kitchen:dragon_breath", ["minecraft:sugar"], "createdelight:dragon_breath_soda", 'ends_delight:dragon_breath_soda')
})