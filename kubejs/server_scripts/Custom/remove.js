ServerEvents.recipes(e => {
    remove_recipes_output(e, [
        "supplementaries:bomb",
        "create_enchantment_industry:experience_rotor",
        "supplementaries:bomb_spiky"
    ])
    remove_recipes_id(e, [
        "create:crafting/materials/rose_quartz",
        "neapolitan:banana/banana_bread",
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
