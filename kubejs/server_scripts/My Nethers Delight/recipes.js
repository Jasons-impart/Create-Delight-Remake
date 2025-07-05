ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "mynethersdelight:boiled_egg_from_smoking",
        "mynethersdelight:boiled_egg_cooking",
        "mynethersdelight:cooking/fries_ghasta",
        "mynethersdelight:toast_from_smoking",
        "mynethersdelight:toast_cooking",
        "mynethersdelight:toast_from_campfire_cooking",
        "mynethersdelight:crafting/sugar_alt"
    ])
    const {create, kubejs, farmersdelight, create_new_age} = e.recipes
    e.replaceInput({mod:"mynethersdelight"}, "mynethersdelight:roasted_sausage", "#forge:sausage/cooked")
    create.milling(
        "minecraft:gunpowder", 
        "mynethersdelight:powder_cannon"
    ).id("mynethersdelight:milling/powdery_cannon")
    kubejs.shapeless("mynethersdelight:letios_compost", [
        "2x vintagedelight:organic_mash",
        ["minecraft:soul_sand", "minecraft:soul_soil"],
        ["minecraft:crimson_roots", "minecraft:warped_roots"],
        ["minecraft:crimson_roots", "minecraft:warped_roots", "farmersdelight:straw"],
        "4x minecraft:bone_meal"
    ])
    .id("mynethersdelight:letios_compost_from_organic_mash")
    kubejs.shapeless("mynethersdelight:letios_compost", [
        ["minecraft:soul_sand", "minecraft:soul_soil"],
        "2x vintagedelight:organic_mash",
        "2x #netherexp:glowspores",
        "4x minecraft:bone_meal"
    ])
    .id("mynethersdelight:letios_compost_from_glowspores")
    kubejs.shapeless("mynethersdelight:letios_compost", [
        ["minecraft:soul_sand", "minecraft:soul_soil"],
        "2x minecraft:rotten_flesh",
        "2x #netherexp:glowspores",
        "4x minecraft:bone_meal"
    ])
    .id("mynethersdelight:letios_compost_from_glowspores_2")
    kubejs.shaped(
        'createdelight:wrapped_fries_ghasta',
        [
            " A ",
            " B "
        ], {
            A: "mynethersdelight:fries_ghasta",
            B: "minecraft:paper"
        }
    ).id("mynethersdelight:crafting/wrapped_fries_ghasta")
    e.recipes.farmersdelight.cooking(
        '#forge:eggs',
        'mynethersdelight:boiled_egg',
        1.0, 200
    ).id("mynethersdelight:boiled_egg_from_campfire_cooking")
    kubejs.shapeless(
        'mynethersdelight:nether_burger',
        [
            'some_assembly_required:burger_bun',
            "#mynethersdelight:cooked_hoglin",
            "#forge:vines/nether",
            "minecraft:crimson_fungus",
            "minecraft:warped_fungus"
        ]
    ).id("mynethersdelight:crafting/nether_burger")
    farmersdelight.cooking(
        [
            "mynethersdelight:boiled_egg",
            "#mynethersdelight:hot_spice",
            "#forge:meat/processed/raw/pork"
        ],
        '2x mynethersdelight:deviled_egg',
        1.0, 100
    ).id("mynethersdelight:cooking/deviled_egg")
    farmersdelight.cooking(
       [
        'create_bic_bit:eggball',
        'create_bic_bit:eggball',
        "#forge:meat/processed/raw/beef"
       ],
        'mynethersdelight:scotch_eggs',
        1.0, 100,
        "minecraft:bowl"
    ).id("mynethersdelight:cooking/scotch_eggs")
    farmersdelight.cooking(
       [
        "mynethersdelight:ghasmati",
        "#forge:milk",
        "#forge:eggs",
        "minecraft:blaze_powder"
       ],
       'mynethersdelight:sizzling_pudding',
       1.0, 100,
       "minecraft:bowl"
    ).id("mynethersdelight:crafting/sizzling_pudding")
    cutting_2(e, "mynethersdelight:ghasta_with_cream", [
        ["mynethersdelight:ghasta_with_cream", 1, 0.9],
        ["mynethersdelight:ghasta", 1]
    ])
{
    let iner = 'mynethersdelight:boiled_egg'
    create.sequenced_assembly('mynethersdelight:enchanted_golden_egg', iner,
        [
            create.filling(iner, [iner, Fluid.of("create_enchantment_industry:experience", 120)]),
            create.deploying(iner, [iner, "minecraft:gold_block"]),
            create.deploying(iner, [iner, "minecraft:gold_block"]),
            create_new_age.energising(iner, iner, 2000000)
        ]
    )
        .loops(4)
        .transitionalItem(iner)
        .id("mynethersdelight:crafting/enchanted_golden_egg")
}
{
    let iner = 'minecraft:carrot'
    create.sequenced_assembly('createdelight:enchanted_golden_carrot', iner, 
        [
            create.filling(iner, [iner, Fluid.of("create_enchantment_industry:experience", 8)]),
            create.deploying(iner, [iner, "minecraft:gold_ingot"]),
            create.deploying(iner, [iner, "minecraft:gold_ingot"]),
            create_new_age.energising(iner, iner, 100000)
        ]
    )
        .loops(4)
        .transitionalItem(iner)
        .id("createdelight:crafting/enchanted_golden_carrot")
}
    create.filling(
        'mynethersdelight:golden_egg',
        [
            'mynethersdelight:boiled_egg',
            Fluid.of("createmetallurgy:molten_gold", 450)
        ]
    ).id("createdelight:filling/golden_egg")
    create.filling(
        "2x mynethersdelight:ghasta",
        [
            "mynethersdelight:ghasta",
            Fluid.of("create:potion", 250, {Potion: "minecraft:healing"})
        ]
    ).id("mynethersdelight:filling/ghasta")
    create.filling(
        "2x mynethersdelight:ghasmati",
        [
            "mynethersdelight:ghasmati",
            Fluid.of("create:potion", 250, {Potion: "minecraft:healing"})
        ]
    ).id("mynethersdelight:filling/ghasmati")

    create.emptying(
        [
            Fluid.of("netherexp:ectoplasm", 250),
            "minecraft:bowl",
            "mynethersdelight:ghasta"
        ], 
        "mynethersdelight:plate_of_ghasta_with_cream"
    ).id("mynethersdelight:emptying/ghasta")
    create.mixing(
        'mynethersdelight:ghast_sourdough',
        [
            "mynethersdelight:ghast_dough",
            '3x bakeries:flour'
        ], 600, "heated"
    ).id("mynethersdelight:crafting/ghast_sourdough")
    create.cutting(
        '5x bakeries:sliced_toast',
        'mynethersdelight:bread_loaf'
    ).id("mynethersdelight:crafting/sliced_toast")
})