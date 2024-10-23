StartupEvents.registry("item", e => {
    let metals = [
        "tin",
        "silver",
        "desh",
        "ostrum",
        "calorite"
    ]
    metals.forEach(metal => {
        e.create(`createdelight:${metal}_dust`)
            .maxStackSize(64)
            .translationKey(`item.createdelight.${metal}_dust`)
            .tag(`forge:dusts/${metal}`)
            .tag(`forge:dusts`)
        e.create(`createdelight:dirty_${metal}_dust`)
            .maxStackSize(64)
            .translationKey(`item.createdelight.dirty_${metal}_dust`)
            .tag(`forge:dirty_dusts/${metal}`)
            .tag(`forge:dirty_dusts`)
    })
})