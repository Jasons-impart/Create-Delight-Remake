new Schema("bakeries:dough_crafting_table")
    .simpleKey("result", "nonEmptyString")
    .simpleKey("ingredient", "inputItem")
    .simpleKey("count", "intNumber", 1)
