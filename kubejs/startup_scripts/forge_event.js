ForgeEvents.onEvent("net.minecraftforge.event.entity.living.LivingHurtEvent", e => {
    try{
        global.ArmorplateHurtEvent(e)
        global.TetraForstallAttackEffect(e)
        global.TetraOverwhelmAttackEffect(e)
        global.TetraFrozenAttackEffect(e)
        global.TetraDragonRestraintEvent(e)
        global.TetraLifeDrainEffect(e)
        global.TetraChargeAttackEffect(e)
    }catch(err){
        console.error(err)
    }
})