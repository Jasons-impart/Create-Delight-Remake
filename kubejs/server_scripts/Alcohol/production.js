// priority: -900
// 在各模组替换配方之后迁移生产；装排液等物流仍由 recipes.js 统一补齐。
ServerEvents.recipes(event => {
    remove_recipes_id(event, [
        "farmersdelight:cooking/apple_cider",
        "farmersrespite:brewing/apple_cider_from_water",
        "ends_delight:food/chorus_fruit_wine",
        "dungeonsdelight:monster_cooking/misc/ghastly_spirits"
    ])

    const barrel = event.recipes.kaleidoscope_tavern.barrel
    barrel("farmersdelight:apple_cider", "minecraft:glass_bottle", [
        "minecraft:apple", "minecraft:apple", "minecraft:sugar", "createdelight:dry_yeast"
    ], "minecraft:water", 3200).id("createdelight:tavern_barrel/apple_cider")

    const chorus = Ingredient.of([
        "#forge:chorus_fruits", "minecraft:chorus_fruit", "ends_delight:chorus_fruit_grain"
    ])
    barrel("ends_delight:chorus_fruit_wine", "minecraft:glass_bottle", [
        chorus, chorus, "minecraft:sugar", "createdelight:dry_yeast"
    ], "minecraft:water", 3200).id("createdelight:tavern_barrel/chorus_fruit_wine")

    const magicDrinks = ["amethyst_tequila", "catacombs_wine", "ice_venom_wine"]
    magicDrinks.forEach(drink => {
        // 保留原生炼药配方结构和条件，只把成品液改为酒醪。
        event.forEachRecipe({id: "farmers_spell:alchemist_cauldron/" + drink}, recipe => {
            recipe.json.getAsJsonArray("results").get(0).getAsJsonObject()
                .addProperty("FluidName", "createdelight:" + drink + "_wort")
            recipe.save()
        })
        barrel("farmers_spell:" + drink, "minecraft:glass_bottle", ["createdelight:dry_yeast"],
            "createdelight:" + drink + "_wort", 2880).id("createdelight:tavern_barrel/" + drink)
    })

    // CDC 仅对此配方检查并消耗每个食材槽的四份材料，空桶走独立容器槽。
    event.recipes.dungeonsdelight.monster_cooking("createdelight:ghastly_spirits_wort_bucket", [
        "#dungeonsdelight:raw_ghast", "#dungeonsdelight:raw_ghast", "minecraft:ghast_tear",
        "minecraft:glistering_melon_slice", "minecraft:sugar", "minecraft:soul_sand"
    ], 80, 1.0, "misc", "minecraft:bucket").id("createdelight:alcohol_preparation/ghastly_spirits")
    barrel("dungeonsdelight:ghastly_spirits", "minecraft:glass_bottle", ["createdelight:dry_yeast"],
        "createdelight:ghastly_spirits_wort", 2880).id("createdelight:tavern_barrel/ghastly_spirits")
})
