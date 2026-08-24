// 通用机械 P0 内容移除
// 数字矿机的职能由包内虚空采矿（矿簇再生）体系覆盖，地震仪无对应内容。
// 配方 ID 未实测前用产物维度删除；首启走查后如需补充杂项自动配方，在下方数组追加。

ServerEvents.recipes(e => {
    remove_recipes_output(e, [
        "mekanism:digital_miner",
        "mekanism:seismic_vibrator"
    ])
})
