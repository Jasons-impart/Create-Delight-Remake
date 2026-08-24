// 装备门槛（P1-d，plan §四 红线）
// 用范围化 replaceInput 给 MekaSuit 模块/MekaTool/MekaSuit 本体追加包内门槛材料，不重排原版配方结构
// 全装备数值平衡（OED 审查）在首启实测后统一处理

ServerEvents.recipes(e => {
    // 模块门槛：原版特殊件 → 包内同语义材料
    const module_gates = [
        // 飞行 = 星际科技特权
        ["mekanism:module_jetpack_unit", "mekanism:jetpack", "northstar:lunar_sapphire_shard"],
        // 制氧 = 北极星线终点
        ["mekanism:module_electrolytic_breathing_unit", "mekanism:electrolytic_core", "createdelight:sturdy_oxygen_tank"],
        // 反重力 = 深渊战利品
        ["mekanism:module_gravitational_modulating_unit", "#forge:nether_stars", "alexscaves:occult_gem"],
        // 速度 = 星际科技
        ["mekanism:module_locomotive_boosting_unit", "minecraft:diamond_leggings", "northstar:advanced_circuit"],
        // 跳跃 = Create 高阶弹簧
        ["mekanism:module_hydraulic_propulsion_unit", "mekanism:free_runners", "#forge:spring/between_500_2_1000"],
        // 夜视 = 望远镜
        ["mekanism:module_vision_enhancement_unit", "minecraft:emerald", "minecraft:spyglass"],
        // 磁吸 = 磁洞纪念品
        ["mekanism:module_magnetic_attraction_unit", "minecraft:iron_bars", "alexscaves:magnetron"],
        // 伤害增幅 = 屠龙
        ["mekanism:module_attack_amplification_unit", "minecraft:iron_sword", "iceandfire:dragonbone"],
        // 辐射防护：原版已用铅块门槛（铅的刚需出口），不改
    ]
    for (const [id, from, to] of module_gates) {
        e.replaceInput({ output: id }, from, to)
    }

    // MekaTool：与「命定之门」入场券同源（over_core），外壳换锻造钢
    e.replaceInput({ output: "mekanism:meka_tool" }, "mekanism:atomic_disassembler", "#more_mod_tetra:over_core")
    e.replaceInput({ output: "mekanism:meka_tool" }, "mekanism:hdpe_sheet", "createdelight:forged_steel_ingot")

    // MekaSuit 本体：外壳锻造钢、辉石换深渊宝珠
    for (const piece of ["meka_suit_helmet", "meka_suit_bodyarmor", "meka_suit_pants", "meka_suit_boots"]) {
        e.replaceInput({ output: `mekanism:${piece}` }, "mekanism:hdpe_sheet", "createdelight:forged_steel_ingot")
        e.replaceInput({ output: `mekanism:${piece}` }, "mekanism:ingot_refined_glowstone", "alexscaves:occult_gem")
    }
})
