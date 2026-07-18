global.CDBlackKnightTetraEffectConfig = {
    solarRechargeTicks: 140,
    solarMaxCharges: 3,
    solarReductionPerLevel: 0.04,
    solarReductionCap: 0.24,
    rageBonusPerStep: 0.01,
    rageBonusStepsCap: 5,
    rageBonusCap: 0.30,
    frostBonusPerLevel: 0.03,
    frostBonusCap: 0.18,
    dragonFireBonusPerLevel: 0.04,
    dragonFireBonusCap: 0.24,
    ghostBaseSafeTicks: 60,
    ghostMinSafeTicks: 20
}

/**
 * Handles the offensive identity effects supplied by Black Knight Armor metals.
 *
 * @param {Internal.LivingHurtEvent} e
 */
global.TetraBlackKnightMaterialAttackEffects = function(e) {
    if (e.source.indirect)
        return

    let player = e.getSource().getPlayer()
    if (player == null || !player.isPlayer())
        return

    let item = player.mainHandItem
    if (TetraUtil.getItem(item) == null)
        return

    let target = e.entity
    let config = global.CDBlackKnightTetraEffectConfig

    // Any attack breaks ghoststeel's disengaged state.
    if (TetraUtil.getArmorEffectLevel(player, "createdelight:ghoststeel") > 0)
        player.persistentData.putLong("tetra_ghoststeel_last_activity", player.level.time)

    if (TetraUtil.itemHasEffect(item, "createdelight:dark_flame")) {
        let level = TetraUtil.getEffectLevel(item, "createdelight:dark_flame")
        target.setSecondsOnFire(Math.min(12, 2 + level))
    }

    if (TetraUtil.itemHasEffect(item, "createdelight:rage_soul")) {
        let level = TetraUtil.getEffectLevel(item, "createdelight:rage_soul")
        let missingHealth = Math.max(0, 1 - player.health / player.maxHealth)
        let missingHealthSteps = Math.min(config.rageBonusStepsCap, Math.floor(missingHealth * 10 + 0.0001))
        let bonus = Math.min(config.rageBonusCap, missingHealthSteps * level * config.rageBonusPerStep)
        if (bonus > 0)
            e.setAmount(e.amount * (1 + bonus))
    }

    if (TetraUtil.itemHasEffect(item, "createdelight:frost_tooth")) {
        let frozen = false
        global.CDServerJavaClasses.$EntityDataProvider.getCapability(target).ifPresent(data => {
            frozen = data.frozenData.isFrozen || data.frozenData.frozenTicks > 0
        })

        if (frozen) {
            let level = TetraUtil.getEffectLevel(item, "createdelight:frost_tooth")
            let bonus = Math.min(config.frostBonusCap, level * config.frostBonusPerLevel)
            e.setAmount(e.amount * (1 + bonus))
            target.knockback(
                Math.min(0.6, level * 0.1),
                player.x - target.x,
                player.z - target.z
            )
        }
    }

    if (TetraUtil.itemHasEffect(item, "createdelight:dragon_fire")) {
        let fullyCharged = false
        try {
            fullyCharged = player.getAttackStrengthScale(0.5) >= 0.95
        } catch (ignored) {
            fullyCharged = false
        }

        if (player.isSprinting() || fullyCharged) {
            let level = TetraUtil.getEffectLevel(item, "createdelight:dragon_fire")
            let bonus = Math.min(config.dragonFireBonusCap, level * config.dragonFireBonusPerLevel)
            e.setAmount(e.amount * (1 + bonus))
            target.setSecondsOnFire(Math.min(12, 4 + level))
            player.potionEffects.add("minecraft:fire_resistance", 40, 0, true, false)
        }
    }
}

/**
 * Consumes a charged solar guard layer before the incoming damage is applied.
 *
 * @param {Internal.LivingHurtEvent} e
 */
