// Create Armorer 改用 CurseForge 官方枪包后，原魔改包中移除的物品在此通过 TaCZ JS 运行时下架
// （官方包为 CC BY-NC-ND 协议，不可再分发修改版，本地改动一律迁移到 KubeJS）
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
