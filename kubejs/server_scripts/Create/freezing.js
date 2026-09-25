ServerEvents.recipes(e => {
    freezing(e, "create:blaze_burner", "fluidlogistics:blaze_cooler")
    freezing(e, "create:blaze_cake", [
        "create:powdered_obsidian",
        Item.of("create:cinder_flour").withChance(0.9)
    ])
    freezing(e, "minecraft:crying_obsidian", "minecraft:obsidian")
    freezing(e, "minecraft:snow", "minecraft:snow_block")
    freezing(e, "minecraft:snowball", "minecraft:snow")
    freezing(e, "minecraft:water_bucket", "minecraft:powder_snow_bucket")
})
