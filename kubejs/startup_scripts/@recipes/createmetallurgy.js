
//todo: 待冶金学mod自身兼容后移除
new Schema("createmetallurgy:bulk_melting")
.simpleKey("results", "outputFluidOrItemArray")
.simpleKey("ingredients", "inputFluidOrItemArray")
.simpleKey("maxHeatRequirement", "anyDoubleNumber", 50)
.simpleKey("minHeatRequirement", "anyDoubleNumber", 6)
.simpleKey("processingTime", "anyDoubleNumber", 200)
// createmetallurgy:entity_melting — 实体熔炼
new Schema("createmetallurgy:entity_melting")
    .complexKey("entity", false, key => {
        key.addKey("type", "nonEmptyString")
        key.addKey("damage", "doubleNumber", 0)
    })
    .simpleKey("ingredients", "inputFluidOrItemArray")
    .simpleKey("results", "outputFluidOrItemArray")
    .simpleKey("maxHeatRequirement", "anyDoubleNumber", 50)
    .simpleKey("minHeatRequirement", "anyDoubleNumber", 9)
