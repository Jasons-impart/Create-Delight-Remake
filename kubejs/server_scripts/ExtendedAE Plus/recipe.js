ServerEvents.recipes(e => {
    remove_recipes_output(e,
        [
            'extendedae_plus:infinity_core',
            'extendedae_plus:infinity_biginteger_cell',
            'extendedae_plus:assembler_matrix_upload_core',
            'extendedae_plus:assembler_matrix_speed_plus',
            'extendedae_plus:assembler_matrix_crafter_plus',
            'extendedae_plus:assembler_matrix_pattern_plus',
            'extendedae_plus:entity_speed_ticker',
            'extendedae_plus:oblivion_singularity',
            'extendedae_plus:basic_core',
            'extendedae_plus:storage_core',
            'extendedae_plus:spatial_core']
    )
    remove_recipes_id(e, [
        "extendedae_plus:entity_speed_card_2x",
        "extendedae_plus:entity_speed_card_4x",
        "extendedae_plus:entity_speed_card_8x",
        "extendedae_plus:entity_speed_card_16x",
        "extendedae_plus:core/spatial_core_1",
        "extendedae_plus:core/spatial_core_2",
        "extendedae_plus:core/spatial_core_3",
        "extendedae_plus:core/storage_core_1",
        "extendedae_plus:core/storage_core_2",
        "extendedae_plus:core/storage_core_3"
    ])
})