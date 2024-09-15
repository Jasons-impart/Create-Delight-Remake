ServerEvents.recipes(e => {
    remove_recipes_output(e, "witheringboon:soulaniteingot")
    e.recipes.vintageimprovements.pressurizing(
        "witheringboon:hardenedprismarine",
        [
            "create:powdered_obsidian",
            "create:powdered_obsidian",
            "create:powdered_obsidian",
            "create:powdered_obsidian",
            "minecraft:prismarine"
        ])
    .superheated()
    .id("witheringboon:pressurizing/soulaniteingot")
    e.recipes.create.haunting("witheringboon:soulaniteingot", "witheringboon:soulanitealloy")
    .id("witheringboon:haunting/soulaniteingot")
})