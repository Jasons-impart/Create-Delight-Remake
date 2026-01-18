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
    'createdelight:initial_processing_of_item_cell_housing',
    'createdelight:initial_processing_of_fluid_cell_housing',
    'createdelight:unformed_item_cell_housing',
    'createdelight:unformed_fluid_cell_housing',
    'createdelight:quartz_glass_parts',
    'createdelight:quartz_vibrant_glass_parts',
    'createdelight:cell_housing_curving_head',
  ])
})

StartupEvents.modifyCreativeTab("extendedae_plus:main", e => {
  e.remove([
    'extendedae_plus:infinity_core', 
    'extendedae_plus:infinity_biginteger_cell', 
    'extendedae_plus:assembler_matrix_upload_core', 
    'extendedae_plus:assembler_matrix_speed_plus', 
    'extendedae_plus:assembler_matrix_crafter_plus', 
    'extendedae_plus:assembler_matrix_pattern_plus', 
    'extendedae_plus:entity_speed_ticker', 
    Item.of('extendedae_plus:entity_speed_card', '{"EAS:mult":2}'), 
    Item.of('extendedae_plus:entity_speed_card', '{"EAS:mult":4}'), 
    Item.of('extendedae_plus:entity_speed_card', '{"EAS:mult":8}'), 
    Item.of('extendedae_plus:entity_speed_card', '{"EAS:mult":16}'), 
    'extendedae_plus:oblivion_singularity', 
    'extendedae_plus:basic_core', 
    'extendedae_plus:storage_core', 
    'extendedae_plus:spatial_core'])
})