StartupEvents.registry("block", (event) => {
    const MODID = "createdelight:"

    let machinery = [
        // "electrolyzer",
    ]
    machinery.forEach((name) => {
        event.create(MODID + name, "custommachinery")
            .machine(MODID + name)
    })
})
