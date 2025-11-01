ServerEvents.tags("item", e => {
    e.add('forge:popsicle_mold_filled', [
        'ratatouille:melon_popsicle_mold_filled'
    ])
    e.add('forge:popsicle_mold_solid', [
        'ratatouille:melon_popsicle_mold_solid'
    ])
})

ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "ratatouille:freezing/melon_popsicle_mold_solid",
        "create:mixing/melon_juice",
        "create:filling/melon_popsicle_mold_filled",
        "create:filling/melon_juice",
        "ends_delight:food/chorus_fruit_popsicle",
        "mypersonaldelight:crafting/tear_popsicle",
        "create:filling/melon_popsicle_mold_filled_cck",
        "youkaishomecoming:milk_popsicle",
        "fruitsdelight:hamimelon_popsicle",
        "fruitsdelight:kiwi_popsicle",
        "casualness_delight:crafting_shaped/green_tongue",
        "abnormals_delight:neapolitan/melon_popsicle",
        "youkaishomecoming:big_popsicle"
    ])

    //各种冰棍冰冻制作
    let popsicle_recipe_list = [
        ['createdelight:empty_popsicle', Fluid.of("the_bumblezone:sugar_water_still", 100)],
        ['ends_delight:chorus_fruit_popsicle', Fluid.of("createdelightcore:chorusslime", 100)],
        ['cosmopolitan:berry_popsicle', Fluid.of("cosmopolitan:berry_syrup", 100)],
        ['youkaishomecoming:milk_popsicle', FluidIngredients("forge:milk", 100)],
        ['fruitsdelight:hamimelon_popsicle', Fluid.of("fruitsdelight:hamimelon_juice", 100)],
        ['collectorsreap:lime_popsicle', Fluid.of("create_central_kitchen:limeade", 100)],
        ['fruitsdelight:kiwi_popsicle', Fluid.of("fruitsdelight:kiwi_juice", 100)],
        ['casualness_delight:green_tongue', Fluid.of("createdelightcore:slime")],
    ]
    popsicle_recipe_list.forEach(popsicle => {
        let iner = "ratatouille:popsicle_mold"
        e.recipes.create.sequenced_assembly(`createdelight:${popsicle[0].split(":")[1]}_mold_filled`, iner, [
            e.recipes.create.deploying(iner, [iner, "minecraft:stick"]),
            e.recipes.create.filling(iner, [iner, popsicle[1]])
        ])
            .loops(1)
            .transitionalItem(iner)
            .id(`create:assembly/${popsicle[0].split(":")[1]}_mold_filled`)
        freezing(e, `createdelight:${popsicle[0].split(":")[1]}_mold_filled`, `createdelight:${popsicle[0].split(":")[1]}_mold_solid`, 200)
        e.recipes.ratatouille.demolding([popsicle[0], 'ratatouille:popsicle_mold'], `createdelight:${popsicle[0].split(":")[1]}_mold_solid`).id(`ratatouille:demolding/${popsicle[0].split(":")[1]}`)
    })
    let popsicle_recipe_list_2 = [
        ['mynethersdelight:tear_popsicle', "minecraft:ghast_tear"],
        ['youkaishomecoming:big_popsicle', "youkaishomecoming:ice_cube"],
    ]
    popsicle_recipe_list_2.forEach(popsicle => {
        let iner = "ratatouille:popsicle_mold"
        e.recipes.create.sequenced_assembly(`createdelight:${popsicle[0].split(":")[1]}_mold_filled`, iner, [
            e.recipes.create.deploying(iner, [iner, "minecraft:stick"]),
            e.recipes.create.deploying(iner, [iner, popsicle[1]])
        ])
            .loops(1)
            .transitionalItem(iner)
            .id(`create:assembly/${popsicle[0].split(":")[1]}_mold_filled`)
        freezing(e, `createdelight:${popsicle[0].split(":")[1]}_mold_filled`, `createdelight:${popsicle[0].split(":")[1]}_mold_solid`, 200)
        e.recipes.ratatouille.demolding([popsicle[0], 'ratatouille:popsicle_mold'], `createdelight:${popsicle[0].split(":")[1]}_mold_solid`).id(`ratatouille:demolding/${popsicle[0].split(":")[1]}`)
    })
    {
        let iner = "ratatouille:popsicle_mold"
        e.recipes.create.sequenced_assembly('ratatouille:melon_popsicle_mold_filled', iner, [
            e.recipes.create.deploying(iner, [iner, "minecraft:stick"]),
            e.recipes.create.filling(iner, [iner, Fluid.of("create_central_kitchen:melon_juice")])
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("create:assembly/melon_popsicle_mold_filled")
        freezing(e, "ratatouille:melon_popsicle_mold_filled", "ratatouille:melon_popsicle_mold_solid", 200)
    }

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
    'casualness_delight:green_tongue',
    'youkaishomecoming:big_popsicle'
]
popsicle_list.forEach(popsicle => {
    ItemEvents.foodEaten(popsicle, e => {
        e.entity.setTicksFrozen(e.entity.getTicksFrozen() + 80)
    })
})
let no_stick_popsicle_list = [
    'createdelight:empty_popsicle',
    'ends_delight:chorus_fruit_popsicle',
    'farmersdelight:melon_popsicle',
    'mynethersdelight:tear_popsicle',
    'collectorsreap:lime_popsicle',
    'casualness_delight:green_tongue',
    'cosmopolitan:berry_popsicle'
]
no_stick_popsicle_list.forEach(popsicle => {
    ItemEvents.foodEaten(popsicle, e => {
        e.server.scheduleInTicks(1, func => {
            if(!e.player.isCreative()) {
                if(!e.player.getInventory().add("minecraft:stick")) {
                    e.player.drop("minecraft:stick", false)
                }
            }
        })
    })
})
let doublepopsicle_list = [
    'cosmopolitan:berry_popsicle_double',
    'cosmopolitan:chorus_fruit_popsicle_double',
    'cosmopolitan:lime_popsicle_double'
]
doublepopsicle_list.forEach(popsicle => {
    ItemEvents.foodEaten(popsicle, e => {
        e.server.scheduleInTicks(1, func => {
            if(!e.player.isCreative()) {
                if(!e.player.getInventory().add("2x minecraft:stick")) {
                    e.player.drop("2x minecraft:stick", false)
                }
            }
        })
    })
})
ItemEvents.foodEaten('cmr:frozen_cake', e => {
    e.entity.setTicksFrozen(e.entity.getTicksFrozen() + 800)
})

    // // 老冰棍

    // e.recipes.kubejs.shaped("createdelight:empty_popsicle", [
    //     " AA",
    //     "ABA",
    //     "CA "
    // ],
    //     {
    //         A: "#forge:ice_cubes",
    //         B: "minecraft:sugar",
    //         C: "minecraft:stick"
    //     })
    //     .id("createdelight:shaped/empty_popsicle")
    // let iner_1 = "minecraft:stick"
    // e.recipes.create.sequenced_assembly("createdelight:empty_popsicle", iner_1, [
    //     e.recipes.create.deploying(iner_1, [iner_1, "#forge:ice_cubes"]),
    //     e.recipes.create.deploying(iner_1, [iner_1, "minecraft:sugar"])
    // ])
    //     .transitionalItem(iner_1)
    //     .loops(1)
    //     .id("createdelight:sequenced_assembly/empty_popsicle")

    // /**
    //  *  
    //  * @param {Internal.ItemStack_} result 
    //  * @param {Internal.Ingredient_} ingredientItem 
    //  * @param {Internal.FluidStackJS} ingredientFluid 
    //  */
    // function make_popsicle(result, ingredientItem, ingredientFluid) {
    //     if (ingredientItem != null) {
    //     e.recipes.kubejs.shaped(result, [
    //         "  A",
    //         " A ",
    //         "B  "
    //     ],
    //         {
    //             A: ingredientItem,
    //             B: "createdelight:empty_popsicle"
    //         })
    //         .id(`createdelight:shaped/${result.split(":")[1]}`)
    //     }
    //     if (ingredientFluid != null) {
    //         e.recipes.create.filling(result, [
    //             "createdelight:empty_popsicle",
    //             ingredientFluid])
    //             .id(`createdelight:filling/${result.split(":")[1]}`)
    //     }
    // }


    // make_popsicle("ends_delight:chorus_fruit_popsicle", "ends_delight:chorus_fruit_grain", Fluid.of("create_central_kitchen:chorus_fruit_wine", 250))
    // make_popsicle("farmersdelight:melon_popsicle", "minecraft:melon_slice", Fluid.of("create_central_kitchen:melon_juice", 250))
    // make_popsicle("fruitsdelight:hamimelon_popsicle", "fruitsdelight:hamimelon_slice", Fluid.of("fruitsdelight:hamimelon_juice", 250))
    // make_popsicle("fruitsdelight:kiwi_popsicle", "fruitsdelight:kiwi", Fluid.of("fruitsdelight:kiwi_juice", 250))
    // make_popsicle("casualness_delight:green_tongue", "minecraft:slime_ball", Fluid.of("createdelightcore:slime", 90))
    // make_popsicle("collectorsreap:lime_popsicle", "#forge:fruits/lime", Fluid.of("createdelight:limeade", 250))
    // // make_popsicle("youkaishomecoming:milk_popsicle", "#forge:milk/milk_bottle", Fluid.of("minecraft:milk", 250))
    // e.recipes.create.deploying("youkaishomecoming:big_popsicle", ["createdelight:empty_popsicle", "#forge:ice_cubes"])
    // e.recipes.create.deploying('mynethersdelight:tear_popsicle', ['createdelight:empty_popsicle', "minecraft:ghast_tear"])
    // .id("createdelight:deploying/big_popsicle")
    // //西瓜冰棍配方替换
    // e.recipes.kubejs.shaped(
    //     'farmersdelight:melon_popsicle',
    //     [
    //         " AA",
    //         "BAA",
    //         "CB "
    //     ], {
    //         A: "minecraft:melon_slice",
    //         B: "#forge:ice_cubes",
    //         C: "minecraft:stick"
    //     }
    // ).id("abnormals_delight:neapolitan/melon_popsicle")
    // // 牛奶冰棍特殊处理
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
    // e.recipes.create.filling(
    //     "youkaishomecoming:milk_popsicle",
    //     [
    //         "createdelight:empty_popsicle",
    //         FluidIngredients("forge:milk", 250)
    //     ]
    // ).id("createdelight:filling/milk_popsicle")
