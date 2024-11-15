ServerEvents.recipes(e => {
    // 序列合成：填馅土豆
    e.custom({
        type: "create:sequenced_assembly",
        ingredient: {
            item: "minecraft:potato"
        },
        loops: 1,
        results: [
            {
                item: "farmersdelight:stuffed_potato"
            }
        ],
        sequence: [
            {
                type: "create:deploying",
                ingredients: [
                    {
                        item: "createdelight:potato_stew_beef"
                    },
                    {
                        tag: "forge:beef/cooked"
                    }
                ],
                results: [
                    {
                        item: "createdelight:potato_stew_beef"
                    }
                ]
            },
            {
                type: "create:filling",
                ingredients: [
                    {
                        item: "createdelight:potato_stew_beef"
                    },
                    {
                        amount: 50,
                        fluidTag: "forge:milk",
                        nbt: {}
                    }
                ],
                results: [
                    {
                        item: "createdelight:potato_stew_beef"
                    }
                ]
            }
        ],
        transitionalItem: {
            item: "createdelight:potato_stew_beef"
        }
    }).id("createdelight:stuffed_potato")
})
