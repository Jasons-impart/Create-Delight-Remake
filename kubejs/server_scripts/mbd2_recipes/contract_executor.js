// ServerEvents.recipes(e => {
//     const {createdelight} = e.recipes
//     /**@type {Internal.Map<string, Internal.ItemStack_[]>} */
//     let map = Utils.newMap()
//     map.put("human_contract", [
//         "64x create:shaft",
//         "64x create:cogwheel",
//         "64x create:large_cogwheel",
//         "32x create:belt_connector",
//         "16x create:gearbox",
//         "16x create:encased_chain_drive",
//         "16x create_connected:encased_chain_cogwheel",
//         "8x create:chain_conveyor",
//         "16x create:chute",
//         "16x create:water_wheel",
//         "8x create:large_water_wheel",
//         "4x create:mechanical_press",
//         "4x create:mechanical_mixer",
//         "16x create:andesite_tunnel",
//         "16x create:depot",
//         "8x create:basin",
//         "16x create:andesite_casing",
//         "8x create:empty_blaze_burner",
//         "8x create:mechanical_pump",
//         "16x create:spout",
//         "16x create:item_drain",
//         "32x create:fluid_pipe",

//         "8x create:smart_chute",
//         "4x create:brass_tunnel",
//         "2x create:rotation_speed_controller",
//         "2x create:mechanical_arm",
//         "4x create:deployer",
//         "8x create:mechanical_crafter",

//     ])
//     map.entrySet().forEach(entry => {
//         entry.value.forEach(item => {
//             createdelight.contract_executor()
//             .inputItems([Order.getRewardContract(entry.key, 1).strongNBT()])
//             .chance(0, builder => builder.inputItems([Item.of(item, 1)]))
//             .outputItems([item])
//             .duration(400)
//             .id(`createdelight:contract_executor/${entry.key}/${Item.of(item).id.split(":")[1]}`)
//         })
//     })
    
// })
