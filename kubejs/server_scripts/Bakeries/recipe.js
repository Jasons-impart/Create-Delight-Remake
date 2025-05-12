/**
 * 
 * @param {InputItem_} item 
 * @param {number} count 
 * @param {number} chance 
 * @returns 
 */
function multi_item(item, count) {
    let list = []
    for (let i = 0; i < count; i++) {
        list.push(Ingredient.of(item))
    }
    return list
}

ServerEvents.recipes(e => {
    const { create, createdieselgenerators, vintageimprovements, kubejs, createaddition } = e.recipes
    remove_recipes_type(e, [
        "bakeries:oven",
        "bakeries:bread_knife",
        "bakeries:coffee",
        "bakeries:flour_sieve",
        "bakeries:blender"
    ])
    remove_recipes_id(e, [
       "farmersdelight:wheat_dough_from_eggs",
       "create:crafting/appliances/dough",
       "create:splashing/wheat_flour",
       "create:mixing/dough_by_mixing",
       "bakeries:blender/bottle_cream",
       "bakeries:blender/butter_cube",
       "bakeries:bottle_milk",
       "bakeries:butter_cube",
       "bakeries:fermentation_tank",
       "bakeries:black_white_concrete",
       "bakeries:flour_sieve",
       "bakeries:blender/meat_floss",
       "bakeries:blender",
       "bakeries:oven",
       "bakeries:salt",
       "bakeries:pineapple_bun_dough",
       "bakeries:meat_floss_bread_dough",
       "bakeries:salt_croissant_dough",
       "bakeries:berry_bread_dough",
       "bakeries:mould_toast_dough",
       "bakeries:cheese_cocoa_toast_dough",
       "bakeries:brown_sugar_roll_dough",
       "bakeries:focaccia",
       "bakeries:drink_cup"
       
    ])
    remove_recipes_output(e, [
        "vintagedelight:oat_dough",
        "bakeries:sweet_dough",
        "bakeries:whole_wheat_dough",
        "bakeries:whole_wheat_flour",
        "bakeries:whole_wheat_flour_bag",
        "bakeries:salted_dough",
        "bakeries:pastry",
        "bakeries:cocoa_dough",
        "bakeries:cocoa_powder",
        "bakeries:olive_oil",
        "bakeries:ground_coffee",
        "bakeries:coffee_bean"
    ])
    e.replaceOutput({ mod: "bakeries" }, 'bakeries:salt', "vintagedelight:salt_dust")
    
    
    //展示框
    e.replaceInput({ id: "bakeries:menu_blcok"}, "minecraft:gray_wool", "minecraft:item_frame")
    create.mixing("4x bakeries:honey_butter", [FluidIngredients("forge:honey", 250), "2x createdelight:butter"])
    .id("bakeries:mixing/honey_butter")
    // 模具
    vintageimprovements.curving(
        'bakeries:mould',
        'vintageimprovements:cast_iron_sheet'
    ).mode(4).id("bakeries:mould")
    // 粗盐块
    kubejs.shapeless(
        "vintagedelight:salt_dust",
        "bakeries:raw_salt_block"
    ).id("bakeries:shapeless/salt_dust")
    //面粉
    create.milling(
        Item.of("bakeries:flour").withChance(0.85),
        "create:wheat_flour"
    ).id("bakeries:integration/create/milling/whole_wheat_flour")
    //酵母
    createdieselgenerators.basin_fermenting(
        Fluid.of("createdelight:yeast", 250),
        [
            '#forge:mushrooms',
            "#forge:flour",
            'minecraft:sugar',
            Fluid.water(250)
        ]
    )
        .processingTime(300)
        .id("bakeries:basin_fermenting/yeast")
    createdieselgenerators.basin_fermenting(
        Fluid.of("createdelight:yeast", 500),
        [
            Fluid.of("createdelight:yeast", 250),
            "#forge:flour",
        ]
    )
        .processingTime(300)
        .id("bakeries:basin_fermenting/yeast_1")
    createdieselgenerators.basin_fermenting(
        Fluid.of("createdelight:yeast", 500),
        [
            "createdelight:dry_yeast",
            "#forge:flour",
            Fluid.water(500)
        ]
    )
        .processingTime(300)
        .id("bakeries:basin_fermenting/yeast_2")
    vintageimprovements.vacuumizing(
        [
            Fluid.water(200),
            "createdelight:dry_yeast"
        ],
        Fluid.of("createdelight:yeast", 250)
    )
        .secondaryFluidOutput(0)
        .id("createdelight:vacuumizing/dry_yeast")
    create.mixing(
        Fluid.of("createdelight:yeast", 250),
        [
            Fluid.water(200),
            "createdelight:dry_yeast"
        ]
    ).id("createdelight:mixing/yeast_fluid")
    create.filling(
        "bakeries:bottle_yeast",
        [
            "minecraft:glass_bottle",
            Fluid.of("createdelight:yeast", 250)
        ]
    ).id("bakeries:filling/bottle_yeast")
    create.emptying(
        [
            "minecraft:glass_bottle",
            Fluid.of("createdelight:yeast", 250)
        ],
        "bakeries:bottle_yeast"
    ).id("bakeries:emptying/bottle_yeast")


    //面团
    create.mixing("bakeries:whole_wheat_dough",
        [
            Fluid.of("minecraft:water", 50),
            "create:wheat_flour"
        ]
    ).id("bakeries:mixing/whole_wheat_dough")
    create.splashing("bakeries:whole_wheat_dough", "create:wheat_flour").id("bakeries:splashing/whole_wheat_dough")
    createdieselgenerators.basin_fermenting(
        "5x create:dough",
        ["createdelight:dry_yeast"].concat(multi_item("bakeries:flour", 5)).concat(Fluid.water(250))
    )
        .processingTime(400)
        .id("create:basin_fermenting/dough")
    createdieselgenerators.basin_fermenting(
        "5x farmersdelight:wheat_dough",
        ["createdelight:dry_yeast"].concat(multi_item("bakeries:flour", 5)).concat(Fluid.of("createdelight:egg_yolk", 250))
    )
        .processingTime(400)
        .id("farmersdelight:basin_fermenting/wheat_dough")
    createdieselgenerators.basin_fermenting(
        "5x bakeries:sweet_dough",
        [
            "createdelight:dry_yeast",
            "minecraft:sugar"
        ].concat(multi_item("bakeries:flour", 5)).concat(Fluid.of("createdelight:egg_yolk", 250))
    )
       .processingTime(400)
       .id("bakeries:basin_fermenting/sweet_dough")
    create.mixing(
        "bakeries:sweet_dough",
        [
            "farmersdelight:wheat_dough",
            "minecraft:sugar"
        ]
    ).id("bakeries:mixing/sweet_dough")
    create.mixing(
        "4x bakeries:meat_floss",
        [
            "minecraft:cooked_porkchop",
            "minecraft:sugar"
        ]
    )
        .processingTime(200)
        .id("bakeries:mixing/meat_floss")
    e.recipes.minecraft.smoking("minecraft:bread", "bakeries:whole_wheat_dough", 0.7, 100)
       .id("bakeries:bread_from_whole_wheat_dough")

    //酥皮
    kubejs.shapeless(
        "createdelight:puff_pastry",
        [
            "#forge:animal_oil",
            "createdelight:oil_dough"
        ]
    ).id("bakeries:puff_pastry")

    //面胚
    {
    let iner = "bakeries:sweet_dough"
    create.sequenced_assembly("4x bakeries:round_bread_dough", iner, [
        vintageimprovements.curving(iner, iner).mode(2),
        create.cutting(iner, iner)
    ])
        .loops(1)
        .transitionalItem(iner)
        .id("bakeries:sequenced_assembly/round_bread_dough")
    }
    vintageimprovements.curving("2x bakeries:bagel_dough", "bakeries:sweet_dough").mode(1).id("bakeries:curving/bagel_dough")
    vintageimprovements.curving("2x bakeries:whole_wheat_bagel_dough", "bakeries:whole_wheat_dough").mode(1).id("bakeries:curving/whole_wheat_bagel_dough")
    {
        let iner = "ratatouille:salty_dough"
        create.sequenced_assembly("2x bakeries:ciabatta_dough", iner, 
            [
            vintageimprovements.curving(iner, iner).mode(1),
            create.cutting(iner, iner)
            ]
        )
            .loops(1)
            .transitionalItem(iner)
            .id("bakeries:sequenced_assembly/ciabatta_dough")
    }
    vintageimprovements.curving("bakeries:country_bread_dough", "ratatouille:salty_dough").mode(2).id("bakeries:curving/country_bread_dough")
    createaddition.rolling("createdelight:puff_pastry", "bakeries:croissant_dough").id("bakeries:rolling/croissant_dough")
    createaddition.rolling("ratatouille:salty_dough", "bakeries:baguette_dough").id("bakeries:rolling/baguette_dough")
    kubejs.shapeless(
       "bakeries:berry_bread_dough",
       [
           "bakeries:round_bread_dough",
           "minecraft:sweet_berries"
       ] 
    ).id("bakeries:berry_bread_dough_manual_only")
    create.deploying(
        "bakeries:berry_bread_dough",
        [
            "bakeries:round_bread_dough",
            "minecraft:sweet_berries"
        ]
    ).id("bakeries:deploying/berry_bread_dough")
    kubejs.shapeless(
        'bakeries:salt_croissant_dough',
        [
            'bakeries:croissant_dough',
            'vintagedelight:salt_dust'
        ]
    ).id("bakeries:salt_croissant_dough_manual_only")
    create.deploying(
        "bakeries:salt_croissant_dough",
        [
            "bakeries:croissant_dough",
            "vintagedelight:salt_dust"
        ]
    ).id("bakeries:deploying/salt_croissant_dough")
    kubejs.shapeless(
        "bakeries:meat_floss_bread_dough",
        [
            "bakeries:round_bread_dough",
            "bakeries:meat_floss"
        ]
    ).id("bakeries:meat_floss_bread_dough_manual_only")
    create.deploying(
        "bakeries:meat_floss_bread_dough",
        [
            "bakeries:round_bread_dough",
            "bakeries:meat_floss"
        ] 
    ).id("bakeries:deploying/meat_floss_bread_dough")
    kubejs.shapeless(
        'bakeries:pineapple_bun_dough',
        [
            'bakeries:round_bread_dough',
            'createdelight:butter',
            "minecraft:sugar"
        ]
    ).id("bakeries:pineapple_bun_dough_manual_only")
    {
        let iner = "bakeries:round_bread_dough"
        create.sequenced_assembly('bakeries:pineapple_bun_dough', 'bakeries:round_bread_dough', 
            [
                create.deploying(iner, [iner, 'createdelight:butter']),
                create.deploying(iner, [iner, "minecraft:sugar"])
            ]
        )
           .loops(1)
           .transitionalItem(iner)
           .id("bakeries:sequenced_assembly/pineapple_bun_dough")
    }
    kubejs.shapeless(
        'bakeries:brown_sugar_roll_dough',
        [
            'bakeries:round_bread_dough',
            'createdelight:butter',
            'bakeries:brown_sugar_cube'
        ]
    ).id("bakeries:brown_sugar_roll_dough_manual_only")
    {
        let iner = "bakeries:round_bread_dough"
        create.sequenced_assembly('bakeries:brown_sugar_roll_dough', iner,
            [
                create.deploying(iner, [iner, 'createdelight:butter']),
                create.deploying(iner, [iner, "bakeries:brown_sugar_cube"])   
            ]
        )
            .loops(1)
            .transitionalItem(iner)
            .id("bakeries:sequenced_assembly/brown_sugar_roll_dough")
    }
    kubejs.shapeless(
        "bakeries:mould_toast_dough",
        [
            "3x bakeries:round_bread_dough",
            "bakeries:mould"
        ]
    ).id("bakeries:mould_toast_dough_manual_only")
    kubejs.shapeless(
        "bakeries:mould_cheese_cocoa_toast_dough",
        [
            "bakeries:mould_toast_dough",
            "3x ad_astra:cheese",
            "3x ratatouille:cocoa_powder"
        ] 
    ).id("bakeries:cheese_cocoa_toast_dough_manual_only")
    {
        let iner = "bakeries:mould"
        create.sequenced_assembly("bakeries:mould_cheese_cocoa_toast_dough", iner,
            [
                create.deploying(iner, [iner, "bakeries:round_bread_dough"]),
                create.deploying(iner, [iner, "ad_astra:cheese"]),
                create.deploying(iner, [iner, "ratatouille:cocoa_powder"])
            ]
        )
            .loops(3)
            .transitionalItem(iner)
            .id("bakeries:sequenced_assembly/mould_cheese_cocoa_toast_dough")
    }
    {
        let iner = "bakeries:mould_toast_dough"
        create.sequenced_assembly("bakeries:mould_cheese_cocoa_toast_dough", iner,
            [
                create.deploying(iner, [iner, "ad_astra:cheese"]),
                create.deploying(iner, [iner, "ratatouille:cocoa_powder"])
            ]
        )
            .loops(3)
            .transitionalItem(iner)
            .id("bakeries:sequenced_assembly/mould_cheese_cocoa_toast_dough_2")

    }
    {
        let iner = "bakeries:baguette"
        create.sequenced_assembly("2x bakeries:baguette_with_filling", iner,
            [
                create.cutting(iner, iner),
                create.deploying(iner, [iner, "#forge:vegetables/tomato"]),
                create.deploying(iner, [iner, "#forge:cooked_pork"]),
                create.cutting(iner, iner)
            ]
        )
            .loops(1)
            .transitionalItem(iner)
            .id("bakeries:sequenced_assembly/baguette_with_filling")
    }
    {
        let iner = 'bakeries:croissant'
        create.sequenced_assembly('2x bakeries:tomato_cheese_croissant_sandwich', iner, 
            [
                create.cutting(iner, iner),
                create.deploying(iner, [iner, '#forge:vegetables/tomato']),
                create.deploying(iner, [iner, '#forge:cheese']),
            ]
        )
            .loops(1)
            .transitionalItem(iner)
            .id("bakeries:sequenced_assembly/tomato_cheese_croissant_sandwich")
    }

    //烤面包
    let breads = [
        ['bakeries:bagel_dough', "bakeries:bagel", 200],
        ['bakeries:whole_wheat_bagel_dough', 'bakeries:whole_wheat_bagel', 300],
        ['bakeries:round_bread_dough', 'bakeries:round_bread', 100],
        ['bakeries:berry_bread_dough', 'bakeries:berry_bread', 100],
        ['bakeries:baguette_dough', 'bakeries:baguette', 200],
        ['bakeries:croissant_dough', 'bakeries:croissant', 200],
        ['bakeries:salt_croissant_dough', 'bakeries:salt_croissant', 220],
        ['bakeries:meat_floss_bread_dough', 'bakeries:meat_floss_bread', 300],
        ['bakeries:brown_sugar_roll_dough', 'bakeries:brown_sugar_roll', 200],
        ['bakeries:pineapple_bun_dough', 'bakeries:pineapple_bun', 200],
        ['bakeries:country_bread_dough', 'bakeries:country_bread', 300],
        ['bakeries:ciabatta_dough', 'bakeries:ciabatta', 160],
        ['bakeries:mould_toast_dough', 'bakeries:mould_toast', 400],
        ['bakeries:mould_cheese_cocoa_toast_dough', 'bakeries:mould_cheese_cocoa_toast', 400],
        ['bakeries:focaccia_dough', 'bakeries:focaccia', 200]
    ]
    breads.forEach(([dough, bread, time]) => {
        baking(e, dough, bread, 1, "food", time)
    })
    //吐司脱模(存在诡异的bug现象)
    // e.custom({
    //     "type": "ratatouille:demolding",
    //     "ingredients": [
    //         {
    //             "item": "bakeries:mould_toast"
    //         }
    //     ],
    //     "results": [
    //         {
    //             "item": "bakeries:toast"
    //         },
    //         {
    //             "item": "bakeries:mould"
    //         }
    //     ]
    // }).id("bakeries:demolding/mould_toast")
    // e.custom({
    //     "type": "ratatouille:demolding",
    //     "ingredients": [
    //         {
    //             "item": "bakeries:mould_cheese_cocoa_toast"
    //         }
    //     ],
    //     "results": [
    //         {
    //             "item": "bakeries:cheese_cocoa_toast"
    //         },
    //         {
    //             "item": "bakeries:mould"
    //         }
    //     ]
    // }).id("bakeries:demolding/mould_cheese_cocoa_toast")

    kubejs.shaped("bakeries:focaccia_dough", [
        "ABC",
        " D "
    ], {
        A: "#forge:vegetables/onion",
        B: "#forge:vegetables/tomato",
        C: "frycooks_delight:canola_oil",
        D: "ratatouille:salty_dough"
    })
    .id("bakeries:focaccia")
    create.mixing("bakeries:focaccia_dough", [
        Fluid.of("createdieselgenerators:plant_oil", 250),
        "#forge:vegetables/onion",
        "#forge:vegetables/tomato",
        "ratatouille:salty_dough"
    ])
    .id("bakeries:mixing/focaccia")
    //其他
    vintageimprovements.vacuumizing(
        [
            Fluid.water(150),
            "bakeries:brown_sugar_cube"
        ],
        Fluid.of("createdelight:unrefined_sugar", 200)
    )
        .secondaryFluidOutput(0)
        .heated()
        .id("bakeries:vacuumizing/brown_sugar_cube")
    //面包切割
    cutting_2(e, 'bakeries:toast', [['bakeries:sliced_toast', 4]])
    cutting_2(e, 'bakeries:cheese_cocoa_toast', [['bakeries:sliced_cheese_cocoa_toast', 4]])
    cutting_2(e, 'bakeries:country_bread', [['bakeries:country_bread_slice', 6]])
    create.cutting(
        '4x bakeries:sliced_toast',
        'bakeries:toast'
    ).id("bakeries:cutting/toast")
    create.cutting(
        '4x bakeries:sliced_cheese_cocoa_toast',
        'bakeries:cheese_cocoa_toast'
    ).id("bakeries:cutting/cheese_cocoa_toast")
    create.cutting(
        '6x bakeries:country_bread_slice',
        'bakeries:country_bread' 
    ).id("bakeries:cutting/country_bread")
})
ServerEvents.tags("item", e => {
    e.removeAllTagsFrom('bakeries:cheese_cube')
    e.removeAllTagsFrom("vintagedelight:cheese_slice")
})