ServerEvents.recipes(e => {
    const { create, farmersdelight } = e.recipes
    create.compacting('supplementaries:ash', 'create:limestone')
        .heated()
        .id("create:compacting/ash")
    remove_recipes_output(e, [
        'youkaishomecoming:green_tea_leaves',
        'youkaishomecoming:oolong_tea_leaves',
        'youkaishomecoming:black_tea_leaves',
        'youkaishomecoming:tofu'])
    remove_recipes_id(e, [
        'youkaishomecoming:oily_bean_curd_from_tofu_campfire',
        'youkaishomecoming:oily_bean_curd_from_tofu_smelting',
        'youkaishomecoming:oily_bean_curd_from_tofu_smoking',
        'youkaishomecoming:pods_cutting'
    ])
    e.replaceInput({}, 'youkaishomecoming:green_tea_leaves', 'farmersrespite:green_tea_leaves')
    e.replaceInput({}, 'youkaishomecoming:oolong_tea_leaves', 'farmersrespite:yellow_tea_leaves')
    e.replaceInput({}, 'youkaishomecoming:black_tea_leaves', 'farmersrespite:black_tea_leaves')
    e.replaceInput({}, 'youkaishomecoming:coffee_powder', 'createcafe:coffee_grounds')
    e.replaceInput({}, 'youkaishomecoming:bowl_of_cream', 'createdelight:whipped_cream_bowl')
    e.replaceInput({}, 'youkaishomecoming:butter', 'createdelight:butter')
    e.replaceInput({not: {output: ["minecraft:packed_ice", Fluid.water(), "youkaishomecoming:ice_cube"]}}, "minecraft:ice", "youkaishomecoming:ice_cube")
    e.replaceInput({mod: 'youkaishomecoming'}, 'minecraft:cocoa_beans', "create:bar_of_chocolate")
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
    
})