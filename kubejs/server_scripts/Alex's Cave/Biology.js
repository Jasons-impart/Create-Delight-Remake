EntityEvents.spawned(e => {
    if (!e.entity.isMonster())
        return
    let typeList = [
        "minecraft", "quark"]
    let dimList = [
        "createdelight:magnetic_caves_dimension",
        "createdelight:abyssal_chasm_dimension",
        "createdelight:forlorn_hollows_dimension",
        "createdelight:primordial_caves_dimension",
        "createdelight:toxic_caves_dimension",
        "createdelight:candy_cavity_dimension"]
        typeList.forEach(type => {
            dimList.forEach(dim => {
                if (e.entity.type.toString().startsWith(type) && e.level.dimension == dim)
                    e.cancel()
            })
        })

})