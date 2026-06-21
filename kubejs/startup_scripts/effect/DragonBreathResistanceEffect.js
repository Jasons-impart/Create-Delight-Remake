/**
 * @param {Internal.LivingHurtEvent} e
 */
global.DragonBreathResistanceEffect = function(e) {
    let entity = e.entity
    if (entity.type != "minecraft:player")
        return

    let effect = entity.getEffect("createdelight:dragon_breath_resistance")
    if (effect == null)
        return

    let dragonBreath = ["dragon_fire", "dragon_ice", "dragon_lightning"]
    let damageType = String(e.getSource().getType())
    if (!dragonBreath.includes(damageType))
        return

    let level = Math.min(effect.getAmplifier() + 1, 3)
    let originalDamage = e.amount
    let finalDamage = originalDamage * (1 - 0.2 * level)
    e.setAmount(finalDamage)
}
