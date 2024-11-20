// ServerEvents.recipes(e => {
//     remove_recipes_id(e, [
//         "create_new_age:reactor/reactor_casing",
//         "create_new_age:shaped/heat_pipe",
//         "create_new_age:shaped/heat_pipe_mirror",
//         "create_new_age:advanced_motor_extension"])
    
//     // 充能和激发互相适配
//     e.forEachRecipe({type: "create_new_age:energising", mod: "create_new_age"}, r => {
//         let energy = r.json.get("energy_needed").asDouble
//         let input = r.getOriginalRecipeIngredients()
//         let output = r.getOriginalRecipeResult()
//         e.recipes.createaddition.charging(input, output, energy)
//         .id(`create_new_age:charging/${output.getId().split(":")[1]}`)
//     })
//     e.forEachRecipe({type: "createaddition:charging", mod: "createaddition"}, r => {
//         let energy = r.json.get("energy").asDouble
//         let input = r.json.get("input").asJsonObject
//         let itemId = input.get("item").asString
//         let count = input.get("count").asDouble
//         let output = r.getOriginalRecipeResult()
//         e.recipes.create_new_age.energising(Ingredient.of(itemId, count), output, energy)
//         .id(`createaddition:energising/${output.getId().split(":")[1]}`)
//     })
    
//     // 电金核心
//     e.recipes.kubejs.shaped("ad_astra:etrionic_core", [
//         "AA ",
//         "BB ",
//         "AA "
//     ],
//     {
//         A: "createaddition:zinc_sheet",
//         B: "create_new_age:overcharged_golden_sheet"
//     }
// )

//     // 磁铁块
//     let ingr_1 = ["minecraft:iron_block"]
//     for (let i = 0; i < 8; i++) {
//         ingr_1.push("alexscaves:energized_galena_neutral")
//     }
//     e.recipes.vintageimprovements.pressurizing(
//         "create_new_age:magnetite_block", 
//         ingr_1
//     ).heated()
    
//     //核反应堆材料
//     let iner_1 = "ad_astra:steel_plating"
//     e.recipes.create.sequenced_assembly("create_new_age:reactor_casing", iner_1, [
//         e.recipes.create.deploying(iner_1, [iner_1, "createmetallurgy:graphite"]),
//         e.recipes.create.deploying(iner_1, [iner_1, "alexscaves:polymer_plate"]),
//         e.recipes.create.pressing(iner_1, iner_1)
//     ])
//     .loops(1)
//     .transitionalItem(iner_1)
//     .id("create_new_age:reactor/reactor_casing")

//     let iner_2 = "create_new_age:reactor_casing"
//     e.recipes.create.sequenced_assembly("3x create_new_age:reactor_glass", iner_2, [
//         e.recipes.createaddition.rolling(iner_2, iner_2),
//         e.recipes.create.deploying(iner_2, [iner_2, "#forge:glass/colorless"]),
//         e.recipes.create.deploying(iner_2, [iner_2, "#forge:glass/colorless"])
//     ])
//     .loops(1)
//     .transitionalItem(iner_2)
//     .id("create_new_age:reactor_glass_from_colorless_glass")

//     e.recipes.create.sequenced_assembly("6x create_new_age:reactor_glass", iner_2, [
//         e.recipes.create.deploying(iner_2, [iner_2, "alexscaves:depth_glass"]),
//         e.recipes.create.deploying(iner_2, [iner_2, "alexscaves:depth_glass"])
//     ])
//     .loops(1)
//     .transitionalItem(iner_2)
//     .id("create_new_age:reactor_glass_from_depth_glass")
    
//     //热能
//     e.recipes.kubejs.shaped("24x create_new_age:heat_pipe", [
//         "AAA",
//         "BBB",
//         "AAA"
//     ],
//     {
//         A: "alexscaves:polymer_plate",
//         B: "createaddition:copper_rod"
//     })

//     //碳刷
//     e.replaceInput({id: "create_new_age:shaped/carbon_brushes"}, "minecraft:coal", "createmetallurgy:graphite")

//     //激发器
//     e.replaceInput({id: "create_new_age:shaped/energiser_t3"}, "minecraft:copper_block", "vintageimprovements:laser_item")

//     //电机，电机扩展
//     e.replaceInput({id: "create_new_age:shaped/basic_motor_extension"}, "create_new_age:overcharged_iron", "createmetallurgy:steel_ingot")
//     e.recipes.create.mechanical_crafting("create_new_age:advanced_motor_extension", [
//         "AAAAA",
//         "BCDCE",
//         "AAAAA"
//     ],
//     {
//         A: "ad_astra:steel_plate",
//         B: "alexscaves:block_of_scarlet_neodymium",
//         C: "create_new_age:copper_circuit",
//         D: "create_new_age:reinforced_motor",
//         E: "alexscaves:block_of_azure_neodymium"
//     })
//     .id("create_new_age:advanced_motor_extension")

//     e.replaceInput({id: "create_new_age:shaped/basic_motor"}, "minecraft:iron_nugget", "ad_astra:steel_nugget")
//     e.replaceInput({id: "create_new_age:shaped/advanced_motor"}, "minecraft:gold_nugget", "createaddition:electrum_nugget")
// })