/**
 * JEED 原生效果来源配方。只提供效果/流体来源时，可省略 providers。
 * @param {Internal.RecipesEventJS} event
 * @param {Special.MobEffect | "all"} effect 目标效果 ID（all 表示所有效果）
 * @param {{providers?: Internal.Ingredient_[], effect_providers?: Special.MobEffect[], fluid_providers?: Special.Fluid[]}} sources
 * @returns {Internal.RecipeJS | null} 无 JEED 时返回 null；链式调用前先判断 Platform.isLoaded("jeed")。
 * @example
 * if (Platform.isLoaded("jeed")) {
 *     jeed_effect_provider(e, "minecraft:haste", {
 *         providers: ["minecraft:golden_apple", "#forge:fruits"],
 *         effect_providers: ["minecraft:conduit_power"],
 *         fluid_providers: ["minecraft:water"]
 *     }).id("createdelight:jeed/example")
 * }
 */
function jeed_effect_provider(event, effect, sources) {
    if (!Platform.isLoaded("jeed")) return null
    sources = sources || {}
    return event.recipes.jeed.effect_provider(
        effect,
        sources.providers || [],
        sources.effect_providers || [],
        sources.fluid_providers || []
    )
}
