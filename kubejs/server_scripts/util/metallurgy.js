/**
 * 
 * @param { Internal.RecipesEventJS_ } event 
 * @param { InputItem_[] } metal // block, ingot, nugget, plate, fluid
 * @param { String } heat // heated, superheated
 * @param { number } time // default 80ticks
 */
function metal_production_line(event, metal, heat, time) {
    // event.recipes.createmetallurgy.melting(Fluid.of(`${metal[4]}`, 810), metal[0])
    //     .heatRequirement(heat).processingTime(2 * time).id(`createmetallurgy:melting/${metal[0].split(":")[1]}`)
    let bulk = event.recipes.createmetallurgy.bulk_melting(Fluid.of(`${metal[4]}`, 810), metal[0])
        .minHeatRequirement(6)
        .processingTime(100)
    if (heat == "superheat")
        bulk.minHeatRequirement(9)
    bulk.id(`createmetallurgy:bulk_melting/${metal[0].split(":")[1]}`)

    
    // event.recipes.createmetallurgy.bulk_melting(metal[0], Fluid.of(`${metal[4]}`, 810))
    // .maxHeatRequirement(0)
    // .minHeatRequirement(-50)
    // .processingTime(time)
    // .id(`createmetallurgy:bulk_melting/${metal[4].split(":")[1]}`)

    event.recipes.createmetallurgy.melting(Fluid.of(`${metal[4]}`, 90), metal[1])
        .heatRequirement(heat).processingTime(time).id(`createmetallurgy:melting/${metal[1].split(":")[1]}`)
    event.recipes.createmetallurgy.melting(Fluid.of(`${metal[4]}`, 10), metal[2])
        .heatRequirement(heat).processingTime(0.5 * time).id(`createmetallurgy:melting/${metal[2].split(":")[1]}`)
    event.recipes.createmetallurgy.melting(Fluid.of(`${metal[4]}`, 90), metal[3])
        .heatRequirement(heat).processingTime(time).id(`createmetallurgy:melting/${metal[3].split(":")[1]}`)
    event.recipes.createmetallurgy.casting_in_basin(metal[0], Fluid.of(`${metal[4]}`, 810))
        .processingTime(2 * time).id(`createmetallurgy:casting_in_basin/${metal[0].split(":")[1]}`)
    event.recipes.createmetallurgy.casting_in_table(metal[1], [Fluid.of(`${metal[4]}`, 90), "createmetallurgy:graphite_ingot_mold"])
        .processingTime(time).id(`createmetallurgy:casting_in_table/${metal[1].split(":")[1]}`)
    event.recipes.createmetallurgy.casting_in_table(metal[2], [Fluid.of(`${metal[4]}`, 10), "createmetallurgy:graphite_nugget_mold"])
        .processingTime(0.5 * time).id(`createmetallurgy:casting_in_table/${metal[2].split(":")[1]}`)
    event.recipes.createmetallurgy.casting_in_table(metal[3], [Fluid.of(`${metal[4]}`, 90), "createmetallurgy:graphite_plate_mold"])
        .processingTime(time).id(`createmetallurgy:casting_in_table/${metal[3].split(":")[1]}`)
    event.recipes.kubejs.shapeless(`${metal[0]}`, `9x ${metal[1]}`)
        .id(`createmetallurgy:crafting/${metal[1].split(":")[1]}_2_${metal[0].split(":")[1]}`)
    event.recipes.kubejs.shapeless(`9x ${metal[1]}`, `${metal[0]}`)
        .id(`createmetallurgy:crafting/${metal[0].split(":")[1]}_2_${metal[1].split(":")[1]}`)
    event.recipes.kubejs.shapeless(`${metal[1]}`, `9x ${metal[2]}`)
        .id(`createmetallurgy:crafting/${metal[2].split(":")[1]}_2_${metal[1].split(":")[1]}`)
    event.recipes.kubejs.shapeless(`9x ${metal[2]}`, `${metal[1]}`)
        .id(`createmetallurgy:crafting/${metal[1].split(":")[1]}_2_${metal[2].split(":")[1]}`)
    event.recipes.create.sequenced_assembly(Item.of(metal[3], 9), metal[0], [
        event.recipes.vintageimprovements.hammering(metal[0], metal[0]),
        event.recipes.create.cutting(metal[0], metal[0])
    ])
        .loops(1)
        .transitionalItem(metal[0])
        .id(`vintageimprovements:sequenced_assembly/${metal[0].split(":")[1]}_to_${metal[3].split(":")[1]}`)
}
/**
 * @param { Internal.RecipesEventJS_ } event 
 * @param { InputItem_[] } metal // block, ingot, nugget, plate, fluid
 * @param { String } heat // heated, superheated
 * @param { number } time // default 80ticks
 */
