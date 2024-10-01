StartupEvents.registry("item", e => {
    let metals = [
        "desh",
        "ostrum",
        "calorite",
    ]

    metals.forEach(metal => {
        e.create(`createdelight:crushed_raw_${metal}`)
            .maxStackSize(64)
            .translationKey(`item.createdelight.crushed_raw_${metal}`)
            .tag("create:crushed_raw_materials")
    })
})
