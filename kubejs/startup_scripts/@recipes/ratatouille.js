new Schema("ratatouille:threshing")
    .simpleKey("results", "outputItemArray")
    .simpleKey("ingredients", "inputItemArray")
    .simpleKey("processingTime", "doubleNumber", 200)
new Schema("ratatouille:squeezing")
    .simpleKey("results", "outputFluidOrItemArray")
    .simpleKey("ingredients", "inputFluidOrItemArray")
    