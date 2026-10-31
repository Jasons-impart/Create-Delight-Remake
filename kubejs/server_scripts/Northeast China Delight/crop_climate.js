// 物品标签用于种植提示，方块标签明确指定实际植株的生长条件。
["item", "block"].forEach(registry => {
    ServerEvents.tags(registry, e => {
        // 种植物品、作物方块、适宜季节、适宜湿度。
        const crops = [
            ["green_pepper_seeds","green_pepper_crop","spring_autumn","average_moist"], // 青椒
            ["green_beans_seeds","green_beans_crop","spring_summer_autumn","average_moist"], // 豆角
            ["snow_mustard_seeds","snow_mustard_crop","spring_autumn_winter","moist_moist"], // 雪里蕻
            ["green_radish_seeds","green_radish_crop","spring_autumn","moist_moist"], // 青萝卜
            ["ginseng_seeds","ginseng_crop","spring_summer_autumn","average_moist"], // 人参
            ["bellflower_seeds","bellflower_crop","spring_autumn","average_moist"], // 桔梗
            ["sweet_potato","sweet_potato_crop","spring_summer","average_moist"], // 地瓜
            ["buckwheat","buckwheat_crop","spring_autumn","average_moist"], // 荞麦
            ["hazelnut","hazelnut_bush","spring_autumn","average_moist"], // 榛子
            ["wood_ear","wood_ear_crop","spring_autumn","moist_humid"], // 木耳
        ]
        crops.forEach(crop => {
            const id = "northeast_china_delight:" + crop[registry === "item" ? 0 : 1]
            e.add("eclipticseasons:crops/" + crop[2], id)
            e.add("eclipticseasons:crops/" + crop[3], id)
        })
        // 榛蘑及菌落只指定湿度，季节沿用现有规则。
        e.add("eclipticseasons:crops/moist_humid", [
            "northeast_china_delight:hazel_mushroom",
            "northeast_china_delight:hazel_mushroom_colony"
        ])
    })
})

