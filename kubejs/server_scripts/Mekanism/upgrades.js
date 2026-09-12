// Mekanism 机器升级组件重建：超频件全部 Create 化
// 速度=齿轮驱动 / 能量=CCA 电路 / 气体=铅制储气 / 过滤=造纸链
// 消音/锚定/造石升级保持原版（纯 QoL，无平衡影响）
// 注意：物品 id 是 upgrade_ 前缀（mekanism:upgrade_speed 等）

ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "mekanism:upgrade/speed",
        "mekanism:upgrade/energy",
        "mekanism:upgrade/gas",
        "mekanism:upgrade/filter"
    ])

    // 速度升级：锇锭 + Create 齿轮 + 红石（动力学超频）
    e.recipes.kubejs.shaped("mekanism:upgrade_speed", [
        " R ",
        "OCO",
        " R "
    ], {
        R: "minecraft:redstone",
        O: "mekanism:ingot_osmium",
        C: "create:cogwheel"
    }).id("createdelight:crafting/mekanism/upgrade_speed")

    // 能量升级：CCA 电容 + 电子管 + 铜线卷（与包内 FE 体系同源）
    e.recipes.kubejs.shaped("mekanism:upgrade_energy", [
        " E ",
        "ACA",
        " E "
    ], {
        E: "create:electron_tube",
        A: "createaddition:capacitor",
        C: "createaddition:copper_spool"
    }).id("createdelight:crafting/mekanism/upgrade_energy")

    // 气体升级：铅锭 + 加压管道 + HDPE 板
    e.recipes.kubejs.shaped("mekanism:upgrade_gas", [
        " T ",
        "LPL",
        " T "
    ], {
        T: "mekanism:basic_pressurized_tube",
        L: "mekanism:ingot_lead",
        P: "mekanism:hdpe_sheet"
    }).id("createdelight:crafting/mekanism/upgrade_gas")

    // 过滤升级：纸 + 筛网 + 锇锭（接包内 Custom/paper.js 造纸链）
    e.recipes.kubejs.shaped("mekanism:upgrade_filter", [
        "PPP",
        "PIQ",
        "PPP"
    ], {
        P: "minecraft:paper",
        I: "create:filter",
        Q: "mekanism:ingot_osmium"
    }).id("createdelight:crafting/mekanism/upgrade_filter")
})
