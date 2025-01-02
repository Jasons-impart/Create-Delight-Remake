ForgeEvents.onEvent("net.minecraftforge.event.entity.living.LivingHurtEvent", e => {
    try{
        global.ArmorplateHurtEvent(e)
    }catch(err){
        
    }
})