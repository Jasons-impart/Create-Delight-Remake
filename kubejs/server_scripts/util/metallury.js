/**
 * 
 * @param { Internal.RecipesEventJS_ } event 
 * @param { InputItem_[] } metal // block, ingot, nugget, plate, fluid
 * @param { String } heat // heated, superheated
 * @param { number } time // default 80ticks
 */
function metal_production_line(event, metal, heat, time) {
    event.recipes.createmetallurgy.melting(Fluid.of(`${metal[4]}`, 810), metal[0])
        .heatRequirement(heat).processingTime(2*time).id(`createmetallurgy:melting/${metal[0].split(":")[1]}`)
    event.recipes.createmetallurgy.melting(Fluid.of(`${metal[4]}`, 90), metal[1])
        .heatRequirement(heat).processingTime(time).id(`createmetallurgy:melting/${metal[1].split(":")[1]}`)
    event.recipes.createmetallurgy.melting(Fluid.of(`${metal[4]}`, 10), metal[2])
        .heatRequirement(heat).processingTime(0.5*time).id(`createmetallurgy:melting/${metal[2].split(":")[1]}`)
    event.recipes.createmetallurgy.melting(Fluid.of(`${metal[4]}`, 90), metal[3])
        .heatRequirement(heat).processingTime(time).id(`createmetallurgy:melting/${metal[3].split(":")[1]}`)
    event.recipes.createmetallurgy.casting_in_basin(metal[0], Fluid.of(`${metal[4]}`, 810))
        .processingTime(2*time).id(`createmetallurgy:casting_in_basin/${metal[0].split(":")[1]}`)
    event.recipes.createmetallurgy.casting_in_table(metal[1], [Fluid.of(`${metal[4]}`, 90), 'createmetallurgy:graphite_ingot_mold'])
        .processingTime(time).id(`createmetallurgy:casting_in_table/${metal[1].split(":")[1]}`)
    event.recipes.createmetallurgy.casting_in_table(metal[2], [Fluid.of(`${metal[4]}`, 10), 'createmetallurgy:graphite_nugget_mold'])
        .processingTime(0.5*time).id(`createmetallurgy:casting_in_table/${metal[2].split(":")[1]}`)
    event.recipes.createmetallurgy.casting_in_table(metal[3], [Fluid.of(`${metal[4]}`, 90), 'createmetallurgy:graphite_plate_mold'])
        .processingTime(time).id(`createmetallurgy:casting_in_table/${metal[3].split(":")[1]}`)
    event.recipes.kubejs.shapeless(`${metal[0]}`, `9x ${metal[1]}`)
        .id(`createmetallurgy:crafting/${metal[1].split(":")[1]}_2_${metal[0].split(":")[1]}`)
    event.recipes.kubejs.shapeless(`9x ${metal[1]}`, `${metal[0]}`)
        .id(`createmetallurgy:crafting/${metal[0].split(":")[1]}_2_${metal[1].split(":")[1]}`)
    event.recipes.kubejs.shapeless(`${metal[1]}`, `9x ${metal[2]}`)
        .id(`createmetallurgy:crafting/${metal[2].split(":")[1]}_2_${metal[1].split(":")[1]}`)
    event.recipes.kubejs.shapeless(`9x ${metal[2]}`, `${metal[1]}`)
        .id(`createmetallurgy:crafting/${metal[1].split(":")[1]}_2_${metal[2].split(":")[1]}`)
}
