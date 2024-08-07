ServerEvents.recipes(e => {
    // 搅拌合成：粗钢锭
    e.recipes.create.mixing(
        ["createdelight:raw_steel_ingot"],
        ["minecraft:iron_ingot", "#minecraft:coals", Fluid.lava(10)]
    )
        .id("create.kjs:raw_steel")
    e.recipes.create.mixing(
        ["createdelight:raw_steel_ingot"],
        ["minecraft:iron_ingot", "#minecraft:coals"]
    )
        .id("create.kjs:raw_steel/2")
        .heated()
    // 序列合成：钢锭
    let inter = 'createdelight:hammering_raw_steel_ingot'
    e.recipes.create.sequenced_assembly("alloyed:steel_ingot", "createdelight:raw_steel_ingot", [
        e.recipes.createFilling(inter, [inter, Fluid.lava(20)]),
        e.recipes.createPressing(inter, inter)
    ])
        .transitionalItem(inter)
        .loops(5)
})
