ServerEvents.recipes(e => {
    // 工作台建造（原为 kubejs/data/refurbished_furniture/recipes/constructing/ 下的数据包配方）
    // materials 为 [{count, item|tag}] 自定义格式，须走 e.custom 保持字段

    /** @returns {{count:number, item?:string, tag?:string}} */
    function mat(count, item, tag) {
        return tag ? { count: count, tag: tag } : { count: count, item: item }
    }

    /** result: count=1 时写裸字符串，>1 时写 {item, count} */
    function constructing(path, materials, result, count) {
        e.custom({
            type: "refurbished_furniture:workbench_constructing",
            materials: materials,
            result: (count || 1) > 1 ? { item: result, count: count } : result,
            show_notification: false
        }).id(`refurbished_furniture:constructing/${path}`)
    }

    // 沙发/凳子共用：木板 + 稻草 + 白羊毛 + 染料
    function seat(color, planks, straw, wool, kind) {
        constructing(`${color}_${kind}`, [
            mat(planks, null, "minecraft:planks"),
            mat(straw, "farmersdelight:straw"),
            mat(wool, "minecraft:white_wool"),
            mat(1, `minecraft:${color}_dye`)
        ], `refurbished_furniture:${color}_${kind}`, 2)
    }

    // DyeColor 枚举：getName() 即 "light_blue" 等染料色名
    let DyeColor = Java.loadClass("net.minecraft.world.item.DyeColor")
    DyeColor.values().forEach(dye => {
        let color = dye.getName()
        seat(color, 6, 16, 2, "sofa")
        seat(color, 3, 8, 1, "stool")
    })

    constructing("door_mat", [mat(8, "farmersdelight:straw")], "refurbished_furniture:door_mat")
})
