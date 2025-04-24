ServerEvents.recipes(e => {
    /**
     * 
     * @param {Internal.RecipesEventJS} e 
     * @param {InputItem_} input
     * @param {OutputItem_} output 
     */
    function cutting_roll(e, input, output) {
        e.recipes.create.cutting(Item.of(output, 3), input)
            .id(`createdelight:cutting/${output.split(":")[1]}`)
    }
    /**
     * 
     * @param {Internal.RecipesEventJS} e 
     * @param {InputItem_} input 
     * @param {OutputItem_} output 
     */
    function sushi_with_kelp(e, input, output) {
        let iner = "minecraft:dried_kelp"
        e.recipes.create.sequenced_assembly(output, iner, [
            e.recipes.create.deploying(iner, [iner, input]),
            e.recipes.create.deploying(iner, [iner, "createdelight:empty_riceball"])
        ])
            .transitionalItem("createdelight:sushi_unrolledroll")
            .loops(1)
            .id(`createdelight:sequenced_assembly/${output.split(":")[1]}`)
    }
    /**
     * 
     * @param {Internal.RecipesEventJS} e 
     * @param {InputItem_} input 
     * @param {OutputItem_} output 
     */
    function sushi(e, input, output) {
        e.recipes.create.deploying(output, ["createdelight:empty_riceball", input])
            .id(`createdelight:deploying/${output.split(":")[1]}`)
    }

    /**
     * 
     * @param {Internal.RecipesEventJS} e 
     * @param {InputItem_} iner 
     * @param {InputItem_} base 
     * @param {InputItem_} cover 
     * @param {OutputItem_} output 
     */
    function sushi_roll(e, iner, base, cover, output) {
        let recipes = []

        cover.forEach(item => {
            recipes.push(e.recipes.create.deploying(iner, [iner, item]))
        })
        recipes.push(e.recipes.create.deploying(iner, [iner, "createdelight:empty_riceball"]))
        recipes.push(e.recipes.create.deploying(iner, [iner, base]))
        e.recipes.create.sequenced_assembly(output, iner, recipes)
            .transitionalItem("createdelight:sushi_unrolledroll")
            .loops(1)
            .id(`createdelight:sequenced_assembly/${output.split(":")[1]}`)
    }
    e.replaceInput({}, "farmersdelight:cooked_rice", "createdelight:empty_riceball")
    e.recipes.kubejs.shapeless("createdelight:empty_riceball", "farmersdelight:cooked_rice")
        .replaceIngredient({ item: "farmersdelight:cooked_rice" }, "minecraft:bowl")
        .id("createdelight:empty_riceball_from_cooked_rice")
    e.recipes.kubejs.shapeless("farmersdelight:cooked_rice", ["createdelight:empty_riceball", "minecraft:bowl"])
        .id("createdelight:cooked_rice_from_empty_riceball")
    e.recipes.minecraft.smoking("createdelight:empty_riceball", "farmersdelight:rice")
        .id("createdelight:empty_riceball_from_rice")
    cutting_roll(e, "culturaldelights:midori_roll", "culturaldelights:midori_roll_slice")
    cutting_roll(e, "culturaldelights:chicken_roll", "culturaldelights:chicken_roll_slice")
    cutting_roll(e, "farmersdelight:kelp_roll", "farmersdelight:kelp_roll_slice")
    cutting_roll(e, "silentsdelight:sculk_sensor_tendril_roll", "silentsdelight:sculk_sensor_tendril_roll_slice")
    cutting_roll(e, "oceanic_delight:sea_pickle_roll", "oceanic_delight:sea_pickle_roll_slice")
    cutting_roll(e, "oceanic_delight:fish_egg_roll", "oceanic_delight:fish_egg_roll_slice")
    sushi(e, "crabbersdelight:pufferfish_slice", "2x culturaldelights:pufferfish_roll")
    sushi(e, "crabbersdelight:cooked_pufferfish_slice", "2x createdelight:fugu_roll")
    sushi(e, "farmersdelight:salmon_slice", "2x farmersdelight:salmon_roll")
    sushi(e, "farmersdelight:cod_slice", "2x farmersdelight:cod_roll")
    sushi(e, "#forge:raw_clam", "2x collectorsreap:clam_roll")
    sushi(e, "cavedelight:raw_trilocaris_slice", "2x cavedelight:trilocaris_roll")
    sushi_with_kelp(e, "collectorsreap:uni", "2x collectorsreap:uni_roll")
    sushi_with_kelp(e, "crabbersdelight:tropical_fish_slice", "2x culturaldelights:tropical_roll")
    sushi_with_kelp(e, "#forge:cooked_eggs", "2x culturaldelights:egg_roll")
    sushi_with_kelp(e, "#forge:tentacles", "2x culturaldelights:calamari_roll")
    sushi_with_kelp(e, "oceanic_delight:shrimp_slices", "2x oceanic_delight:shrimp_roll")
    sushi_with_kelp(e, "youkaishomecoming:flesh", "2x youkaishomecoming:flesh_roll")
    sushi_roll(e, "minecraft:dried_kelp", "minecraft:dried_kelp", ["#forge:cucumber", "#culturaldelights:avocados"], "culturaldelights:midori_roll")
    sushi_roll(e, "minecraft:dried_kelp", "minecraft:dried_kelp", ["#forge:cooked_chicken", "minecraft:beetroot"], "culturaldelights:chicken_roll")
    sushi_roll(e, "minecraft:dried_kelp", "minecraft:dried_kelp", ["minecraft:carrot"], "farmersdelight:kelp_roll")
    sushi_roll(e, "minecraft:dried_kelp", "minecraft:dried_kelp", ["createdelight:empty_riceball", "oceanic_delight:salmon_eggs"], "oceanic_delight:fish_egg_roll")
    sushi_roll(e, "minecraft:dried_kelp", "#forge:sea_pickles", ["#forge:tentacles"], "oceanic_delight:sea_pickle_roll")
    sushi_roll(e, "silentsdelight:sculk_sensor_tendril", "silentsdelight:sculk_sensor_tendril", ["minecraft:carrot"], "silentsdelight:sculk_sensor_tendril_roll")
})