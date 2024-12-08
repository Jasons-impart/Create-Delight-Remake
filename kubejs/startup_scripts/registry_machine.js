StartupEvents.registry("block", (event) => {
    const MODID = "createdelight:"

    let machinery = [
        "electrolyzer",
        "emergency_industrial_platform"
    ]
    machinery.forEach((name) => {
        event.create(MODID + name, "custommachinery")
            .machine(MODID + name)
    })
})
