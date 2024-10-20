EntityEvents.spawned(e => {
    let typeList = [
        "minecraft:zombie",
        "minecraft:zombie_villager",
        "minecraft:skeleton",
        'quark:forgotten',
        "minecraft:spider",
        "minecraft:creeper"]
    let dimList = [
        "createdelight:magnetic_caves_dimension",
        "createdelight:abyssal_chasm_dimension",
        "createdelight:forlorn_hollows_dimension",
        "createdelight:primordial_caves_dimension",
        "createdelight:toxic_caves_dimension",
        "createdelight:candy_cavity_dimension"]
    if (typeList.indexOf(e.entity.type) != -1) {
        if (dimList.indexOf(e.level.dimension) != -1) {
            e.cancel()
        }
    }

})