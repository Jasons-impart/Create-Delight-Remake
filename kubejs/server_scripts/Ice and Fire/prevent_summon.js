EntityEvents.spawned(e => {
    let dread_monster = [
        "iceandfire:dread_beast",
        "iceandfire:dread_ghoul",
        "iceandfire:dread_horse",
        "iceandfire:dread_knight",
        "iceandfire:dread_lich",
        "iceandfire:dread_lich_skull",
        "iceandfire:dread_scuttler",
        "iceandfire:dread_thrall",
    ]
    // 悚怖怪生成
    if (dread_monster.indexOf(e.entity.type) != -1) {
        if (e.level.dimension != "ad_astra:glacio") {
            e.cancel()
        }
    }
    if (e.entity.type == "iceandfire:siren" || e.entity.type == "iceandfire:sea_serpent")
        if (e.level.dimension != "createdelight:abyssal_chasm_dimension") {
            e.cancel()
        }
})