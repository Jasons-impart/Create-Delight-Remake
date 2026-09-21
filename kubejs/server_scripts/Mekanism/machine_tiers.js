// Mekanism 基础机器 + 等级安装器重建
// 注意：Mek 机器的等级存在方块 NBT 中，高阶机器不是独立物品——升级唯一途径是等级安装器
// 因此安装器配方是整个阶梯的核心，做成 Create 序列装配（精密机构同款产线）

ServerEvents.recipes(e => {
    // 9 台基础机器：安山合金 + 铜板 + 基础电路 + 安山机壳
    // 机器配方是 mekanism:mek_data 类型，必须按精确 id 删除
    remove_recipes_id(e, [
        "mekanism:enrichment_chamber",
        "mekanism:crusher",
        "mekanism:energized_smelter",
        "mekanism:precision_sawmill",
        "mekanism:osmium_compressor",
        "mekanism:combiner",
        "mekanism:metallurgic_infuser",
        "mekanism:purification_chamber",
        "mekanism:chemical_injection_chamber"
    ])

    /**
     * 基础机器统一模板
     * @param {string} machine 机器物品 id
     * @param {string} core 该机器的风味核心材料
     */
    function basic_machine(machine, core) {
        e.recipes.kubejs.shaped(machine, [
            "AUA",
            "PCP",
            "AKA"
        ], {
            A: "create:andesite_alloy",
            U: core,
            P: "#forge:plates/copper",
            C: "mekanism:basic_control_circuit",
            K: "create:andesite_casing"
        }).id(`createdelight:crafting/mekanism/${machine.split(":")[1]}`)
    }
    basic_machine("mekanism:enrichment_chamber", "minecraft:iron_ingot")
    basic_machine("mekanism:crusher", "minecraft:copper_ingot")
    basic_machine("mekanism:energized_smelter", "minecraft:iron_ingot")
    basic_machine("mekanism:precision_sawmill", "#minecraft:planks")
    basic_machine("mekanism:osmium_compressor", "mekanism:ingot_osmium")
    basic_machine("mekanism:combiner", "minecraft:cobblestone")
    basic_machine("mekanism:metallurgic_infuser", "minecraft:redstone")
    basic_machine("mekanism:purification_chamber", "mekanism:ingot_lead")
    basic_machine("mekanism:chemical_injection_chamber", "mekanism:ingot_osmium")

    // 等级安装器：序列装配（部署电路 -> 压制铁板 -> 部署阶位材料），loops(1)
    remove_recipes_id(e, [
        "mekanism:tier_installer/basic",
        "mekanism:tier_installer/advanced",
        "mekanism:tier_installer/elite",
        "mekanism:tier_installer/ultimate"
    ])

    /**
     * 等级安装器统一模板
     * @param {string} installer 安装器物品 id
     * @param {string} circuit 对应等级控制电路
     * @param {string} bond 阶位绑定材料
     */
    function tier_installer(installer, circuit, bond) {
        let iner = "createdelight:incomplete_tier_installer"
        e.recipes.create.sequenced_assembly(installer, "create:iron_sheet", [
            e.recipes.create.deploying(iner, [iner, circuit]),
            e.recipes.create.pressing(iner, iner),
            e.recipes.create.deploying(iner, [iner, bond])
        ])
            .transitionalItem(iner)
            .loops(1)
            .id(`createdelight:sequenced_assembly/${installer.split(":")[1]}`)
    }
    tier_installer("mekanism:basic_tier_installer", "mekanism:basic_control_circuit", "create:andesite_alloy")
    tier_installer("mekanism:advanced_tier_installer", "mekanism:advanced_control_circuit", "create:brass_ingot")
    tier_installer("mekanism:elite_tier_installer", "mekanism:elite_control_circuit", "createmetallurgy:steel_ingot")
    tier_installer("mekanism:ultimate_tier_installer", "mekanism:ultimate_control_circuit", "createmetallurgy:tungsten_ingot")

    // === 化学线中阶机器（湿法冶金五倍链 + 气体工业）：进阶电路 + 黄铜机壳 ===
    remove_recipes_id(e, [
        "mekanism:electrolytic_separator",
        "mekanism:chemical_infuser",
        "mekanism:chemical_oxidizer",
        "mekanism:chemical_dissolution_chamber",
        "mekanism:chemical_washer",
        "mekanism:chemical_crystallizer",
        "mekanism:rotary_condensentrator",
        "mekanism:pressurized_reaction_chamber"
    ])

    /**
     * 化学机器统一模板
     * @param {string} machine 机器物品 id
     * @param {string} core 风味核心材料 x2
     */
    function chemical_machine(machine, core) {
        e.recipes.kubejs.shaped(machine, [
            "PUP",
            "BCB",
            "PUP"
        ], {
            P: "create:brass_ingot",
            U: core,
            B: "create:brass_casing",
            C: "mekanism:advanced_control_circuit"
        }).id(`createdelight:crafting/mekanism/${machine.split(":")[1]}`)
    }
    chemical_machine("mekanism:electrolytic_separator", "createaddition:copper_spool")
    chemical_machine("mekanism:chemical_infuser", "mekanism:basic_pressurized_tube")
    chemical_machine("mekanism:chemical_oxidizer", "mekanism:dust_sulfur")
    chemical_machine("mekanism:chemical_dissolution_chamber", "minecraft:glass")
    chemical_machine("mekanism:chemical_washer", "create:fluid_tank")
    chemical_machine("mekanism:chemical_crystallizer", "create:polished_rose_quartz")
    chemical_machine("mekanism:rotary_condensentrator", "create:mechanical_pump")
    chemical_machine("mekanism:pressurized_reaction_chamber", "create:propeller")

    // === 后阶核工业机器：精英电路 + 冶金钢 ===
    remove_recipes_id(e, [
        "mekanism:isotopic_centrifuge",
        "mekanism:solar_neutron_activator"
    ])

    /**
     * 后阶机器统一模板
     * @param {string} machine 机器物品 id
     * @param {string} core 风味核心材料 x2
     */
    function late_machine(machine, core) {
        e.recipes.kubejs.shaped(machine, [
            "SXS",
            "XCX",
            "SXS"
        ], {
            S: "createmetallurgy:steel_ingot",
            X: core,
            C: "mekanism:elite_control_circuit"
        }).id(`createdelight:crafting/mekanism/${machine.split(":")[1]}`)
    }
    late_machine("mekanism:isotopic_centrifuge", "mekanism:alloy_reinforced")
    late_machine("mekanism:solar_neutron_activator", "createaddition:capacitor")
})
