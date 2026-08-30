const HERBAL_COOKIE_VANILLA_EFFECTS = {
    1: "minecraft:speed",
    2: "minecraft:slowness",
    3: "minecraft:haste",
    4: "minecraft:mining_fatigue",
    5: "minecraft:strength",
    6: "minecraft:instant_health",
    7: "minecraft:instant_damage",
    8: "minecraft:jump_boost",
    9: "minecraft:nausea",
    10: "minecraft:regeneration",
    11: "minecraft:resistance",
    12: "minecraft:fire_resistance",
    13: "minecraft:water_breathing",
    14: "minecraft:invisibility",
    15: "minecraft:blindness",
    16: "minecraft:night_vision",
    17: "minecraft:hunger",
    18: "minecraft:weakness",
    19: "minecraft:poison",
    20: "minecraft:wither",
    21: "minecraft:health_boost",
    22: "minecraft:absorption",
    23: "minecraft:saturation",
    24: "minecraft:glowing",
    25: "minecraft:levitation",
    26: "minecraft:luck",
    27: "minecraft:unluck",
    28: "minecraft:slow_falling",
    29: "minecraft:conduit_power",
    30: "minecraft:dolphins_grace",
    31: "minecraft:bad_omen",
    32: "minecraft:hero_of_the_village",
    33: "minecraft:darkness"
}

function getHerbalCookieEffectId(stack) {
    if (!stack.nbt)
        return ""

    try {
        let effects = stack.nbt.getList("Effects", 10)
        if (effects && !effects.isEmpty()) {
            let effect = effects.getCompound(0)
            let effectId = effect.getString("forge:effect_id")
            if (effectId)
                return effectId

            effectId = effect.get("forge:effect_id")
            if (effectId)
                return String(effectId).replace(/^"|"$/g, "")

            let vanillaEffectId = effect.getInt("EffectId")
            if (HERBAL_COOKIE_VANILLA_EFFECTS[vanillaEffectId])
                return HERBAL_COOKIE_VANILLA_EFFECTS[vanillaEffectId]
        }
    } catch (err) {
    }

    let match = String(stack.nbt).match(/"forge:effect_id"\s*:\s*"([^"]+)"/)
    if (!match)
        match = String(stack.nbt).match(/forge:effect_id\s*:\s*"([^"]+)"/)
    if (match)
        return match[1]

    match = String(stack.nbt).match(/EffectId\s*:\s*(\d+)/)
    return match && HERBAL_COOKIE_VANILLA_EFFECTS[match[1]] ? HERBAL_COOKIE_VANILLA_EFFECTS[match[1]] : ""
}

function renderHerbalCookieEffect(c) {
    let effectId = getHerbalCookieEffectId(c.itemStack)
    if (!effectId || effectId.indexOf(":") == -1)
        return

    let name = effectId.split(":")
    let icon = new global.CDClientJavaClasses.$ResourceLocation(
        name[0],
        `textures/mob_effect/${name[1]}.png`
    )

    c.pushPose()
    c.translate(c.xOffset + 7, c.yOffset + 7, 200)
    c.scale(0.5, 0.5)
    global.CDClientJavaClasses.$Lighting.setupForFlatItems()
    c.drawTexture(icon, 0, 0, 18, 18, 0, 0, 18, 18)
    global.CDClientJavaClasses.$Lighting.setupFor3DItems()
    c.popPose()
}

RenderJSEvents.RegisterItemDecorations(e => {
    e.register("cosmopolitan:herbal_cookie", renderHerbalCookieEffect)
    e.register("createdelight:herbal_cookie_dough", renderHerbalCookieEffect)
})
