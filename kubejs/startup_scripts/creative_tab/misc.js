const Inf_Fluid = [
  "minecraft:water",
  "minecraft:lava",
  "alexscaves:acid",
  "alexscaves:purple_soda",
  "ratatouille:cocoa_liquor",
  "createdelight:egg_yolk",
  "createcafe:melted_sugar",
  "create:honey",
  "createdelight:vinegar",
  "createmetallurgy:molten_iron",
  "createmetallurgy:molten_gold",
  "createmetallurgy:molten_copper",
  "createmetallurgy:molten_zinc",
  "createmetallurgy:molten_brass",
  "createmetallurgy:molten_tungsten",
  "createmetallurgy:molten_steel",
  "createmetallurgy:molten_netherite",
  "createmetallurgy:molten_aluminum",
  "createmetallurgy:molten_lead",
  "createmetallurgy:molten_nickel",
  "createmetallurgy:molten_osmium",
  "createmetallurgy:molten_silver",
  "createmetallurgy:molten_tin",
  "createmetallurgy:molten_invar",
  "createmetallurgy:molten_electrum",
  "createmetallurgy:molten_bronze",
  "createmetallurgy:molten_constantan",
  "createmetallurgy:molten_void_steel",
  "createdelightcore:molten_andesite",
  "createdelightcore:molten_desh",
  "createdelightcore:molten_ostrum",
  "createdelightcore:molten_calorite",
  "createdelightcore:molten_scarlet_neodymium",
  "createdelightcore:molten_azure_neodymium",
  "createdelightcore:molten_fire_steel",
  "createdelightcore:molten_ice_steel",
  "createdelightcore:molten_lightning_steel",
  "createdelightcore:molten_forged_steel",
];

// 机素防护
StartupEvents.modifyCreativeTab("protection_pixel:pp", e => {
  e.add([
    Item.of('createdelight:fire_dragonsteel_armorplate', '{Damage:0,armor:2.5d,toughness:1.5d,weight:1.5d}'),
    Item.of('createdelight:ice_dragonsteel_armorplate', '{Damage:0,armor:2.5d,toughness:1.5d,weight:1.5d}'),
    Item.of('createdelight:lightning_dragonsteel_armorplate', '{Damage:0,armor:2.5d,toughness:1.5d,weight:1.5d}')
  ])
  e.remove([
    'protection_pixel:hookcannon',
    'protection_pixel:hookitem'
  ])
})
// tetra
StartupEvents.modifyCreativeTab("tetra:default", e => {
  e.add([
    custom_scroll([1, 1, 4, 5], 1, "bow/stave/remembrance_stave", 1, ["tetra:bow/stave/remembrance_stave"], "c10000")])
  e.add([
    Item.of('tetra:modular_double', '{Damage:0,HideFlags:1,"double/basic_hammer_left_material":"basic_hammer/dragonsteel_fire_ingot","double/basic_hammer_right_material":"basic_hammer/dragonsteel_fire_ingot","double/basic_handle_material":"basic_handle/forged_steel_ingot","double/handle":"double/basic_handle","double/head_left":"double/basic_hammer_left","double/head_right":"double/basic_hammer_right",honing_progress:560,id:"66c9276b-c330-4922-ad3b-b8a96cd223be"}'),
    Item.of('tetra:modular_double', '{Damage:0,HideFlags:1,"double/basic_hammer_left_material":"basic_hammer/dreadsteel_ingot","double/basic_hammer_right_material":"basic_hammer/dreadsteel_ingot","double/basic_handle_material":"basic_handle/forged_steel_ingot","double/handle":"double/basic_handle","double/head_left":"double/basic_hammer_left","double/head_right":"double/basic_hammer_right",honing_progress:560,id:"f259453a-3eac-463f-9e96-f33ba635f64b"}')
  ])

})
StartupEvents.modifyCreativeTab("art_of_forging:art_of_forging", e => {
  e.add([
    'createdelight:demonic_codex',
    'createdelight:otherworld_note',
    'createdelight:dread_heart',
    'createdelight:devil_eye',
  ])
})
// epp
StartupEvents.modifyCreativeTab("expatternprovider:tab_main", e => {
  Inf_Fluid.forEach((f) => {
  e.add(Item.of("expatternprovider:infinity_cell", `{record:{"#c":"ae2:f",id:"${f}"}}`))
    });
  e.remove([
    "expatternprovider:assembler_matrix_frame",
    "expatternprovider:assembler_matrix_wall",
    "expatternprovider:assembler_matrix_pattern",
    "expatternprovider:assembler_matrix_crafter",
    "expatternprovider:assembler_matrix_speed",
    'expatternprovider:assembler_matrix_glass',
  ])
})

