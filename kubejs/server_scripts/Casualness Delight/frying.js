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
            .heatRequirement("heated").id(`casualness_delight:animal_frying/${output.split(":")[1]}`)
            e.recipes.create_bic_bit.deep_frying(output, [Fluid.of("createdieselgenerators:plant_oil", 25), input])
            .heatRequirement("heated").id(`casualness_delight:plant_frying/${output.split(":")[1]}`)
        }
        else {
            e.custom({ type: "casualness_delight:deep_frying", ingredient: { item: input }, cookingtime: time, result: output })
                .id(`casualness_delight:deep_frying/${output.split(":")[1]}`)
            e.recipes.create.mixing(output, ["butchercraft:lard", input])
            .heatRequirement("heated").id(`casualness_delight:animal_frying/${output.split(":")[1]}`)
            e.recipes.create_bic_bit.deep_frying(output, [Fluid.of("createdieselgenerators:plant_oil", 25), input])
            .heatRequirement("heated").id(`casualness_delight:plant_frying/${output.split(":")[1]}`)
        }
    }

    remove_recipes_id(e, [
        "casualness_delight:crafting_shaped/deep_frying_pan",
        "create_deepfried:mixing/raw_chicken_nuggets",
        'dungeonsdelight:fried_ghast_calamari_from_smoking'
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
    deep_frying("casualness_delight:fried_fish", 'createdelightcore:unfried_fish', 100)
    deep_frying("casualness_delight:tonkatsu", 'createdelightcore:unfried_tonkatsu', 100)
    deep_frying("casualness_delight:fried_chicken_chip", 'createdelightcore:unfried_chicken_chip', 100)
    deep_frying("casualness_delight:spring_roll", "casualness_delight:raw_spring_roll", 100)
    deep_frying("casualness_delight:fried_dumpling", "casualness_delight:raw_fried_dumpling", 100)
    deep_frying("create_bic_bit:fries", "create_bic_bit:raw_fries", 100)
    deep_frying('frycooks_delight:fried_potato', 'createdelightcore:unfried_potato', 100)
    deep_frying('frycooks_delight:fried_chicken_leg', 'createdelightcore:unfried_chicken_leg', 100)
    deep_frying('create_deepfried:donut', 'create_deepfried:raw_donut', 100)
    deep_frying('create_deepfried:onion_rings', 'create_deepfried:raw_onion_rings', 100)
    deep_frying('create_bic_bit:cheese_souffle', 'create_bic_bit:raw_cheese_souffle', 100)
    deep_frying('create_bic_bit:kroket', 'create_bic_bit:raw_kroket', 100)
    deep_frying('create_bic_bit:eggball', 'create_bic_bit:raw_eggball', 100)
    deep_frying('create_bic_bit:frikandel', 'create_bic_bit:raw_frikandel', 100)
    // TODO：直接加上会导致配方id冲突，因为原本输入产物写的有误就没生效，所以干脆先注释掉后面再修
    // deep_frying('create_bic_bit:fries', 'casualness_delight:potato_slice', 100)
    deep_frying('create_bic_bit:churros', 'create_bic_bit:raw_churros', 100)
    deep_frying('create_deepfried:panzerotto', 'create_deepfried:raw_panzerotto', 100)
    deep_frying('create_deepfried:blooming_onion', 'farmersdelight:onion', 100)
    deep_frying('create_deepfried:fried_chicken', 'minecraft:chicken', 100)
    deep_frying('create_deepfried:yuca_fries', 'createcafe:cassava_root', 100)
    deep_frying('create_deepfried:apfelkuchle', 'some_assembly_required:apple_slices', 100)
    deep_frying('create_deepfried:tempura', 'create_deepfried:raw_tempura', 100)
    deep_frying('create_deepfried:berliner', 'create_bic_bit:sweet_dough', 100)
    deep_frying('create_deepfried:deepfried_chocolate_bar', 'create:bar_of_chocolate', 100)
    deep_frying('create_deepfried:calamari', 'createdelightcore:unfried_calamari', 100)
    deep_frying('create_bic_bit:bitterballen', 'create_bic_bit:raw_bitterballen', 100)
    deep_frying('create_bic_bit:oliebollen', 'ratatouille:salty_dough', 100)
    deep_frying('youkaishomecoming:oily_bean_curd', 'youkaishomecoming:tofu', 100)
    deep_frying('oceanic_delight:fried_shrimp', "createdelightcore:unfried_shrimp", 100)
    deep_frying('create_bic_bit:enderball', 'minecraft:ender_pearl', 100)
    deep_frying('create_deepfried:corn_dog', 'create_deepfried:raw_corn_dog', 100)
    deep_frying('mynethersdelight:fries_ghasta', 'mynethersdelight:ghasta', 100)
    deep_frying('dungeonsdelight:fried_ghast_calamari', 'createdelight:raw_ghast_calamari', 100)
    deep_frying('cosmopolitan:potato_pancakes', 'cosmopolitan:cut_potatoes', 100)
    deep_frying('create_deepfried:arancini', 'create_deepfried:raw_arancini', 100)
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
    e.recipes.farmersdelight.cooking(
        [
            "mynethersdelight:hoglin_loin",
            "#forge:dough",
            "#forge:milk",
            "#forge:eggs",
            "#mynethersdelight:hot_spice"
        ],
        'mynethersdelight:fried_hoglin_chop',
        1.0, 400
    ).id("mynethersdelight:cooking/fried_hoglin_chop")
    // 生大炸饺
    e.replaceInput({id: "casualness_delight:crafting_shaped/raw_fried_dumpling"}, "minecraft:porkchop", "#forge:meat/raw")
    // 生炸鸡，炸鱼，炸猪排
    e.recipes.create.mixing(
        'createdelightcore:unfried_fish',
        [
            "#minecraft:fishes",
            'bakeries:flour',
            FluidIngredients("forge:egg_yolk", 100)
        ]
    ).id("createdelight:mixing/raw_fish")
    e.recipes.create.mixing(
        'createdelightcore:unfried_tonkatsu',
        [
            'minecraft:porkchop',
            'bakeries:flour',
            FluidIngredients("forge:egg_yolk", 100)
        ]
    ).id("createdelight:mixing/raw_tonkatsu")
    e.recipes.create.mixing(
        'createdelightcore:unfried_chicken_chip',
        [
            'butchercraft:chicken_breast',
            'bakeries:flour',
            FluidIngredients("forge:egg_yolk", 100)
        ]
    ).id("createdelight:mixing/raw_chicken_chip")
    e.recipes.create.mixing(
        'createdelight:raw_ghast_calamari',
        [
            'dungeonsdelight:ghast_calamari',
            'bakeries:flour',
            FluidIngredients("forge:egg_yolk", 100)
        ]
    ).id("createdelight:mixing/raw_ghast_calamari")
    // 玉米热狗
    e.recipes.create.mixing(
        "create_deepfried:raw_corn_dog",
        [
            "minecraft:stick",
            '#forge:sausage/raw',
            "createdelight:corn_flour",
            Fluid.of("minecraft:water", 50)
        ]
    ).id("create_deepfried:mixing/raw_corn_dog")
})