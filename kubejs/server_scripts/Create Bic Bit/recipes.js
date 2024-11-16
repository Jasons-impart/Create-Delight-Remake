ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "create_deepfried:mixing/raw_springroll",
        "create_deepfried:compat/farmersdelight/mixing/raw_springroll",
        "create_deepfried:deep_frying/springroll"
    ])
    e.recipes.create.mixing(
        Fluid.of("create_bic_bit:stamppot", 250),
        [
            '4x minecraft:baked_potato',
            '2x some_assembly_required:chopped_carrot',
            'some_assembly_required:sliced_onion'
        ]
    ).id("create_bic_bit:compat/farmersdelight/stamppot_recipe2")
})
LootJS.modifiers(e => {
    e.addBlockLootModifier("minecraft:dead_bush")
        .removeLoot('create_deepfried:yuca')
})