function metal_production_line_2(event, metal, heat, time) {
    // event.recipes.createmetallurgy.melting(Fluid.of(`${metal[4]}`, 810), metal[0])
    //     .heatRequirement(heat).processingTime(2 * time).id(`createmetallurgy:melting/${metal[0].split(":")[1]}`)
    let bulk = event.recipes.createmetallurgy.bulk_melting(Fluid.of(`${metal[4]}`, 810), metal[0])
        .minHeatRequirement(6)
        .processingTime(100)
    if (heat == "superheat")
        bulk.minHeatRequirement(9)
    bulk.id(`createmetallurgy:bulk_melting/${metal[0].split(":")[1]}`)
    
    // event.recipes.createmetallurgy.bulk_melting(metal[0], Fluid.of(`${metal[4]}`, 810))
    // .maxHeatRequirement(0)
    // .minHeatRequirement(-50)
    // .processingTime(time)
    // .id(`createmetallurgy:bulk_melting/${metal[4].split(":")[1]}`)
    event.recipes.createmetallurgy.melting(Fluid.of(`${metal[4]}`, 90), metal[1])
        .heatRequirement(heat).processingTime(time).id(`createmetallurgy:melting/${metal[1].split(":")[1]}`)
    event.recipes.createmetallurgy.melting(Fluid.of(`${metal[4]}`, 10), metal[2])
        .heatRequirement(heat).processingTime(0.5 * time).id(`createmetallurgy:melting/${metal[2].split(":")[1]}`)
    event.recipes.createmetallurgy.melting(Fluid.of(`${metal[4]}`, 90), metal[3])
        .heatRequirement(heat).processingTime(time).id(`createmetallurgy:melting/${metal[3].split(":")[1]}`)
    event.recipes.createmetallurgy.casting_in_basin(metal[0], Fluid.of(`${metal[4]}`, 810))
        .processingTime(2 * time).id(`createmetallurgy:casting_in_basin/${metal[0].split(":")[1]}`)
    event.recipes.createmetallurgy.casting_in_table(metal[1], [Fluid.of(`${metal[4]}`, 90), "createmetallurgy:graphite_ingot_mold"])
        .processingTime(time).id(`createmetallurgy:casting_in_table/${metal[1].split(":")[1]}`)
    event.recipes.createmetallurgy.casting_in_table(metal[2], [Fluid.of(`${metal[4]}`, 10), "createmetallurgy:graphite_nugget_mold"])
        .processingTime(0.5 * time).id(`createmetallurgy:casting_in_table/${metal[2].split(":")[1]}`)
    event.recipes.createmetallurgy.casting_in_table(metal[3], [Fluid.of(`${metal[4]}`, 90), "createmetallurgy:graphite_plate_mold"])
        .processingTime(time).id(`createmetallurgy:casting_in_table/${metal[3].split(":")[1]}`)
    event.recipes.create.sequenced_assembly(Item.of(metal[3], 9), metal[0], [
        event.recipes.vintageimprovements.hammering(metal[0], metal[0]),
        event.recipes.create.cutting(metal[0], metal[0])
    ])
        .loops(1)
        .transitionalItem(metal[0])
        .id(`vintageimprovements:sequenced_assembly/${metal[0].split(":")[1]}_to_${metal[3].split(":")[1]}`)
}
/**
 * @param { Internal.RecipesEventJS_ } event 
 * @param { InputItem_[] } metal // block, ingot, plate, fluid
 * @param { String } heat // heated, superheated
 * @param { number } time // default 80ticks
 */
