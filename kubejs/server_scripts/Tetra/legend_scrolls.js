// 传奇卷轴合成配方（原为 kubejs/data/tetra/recipes/more_mod_tetra/the_legend_scroll/titan/ 下的数据包配方）
// 配方 ID 保留 tetra: 命名空间，避免打断既有引用
const legendScrollRecipes = [
    // key, ribbon, top(B上), sides(C中左右), bottom(D下)
    ['the_legend_scroll_of_death_titan', '9933ff', 'cataclysm:cursed_eye', 'cataclysm:cursium_ingot', 'createdelight:dread_heart'],
    ['the_legend_scroll_of_earth_titan', 'ffff66', 'cataclysm:monstrous_horn', 'cataclysm:ancient_metal_ingot', 'alexscaves:tectonic_shard'],
    ['the_legend_scroll_of_law_titan', '37f3ff', 'cataclysm:flame_eye', 'cataclysm:ignitium_ingot', 'cataclysm:burning_ashes'],
    ['the_legend_scroll_of_ocean_titan', '3333ff', 'cataclysm:abyssal_sacrifice', 'more_mod_tetra:abyssal_ingot', 'cataclysm:crystallized_coral'],
    ['the_legend_scroll_of_passage_titan', 'ff0000', 'cataclysm:flame_eye', 'cataclysm:void_eye', 'minecraft:ender_eye'],
    ['the_legend_scroll_of_reason_titan', '00ff55', 'cataclysm:void_core', 'minecraft:echo_shard', 'tetra:pristine_emerald'],
    ['the_legend_scroll_of_romance_titan', '62ff62', 'the_bumblezone:essence_of_the_bees', 'more_mod_tetra:golden_silk', 'blackknightarmor:end_dragon_blood'],
    ['the_legend_scroll_of_sky_titan', '00ff00', 'blackknightarmor:end_dragon_blood', 'tetra:dragon_sinew', 'cataclysm:essence_of_the_storm'],
    ['the_legend_scroll_of_strife_titan', 'ffd800', 'cataclysm:monstrous_eye', 'dreadsteel:dreadsteel_ingot', 'cataclysm:witherite_ingot'],
    ['the_legend_scroll_of_time_titan', 'ff33ff', 'minecraft:echo_shard', 'alexscaves:immortal_embryo', 'blackknightarmor:end_dragon_ingot'],
    ['the_legend_scroll_of_trickery_titan', '4400cd', 'cataclysm:ancient_metal_ingot', 'alexscaves:occult_gem', 'alexscaves:amber_curiosity'],
    ['the_legend_scroll_of_worldbearing_titan', '39e5ff', 'blackknightarmor:end_dragon_ingot', 'cataclysm:void_core', 'minecraft:nether_star']
]

/**
 * @param {string} key 卷轴 key（与 schematic / unlock key 同名）
 * @param {string} ribbon 丝带颜色（十六进制，不带 #）
 * @returns {Internal.ItemStack}
 */
function legendScroll(key, ribbon) {
    return Item.of('tetra:scroll_rolled', {
        BlockEntityTag: {
            data: [{
                key: `shared/${key}`,
                schematics: [`tetra:shared/${key}`],
                intricate: false,
                material: 2,
                ribbon: ribbon,
                glyphs: [3, 8, 1, 4]
            }]
        }
    })
}

ServerEvents.recipes(event => {
    legendScrollRecipes.forEach(([key, ribbon, top, sides, bottom]) => {
        event.shaped(legendScroll(key, ribbon), [
            ' B ',
            'CAC',
            ' D '
        ], {
            A: 'minecraft:writable_book',
            B: top,
            C: sides,
            D: bottom
        }).id(`tetra:more_mod_tetra/the_legend_scroll/titan/${key}`)
    })
})
