ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "create_central_kitchen:mixing/coffee"
    ])
    // 袋装咖啡豆
    e.recipes.minecraft.crafting_shapeless(
        'farmersrespite:coffee_beans_sack',
        "9x createcafe:roasted_coffee_beans"
    )
    .id("farmersrespite:coffee_beans_sack")
    e.recipes.minecraft.crafting_shapeless(
        "9x createcafe:roasted_coffee_beans",
        'farmersrespite:coffee_beans_sack'        
    )
    .id("farmersrespite:coffee_beans")
    // 咖啡果→咖啡豆
    e.custom({
        "type": "farmersdelight:cutting",
        "ingredients": [
            {
                "item": "farmersrespite:coffee_berries"
            }
        ],
        "result": [
            {
                "item": "createcafe:roasted_coffee_beans"
            }
        ],
        "tool": {
            "tag": "forge:tools/knives"
        }
    })
    .id("farmersrespite:cutting/coffee_berries")
    e.recipes.create.milling(
        [
            'createcafe:coffee_grounds',
            'minecraft:red_dye'
        ],
        [
            "farmersrespite:coffee_berries"
        ]
    )
    .id("create_central_kitchen:milling/coffee_berries")
    e.recipes.minecraft.crafting_shapeless(
        "createcafe:roasted_coffee_beans",
        "farmersrespite:coffee_berries"
    )
    .id("minecraft:red_dye")
    // 咖啡
    e.recipes.create.filling(
        'farmersrespite:coffee',
        [
            Fluid.of("createcafe:coffee", 250),
            "minecraft:glass_bottle"
        ]
    )
    .id("create_central_kitchen:filling/coffee")
    e.custom({
        "type": "farmersrespite:brewing",
        "container": {
            "item": "minecraft:glass_bottle"
        },
        "cookingtime": 2400,
        "experience": 0.35,
        "group": "coffee",
        "ingredients": [
            {
                "item": 'createcafe:coffee_grounds'
            }
        ],
        "needwater": true,
        "recipe_book_tab": "drinks",
        "result": {
            "item": "farmersrespite:coffee"
        }
    })
    .id("farmersrespite:brewing/coffee")
    // 烈焰辣椒酱
    e.custom({
        "type": "farmersdelight:cooking",
        "cookingtime": 200,
        "experience": 0.35,
        "ingredients": [
            {
                "item": "minecraft:blaze_powder"
            },
            {
                "item": "minecraft:blaze_powder"
            },
            {
                "item": "minecraft:nether_wart"
            },
            {
                "item": "minecraft:nether_wart"
            },
            {
                "item": 'createcafe:coffee_grounds'
            },
            {
                "tag": "forge:raw_beef"
            }
        ],
        "recipe_book_tab": "meals",
        "result": {
            "item": "farmersrespite:blazing_chili"
        }
    })
    .id("farmersrespite:cooking/blazing_chili")
})