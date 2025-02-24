ServerEvents.tags("item", e => {
    e.add("create:upright_on_belt", [
        'create_sa:brass_exoskeleton_chestplate',
        'create_sa:andesite_exoskeleton_chestplate',
        'create_sa:copper_exoskeleton_chestplate',
        'create_sa:creative_filling_tank',
        'create_sa:small_filling_tank',
        'create_sa:medium_filling_tank',
        'create_sa:large_filling_tank',
        'create_sa:small_fueling_tank',
        'create_sa:medium_fueling_tank',
        'create_sa:large_fueling_tank',
        'create_sa:brass_jetpack_chestplate',
        'create_sa:andesite_jetpack_chestplate',
        'create_sa:copper_jetpack_chestplate',
    ])
})

ServerEvents.tags("fluid", e => {
    e.add("craete_sa:fuel_fluid", 
        "#forge:diesel",
        "#forge:biodiesel",
        "#forge:gasoline",
        "createdelight:fuel_mixtures"
    )
})