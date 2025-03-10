ForgeEvents.onEvent("net.minecraftforge.event.entity.living.LivingHurtEvent", e => {
    try{
        global.ArmorplateHurtEvent(e)
        global.TetraForstallAttackEffect(e)
        global.TetraOverwhelmAttackEffect(e)
    }catch(err){
        console.error(err)
    }
})