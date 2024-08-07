ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "casualness_delight:cutting/potato_slice_using_deployer",
        "casualness_delight:deep_frying/potato_chip",
        "extradelight:fried_fish",
        "create:mixing/fried_fish_create",
        "extradelight:fish_and_chips",
        "casualness_delight:cutting/potato_slice"
    ])
    // 油炸锅
    e.recipes.minecraft.crafting_shaped(
        'casualness_delight:deep_frying_pan', [
            "ABA",
            "CDC",
            "CCC"
        ], {
            A:"minecraft:bricks",
            B:"minecraft:iron_bars",
            C:"minecraft:iron_ingot",
            D:"butchercraft:lard"
        }
    ).id("casualness_delight:crafting_shaped/deep_frying_pan")
    // 炸薯片
    e.custom({
        "type": "casualness_delight:deep_frying",
        "ingredient": {
            "item": 'extradelight:sliced_potato'
        },
        "cookingtime": 100,
        "result": 'extradelight:potato_chips'
    })
    .id("extradelight:chips")
    // 炸薯条
    e.custom({
        "type": "casualness_delight:deep_frying",
        "ingredient": {
            "item": 'extradelight:potato_sticks'
        },
        "cookingtime": 100,
        "result": 'extradelight:french_fries'
    })
    .id("extradelight:fries")
    // 炸鱼薯条
    e.shapeless(
        'casualness_delight:fish_and_chips',
        [
            'casualness_delight:fried_fish',
            'extradelight:french_fries',
            'minecraft:bowl'
        ]
    )
    .id("casualness_delight:cooking/fish_and_chips")
    // 炸猪排
    e.recipes.create.mixing(
        'casualness_delight:tonkatsu',
        [
            'extradelight:cooking_oil',
            'minecraft:porkchop'
        ]
    ).heated()
    // 炸鸡块
    e.recipes.create.mixing(
        'casualness_delight:fried_chicken_chip',
        [
            'extradelight:cooking_oil',
            'farmersdelight:chicken_cuts'
        ]
    ).heated()
})