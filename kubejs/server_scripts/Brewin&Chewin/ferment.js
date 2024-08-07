ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "farmersrespite:brewing/apple_cider",
        "create_central_kitchen:mixing/apple_cider"
    ])
    // 可可软糖
    e.custom({
        "type": "brewinandchewin:fermenting",
        "experience": 0.6,
        "fermentingtime": 12000,
        "fluiditem": {
            "item": "minecraft:milk_bucket"
        },
        "ingredients": [
            {
                "item": "minecraft:sugar"
            },
            {
                "item": 'ratatouille:cocoa_powder'
            }
        ],
        "recipe_book_tab": "misc",
        "result": {
            "item": "brewinandchewin:cocoa_fudge"
        },
        "temperature": 5
    })
    .id("brewinandchewin:fermenting/cocoa_fudge")
    // 苹果酒合成
    e.custom({
        "type": "brewinandchewin:fermenting",
        "container": {
            "item": 'brewinandchewin:tankard'
        },
        "experience": 0.6,
        "fermentingtime": 120,
        "ingredients": [
            {
                "item": "minecraft:sugar"
            },
            {
                "item": "minecraft:apple"
            },
            {
                "item": "minecraft:apple"
            }
        ],
        "recipe_book_tab": "drinks",
        "result": {
            "item": 'farmersdelight:apple_cider'
        },
        "temperature": 3
    })
    .id("farmersdelight:cooking/apple_cider")
})