// priority: -900
// 原生酒桶配方逐条覆盖原 ID，保留基液、原料、空瓶和工时；酵母作为普通原料。
ServerEvents.recipes(event => {
    const barrel = event.recipes.kaleidoscope_tavern.barrel

    barrel("kaleidoscope_tavern:brandy", "kaleidoscope_tavern:empty_bottle", [
        "minecraft:apple", "createdelight:dry_yeast"
    ], "kaleidoscope_tavern:grape_juice", 2400).id("kaleidoscope_tavern:barrel/brandy")

    barrel("kaleidoscope_tavern:carignan", "kaleidoscope_tavern:empty_bottle", [
        "minecraft:sweet_berries", "createdelight:dry_yeast"
    ], "kaleidoscope_tavern:grape_juice", 2400).id("kaleidoscope_tavern:barrel/carignan")

    barrel("kaleidoscope_tavern:champagne", "kaleidoscope_tavern:empty_bottle", [
        "minecraft:sugar", "createdelight:dry_yeast"
    ], "kaleidoscope_tavern:grape_juice", 2400).id("kaleidoscope_tavern:barrel/champagne")

    barrel("kaleidoscope_tavern:glowflower_brew", "kaleidoscope_tavern:empty_bottle", [
        "minecraft:glowstone_dust", "createdelight:dry_yeast"
    ], "kaleidoscope_tavern:glow_berries_juice", 2400).id("kaleidoscope_tavern:barrel/glowflower_brew")

    barrel("kaleidoscope_tavern:honey_wine", "kaleidoscope_tavern:empty_bottle", [
        "minecraft:honeycomb", "createdelight:dry_yeast"
    ], "kaleidoscope_tavern:gold_grape_juice", 2400).id("kaleidoscope_tavern:barrel/honey_wine")

    barrel("kaleidoscope_tavern:ice_wine", "kaleidoscope_tavern:empty_bottle", [
        "createdelight:dry_yeast"
    ], "kaleidoscope_tavern:ice_grape_juice", 2400).id("kaleidoscope_tavern:barrel/ice_wine")

    barrel("kaleidoscope_tavern:luminous_bride", "kaleidoscope_tavern:empty_bottle", [
        "minecraft:glow_ink_sac", "createdelight:dry_yeast"
    ], "kaleidoscope_tavern:glow_berries_juice", 2400).id("kaleidoscope_tavern:barrel/luminous_bride")

    barrel("kaleidoscope_tavern:madame_shexiang", "kaleidoscope_tavern:empty_bottle", [
        "minecraft:gold_nugget", "createdelight:dry_yeast"
    ], "kaleidoscope_tavern:gold_grape_juice", 2400).id("kaleidoscope_tavern:barrel/madame_shexiang")

    barrel("kaleidoscope_tavern:miners_star", "kaleidoscope_tavern:empty_bottle", [
        "minecraft:iron_nugget", "createdelight:dry_yeast"
    ], "kaleidoscope_tavern:gold_grape_juice", 2400).id("kaleidoscope_tavern:barrel/miners_star")

    barrel("kaleidoscope_tavern:molotov", "kaleidoscope_tavern:empty_bottle", [
        "createdelight:dry_yeast"
    ], "minecraft:lava", 2400).id("kaleidoscope_tavern:barrel/molotov")

    barrel("kaleidoscope_tavern:mother_snow", "kaleidoscope_tavern:empty_bottle", [
        "minecraft:ice", "createdelight:dry_yeast"
    ], "kaleidoscope_tavern:ice_grape_juice", 2400).id("kaleidoscope_tavern:barrel/mother_snow")

    barrel("kaleidoscope_tavern:plum_wine", "kaleidoscope_tavern:empty_bottle", [
        "minecraft:sugar", "createdelight:dry_yeast"
    ], "kaleidoscope_tavern:sweet_berries_juice", 2400).id("kaleidoscope_tavern:barrel/plum_wine")

    barrel("kaleidoscope_tavern:polaris_sweet_white", "kaleidoscope_tavern:empty_bottle", [
        "minecraft:packed_ice", "createdelight:dry_yeast"
    ], "kaleidoscope_tavern:ice_grape_juice", 2400).id("kaleidoscope_tavern:barrel/polaris_sweet_white")

    barrel("kaleidoscope_tavern:red_queen", "kaleidoscope_tavern:empty_bottle", [
        "minecraft:redstone", "createdelight:dry_yeast"
    ], "kaleidoscope_tavern:sweet_berries_juice", 2400).id("kaleidoscope_tavern:barrel/red_queen")

    barrel("kaleidoscope_tavern:riesling_dry_white", "kaleidoscope_tavern:empty_bottle", [
        "minecraft:gunpowder", "minecraft:sugar", "createdelight:dry_yeast"
    ], "kaleidoscope_tavern:green_grape_juice", 2400).id("kaleidoscope_tavern:barrel/riesling_dry_white")

    barrel("kaleidoscope_tavern:rum", "kaleidoscope_tavern:empty_bottle", [
        "minecraft:sugar_cane", "createdelight:dry_yeast"
    ], "minecraft:water", 2400).id("kaleidoscope_tavern:barrel/rum")

    barrel("kaleidoscope_tavern:sakura_wine", "kaleidoscope_tavern:empty_bottle", [
        "minecraft:pink_petals", "createdelight:dry_yeast"
    ], "kaleidoscope_tavern:grape_juice", 2400).id("kaleidoscope_tavern:barrel/sakura_wine")

    barrel("kaleidoscope_tavern:sauvignon_blanc_dry_white", "kaleidoscope_tavern:empty_bottle", [
        "minecraft:sugar_cane", "minecraft:sugar", "createdelight:dry_yeast"
    ], "kaleidoscope_tavern:green_grape_juice", 2400).id("kaleidoscope_tavern:barrel/sauvignon_blanc_dry_white")

    barrel("kaleidoscope_tavern:sherry", "kaleidoscope_tavern:empty_bottle", [
        "minecraft:blue_ice", "createdelight:dry_yeast"
    ], "kaleidoscope_tavern:ice_grape_juice", 2400).id("kaleidoscope_tavern:barrel/sherry")

    barrel("kaleidoscope_tavern:sunset_glow", "kaleidoscope_tavern:empty_bottle", [
        "minecraft:blaze_powder", "createdelight:dry_yeast"
    ], "kaleidoscope_tavern:gold_grape_juice", 2400).id("kaleidoscope_tavern:barrel/sunset_glow")

    barrel("kaleidoscope_tavern:sweet_berry_wine", "kaleidoscope_tavern:empty_bottle", [
        "minecraft:sweet_berries", "createdelight:dry_yeast"
    ], "kaleidoscope_tavern:sweet_berries_juice", 2400).id("kaleidoscope_tavern:barrel/sweet_berry_wine")

    barrel("kaleidoscope_tavern:vodka", "kaleidoscope_tavern:empty_bottle", [
        "minecraft:potato", "createdelight:dry_yeast"
    ], "minecraft:water", 2400).id("kaleidoscope_tavern:barrel/vodka")

    barrel("kaleidoscope_tavern:whiskey", "kaleidoscope_tavern:empty_bottle", [
        "minecraft:wheat", "createdelight:dry_yeast"
    ], "minecraft:water", 2400).id("kaleidoscope_tavern:barrel/whiskey")

    barrel("kaleidoscope_tavern:wine", "kaleidoscope_tavern:empty_bottle", [
        "createdelight:dry_yeast"
    ], "kaleidoscope_tavern:grape_juice", 2400).id("kaleidoscope_tavern:barrel/wine")
})
