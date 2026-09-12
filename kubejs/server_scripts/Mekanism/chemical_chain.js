// Mekanism 化学/农业绑定
// Mek 原生已有 100+ 原版物品 -> 生物燃料的粉碎配方（crushing/biofuel/*）
// 这里补充包内自创作物与 Farmer's Delight 食材，让美食包的农业盈余直通乙烯->塑料链

ServerEvents.recipes(e => {
    const CROPS = [
        "createdelight:adzuki_beans_seed",
        "createdelight:artemisia_argyi_seed",
        "farmersdelight:rice",
        "farmersdelight:tomato"
    ]
    CROPS.forEach(crop => {
        e.custom({
            type: "mekanism:crushing",
            input: { ingredient: { item: crop } },
            output: { item: "mekanism:bio_fuel", count: 2 }
        }).id(`createdelight:crushing/bio_fuel_from_${crop.split(":")[1]}`)
    })
})