global.TetraSolarGuardDefenseEffect = function(e) {
    let player = e.entity
    if (player == null || !player.isPlayer())
        return

    let now = player.level.time
    let ghostLevel = TetraUtil.getArmorEffectLevel(player, "createdelight:ghoststeel")
    if (ghostLevel > 0)
        player.persistentData.putLong("tetra_ghoststeel_last_activity", now)

    let level = TetraUtil.getArmorEffectLevel(player, "createdelight:solar_guard")
        + TetraUtil.getHeldEffectLevel(player, "createdelight:solar_guard")
    if (level <= 0)
        return

    let config = global.CDBlackKnightTetraEffectConfig
    let charges = player.persistentData.getInt("tetra_solar_guard_charges")
    player.persistentData.putLong("tetra_solar_guard_next_charge", now + config.solarRechargeTicks)
    if (charges <= 0)
        return

    let incomingDamage = e.amount
    let reduction = Math.min(config.solarReductionCap, level * config.solarReductionPerLevel)
    let finalDamage = incomingDamage * (1 - reduction)
    e.setAmount(finalDamage)
    player.persistentData.putInt("tetra_solar_guard_charges", charges - 1)

    let attacker = e.getSource().getEntity()
    if (attacker instanceof global.CDServerJavaClasses.$LivingEntity && attacker != player && attacker.alive) {
        let reflectedDamage = Math.min(6, Math.max(0.5, (incomingDamage - finalDamage) * 0.75))
        attacker.attack(player.damageSources().magic(), reflectedDamage)
        attacker.setSecondsOnFire(1)
    }
}

PlayerEvents.tick(e => {
    let player = e.player
    let now = e.level.time
    if (now % 10 != 0)
        return

    let config = global.CDBlackKnightTetraEffectConfig
    let solarLevel = TetraUtil.getArmorEffectLevel(player, "createdelight:solar_guard")
        + TetraUtil.getHeldEffectLevel(player, "createdelight:solar_guard")
    if (solarLevel > 0) {
        let maxCharges = Math.min(config.solarMaxCharges, Math.max(1, Math.ceil(solarLevel / 2)))
        let charges = Math.min(maxCharges, player.persistentData.getInt("tetra_solar_guard_charges"))
        let nextCharge = player.persistentData.getLong("tetra_solar_guard_next_charge")

        if (nextCharge <= 0) {
            nextCharge = now + config.solarRechargeTicks
        } else if (charges < maxCharges && now >= nextCharge) {
            charges++
            nextCharge = now + config.solarRechargeTicks
        }

        player.persistentData.putInt("tetra_solar_guard_charges", charges)
        player.persistentData.putLong("tetra_solar_guard_next_charge", nextCharge)
        if (charges > 0)
            player.potionEffects.add("blackknightarmor:solar_shield", 30, charges - 1, false, true)
    } else {
        player.persistentData.putInt("tetra_solar_guard_charges", 0)
        player.persistentData.putLong("tetra_solar_guard_next_charge", now + config.solarRechargeTicks)
    }

    let ghostLevel = TetraUtil.getArmorEffectLevel(player, "createdelight:ghoststeel")
    if (ghostLevel <= 0) {
        player.persistentData.putLong("tetra_ghoststeel_last_activity", now)
        return
    }

    let lastActivity = player.persistentData.getLong("tetra_ghoststeel_last_activity")
    if (lastActivity <= 0) {
        player.persistentData.putLong("tetra_ghoststeel_last_activity", now)
        return
    }

    player.potionEffects.add("blackknightarmor:ghost", 30, Math.min(2, ghostLevel - 1), false, true)
    let safeTicks = Math.max(config.ghostMinSafeTicks, config.ghostBaseSafeTicks - (ghostLevel - 1) * 5)
    if (now - lastActivity < safeTicks)
        return

    player.potionEffects.add("minecraft:speed", 30, 0, true, false)
    let radius = Math.min(24, 8 + ghostLevel * 2)
    player.level.getEntities(player, player.boundingBox.inflate(radius)).forEach(entity => {
        if (entity instanceof global.CDServerJavaClasses.$Mob && entity.target == player) {
            entity.setTarget(null)
            entity.setAggressive(false)
        }
    })
})
