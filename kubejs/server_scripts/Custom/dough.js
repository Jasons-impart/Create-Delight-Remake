ServerEvents.recipes(e => {
        // 挂面合成
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