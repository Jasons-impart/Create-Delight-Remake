ServerEvents.tags("item", e => {
    //腌渍乐事种子添加种子tag
    e.add("forge:seeds", "vintagedelight:oat_seeds")
    e.add("forge:seeds", "vintagedelight:peanut")
    e.add("forge:seeds", "vintagedelight:cucumber_seeds")
    e.add("forge:seeds", "vintagedelight:ghost_pepper_seeds")
})
ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "vintagedelight:cutting/cucumber_cutting",
        "culturaldelights:cutting/cut_cucumber",
    ])
    e.replaceOutput({id: "vintagedelight:fermenting/fermented_spider_eye_from_fermenting"}, "vintagedelight:pickle", "minecraft:fermented_spider_eye")
    e.replaceInput({}, 'farmersdelight:raw_pasta', "#forge:pasta")
    e.replaceInput({id: "vintagedelight:cooking/pad_thai"}, "#forge:pasta", 'createdelight:vermicelli')
    cutting_2(e, "brewinandchewin:flaxen_cheese_wheel", [["ad_astra:cheese", 4]])
    // 燕麦磨粉
    e.recipes.create.milling(
        Item.of("bakeries:flour").withChance(0.5),
        'vintagedelight:raw_oats'
    ).id("vintagedelight:integration/bakeries/milling/flour")
    // 腊肠
    e.recipes.vintagedelight.fermenting(
        "5x createdelight:salami",
        [
            "ratatouille:raw_sausage",
            "ratatouille:raw_sausage",
            "ratatouille:raw_sausage",
            "ratatouille:raw_sausage",
            "ratatouille:raw_sausage",
            "#forge:salt"
        ], 5000
    ).id("vintagedelight:fermenting/salami")
    // 黄瓜
    remove_recipes_id(e, [
        "culturaldelights:cucumber_crate",
        "culturaldelights:from_crate/cucumber",
    ])
    e.recipes.kubejs.shapeless(
        "vintagedelight:cucumber_crate",
        "9x vintagedelight:cucumber"
    ).id("vintagedelight:cucumber_crate")
    e.recipes.vintagedelight.fermenting(
        "5x culturaldelights:pickle",
        [
            "vintagedelight:cucumber",
            "vintagedelight:cucumber",
            "vintagedelight:cucumber",
            "vintagedelight:cucumber",
            "vintagedelight:cucumber",
            "#forge:salt"
        ], 6000
    ).id("vintagedelight:fermenting/pickle_from_fermenting")
    e.recipes.vintagedelight.fermenting(
        "5x culturaldelights:cut_pickle",
        [
            "culturaldelights:cut_cucumber",
            "culturaldelights:cut_cucumber",
            "culturaldelights:cut_cucumber",
            "culturaldelights:cut_cucumber",
            "culturaldelights:cut_cucumber",
            "#forge:salt"
        ], 3000
    ).id("vintagedelight:fermenting/cut_pickle_from_fermenting")
    cutting(e, "culturaldelights:cut_cucumber", [["vintagedelight:cucumber_noodles"]])
    // 盐
    e.recipes.create.mixing(
        Fluid.of("bakeries:salt_water", 250),
        [
            Fluid.of("water", 250),
            "vintagedelight:salt_dust"
        ]
    )
        .id("vintagedelight:salt_dust")
    e.recipes.create.mixing(
        "vintagedelight:salt_dust",
        Fluid.of("bakeries:salt_water", 250)
    )
        .heated()
        .id("vintagedelight:salt_water2salt_dust")
    e.recipes.minecraft.smelting(
        "vintagedelight:salt_bucket",
        'bakeries:salt_water_bucket',
        0.7,
        200
    ).id("vintagedelight:salt_from_smelting")
    e.recipes.kubejs.shapeless(
        "4x vintagedelight:salt_dust",
        "vintagedelight:salt_bucket"
    ).id("vintagedelight:salt_bucket_to_salt")
    // 腌制
    e.recipes.vintagedelight.fermenting(
        "5x vintagedelight:surstromming",
        [
            'create_bic_bit:raw_herring',
            'create_bic_bit:raw_herring',
            'create_bic_bit:raw_herring',
            'create_bic_bit:raw_herring',
            'create_bic_bit:raw_herring',
            "#forge:salt"
        ], 2500
    ).id("vintagedelight:fermenting/surstromming_from_fermenting")
    e.recipes.vintagedelight.fermenting(
        "5x vintagedelight:salted_cod",
        [
            'minecraft:cod',
            'minecraft:cod',
            'minecraft:cod',
            'minecraft:cod',
            'minecraft:cod',
            "#forge:salt"
        ], 2500
    ).id("vintagedelight:salted_cod")
    e.recipes.vintagedelight.fermenting(
        "5x vintagedelight:salted_salmon",
        [
            'minecraft:salmon',
            'minecraft:salmon',
            'minecraft:salmon',
            'minecraft:salmon',
            'minecraft:salmon',
            "#forge:salt"
        ], 2500
    ).id("vintagedelight:salted_salmon")
    e.recipes.vintagedelight.fermenting(
        "5x festival_delicacies:preserved_meat",
        [
            "#forge:raw_pork",
            "#forge:raw_pork",
            "#forge:raw_pork",
            "#forge:raw_pork",
            "#forge:raw_pork",
            "#forge:salt"
        ], 5000
    ).id("vintagedelight:fermenting/preserved_meat")
    e.recipes.vintagedelight.fermenting(
        "vintagedelight:century_egg",
        [
            "minecraft:sniffer_egg",
            "#forge:ash",
            "#forge:salt"
        ], 72000
    ).id("vintagedelight:fermenting/century_egg_from_fermenting")
    e.recipes.vintagedelight.fermenting(
        "vintagedelight:century_egg",
        [
            "#forge:dragonegg",
            "#forge:ash",
            "#forge:salt"
        ], 72000
    ).id("vintagedelight:fermenting/century_egg_from_dragonegg")
    e.recipes.vintagedelight.fermenting(
        "vintagedelight:century_egg",
        [
            "alexsmobs:emu_egg",
            "#forge:ash",
            "#forge:salt"
        ], 72000
    ).id("vintagedelight:fermenting/century_egg_from_emu_egg")
    e.custom({
        "type": "vintagedelight:fermenting",
        "processingTime": 5000,
        "ingredients": [
            { "tag": "createdelight:cabbage_leaves" },
            { "tag": "createdelight:cabbage_leaves" },
            { "tag": "createdelight:cabbage_leaves" },
            { "tag": "createdelight:cabbage_leaves" },
            { "tag": "forge:salt" },
            { "tag": "forge:chilipepper" }
        ],
        "output": {
            "count": 4,
            "item": "vintagedelight:kimchi"
        },
        "secondaryOutput": {
            "item": "vintagedelight:pickled_pepper"
        }
    }).id("vintagedelight:fermenting/kimchi_from_fermenting")
    // 花生奶兼容
    e.recipes.create.emptying(
        [
            Fluid.of("createdelight:nut_milk", 250),
            "minecraft:glass_bottle"
        ], 
        "vintagedelight:nut_milk_bottle"
    ).id("create:emptying/compat/vintagedelight/nut_milk_bottle")
    e.recipes.create.filling(
        "vintagedelight:nut_milk_bottle",
        [
            Fluid.of("createdelight:nut_milk", 250),
            "minecraft:glass_bottle"
        ]
    ).id("create:filling/compat/vintagedelight/nut_milk_bottle")
    e.recipes.kubejs.shapeless(
        'createdelight:nut_milk_bucket',
        [
            "4x vintagedelight:nut_milk_bottle",
            "minecraft:bucket"
        ]
    ).id("vintagedelight:nut_milk_bucket_from_bottles").replaceIngredient("vintagedelight:nut_milk_bottle", "minecraft:glass_bottle")
    e.recipes.kubejs.shapeless(
        "4x vintagedelight:nut_milk_bottle",
        [
            'createdelight:nut_milk_bucket',
            "4x minecraft:glass_bottle"
        ]
    ).id("vintagedelight:nut_milk_bottle").replaceIngredient("createdelight:nut_milk_bucket", "minecraft:bucket")
    e.recipes.create.mixing(
        Fluid.of("createdelight:nut_milk", 250),
        [
            "2x vintagedelight:peanut",
            "minecraft:sugar"
        ]
    ).heated().id("vintagedelight:mixing/nut_milk")

    e.recipes.create.filling("vintagedelight:vinegar_bottle", ["minecraft:glass_bottle", Fluid.of("createdelight:vinegar", 250)])
    .id("create:filling/compat/vintagedelight/vinegar_bottle")
    e.recipes.create.filling("vintagedelight:vinegar_mason_jar", ["vintagedelight:mason_jar", Fluid.of("createdelight:vinegar", 750)])
    .id("create:filling/compat/vintagedelight/vinegar_jar")
    e.recipes.create.emptying(["minecraft:glass_bottle", Fluid.of("createdelight:vinegar", 250)], "vintagedelight:vinegar_bottle")
    .id("create:filling/emptying/vintagedelight/vinegar_bottle")
    e.recipes.create.emptying(["vintagedelight:mason_jar", Fluid.of("createdelight:vinegar", 750)], "vintagedelight:vinegar_mason_jar")
    .id("create:filling/emptying/vintagedelight/vinegar_jar")

        
    e.recipes.vintagedelight.fermenting("3x alexscaves:carmine_froglight", [
        "minecraft:slime_block",
        "minecraft:slime_block",
        "alexscaves:amber_curiosity",
        "#forge:dusts/redstone",
        "vintagedelight:salt_block",
        "vintagedelight:vinegar_bottle"
    ])
    .secondaryOutput("minecraft:glass_bottle")
    .processingTime(2400)
    .id("vintagedelight:fermenting/carmine_froglight_from_fermenting")
    fermenting(e,"2x minecraft:ochre_froglight", [
        Fluid.of("createdelightcore:slime", 810),
        "minecraft:blaze_powder",
        "minecraft:magma_cream",
        "vintagedelight:salt_block",
        Fluid.of("createdelight:vinegar", 250)
    ])

    fermenting(e,"2x minecraft:pearlescent_froglight", [
        Fluid.of("createdelightcore:slime", 810),
        'minecraft:prismarine_crystals',
        'minecraft:sea_pickle',
        "vintagedelight:salt_block",
        Fluid.of("createdelight:vinegar", 250)
    ])
    
    fermenting(e,"2x minecraft:verdant_froglight", [
        Fluid.of("createdelightcore:slime", 810),
        "#forge:dusts/glowstone",
        "minecraft:glow_berries",
        "vintagedelight:salt_block",
        Fluid.of("createdelight:vinegar", 250)
    ])
    
    fermenting(e,"2x minecraft:pearlescent_froglight", [
        Fluid.of("createdelightcore:slime", 810),
        "minecraft:prismarine_crystal",
        "minecraft:sea_pickle",
        "vintagedelight:salt_block",
        Fluid.of("createdelight:vinegar", 250)
    ])
    
    fermenting(e,"2x alexscaves:carmine_froglight", [
        Fluid.of("createdelightcore:slime", 810),
        "#forge:dusts/redstone",
        "alexscaves:amber_curiosity",
        "vintagedelight:salt_block",
        Fluid.of("createdelight:vinegar", 250)
    ])
})
