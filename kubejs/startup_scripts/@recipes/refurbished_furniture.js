// refurbished_furniture:workbench_constructing 的 materials 为 [{count, item|tag}] 自定义格式，
// 配方在 server_scripts/Refurbished Furniture/workbench.js 中以 e.custom 注册。
new Schema("refurbished_furniture:freezer_solidifying")
    .simpleKey("ingredient", "inputItem")
    .simpleKey("result", "outputItem")
    .simpleKey("category", "anyString", "blocks")
    .simpleKey("time", "intNumber", 200)
