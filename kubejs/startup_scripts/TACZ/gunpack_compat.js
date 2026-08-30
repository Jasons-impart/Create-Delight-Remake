TaCZStartupEvents.attachmentIndexLoad((event) => {
    const id = event.getId().toString()
    if ([
        "create_armorer:grip_pipe",
        "create_armorer:muzzle_pipe",
        "create_armorer:scope_pipe",
        "create_armorer:muzzle_refit_energy_blade",
    ].includes(id)) {
        return event.removeAttachment()
    }
})

TaCZStartupEvents.gunIndexLoad((event) => {
    if (event.getId().toString() === "create_armorer:special_melee_atomic") {
        return event.removeGun()
    }
})
