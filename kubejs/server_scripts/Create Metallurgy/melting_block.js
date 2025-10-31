// ServerEvents.recipes(e => {
//     const {createmetallurgy} = e.recipes
//         /**
//      * 
//      * @param {InputItem_} block 
//      * @param {Internal.FluidStackJS_} fluid 
//      * @param {number} processingTime 
//      */
//         function melting_block(block, fluid, processingTime) {
//             createmetallurgy.melting(Fluid.of(fluid, 810), block, processingTime)
//             .heatRequirement("heated")
//             .id(`${fluid.split(":")[0]}:melting/${fluid.split(":")[1]}`)
//         }
//         melting_block("#forge:storage_blocks/iron", "createmetallurgy:molten_iron", 90)
//         melting_block("#forge:storage_blocks/gold", "createmetallurgy:molten_gold", 90)
//         melting_block("#forge:storage_blocks/silver", "createmetallurgy:molten_silver", 90)
//         melting_block("#forge:storage_blocks/tin", "createmetallurgy:molten_tin", 90)
//         melting_block("#forge:storage_blocks/copper", "createmetallurgy:molten_copper", 90)
//         melting_block("#forge:storage_blocks/zinc", "createmetallurgy:molten_zinc", 90)
//         melting_block("#forge:storage_blocks/brass", "createmetallurgy:molten_brass", 120)
//         melting_block("#forge:storage_blocks/bronze", "createmetallurgy:molten_bronze", 120)
//         melting_block("#forge:storage_blocks/steel", "createmetallurgy:molten_steel", 120)
//         melting_block("#forge:storage_blocks/netherite", "createmetallurgy:molten_netherite", 120)
//         melting_block("#forge:storage_blocks/electrum", "createmetallurgy:molten_electrum", 120)
// })