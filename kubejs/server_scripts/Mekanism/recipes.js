// 材料统一与控制电路重铺（P1-a）
// - Mek 金属链产出替换为包内材料，Mek 锭不进入流通
// - 电冶金分离器保留为"钢的气相快线"：铁+碳灌注出钢粉，熔炼产物经 replaceOutput 落到包内锻造钢锭
// - 四级控制电路按 plan §二 用包内材料重铺，成为 Mek 与 Create 冶金线的焊点

ServerEvents.recipes(e => {
    // Mek 机器产物统一到包内材料
    e.replaceOutput("mekanism:ingot_bronze", "createdelightcore:bronze_ingot")
    e.replaceOutput("mekanism:ingot_steel", "createdelight:forged_steel_ingot")
    e.replaceOutput("mekanism:ingot_tin", "createdelightcore:tin_ingot")

    // 青铜双轨（铜+锡灌注）删除：包内青铜唯一真源是 Create 铜锌线
    remove_recipes_id(e, [
        "mekanism:processing/bronze/ingot/from_infusing",
        "mekanism:processing/bronze/dust/from_infusing"
    ])

    // 四级控制电路重铺
    remove_recipes_id(e, [
        "mekanism:control_circuit/basic",
        "mekanism:control_circuit/advanced",
        "mekanism:control_circuit/elite",
        "mekanism:control_circuit/ultimate"
    ])
    e.shapeless("mekanism:basic_control_circuit", [
        "mekanism:ingot_osmium",
        "minecraft:redstone",
        "createaddition:copper_wire"
    ]).id("createdelight:circuit/basic_control_circuit")

    e.shaped("mekanism:advanced_control_circuit", ["BC", "BT"], {
        B: "createdelightcore:bronze_ingot",
        C: "mekanism:basic_control_circuit",
        T: "create:electron_tube"
    }).id("createdelight:circuit/advanced_control_circuit")

    e.shaped("mekanism:elite_control_circuit", ["MS", "CM"], {
        M: "create:precision_mechanism",
        S: "createdelight:forged_steel_ingot",
        C: "mekanism:advanced_control_circuit"
    }).id("createdelight:circuit/elite_control_circuit")

    e.shaped("mekanism:ultimate_control_circuit", ["OC", "CU"], {
        O: "mekanism:ingot_refined_obsidian",
        C: "mekanism:elite_control_circuit",
        U: "createaddition:superconducting_connector"
    }).id("createdelight:circuit/ultimate_control_circuit")
})
