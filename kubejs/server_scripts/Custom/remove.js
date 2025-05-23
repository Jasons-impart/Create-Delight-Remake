ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "create:crafting/materials/rose_quartz",
        "createmetallurgy:belt_grinder",
        "createmetallurgy:sandpaper_belt",
        "torchmaster:frozen_pearl",
        "torchmaster:feral_flare_lantern"
    ])
    remove_recipes_mod(e, [
        "ftbquests",
        "itemfilters",
    ])
})
