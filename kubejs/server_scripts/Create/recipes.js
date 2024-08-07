ServerEvents.recipes(e => {
    // 新增配方：玫瑰石英
    e.shapeless("create:rose_quartz", [
        "4x redstone",
        "quartz"
    ])
    // 动力锯切割：平滑玫瑰石英
    e.recipes.create.cutting(
        ["create:polished_rose_quartz", Item.of("create:polished_rose_quartz").withChance(0.1)],
        "create:rose_quartz"
    ).id("create.kjs:polished_rose_quartz")
})
