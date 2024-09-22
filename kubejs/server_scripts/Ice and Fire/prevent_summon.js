EntityEvents.spawned(e => {
    let dread_monster = [
        "iceandfire:dread_beast", 
        "iceandfire:dread_ghoul", 
        "iceandfire:dread_horse",
        "iceandfire:dread_knight",
        "iceandfire:dread_lich",
        "iceandfire:dread_lich_skull",
        "iceandfire:dread_scuttler",
        "iceandfire:dread_thrall"]
    // 苍蝇生成
    if (dread_monster.find(e.entity.type)) {
        if (e.level.dimension != "ad_astra:glacio") {
            e.cancel()
        }
    }
})