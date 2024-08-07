ServerEvents.recipes(e => {
    e.recipes.minecraft.crafting_shapeless(
        'createdelight:brass_coin',
        '9x createdelight:iron_coin'
    ).id("createdelight:iron_2_brass")
    e.recipes.minecraft.crafting_shapeless(
        'createdelight:gold_coin',
        '9x createdelight:brass_coin'
    ).id("createdelight:brass_2_gold")
    e.recipes.minecraft.crafting_shapeless(
        'createdelight:netherite_coin',
        '9x createdelight:gold_coin'
    ).id("createdelight:gold_2_netherite")
    e.recipes.minecraft.crafting_shapeless(
        '9x createdelight:iron_coin',
        'createdelight:brass_coin'
    ).id("createdelight:brass_2_iron")
    e.recipes.minecraft.crafting_shapeless(
        '9x createdelight:brass_coin',
        'createdelight:gold_coin'
    ).id("createdelight:gold_2_brass")
    e.recipes.minecraft.crafting_shapeless(
        '9x createdelight:gold_coin',
        'createdelight:netherite_coin'
    ).id("createdelight:netherite_2_gold")

})
