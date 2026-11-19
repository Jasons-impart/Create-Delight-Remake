ServerEvents.recipes(event => {
    if (!Platform.isLoaded("jeed") || !Item.exists("kaleidoscope_tavern:wine")) return

    // 对齐 CDC TavernQuality.effects：瓶酒和醋固定取原生第三档，杯装鸡尾酒取第一档。
    // QF 负责等级和时长；来源按实际可获得的效果登记，不混入原生其他品质档。
    // 数据基于 Kaleidoscope Tavern 1.2.0 的 datamap/drink_effect，升级时复核。
    const drinkEffects = {
        "allium_garden": ["kaleidoscope_tavern:xp_drain"],
        "bloody_mary": ["kaleidoscope_tavern:bloody_mary"],
        "brandy": ["kaleidoscope_tavern:slightly_tipsy", "kaleidoscope_tavern:high_heels"],
        "brass_heart": ["kaleidoscope_tavern:ardent_heat"],
        "carignan": ["kaleidoscope_tavern:slightly_tipsy", "minecraft:instant_health"],
        "champagne": ["kaleidoscope_tavern:slightly_tipsy", "kaleidoscope_tavern:high_heels"],
        "depth_charge": ["kaleidoscope_tavern:ardent_heat"],
        "emerald": ["kaleidoscope_tavern:long_reach"],
        "glowflower_brew": ["kaleidoscope_tavern:slightly_tipsy", "kaleidoscope_tavern:vision"],
        "godfather": ["kaleidoscope_tavern:zenith"],
        "grasshopper": ["kaleidoscope_tavern:grass_stealth"],
        "honey_wine": ["kaleidoscope_tavern:slightly_tipsy", "minecraft:resistance"],
        "ice_wine": ["kaleidoscope_tavern:slightly_tipsy", "minecraft:fire_resistance"],
        "luminous_bride": ["kaleidoscope_tavern:slightly_tipsy", "minecraft:night_vision"],
        "madame_shexiang": ["kaleidoscope_tavern:slightly_tipsy", "minecraft:resistance"],
        "miners_star": ["kaleidoscope_tavern:slightly_tipsy", "minecraft:haste"],
        "mojito": ["kaleidoscope_tavern:vision"],
        "mother_snow": ["kaleidoscope_tavern:slightly_tipsy", "minecraft:fire_resistance"],
        "mystery_cocktail": ["kaleidoscope_tavern:slightly_tipsy"],
        "nether_special": ["kaleidoscope_tavern:tomb_raider"],
        "plum_wine": ["kaleidoscope_tavern:slightly_tipsy", "minecraft:water_breathing"],
        "polaris_sweet_white": ["kaleidoscope_tavern:slightly_tipsy", "minecraft:fire_resistance"],
        "red_queen": ["kaleidoscope_tavern:slightly_tipsy", "kaleidoscope_tavern:bloody_mary"],
        "riesling_dry_white": ["kaleidoscope_tavern:slightly_tipsy", "kaleidoscope_tavern:grass_stealth"],
        "rum": ["kaleidoscope_tavern:slightly_tipsy", "minecraft:bad_omen"],
        "sakura_wine": ["kaleidoscope_tavern:slightly_tipsy", "minecraft:regeneration"],
        "sauvignon_blanc_dry_white": ["kaleidoscope_tavern:slightly_tipsy", "kaleidoscope_tavern:grass_stealth"],
        "screwdriver": ["kaleidoscope_tavern:upside_down"],
        "sculk_special": ["kaleidoscope_tavern:shriek_attack"],
        "sherry": ["kaleidoscope_tavern:slightly_tipsy", "minecraft:fire_resistance"],
        "sunset_glow": ["kaleidoscope_tavern:slightly_tipsy", "minecraft:resistance"],
        "sweet_berry_wine": ["kaleidoscope_tavern:slightly_tipsy", "kaleidoscope_tavern:bloody_mary"],
        "vinegar": ["kaleidoscope_tavern:slightly_tipsy", "minecraft:blindness", "minecraft:mining_fatigue", "minecraft:speed", "minecraft:jump_boost", "minecraft:haste"],
        "vodka": ["kaleidoscope_tavern:slightly_tipsy", "minecraft:strength"],
        "whiskey": ["kaleidoscope_tavern:slightly_tipsy", "minecraft:strength"],
        "white_lady": ["kaleidoscope_tavern:high_heels"],
        "wine": ["kaleidoscope_tavern:slightly_tipsy", "minecraft:regeneration"],
    }
    const providers = {}
    Object.keys(drinkEffects).forEach(drink => {
        drinkEffects[drink].forEach(effect => {
            if (!providers[effect]) providers[effect] = []
            providers[effect].push("kaleidoscope_tavern:" + drink)
        })
    })

    // 特调继承可调制基酒和药水的效果；杯装鸡尾酒不会被 collectFromStorage 当作基酒。
    // 只登记可能继承的效果，不能用 all 把没有来源的模组效果也列入。
    const bottleDrinks = [
        "brandy", "carignan", "champagne", "glowflower_brew", "honey_wine", "ice_wine",
        "luminous_bride", "madame_shexiang", "miners_star", "mother_snow", "plum_wine",
        "polaris_sweet_white", "red_queen", "riesling_dry_white", "rum", "sakura_wine",
        "sauvignon_blanc_dry_white", "sherry", "sunset_glow", "sweet_berry_wine",
        "vodka", "whiskey", "wine"
    ]
    const signatureEffects = {}
    bottleDrinks.forEach(drink => {
        drinkEffects[drink].forEach(effect => signatureEffects[effect] = true)
    })
    global.CDServerJavaClasses.$ForgeRegistries.POTIONS.getValues().forEach(potion => {
        potion.getEffects().forEach(instance => {
            const effect = global.CDServerJavaClasses.$ForgeRegistries.MOB_EFFECTS
                .getKey(instance.getEffect()).toString()
            signatureEffects[effect] = true
        })
    })
    Object.keys(signatureEffects).forEach(effect => {
        if (!providers[effect]) providers[effect] = []
        providers[effect].push("kaleidoscope_tavern:signature_cocktail")
    })

    Object.keys(providers).forEach(effect => {
        jeed_effect_provider(event, effect, {providers: providers[effect]})
            .id("createdelight:jeed/kaleidoscope_tavern/" + effect.replace(":", "/"))
    })

    jeed_effect_provider(event, "minecraft:glowing", {
        effect_providers: ["kaleidoscope_tavern:vision"]
    }).id("createdelight:jeed/kaleidoscope_tavern/secondary/glowing")
    jeed_effect_provider(event, "minecraft:fire_resistance", {
        effect_providers: ["kaleidoscope_tavern:ardent_heat", "kaleidoscope_tavern:zenith"]
    }).id("createdelight:jeed/kaleidoscope_tavern/secondary/fire_resistance")
})
