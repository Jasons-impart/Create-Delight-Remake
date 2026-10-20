ServerEvents.recipes(e => {
    const { create, minecraft, youkaishomecoming } = e.recipes

    // 茶树只提供生茶叶，三类成品继续使用农夫暇事物品。
    const teaTypes = [
        ['green', 'green'],
        ['oolong', 'yellow'],
        ['black', 'black']
    ]
    teaTypes.forEach(types => {
        e.replaceInput({}, `youkaishomecoming:${types[0]}_tea_leaves`, `#forge:tea_leaves/${types[0]}`)
        e.replaceOutput({}, `youkaishomecoming:${types[0]}_tea_leaves`, `farmersrespite:${types[1]}_tea_leaves`)
    })

    // 旧茶籽由 OEI 自动合并，不添加会被 OEI 重写为自循环的转换配方。
    remove_recipes_output(e, ['farmersrespite:wild_tea_bush'])

    youkaishomecoming.steaming('farmersrespite:green_tea_leaves', 'youkaishomecoming:tea_leaves', 200)
        .id('youkaishomecoming:green_tea_leaves_from_tea_leaves_steaming')
    minecraft.campfire_cooking('farmersrespite:yellow_tea_leaves', 'youkaishomecoming:white_tea_leaves')
        .cookingTime(200).xp(0.1)
        .id('youkaishomecoming:oolong_tea_leaves_from_white_tea_leaves_campfire')
    youkaishomecoming.simple_fermentation(
        ['youkaishomecoming:white_tea_leaves'],
        Fluid.of('minecraft:empty', 0),
        Fluid.of('minecraft:empty', 0),
        ['farmersrespite:black_tea_leaves'],
        1800
    ).id('youkaishomecoming:black_tea_leaves')

    create.mixing('farmersrespite:green_tea_leaves', [
        'youkaishomecoming:tea_leaves', Fluid.water(100)
    ]).heated().processingTime(200).id('createdelight:mixing/green_tea_leaves')

    // 生茶叶→白茶叶的机械晾晒沿用 recipe.js 中的 drying_rack 自动复制。
    // 风扇烟熏识别原版配方，耗时沿用 Create 的全局风扇加工设置。
    e.recipes.minecraft.smoking('farmersrespite:yellow_tea_leaves', 'youkaishomecoming:white_tea_leaves')
        .id('createdelight:smoking/oolong_tea_leaves')
    fermenting(e, ['farmersrespite:black_tea_leaves'], ['youkaishomecoming:white_tea_leaves'], 1800)
})
