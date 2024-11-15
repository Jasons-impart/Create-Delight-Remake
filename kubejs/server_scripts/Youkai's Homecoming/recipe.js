ServerEvents.recipes(e => {
    const { create, farmersdelight } = e.recipes
    create.compacting('supplementaries:ash', 'create:limestone')
        .heated()
        .id("create:compacting/ash")
    remove_recipes_output(e, [
        'youkaishomecoming:green_tea_leaves',
        'youkaishomecoming:oolong_tea_leaves',
        'youkaishomecoming:black_tea_leaves',
        'youkaishomecoming:tofu',
        'youkaishomecoming:butter',
        'youkaishomecoming:bowl_of_cream',
        'youkaishomecoming:tea_leaf_bag',
        'youkaishomecoming:coffee_bean_bag',
        'youkaishomecoming:black_tea_bag',
        'youkaishomecoming:green_tea_bag',
        'youkaishomecoming:oolong_tea_bag'])
    remove_recipes_id(e, [
        'youkaishomecoming:oily_bean_curd_from_tofu_campfire',
        'youkaishomecoming:oily_bean_curd_from_tofu_smelting',
        'youkaishomecoming:oily_bean_curd_from_tofu_smoking',
        'youkaishomecoming:pods_cutting',
        'youkaishomecoming:red_velvet_cake',
        "youkaishomecoming:emptying/blood_bottle_emptying",
        'youkaishomecoming:mandrake_root_cutting',
        'youkaishomecoming:raw_lamprey_cutting',
        "youkaishomecoming:red_velvet_cake_slice"
    ])
    e.replaceInput({}, 'youkaishomecoming:green_tea_leaves', 'farmersrespite:green_tea_leaves')
    e.replaceInput({}, 'youkaishomecoming:oolong_tea_leaves', 'farmersrespite:yellow_tea_leaves')
    e.replaceInput({}, 'youkaishomecoming:black_tea_leaves', 'farmersrespite:black_tea_leaves')
    e.replaceInput({}, 'youkaishomecoming:coffee_powder', 'createcafe:coffee_grounds')
    e.replaceInput({}, 'youkaishomecoming:bowl_of_cream', 'createdelight:whipped_cream_bowl')
    e.replaceInput({}, 'youkaishomecoming:butter', 'createdelight:butter')
    e.replaceInput({not: {output: ["minecraft:packed_ice", Fluid.water(), "youkaishomecoming:ice_cube"]}}, "minecraft:ice", "youkaishomecoming:ice_cube")
    e.replaceInput({mod: 'youkaishomecoming'}, 'minecraft:cocoa_beans', "create:bar_of_chocolate")
    e.replaceInput({}, "youkaishomecoming:blood_bottle", "butchercraft:blood_fluid_bottle")
    e.replaceInput({}, "youkaishomecoming:roe", "oceanic_delight:salmon_eggs")
    e.replaceInput({}, "festival_delicacies:red_bean", "youkaishomecoming:redbean")
    create.sequenced_assembly("youkaishomecoming:red_velvet_cake", "ratatouille:cake_base", [
        create.filling("ratatouille:cake_base", ["ratatouille:cake_base", Fluid.of("butchercraft:blood_fluid")]),
        create.deploying("ratatouille:cake_base", ["ratatouille:cake_base", "youkaishomecoming:flesh"])
    ])
    .loops(1)
    .transitionalItem("ratatouille:cake_base")
    .id("youkaishomecoming:sequenced_assembly/red_velvet_cake")
    threshing(e, 'youkaishomecoming:pods', ['youkaishomecoming:soybean', Item.of('youkaishomecoming:soybean').withChance(0.5)], 200)
    farmersdelight.cooking(
        [
            'youkaishomecoming:soybean', 
            'youkaishomecoming:soybean', 
            '#forge:salt'],
        'youkaishomecoming:tofu',
        1.0, 200)
        .id('youkaishomecoming:tofu')
    create.compacting('youkaishomecoming:tofu', [
        '2x youkaishomecoming:soybean',
        '#forge:salt'
    ])
        .id('youkaishomecoming:compacting/tofu')
    create.crushing("8x youkaishomecoming:ice_cube",
                    "minecraft:ice"
    ).id("youkaishomecoming:crushing/ice_cube")
    cutting_3(e, "youkaishomecoming:mandrake_root",
        [
            ["youkaishomecoming:stripped_mandrake_root", 1]
        ]
    )
    cutting_3(e, "youkaishomecoming:raw_lamprey",
        [
            ["youkaishomecoming:raw_lamprey_fillet", 1]
        ]
    )
    cutting_3(e, "youkaishomecoming:red_velvet_cake", [["youkaishomecoming:red_velvet_cake_slice", 7]])
})