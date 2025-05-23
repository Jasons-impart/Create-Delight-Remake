
//todo: 待冶金学mod自身兼容后移除
new Schema("createmetallurgy:bulk_melting")
.simpleKey("results", "outputFluidOrItemArray")
.simpleKey("ingredients", "inputFluidOrItemArray")
.simpleKey("maxHeatRequirement", "doubleNumber", 50)
.simpleKey("minHeatRequirement", "doubleNumber", 6)
.simpleKey("processingTime", "doubleNumber", 200)