function metal_production_line_3(event, metal, heat, time) {
    // event.recipes.createmetallurgy.melting(Fluid.of(`${metal[3]}`, 810), metal[0])
    //     .heatRequirement(heat).processingTime(2 * time).id(`createmetallurgy:melting/${metal[0].split(":")[1]}`)
    let bulk = event.recipes.createmetallurgy.bulk_melting(Fluid.of(`${metal[3]}`, 810), metal[0])
        .minHeatRequirement(6)
        .processingTime(100)
    if (heat == "superheat")
        bulk.minHeatRequirement(9)
    bulk.id(`createmetallurgy:bulk_melting/${metal[0].split(":")[1]}`)
    
    // event.recipes.createmetallurgy.bulk_melting(metal[0], Fluid.of(`${metal[3]}`, 810))
    // .maxHeatRequirement(0)
    // .minHeatRequirement(-50)
    // .processingTime(time)
    // .id(`createmetallurgy:bulk_melting/${metal[3].split(":")[1]}`)
    event.recipes.createmetallurgy.melting(Fluid.of(`${metal[3]}`, 90), metal[1])
        .heatRequirement(heat).processingTime(0.5 * time).id(`createmetallurgy:melting/${metal[1].split(":")[1]}`)
    event.recipes.createmetallurgy.melting(Fluid.of(`${metal[3]}`, 90), metal[2])
        .heatRequirement(heat).processingTime(time).id(`createmetallurgy:melting/${metal[2].split(":")[1]}`)
    event.recipes.createmetallurgy.casting_in_basin(metal[0], Fluid.of(`${metal[3]}`, 810))
        .processingTime(2 * time).id(`createmetallurgy:casting_in_basin/${metal[0].split(":")[1]}`)
    event.recipes.createmetallurgy.casting_in_table(metal[1], [Fluid.of(`${metal[3]}`, 90), "createmetallurgy:graphite_ingot_mold"])
        .processingTime(time).id(`createmetallurgy:casting_in_table/${metal[1].split(":")[1]}`)
    event.recipes.createmetallurgy.casting_in_table(metal[2], [Fluid.of(`${metal[3]}`, 90), "createmetallurgy:graphite_plate_mold"])
        .processingTime(time).id(`createmetallurgy:casting_in_table/${metal[2].split(":")[1]}`)
    event.recipes.create.sequenced_assembly(Item.of(metal[2], 9), metal[0], [
        event.recipes.vintageimprovements.hammering(metal[0], metal[0]),
        event.recipes.create.cutting(metal[0], metal[0])
    ])
        .loops(1)
        .transitionalItem(metal[0])
        .id(`vintageimprovements:sequenced_assembly/${metal[0].split(":")[1]}_to_${metal[2].split(":")[1]}`)
}
/**
 * @param { Internal.RecipesEventJS_ } event 
 * @param { InputItem_[] } metal // ingot, nugget, plate, fluid
 * @param { String } heat // heated, superheated
 * @param { number } time // default 80ticks
 */
function metal_production_line_4(event, metal, heat, time) {
    event.recipes.createmetallurgy.melting(Fluid.of(`${metal[3]}`, 90), metal[0])
        .heatRequirement(heat).processingTime(time).id(`createmetallurgy:melting/${metal[0].split(":")[1]}`)
    event.recipes.createmetallurgy.melting(Fluid.of(`${metal[3]}`, 10), metal[1])
        .heatRequirement(heat).processingTime(0.5 * time).id(`createmetallurgy:melting/${metal[1].split(":")[1]}`)
    event.recipes.createmetallurgy.melting(Fluid.of(`${metal[3]}`, 90), metal[2])
        .heatRequirement(heat).processingTime(time).id(`createmetallurgy:melting/${metal[2].split(":")[1]}`)
    event.recipes.createmetallurgy.casting_in_table(metal[0], [Fluid.of(`${metal[3]}`, 90), "createmetallurgy:graphite_ingot_mold"])
        .processingTime(time).id(`createmetallurgy:casting_in_table/${metal[0].split(":")[1]}`)
    event.recipes.createmetallurgy.casting_in_table(metal[1], [Fluid.of(`${metal[3]}`, 10), "createmetallurgy:graphite_nugget_mold"])
        .processingTime(0.5 * time).id(`createmetallurgy:casting_in_table/${metal[1].split(":")[1]}`)
    event.recipes.createmetallurgy.casting_in_table(metal[2], [Fluid.of(`${metal[3]}`, 90), "createmetallurgy:graphite_plate_mold"])
        .processingTime(time).id(`createmetallurgy:casting_in_table/${metal[2].split(":")[1]}`)
}

