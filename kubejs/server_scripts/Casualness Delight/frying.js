ServerEvents.recipes(e => {
    /**
     * @param { InputItem_ } input 
     * @param { OutputItem_ } output 
     * @param { number } time 
     */
    function deep_frying(output, input, time){
        if(input[0] == "#") {
            e.custom({type: "casualness_delight:deep_frying", ingredient: {tag: input.slice(1)}, cookingtime: time, result: output})
                .id(`casualness_delight:deep_frying/${output.split(":")[1]}`)
            e.recipes.create.mixing(output, ['butchercraft:lard', input])
                .heated().id(`casualness_delight:mix_animal_frying/${output.split(":")[1]}`)
            e.recipes.create.mixing(output, [Fluid.of("createdieselgenerators:plant_oil", 50), input])
                .heated().id(`casualness_delight:mix_plant_frying/${output.split(":")[1]}`)
        }
        else {
            e.custom({type: "casualness_delight:deep_frying", ingredient: {item: input}, cookingtime: time, result: output})
                .id(`casualness_delight:deep_frying/${output.split(":")[1]}`)
            e.recipes.create.mixing(output, ['butchercraft:lard', input])
                .heated().id(`casualness_delight:mix_animal_frying/${output.split(":")[1]}`)
            e.recipes.create.mixing(output, [Fluid.of("createdieselgenerators:plant_oil", 50), input])
                .heated().id(`casualness_delight:mix_plant_frying/${output.split(":")[1]}`)
        }
    }

    remove_recipes_id(e, [
        "casualness_delight:crafting_shaped/deep_frying_pan"
    ])

    // 油炸锅
    e.recipes.minecraft.crafting_shaped(
        'casualness_delight:deep_frying_pan', [
            "AB ",
            "CDC",
            "CCC"
        ], {
            A:"minecraft:brick",
            B:"minecraft:iron_bars",
            C:'#forge:plates/iron',
            D:"butchercraft:lard"
        }
    ).id("casualness_delight:crafting_shaped_animal/deep_frying_pan")
    e.recipes.minecraft.crafting_shaped(
        'casualness_delight:deep_frying_pan', [
            "AB ",
            "CDC",
            "CCC"
        ], {
            A:"minecraft:brick",
            B:"minecraft:iron_bars",
            C:'#forge:plates/iron',
            D:'createdieselgenerators:plant_oil_bucket'
        }
    ).id("casualness_delight:crafting_shaped_plant/deep_frying_pan")
    // 炸
    deep_frying('casualness_delight:potato_chip', "casualness_delight:potato_slice", 100)
    deep_frying("casualness_delight:fried_fish","#minecraft:fishes", 100)
    deep_frying('casualness_delight:tonkatsu', 'minecraft:porkchop', 100)
    deep_frying('casualness_delight:fried_chicken_chip', 'farmersdelight:chicken_cuts', 100)
    deep_frying('casualness_delight:spring_roll', 'casualness_delight:raw_spring_roll', 100)
    deep_frying('casualness_delight:fried_dumpling', 'casualness_delight:raw_fried_dumpling', 100)
    deep_frying("createdelight:french_fries", "createdelight:potato_sticks", 100)
    e.recipes.kubejs.shapeless(
        'casualness_delight:fish_and_chips',
        [
            'vintagedelight:salt_dust',
            'casualness_delight:fried_fish',
            '2x createdelight:french_fries',
            'minecraft:bowl'
        ]
    ).id("casualness_delight:cooking/fish_and_chips")
    deep_frying('culturaldelights:empanada', 'createdelight:raw_empanada', 100)
    // 生暴辣疣猪兽排
    e.recipes.kubejs.shapeless(
        'createdelight:raw_hoglin_chop',
        [
            'mynethersdelight:hoglin_loin',
            "#forge:dough",
            '#forge:milk',
            '#forge:eggs',
            'mynethersdelight:bullet_pepper',
            "minecraft:bowl"
        ]
    ).id("mynethersdelight:cooking/fried_hoglin_chop")
    deep_frying('mynethersdelight:fried_hoglin_chop', 'createdelight:raw_hoglin_chop', 100)
})