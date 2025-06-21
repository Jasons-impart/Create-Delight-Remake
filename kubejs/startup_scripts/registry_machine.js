StartupEvents.registry("block", (event) => {
    const MODID = "createdelight:"

    let machinery = [
        // "electrolyzer",
        "emergency_industrial_platform",
        "emergency_industrial_platform_block",
        "emergency_industrial_platform_lime",
        "emergency_industrial_platform_lime_block",
        "emergency_industrial_platform_dark",
        "emergency_industrial_platform_dark_block"
    ]
    machinery.forEach((name) => {
        event.create(MODID + name, "custommachinery")
            .machine(MODID + name)
    })
})