/**
 * @param { Internal.RecipesEventJS_ } event 
 * @param { InputItem_[] } metal // block, ingot, nugget, plate, rod, wire, fluid
 * @param { String } heat // heated, superheated
 * @param { number } time // default 80ticks
 */
function metal_production_line_6(event, metal, heat, time) {
    // event.recipes.createmetallurgy.melting(Fluid.of(`${metal[6]}`, 810), metal[0])
    //     .heatRequirement(heat).processingTime(time).id(`createmetallurgy:melting/${metal[0].split(":")[1]}`)
    let bulk = event.recipes.createmetallurgy.bulk_melting(Fluid.of(`${metal[6]}`, 810), metal[0])
        .minHeatRequirement(6)
        .processingTime(time)
    if (heat == "superheat")
        bulk.minHeatRequirement(9)
    bulk.id(`createmetallurgy:bulk_melting/${metal[0].split(":")[1]}`)
    // event.recipes.createmetallurgy.bulk_melting(metal[0], Fluid.of(`${metal[6]}`, 810))
    // .maxHeatRequirement(0)
    // .minHeatRequirement(-50)
    // .processingTime(time)
    // .id(`createmetallurgy:bulk_melting/${metal[6].split(":")[1]}`)
    event.recipes.createmetallurgy.melting(Fluid.of(`${metal[6]}`, 90), metal[1])
        .heatRequirement(heat).processingTime(time).id(`createmetallurgy:melting/${metal[1].split(":")[1]}`)
    event.recipes.createmetallurgy.melting(Fluid.of(`${metal[6]}`, 10), metal[2])
        .heatRequirement(heat).processingTime(0.5 * time).id(`createmetallurgy:melting/${metal[2].split(":")[1]}`)
    event.recipes.createmetallurgy.melting(Fluid.of(`${metal[6]}`, 90), metal[3])
        .heatRequirement(heat).processingTime(time).id(`createmetallurgy:melting/${metal[3].split(":")[1]}`)
    event.recipes.createmetallurgy.melting(Fluid.of(`${metal[6]}`, 45), metal[4])
        .heatRequirement(heat).processingTime(time).id(`createmetallurgy:melting/${metal[4].split(":")[1]}`)
    event.recipes.createmetallurgy.melting(Fluid.of(`${metal[6]}`, 45), metal[5])
        .heatRequirement(heat).processingTime(time).id(`createmetallurgy:melting/${metal[5].split(":")[1]}`)
    event.recipes.createmetallurgy.casting_in_table(metal[1], [Fluid.of(`${metal[6]}`, 90), "createmetallurgy:graphite_ingot_mold"])
        .processingTime(time).id(`createmetallurgy:casting_in_table/${metal[1].split(":")[1]}`)
    event.recipes.createmetallurgy.casting_in_table(metal[2], [Fluid.of(`${metal[6]}`, 10), "createmetallurgy:graphite_nugget_mold"])
        .processingTime(0.5 * time).id(`createmetallurgy:casting_in_table/${metal[2].split(":")[1]}`)
    event.recipes.createmetallurgy.casting_in_table(metal[3], [Fluid.of(`${metal[6]}`, 90), "createmetallurgy:graphite_plate_mold"])
        .processingTime(time).id(`createmetallurgy:casting_in_table/${metal[3].split(":")[1]}`)
    event.recipes.createmetallurgy.casting_in_table(metal[4], [Fluid.of(`${metal[6]}`, 45), "createmetallurgy:graphite_rod_mold"])
        .processingTime(time).id(`createmetallurgy:casting_in_table/${metal[4].split(":")[1]}`)
    event.recipes.createmetallurgy.casting_in_basin(metal[0], Fluid.of(`${metal[6]}`, 810))
        .processingTime(time * 3).id(`createmetallurgy:casting_in_basin/${metal[0].split(":")[1]}`)

    event.recipes.create.sequenced_assembly(Item.of(metal[3], 9), metal[0], [
        event.recipes.vintageimprovements.hammering(metal[0], metal[0]),
        event.recipes.create.cutting(metal[0], metal[0])
    ])
        .loops(1)
        .transitionalItem(metal[0])
        .id(`vintageimprovements:sequenced_assembly/${metal[0].split(":")[1]}_to_${metal[3].split(":")[1]}`)
}


