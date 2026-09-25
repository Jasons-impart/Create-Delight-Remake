ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "create:crafting/materials/rose_quartz",
        "createmetallurgy:belt_grinder",
        "createmetallurgy:sandpaper_belt",
        "minecraft:dispenser",
        "torchmaster:frozen_pearl",
        "torchmaster:feral_flare_lantern",
        // 原为 kubejs/data 下的 forge:false 禁用桩
        "minecraft:beetroot_soup",
        "minecraft:mushroom_stew",
        "minecraft:rabbit_stew_from_brown_mushroom",
        "minecraft:rabbit_stew_from_red_mushroom",
        "northstar:electrolysis/brine",
        "northstar:electrolysis/water",
        // tetra/more_mod_tetra 禁用配方
        "tetra:more_mod_tetra/mmt_critical_strike_improvements",
        "tetra:more_mod_tetra/mmt_over_improvements",
        "tetra:more_mod_tetra/mmt_skill_improvements",
        "tetra:more_mod_tetra/mmt_upgraded_netherite",
        "tetra:more_mod_tetra/biomancy/mmt_malum_scythe_scroll",
        "tetra:more_mod_tetra/botania/mmt_botania_scroll",
        "tetra:more_mod_tetra/eidolon_repraised/mmt_eidolon_reaper_scythe_scroll",
        "tetra:more_mod_tetra/forge_hammer/mmt_high_settled_scroll",
        "tetra:more_mod_tetra/forge_hammer/mmt_settled_scroll",
        "tetra:more_mod_tetra/malum/mmt_malum_scythe_scroll"
    ])
    remove_recipes_mod(e, [
        "ftbquests",
        "itemfilters",
    ])
})
