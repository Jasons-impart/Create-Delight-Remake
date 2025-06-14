StartupEvents.modifyCreativeTab("megacells:tab", e => {
  e.add([
    'createdelight:sky_stone_paste',
    'createdelight:initial_processing_of_printed_accumulation_processor',
    'createdelight:accumulation_processor_inscribed',
    'createdelight:mega_item_cell_housing_blank',
    'createdelight:mega_fluid_cell_housing_blank',
    'createdelight:initial_processing_of_mega_item_cell_housing',
    'createdelight:initial_processing_of_mega_fluid_cell_housing',
    'createdelight:unformed_mega_item_cell_housing',
    'createdelight:unformed_mega_fluid_cell_housing',
  ])
  e.remove([
    "megacells:mega_interface",
    "megacells:mega_pattern_provider",
    'megacells:cable_mega_interface',
    'megacells:cable_mega_pattern_provider',
  ])
})
