// Mekanism 接入：标签统一
// 原则：包内已有的金属保持 owner 地位，通过 forge 标签喂给 Mekanism 配方

ServerEvents.tags("minecraft:item", e => {
    // 锡：包内 createdelightcore 锡是唯一来源，挂入常规标签驱动 Mek 青铜等配方
    e.add("forge:ingots/tin", ["createdelightcore:tin_ingot"])
    e.add("forge:nuggets/tin", ["createdelightcore:tin_nugget"])
    e.add("forge:storage_blocks/tin", ["createdelightcore:tin_block"])
    e.add("forge:raw_materials/tin", ["createdelightcore:raw_tin"])
    e.add("forge:raw_material_blocks/tin", ["createdelightcore:raw_tin_block"])
    e.add("forge:ores/tin", [
        "createdelightcore:tin_ore",
        "createdelightcore:deepslate_tin_ore"
    ])

    // 青铜：Mek 与包内青铜互通（owner 仍为 createdelightcore）
    e.add("forge:ingots/bronze", ["createdelightcore:bronze_ingot"])

    // 钢：Mek 钢与冶金钢互通（owner 仍为 createmetallurgy）
    e.add("forge:ingots/steel", ["createmetallurgy:steel_ingot"])

    // 铀：alexscaves 已挂 forge:ingots/uranium，Mek 铀锭由模组自挂，形成三向互通
})
