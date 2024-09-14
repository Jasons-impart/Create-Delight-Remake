new Schema("createaddition:rolling")
    .simpleKey("input", "inputItem")
    .simpleKey("result", "outputItem")

new Schema("createaddition:charging")
    .simpleKey("input", "inputItem")
    .simpleKey("result", "outputItem")
    .simpleKey("energy", "doubleNumber", 4000)
    .simpleKey("maxChargeRate", "doubleNumber", 200)

new Schema("createaddition:liquid_burning")
    .simpleKey("input", "inputFluid")
    .simpleKey("burnTime", "doubleNumber", 12000)
    .simpleKey("superheated", "nonEmptyString", "true" || "false")