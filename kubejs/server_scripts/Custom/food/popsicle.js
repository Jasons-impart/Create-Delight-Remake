ServerEvents.recipes(e => {
    // 老冰棍

    e.recipes.kubejs.shaped("createdelight:empty_popsicle", [
        " AA",
        "ABA",
        "CA "
    ],
        {
            A: "#forge:ice_cubes",
            B: "minecraft:sugar",
            C: "minecraft:stick"
        })
        .id("createdelight:shaped/empty_popsicle")
    let iner_1 = "minecraft:stick"
    e.recipes.create.sequenced_assembly("createdelight:empty_popsicle", iner_1, [
        e.recipes.create.deploying(iner_1, [iner_1, "#forge:ice_cubes"]),
        e.recipes.create.deploying(iner_1, [iner_1, "minecraft:sugar"])
    ])
        .transitionalItem(iner_1)
        .loops(1)
        .id("createdelight:sequenced_assembly/empty_popsicle")

    /**
     *  
     * @param {Internal.ItemStack_} result 
     * @param {Internal.Ingredient_} ingredientItem 
     * @param {Internal.FluidStackJS} ingredientFluid 
     */
    function make_popsicle(result, ingredientItem, ingredientFluid) {
        if (ingredientItem != null) {
        e.recipes.kubejs.shaped(result, [
            "  A",
            " A ",
            "B  "
        ],
            {
                A: ingredientItem,
                B: "createdelight:empty_popsicle"
            })
            .id(`createdelight:shaped/${result.split(":")[1]}`)
        }
        if (ingredientFluid != null) {
            e.recipes.create.filling(result, [
                "createdelight:empty_popsicle",
                ingredientFluid])
                .id(`createdelight:filling/${result.split(":")[1]}`)
        }
    }
    make_popsicle("ends_delight:chorus_fruit_popsicle", "ends_delight:chorus_fruit_grain", Fluid.of("create_central_kitchen:chorus_fruit_wine", 250))
    make_popsicle("farmersdelight:melon_popsicle", "minecraft:melon_slice", Fluid.of("create_central_kitchen:melon_juice", 250))
    make_popsicle("fruitsdelight:hamimelon_popsicle", "fruitsdelight:hamimelon_slice", Fluid.of("fruitsdelight:hamimelon_juice", 250))
    make_popsicle("fruitsdelight:kiwi_popsicle", "fruitsdelight:kiwi", Fluid.of("fruitsdelight:kiwi_juice", 250))
    make_popsicle("casualness_delight:green_tongue", "minecraft:slime_ball", Fluid.of("createdelightcore:slime", 90))
    make_popsicle("collectorsreap:lime_popsicle", "#forge:fruits/lime", Fluid.of("createdelight:limeade", 250))
    // make_popsicle("youkaishomecoming:milk_popsicle", "#forge:milk/milk_bottle", Fluid.of("minecraft:milk", 250))
    e.recipes.create.deploying("youkaishomecoming:big_popsicle", ["createdelight:empty_popsicle", "#forge:ice_cubes"])
    e.recipes.create.deploying('mynethersdelight:tear_popsicle', ['createdelight:empty_popsicle', "minecraft:ghast_tear"])
    .id("createdelight:deploying/big_popsicle")
    //西瓜冰棍配方替换
    e.recipes.kubejs.shaped(
        'farmersdelight:melon_popsicle',
        [
            " AA",
            "BAA",
            "CB "
        ], {
            A: "minecraft:melon_slice",
            B: "#forge:ice_cubes",
            C: "minecraft:stick"
        }
    ).id("abnormals_delight:neapolitan/melon_popsicle")
    // 牛奶冰棍特殊处理
    e.recipes.kubejs.shaped(
        "youkaishomecoming:milk_popsicle",
        [
            "  A",
            " A ",
            "B  "
        ], {
            A: "#forge:milk/milk_bottle",
            B: "createdelight:empty_popsicle"
        }
    ).id("createdelight:shaped/milk_popsicle")
    e.recipes.create.filling(
        "youkaishomecoming:milk_popsicle",
        [
            "createdelight:empty_popsicle",
            FluidIngredients("forge:milk", 250)
        ]
    ).id("createdelight:filling/milk_popsicle")
})

let popsicle_list = [
    'createdelight:empty_popsicle',
    'ends_delight:chorus_fruit_popsicle',
    'farmersdelight:melon_popsicle',
    'mynethersdelight:tear_popsicle',
    'youkaishomecoming:milk_popsicle',
    'fruitsdelight:hamimelon_popsicle',
    'collectorsreap:lime_popsicle',
    'fruitsdelight:kiwi_popsicle',
    'casualness_delight:green_tongue'
]
popsicle_list.forEach(popsicle => {
    ItemEvents.foodEaten(popsicle, e => {
        e.entity.setTicksFrozen(e.entity.getTicksFrozen() + 80)
    })
})
//大冰棍特例
ItemEvents.foodEaten('youkaishomecoming:big_popsicle', e => {
    e.entity.setTicksFrozen(e.entity.getTicksFrozen() + 160)
})