StartupEvents.modifyCreativeTab("alexsmobs:alexsmobs", e => {
  e.remove([
    "alexsmobs:banana"
  ])
})

StartupEvents.modifyCreativeTab("moreburners:moreburners_tab", e => {
  e.remove([
    "moreburners:nickel_coil"
  ])
})

StartupEvents.modifyCreativeTab("torchmaster:creative_tab", e => {
  e.remove([
    'torchmaster:feral_flare_lantern',
    'torchmaster:frozen_pearl'
  ])
})

StartupEvents.modifyCreativeTab("ae2:main", e => {
  e.add([
    'createdelight:universal_press',
    'createdelight:bleak_electron_tube',
    'createdelight:redstone_paste',
    'createdelight:glowstone_paste',
    'createdelight:initial_processing_of_printed_engineering_processor',
    'createdelight:initial_processing_of_printed_calculation_processor',
    'createdelight:initial_processing_of_printed_logic_processor',
    'createdelight:engineering_processor_inscribed',
    'createdelight:calculation_processor_inscribed',
    'createdelight:logic_processor_inscribed',
    'createdelight:item_cell_housing_blank',
    'createdelight:fluid_cell_housing_blank',
    'createdelight:mega_fluid_cell_housing_blank',
    'createdelight:initial_processing_of_item_cell_housing',
    'createdelight:initial_processing_of_fluid_cell_housing',
    'createdelight:initial_processing_of_mega_fluid_cell_housing',
    'createdelight:unformed_item_cell_housing',
    'createdelight:unformed_item_cell_housing',
    'createdelight:unformed_mega_fluid_cell_housing',
    'createdelight:quartz_glass_parts',
    'createdelight:quartz_vibrant_glass_parts',
    'createdelight:cell_housing_curving_head',
  ])
})
StartupEvents.modifyCreativeTab("megacells:tab", e => {
  e.add([
    'createdelight:sky_stone_paste',
    'createdelight:initial_processing_of_printed_accumulation_processor',
    'createdelight:accumulation_processor_inscribed',
    'createdelight:mega_item_cell_housing_blank',
    'createdelight:initial_processing_of_mega_item_cell_housing',
    'createdelight:unformed_mega_item_cell_housing',
  ])
})

StartupEvents.modifyCreativeTab("iceandfire:items", e => {
  e.add([
    'dreadsteel:dreadsteel_ingot',
    'dreadsteel:kit_default',
    'dreadsteel:kit_white',
    'dreadsteel:kit_black',
    'dreadsteel:kit_bronze',
  ])
})

StartupEvents.modifyCreativeTab("minecraft:ingredients", e => {
  e.remove([
    'dreadsteel:dreadsteel_ingot',
    'dreadsteel:kit_default',
    'dreadsteel:kit_white',
    'dreadsteel:kit_black',
    'dreadsteel:kit_bronze',
  ])
})

StartupEvents.modifyCreativeTab("kinetic_pixel:kineticpixel", e => {
  e.remove([
    'kinetic_pixel:firearmworktable',
    'kinetic_pixel:wildgraycotton',
    'kinetic_pixel:graycotton',
    'kinetic_pixel:graycottonseed',
    'kinetic_pixel:bambooshell',
    'kinetic_pixel:bambooshell',
    Item.of('kinetic_pixel:pressurepoweredfirearmblueprint', '{Inventory:{Items:[],Size:32}}'),
    Item.of('kinetic_pixel:heatpoweredfirearmblueprint', '{Inventory:{Items:[],Size:32}}'),
    Item.of('kinetic_pixel:laboratorialfirearmblueprint', '{Inventory:{Items:[],Size:32}}'),
    Item.of('kinetic_pixel:magicpoweredfirearmblueprint', '{Inventory:{Items:[],Size:32}}'),
    'kinetic_pixel:gascylinder',
    'kinetic_pixel:emptygascylinder',
    'kinetic_pixel:brasscompressionsheet',
    'kinetic_pixel:andesitealloycompressionsheet',
    'kinetic_pixel:specialsteelcompressionsheet',
    'kinetic_pixel:enderalloycompressionsheet',
    'kinetic_pixel:enderalloyingot',
    'kinetic_pixel:specialsteelingot',
    'kinetic_pixel:componenttemplate',
    'kinetic_pixel:nitropropellant',
    'kinetic_pixel:wastedbarrel',
  ])
})

StartupEvents.modifyCreativeTab("minecraft:redstone_blocks", e => {
  e.remove([
    'mbd2:mbd_gadgets'
  ])
})