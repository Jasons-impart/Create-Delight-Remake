ServerEvents.recipes(e => {
    // 老冰棍

    e.recipes.kubejs.shaped("createdelight:empty_popsicle", [
        "  A",
        "AB ",
        "CA "
    ],
        {
            A: "youkaishomecoming:ice_cube",
            B: "minecraft:sugar",
            C: "minecraft:stick"
        })
        .id("createdelight:shaped/empty_popsicle")
    let iner_1 = "minecraft:stick"
    e.recipes.create.sequenced_assembly("createdelight:empty_popsicle", iner_1, [
        e.recipes.create.deploying(iner_1, [iner_1, "youkaishomecoming:ice_cube"]),
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
    make_popsicle("casualness_delight:green_tongue", "minecraft:slime_ball", Fluid.of("createdelight:slime", 90))
    // make_popsicle("youkaishomecoming:milk_popsicle", "#forge:milk/milk_bottle", Fluid.of("minecraft:milk", 250))
    e.recipes.create.deploying("youkaishomecoming:big_popsicle", ["createdelight:empty_popsicle", "youkaishomecoming:ice_cube"])
    .id("createdelight:deploying/big_popsicle")
    // 牛奶冰棍特殊处理
    // e.recipes.kubejs.shaped(
    //     "youkaishomecoming:milk_popsicle",
    //     [
    //         "  A",
    //         " A ",
    //         "B  "
    //     ], {
    //         A: "#forge:milk/milk_bottle",
    //         B: "createdelight:empty_popsicle"
    //     }
    // ).id("createdelight:shaped/milk_popsicle")
    e.custom({
        type: "create:filling",
        ingredients: [
            {
                item: "createdelight:empty_popsicle"
            },
            {
                amount: 250,
                fluidTag: "forge:milk"
            }
        ],
        results: [
            {
                item: "youkaishomecoming:milk_popsicle"
            }
        ]
    }).id("createdelight:filling/milk_popsicle")
})