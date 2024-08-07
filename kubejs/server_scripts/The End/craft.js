ServerEvents.recipes(e => {
    // 机械手合成：凋零之眼
    e.recipes.create.deploying("endrem:wither_eye", [
        "createdelight:unactivated_wither_eye",
        "ulterlands:pentagram"
    ])
    // 机械手合成：魔力之眼
    e.recipes.create.deploying("endrem:magical_eye", [
        "createdelight:dusty_magical_eye",
        "ulterlands:etherite"
    ])
    // 修改配方：女巫之眼
    e.shapeless("endrem:witch_eye", [
        "ender_eye",
        "endrem:witch_pupil",
        "ulterlands:etherite"
    ]).id("endrem:witch_eye")
    // 增加配方：龙齿合成龙息
    e.shapeless("4x minecraft:dragon_breath", [
        "ends_delight:dragon_tooth",
        "4x minecraft:glass_bottle"
    ])
})