/**
 * @param { Internal.RecipesEventJS_ } event 
 * @param { InputItem_[] } metal // block, ingot, fluid
 * @param { String } heat // heated, superheated
 * @param { number } time // default 80ticks
 */
function metal_production_line_7(event, metal, heat, time) {
    // event.recipes.createmetallurgy.melting(Fluid.of(`${metal[2]}`, 810), metal[0])
    //     .heatRequirement(heat).processingTime(2 * time).id(`createmetallurgy:melting/${metal[0].split(":")[1]}`)

    let bulk = event.recipes.createmetallurgy.bulk_melting(Fluid.of(`${metal[2]}`, 810), metal[0])
        .minHeatRequirement(6)
        .processingTime(100)
    if (heat == "superheat")
        bulk.minHeatRequirement(9)
    
    // event.recipes.createmetallurgy.bulk_melting(metal[0], Fluid.of(`${metal[2]}`, 810))
    // .maxHeatRequirement(0)
    // .minHeatRequirement(-50)
    // .processingTime(time)
    // .id(`createmetallurgy:bulk_melting/${metal[2].split(":")[1]}`)
    bulk.id(`createmetallurgy:bulk_melting/${metal[0].split(":")[1]}`)
    event.recipes.createmetallurgy.melting(Fluid.of(`${metal[2]}`, 90), metal[1])
        .heatRequirement(heat).processingTime(0.5 * time).id(`createmetallurgy:melting/${metal[1].split(":")[1]}`)
    event.recipes.createmetallurgy.casting_in_basin(metal[0], Fluid.of(`${metal[2]}`, 810))
        .processingTime(2 * time).id(`createmetallurgy:casting_in_basin/${metal[0].split(":")[1]}`)
    event.recipes.createmetallurgy.casting_in_table(metal[1], [Fluid.of(`${metal[2]}`, 90), "createmetallurgy:graphite_ingot_mold"])
        .processingTime(time).id(`createmetallurgy:casting_in_table/${metal[1].split(":")[1]}`)
}
/**
 * @type {Map<OutputItem_, [InputItem_, number]>}
 */
let byProductMap = new Map()
byProductMap.set("createmetallurgy:iron_dust", ["minecraft:redstone", 0.75])
byProductMap.set("createmetallurgy:copper_dust", ["minecraft:clay_ball", 0.5])
byProductMap.set("createmetallurgy:zinc_dust", ["minecraft:gunpowder", 0.5])
byProductMap.set("createmetallurgy:gold_dust", ["minecraft:quartz", 0.5])
byProductMap.set("createmetallurgy:wolframite_dust", ["2x minecraft:gold_nugget", 0.5])
byProductMap.set("createdelight:tin_dust", ["minecraft:glowstone_dust", 0.5])
byProductMap.set("createdelight:silver_dust", ["vintageimprovements:sulfur_chunk", 0.5])
byProductMap.set("createdelight:desh_dust", ["ad_astra:cheese", 0.2])
byProductMap.set("createdelight:ostrum_dust", ["iceandfire:myrmex_desert_resin", 0.2])
byProductMap.set("createdelight:calorite_dust", ["iceandfire:deathworm_egg", 0.2])
/**
 * 
 * @param { Internal.RecipesEventJS_ } event 
 * @param { InputItem_[] } metal //dirty_dust, dust, crushed_raw_ore, raw_ore, nugget, ingot
 */
