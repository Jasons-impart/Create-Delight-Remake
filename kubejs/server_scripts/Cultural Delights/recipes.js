ServerEvents.recipes(e => {
    e.recipes.kubejs.shapeless(
        'createdelight:raw_empanada',
        [
            '2x culturaldelights:corn_dough',
            '#culturaldelights:avocados',
            '#forge:vegetables/tomato',
            '#forge:vegetables/onion'
        ]
    ).id("culturaldelights:cooking/empanada")
})