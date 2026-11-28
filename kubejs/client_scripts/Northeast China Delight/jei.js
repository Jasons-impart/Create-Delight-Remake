let northeastSaltInfoPending = false

JEIEvents.removeRecipes(e => {
    // 大酱油瓶使用已有的显式 JEI 条目，隐藏由流体能力生成的重复条目。
    e.remove("create:draining", [
        "create:empty_youkaishomecoming_soy_sauce_bottle_of_youkaishomecoming_soy_sauce",
        "create:empty_youkaishomecoming_soy_sauce_flask_of_youkaishomecoming_soy_sauce",
        "create:empty_youkaishomecoming_soy_sauce_flask_of_northeast_china_delight_soy_sauce"
    ])
    if (Platform.isLoaded("steam_letters")) {
        const hiddenOilFuels = []
        for (let usedMb = 1; usedMb <= 250; usedMb++) {
            hiddenOilFuels.push(`createdelight:steam_letters/solid_fuel/cooking_oil_bottle/damage_${usedMb}`)
            hiddenOilFuels.push(`createdelight:steam_letters/solid_fuel/animal_oil_bottle/damage_${usedMb}`)
            hiddenOilFuels.push(`createdelight:steam_letters/solid_fuel/chili_oil_bottle/damage_${usedMb}`)
        }
        e.remove("steam_letters:solid_fuel", hiddenOilFuels)
    }

    // JEI 在所有 onRuntimeAvailable 回调完成后才保存全局 runtime。
    northeastSaltInfoPending = true
})

ClientEvents.tick(e => {
    if (!northeastSaltInfoPending) return
    northeastSaltInfoPending = false

    // JEI 信息页没有配方 ID；按本地化说明匹配，兼容 OEI 合并后的盐物品。
    const recipeManager = global.CDClientJavaClasses.$JEIInternal.getJeiRuntime().getRecipeManager()
    const informationType = global.CDClientJavaClasses.$JEIRecipeTypes.INFORMATION
    const saltInfoText = String(Text.translate("jei.northeast_china_delight.info.salt").getString())
    const saltInfoRecipes = recipeManager.createRecipeLookup(informationType).get()
        .filter(recipe => recipe.getDescription().stream()
            .anyMatch(line => String(line.getString()) === saltInfoText))
        .toList()
    recipeManager.hideRecipes(informationType, saltInfoRecipes)
})
