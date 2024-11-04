ServerEvents.recipes(e => {
    /**
     * @param { InputItem_ } input 
     * @param { OutputItem_ } output 
     * @param { number } time 
     */
    function deep_frying(output, input, time) {
        if (input[0] == "#") {
            e.custom({ type: "casualness_delight:deep_frying", ingredient: { tag: input.slice(1) }, cookingtime: time, result: output })
                .id(`casualness_delight:deep_frying/${output.split(":")[1]}`)
            e.recipes.create.mixing(output, ["butchercraft:lard", input])
            .heatRequirement("superheated").id(`casualness_delight:animal_frying/${output.split(":")[1]}`)
            e.recipes.create_bic_bit.deep_frying(output, [Fluid.of("createdieselgenerators:plant_oil", 125), input])
            .heatRequirement("heated").id(`casualness_delight:plant_frying/${output.split(":")[1]}`)
        }
        else {
            e.custom({ type: "casualness_delight:deep_frying", ingredient: { item: input }, cookingtime: time, result: output })
                .id(`casualness_delight:deep_frying/${output.split(":")[1]}`)
            e.recipes.create.mixing(output, ["butchercraft:lard", input])
            .heatRequirement("superheated").id(`casualness_delight:animal_frying/${output.split(":")[1]}`)
            e.recipes.create_bic_bit.deep_frying(output, [Fluid.of("createdieselgenerators:plant_oil", 125), input])
            .heatRequirement("heated").id(`casualness_delight:plant_frying/${output.split(":")[1]}`)
        }
    }

    remove_recipes_id(e, [
        "casualness_delight:crafting_shaped/deep_frying_pan"
    ])

    // 油炸锅
    e.recipes.minecraft.crafting_shaped(
        "casualness_delight:deep_frying_pan", [
        "AB ",
        "CDC",
        "CCC"
    ], {
        A: "minecraft:brick",
        B: "minecraft:iron_bars",
        C: "#forge:plates/iron",
        D: "#forge:animal_oil"
    }
    ).id("casualness_delight:crafting_shaped_animal/deep_frying_pan")
    e.recipes.minecraft.crafting_shaped(
        "casualness_delight:deep_frying_pan", [
        "AB ",
        "CDC",
        "CCC"
    ], {
        A: "minecraft:brick",
        B: "minecraft:iron_bars",
        C: "#forge:plates/iron",
        D: "createdieselgenerators:plant_oil_bucket"
    }
    ).id("casualness_delight:crafting_shaped_plant/deep_frying_pan")
    // 炸
    deep_frying("casualness_delight:potato_chip", "casualness_delight:potato_slice", 100)
    deep_frying("casualness_delight:fried_fish", "#minecraft:fishes", 100)
    deep_frying("casualness_delight:tonkatsu", "minecraft:porkchop", 100)
    deep_frying("casualness_delight:fried_chicken_chip", "farmersdelight:chicken_cuts", 100)
    deep_frying("casualness_delight:spring_roll", "casualness_delight:raw_spring_roll", 100)
    deep_frying("casualness_delight:fried_dumpling", "casualness_delight:raw_fried_dumpling", 100)
    deep_frying("create_bic_bit:fries", "create_bic_bit:raw_fries", 100)
    deep_frying('frycooks_delight:fried_potato', 'minecraft:potato', 100)
    deep_frying('frycooks_delight:plain_donut', 'farmersdelight:wheat_dough', 100)
    deep_frying('frycooks_delight:fried_onion_ring', 'some_assembly_required:sliced_onion', 100)
    deep_frying('create_bic_bit:cheese_souffle', 'create_bic_bit:raw_cheese_souffle', 100)
    deep_frying('create_bic_bit:kroket', 'create_bic_bit:raw_kroket', 100)
    deep_frying('create_bic_bit:eggball', 'create_bic_bit:raw_eggball', 100)
    deep_frying('create_bic_bit:frikandel', 'create_bic_bit:raw_frikandel', 100)
    deep_frying('create_bic_bit:fries', 'potato_slice', 100)
    deep_frying('create_bic_bit:churros', 'create_bic_bit:raw_churros', 100)
    deep_frying('create_deepfried:panzerotto', 'create_deepfried:raw_panzerotto', 100)
    deep_frying('create_deepfried:blooming_onion', 'farmersdelight:onion', 100)
    deep_frying('create_deepfried:fried_chicken', 'minecraft:chicken', 100)
    deep_frying('create_deepfried:yuca_fries', 'createcafe:cassava_root', 100)
    deep_frying('create_deepfried:apfelkuchle', 'some_assembly_required:apple_slices', 100)
    deep_frying('create_deepfried:tempura', 'create_deepfried:raw_tempura', 100)
    deep_frying('create_deepfried:berliner', 'create_bic_bit:sweet_dough', 100)
    deep_frying('create_deepfried:deepfried_chocolate_bar', 'create:bar_of_chocolate', 100)
    deep_frying('oceansdelight:squid_rings', 'oceansdelight:cut_tentacles', 100)
    deep_frying('create_bic_bit:bitterballen', 'create_bic_bit:raw_bitterballen', 100)
    deep_frying('create_bic_bit:oliebollen', 'ratatouille:salty_dough', 100)
    e.recipes.kubejs.shapeless(
        "casualness_delight:fish_and_chips",
        [
            "vintagedelight:salt_dust",
            "casualness_delight:fried_fish",
            "2x create_bic_bit:fries",
            "minecraft:bowl"
        ]
    ).id("casualness_delight:cooking/fish_and_chips")
    deep_frying("culturaldelights:empanada", "createdelight:raw_empanada", 100)
    // 生暴辣疣猪兽排
    e.recipes.kubejs.shapeless(
        "createdelight:raw_hoglin_chop",
        [
            "mynethersdelight:hoglin_loin",
            "#forge:dough",
            "#forge:milk",
            "#forge:eggs",
            "#mynethersdelight:hot_spice",
            "minecraft:bowl"
        ]
    ).id("mynethersdelight:cooking/fried_hoglin_chop")
    deep_frying("mynethersdelight:fried_hoglin_chop", "createdelight:raw_hoglin_chop", 100)
    // 生大炸饺
    e.replaceInput({id: "casualness_delight:crafting_shaped/raw_fried_dumpling"}, "minecraft:porkchop", "#forge:meat/raw")
})