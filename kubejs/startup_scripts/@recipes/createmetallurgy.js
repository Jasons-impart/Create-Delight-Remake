
//todo: 待冶金学mod自身兼容后移除
new Schema("createmetallurgy:bulk_melting")
.simpleKey("results", "outputFluidOrItemArray")
.simpleKey("ingredients", "inputFluidOrItemArray")
.simpleKey("maxHeatRequirement", "anyDoubleNumber", 50)
.simpleKey("minHeatRequirement", "anyDoubleNumber", 6)
.simpleKey("processingTime", "anyDoubleNumber", 200)