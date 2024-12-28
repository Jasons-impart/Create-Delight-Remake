ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "festival_delicacies:cutting/eggplant"
    ])
    cutting(e, "festival_delicacies:eggplant", [["culturaldelights:cut_eggplant", 4]])
    e.custom({
        type: "farmersdelight:cutting",
        ingredients: [{ item: "culturaldelights:eggplant" }],
        result: [{ item: "culturaldelights:cut_eggplant", count: 2 }],
        tool: { type: "farmersdelight:tool_action", action: "blade_cut" }
    }).id("tetracelium:cutting/culturaldelights_eggplant")
    cutting(e, "festival_delicacies:chinese_cabbage", [
        ["festival_delicacies:chinese_cabbage_leaf", 2],
        ["festival_delicacies:chinese_cabbage_leaf", 1, 0.3]
    ])
    e.recipes.farmersdelight.cooking(
        [
            'neapolitan:roasted_adzuki_beans',
            'neapolitan:roasted_adzuki_beans'
        ],
        'festival_delicacies:red_bean_paste',
        1.0, 200,
        "minecraft:bowl"
    ).id("festival_delicacies:red_bean_paste")
    e.recipes.create.mixing(
        'festival_delicacies:red_bean_paste',
        [
            '2x neapolitan:roasted_adzuki_beans',
            "minecraft:bowl"
        ]
    ).heated().id("festival_delicacies:mixing/red_bean_paste")
    e.recipes.create.mixing(
        Fluid.of("hotbath:herbal_bath_fluid", 1000),
        [
            Fluid.of("hotbath:hot_water_fluid", 1000),
            "2x festival_delicacies:artemisia_argyi"
        ]
    ).id("create:mixing/herbal_bath_fluid_2")
    threshing(e, 'festival_delicacies:artemisia_argyi', [
        'createdelight:artemisia_argyi_seed',
        Item.of('createdelight:artemisia_argyi_seed').withChance(0.5)
    ], 200)
    e.custom({
        type: "farmersdelight:cutting",
        ingredients: [{item: "festival_delicacies:artemisia_argyi"}],
        result: [{item: "createdelight:artemisia_argyi_seed", count: 1}, {item: "createdelight:artemisia_argyi_seed", count: 1, chance: 0.5}],
        tool: {type: "farmersdelight:tool_action", action: "blade_cut"}
    }).id("tetracelium:cutting/artemisia_argyi")
})