function metal_production_line_5(event, metal) {
    let byProduct = byProductMap.get(metal[1])
    event.recipes.vintageimprovements.pressurizing(
        [Item.of(metal[0], 2), Item.of(metal[0], 1).withChance(0.66)], [
        Fluid.of("vintageimprovements:sulfuric_acid", 100),
        metal[3]
    ])
        .superheated()
        .id(`vintageimprovements:pressurizing/${metal[0].split(":")[1]}`)
    centrifugation(event,
        [metal[1], Item.of(metal[1]).withChance(0.25), Item.of(byProduct[0]).withChance(byProduct[1])],
        metal[0])
        .id(`vintageimprovements:centrifugation/${metal[0].split(":")[1]}`)
    centrifugation(event,
        [Item.of(metal[4], 12), Item.of(metal[4], 6).withChance(0.25)],
        metal[2])
        .id(`vintageimprovements:centrifugation/${metal[4].split(":")[1]}`)
    event.recipes.createdelight.small_centrifugation()
        .outputItems([metal[1], Item.of(byProduct[0]).withChance(byProduct[1])])
        .chance(0.5, builder => builder.outputItems(Item.of(metal[1])))
        .inputItems(metal[0])
        .perTick(builder => builder.inputFE(100))
        .id(`createdelight:centrifugation/${metal[0].split(":")[1]}`)
    event.recipes.createdelight.small_centrifugation()
        .outputItems([Item.of(metal[4], 12)])
        .chance(0.5, builder => builder.outputItems(Item.of(metal[4], 6)))
        .inputItems(metal[2])
        .perTick(builder => builder.inputFE(100))
        .id(`createdelight:centrifugation/${metal[4].split(":")[1]}`)
    event.recipes.vintageimprovements.vibrating(
        Item.of(metal[4], 18),
        metal[2])
        .id(`vintageimprovements:vibrating/${metal[4].split(":")[1]}`)
    event.recipes.create.splashing([Item.of(metal[4], 9), Item.of(byProduct[0]).withChance(byProduct[1])], metal[2])
        .id(`create:splashing/${metal[2].split(":")[1]}`)
    event.recipes.create.splashing([metal[1], Item.of(byProduct[0]).withChance(byProduct[1])], metal[0])
        .id(`createmetallurgy:splashing/${metal[0].split(":")[1]}`)
    if (event.findRecipeIds(`createmetallurgy:milling/${metal[3].split(":")[1]}`).isEmpty())
        event.recipes.create.crushing([metal[2], Item.of("create:experience_nugget").withChance(0.75)], metal[3])
            .id(`createmetallurgy:crushing/${metal[3].split(":")[1]}`)
    if (event.findRecipeIds(`createmetallurgy:milling/${metal[2].split(":")[1]}`).isEmpty())
        event.recipes.create.milling([metal[0], Item.of(metal[0]).withChance(0.25)], metal[2])
            .id(`createmetallurgy:milling/${metal[2].split(":")[1]}`)

}
/**
 * 
 * @param {Internal.RecipesEventJS_} e 
 * @param {(OutputItem_ | Internal.OutputFluid_)[]} results 
 * @param {Special.EntityType} entity 
 * @param {number} damage 
 * @param {(OutputItem_ | Internal.OutputFluid_)[]} [ingredient] 
 * @param {number} [maxHeatRequirement] 
 * @param {number} [minHeatRequirement] 
 */
function entity_melting(e, results, entity, damage, ingredient, maxHeatRequirement, minHeatRequirement) {
    let input = RecipeUtil.convertInput(ingredient)
    let output = RecipeUtil.convertInput(results)
    let ingr = []
    let res = []
    input[0].forEach(item => {
        ingr.push(Ingredient.of(item))
    })
    input[1].forEach(item => {
        ingr.push(item.toJson())
    })
    output[0].forEach(item => {
        res.push(Ingredient.of(item))
    })
    output[1].forEach(item => {
        res.push(item.toJson())
    })
    return e.custom({
        "type": "createmetallurgy:entity_melting",
        "entity": {
            "type": entity,
            "damage": damage
        },
        "ingredients": ingr,
        "maxHeatRequirement": maxHeatRequirement || 50,
        "minHeatRequirement": minHeatRequirement || 9,
        "results": res
    })
}