ServerEvents.recipes(e => {
        // 挂面合成
        e.custom({
            "type": "extradelight:dough_shaping",
            "count": 2,
            "ingredient": {
                "item": 'create:dough'
            },
                "result": 'createdelight:vermicelli'
        })
        e.custom({
            "type": "ratatouille:squeezing",
            "ingredients": [
                {
                    "item": "create:dough"
                }
            ],
            "results": [
                {
                    "item": "createdelight:vermicelli"
                }
            ]
        })
        // 曲奇面团
})