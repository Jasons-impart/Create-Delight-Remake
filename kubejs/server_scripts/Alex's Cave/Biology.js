EntityEvents.spawned(e => {
    if(e.entity.type == "minecraft:zombie" ){
        if(e.level.dimension == 
            "createdelight:magnetic_caves_dimension" ||
            "createdelight:abyssal_chasm_dimension" ||
            "createdelight:forlorn_hollows_dimension" ||
            "createdelight:primordial_caves_dimension" ||
            "createdelight:toxic_caves_dimension"){
            e.cancel()
        }
    }
    if(e.entity.type == "minecraft:zombie_villager" ){
        if(e.level.dimension == 
            "createdelight:magnetic_caves_dimension" ||
            "createdelight:abyssal_chasm_dimension" ||
            "createdelight:forlorn_hollows_dimension" ||
            "createdelight:primordial_caves_dimension" ||
            "createdelight:toxic_caves_dimension"){
            e.cancel()
        }
    }
    if(e.entity.type == "minecraft:skeleton" ){
        if(e.level.dimension == 
            "createdelight:magnetic_caves_dimension" ||
            "createdelight:abyssal_chasm_dimension" ||
            "createdelight:forlorn_hollows_dimension" ||
            "createdelight:primordial_caves_dimension" ||
            "createdelight:toxic_caves_dimension"){
            e.cancel()
        }
    }
    if(e.entity.type == 'quark:forgotten' ){
        if(e.level.dimension == 
            "createdelight:magnetic_caves_dimension" ||
            "createdelight:abyssal_chasm_dimension" ||
            "createdelight:forlorn_hollows_dimension" ||
            "createdelight:primordial_caves_dimension" ||
            "createdelight:toxic_caves_dimension"){
            e.cancel()
        }
    }
    if(e.entity.type == "minecraft:spider" ){
        if(e.level.dimension == 
            "createdelight:magnetic_caves_dimension" ||
            "createdelight:abyssal_chasm_dimension" ||
            "createdelight:forlorn_hollows_dimension" ||
            "createdelight:primordial_caves_dimension" ||
            "createdelight:toxic_caves_dimension"){
            e.cancel()
        }
    }

})