ServerEvents.recipes(e => {
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
    threshing(e, 'festival_delicacies:artemisia_argyi', [
        'createdelight:artemisia_argyi_seed',
        Item.of('createdelight:artemisia_argyi_seed').withChance(0.5)
    ], 200)
    e.recipes.farmersdelight.cooking(
        [
            'festival_delicacies:artemisia_argyi',
            'festival_delicacies:red_bean_paste',
            'farmersdelight:rice'
        ],
        'festival_delicacies:qingtuan',
        1.0, 200,
    ).id("festival_delicacies:farmersdelight/qingtuan")
})
