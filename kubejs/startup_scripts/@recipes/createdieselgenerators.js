new Schema("createdieselgenerators:basin_fermenting")
    .simpleKey("results", "outputFluidOrItemArray")
    .simpleKey("ingredients", "inputFluidOrItemArray")
    .simpleKey("heatRequirement", "nonEmptyString", "superheated" || "heated")
    .simpleKey("processingTime", "doubleNumber", 100)