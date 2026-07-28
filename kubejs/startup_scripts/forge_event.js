ForgeEvents.onEvent("net.minecraftforge.event.entity.living.LivingHurtEvent", e => {
    [
        "TetraForstallAttackEffect",
        "TetraOverwhelmAttackEffect",
        "TetraBlackKnightMaterialAttackEffects",
        "TetraFrozenAttackEffect",
        "TetraDragonRestraintEvent",
        "TetraLifeDrainEffect",
        "TetraChargeAttackEffect",
        "TetraSolarGuardDefenseEffect",
        "DragonBreathResistanceEffect"
    ].forEach(handlerName => {
        try {
            let handler = global[handlerName]
            if (handler != null)
                handler(e)
        } catch (err) {
            console.error(`[CD][Tetra Effect] ${handlerName}: ${err}`)
        }
    })
})
