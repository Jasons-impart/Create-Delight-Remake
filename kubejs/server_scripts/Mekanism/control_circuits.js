// Mekanism 四级控制电路重建：全部绑定 Create 产线
// 基础=黄铜+电子管 / 进阶=精密机构+注入合金+电容 / 精英=4x4机械合成 / 终极=5x5机械合成
// 电路是全部 Mek 机器/工厂/QIO 的核心耗材，等级梯度即进度门控

ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "mekanism:control_circuit/basic",
        "mekanism:control_circuit/advanced",
        "mekanism:control_circuit/elite",
        "mekanism:control_circuit/ultimate"
    ])

    // 基础控制电路：黄铜 + 电子管 + 红石
    e.recipes.kubejs.shaped("2x mekanism:basic_control_circuit", [
        "RBR",
        "BAB",
        "RBR"
    ], {
        R: "minecraft:redstone",
        B: "create:brass_ingot",
        A: "create:electron_tube"
    }).id("createdelight:crafting/mekanism/basic_control_circuit")

    // 进阶控制电路：精密机构 + 注入合金 + CCA 电容
    e.recipes.kubejs.shaped("2x mekanism:advanced_control_circuit", [
        "IPI",
        "PAP",
        "IPI"
    ], {
        I: "mekanism:alloy_infused",
        P: "create:precision_mechanism",
        A: "createaddition:capacitor"
    }).id("createdelight:crafting/mekanism/advanced_control_circuit")

    // 精英控制电路：4x4 机械合成（强化合金 + northstar 电路 + 电子管）
    e.recipes.create.mechanical_crafting("2x mekanism:elite_control_circuit", [
        "IRRI",
        "REER",
        "REER",
        "IRRI"
    ], {
        I: "northstar:circuit",
        R: "mekanism:alloy_reinforced",
        E: "create:electron_tube"
    }).id("createdelight:mechanical_crafting/mekanism/elite_control_circuit")

    // 终极控制电路：5x5 机械合成（原子合金 + northstar 高级电路 + 钨锭 + 精密机构）
    e.recipes.create.mechanical_crafting("2x mekanism:ultimate_control_circuit", [
        "IAAAI",
        "ATPTA",
        "APCPA",
        "ATPTA",
        "IAAAI"
    ], {
        I: "northstar:advanced_circuit",
        A: "mekanism:alloy_atomic",
        T: "createmetallurgy:tungsten_ingot",
        P: "create:precision_mechanism",
        C: "createaddition:capacitor"
    }).id("createdelight:mechanical_crafting/mekanism/ultimate_control_circuit")
})
