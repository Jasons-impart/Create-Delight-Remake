// 材料统一：包内锭进入 forge 共享标签，Mek 配方（多用 forge:ingots/* 标签）直接吃包内材料
// Mek 侧锭/粉/粗矿由其自带标签覆盖，无需重复添加；存量 Mek 锭物品因此保持可用
ServerEvents.tags("item", e => {
    e.add("forge:ingots/steel", "createdelight:forged_steel_ingot")
    e.add("forge:ingots/bronze", "createdelightcore:bronze_ingot")
    e.add("forge:ingots/tin", "createdelightcore:tin_ingot")
})
