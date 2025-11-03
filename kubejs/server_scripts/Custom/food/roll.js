ServerEvents.recipes(e => {
    /**
     * 
     * @param {InputItem_} input
     * @param {OutputItem_} output 
     */
    function cutting_roll(input, output) {
        e.recipes.create.cutting(Item.of(output, 3), input)
            .id(`createdelight:cutting/${output.split(":")[1]}`)
    }
    /**
     * 
     * @param {InputItem_} input 
     * @param {OutputItem_} output 
     */
    function sushi_with_kelp(input, output) {
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
     * @param {InputItem_} input 
     * @param {OutputItem_} output 
     */
    function sushi(input, output) {
        e.recipes.create.deploying(output, ["createdelight:empty_riceball", input])
            .id(`createdelight:deploying/${output.split(":")[1]}`)
    }

    /**
     * 
     * @param {InputItem_} iner 
     * @param {InputItem_} base 
     * @param {InputItem_} cover 
     * @param {OutputItem_} output 
     */
    function sushi_roll(iner, base, cover, output) {
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

    cutting_roll("culturaldelights:midori_roll", "culturaldelights:midori_roll_slice")
    cutting_roll("culturaldelights:chicken_roll", "culturaldelights:chicken_roll_slice")
    cutting_roll("farmersdelight:kelp_roll", "farmersdelight:kelp_roll_slice")
    cutting_roll("silentsdelight:sculk_sensor_tendril_roll", "silentsdelight:sculk_sensor_tendril_roll_slice")
    cutting_roll("oceanic_delight:sea_pickle_roll", "oceanic_delight:sea_pickle_roll_slice")

    sushi("crabbersdelight:pufferfish_slice", "2x culturaldelights:pufferfish_roll")
    sushi("crabbersdelight:cooked_pufferfish_slice", "2x createdelight:fugu_roll")
    sushi("farmersdelight:salmon_slice", "2x farmersdelight:salmon_roll")
    sushi("farmersdelight:cod_slice", "2x farmersdelight:cod_roll")
    sushi("#forge:raw_clam", "2x collectorsreap:clam_roll")
    sushi("cavedelight:raw_trilocaris_slice", "2x cavedelight:trilocaris_roll")
    sushi("#forge:raw_fishes/tuna", "2x youkaishomecoming:tuna_nigiri")
    sushi("youkaishomecoming:otoro", "2x youkaishomecoming:otoro_nigiri")
    sushi("#forge:tropical", "2x culturaldelights:tropical_roll")

    sushi_with_kelp("collectorsreap:uni", "2x collectorsreap:uni_roll")
    sushi_with_kelp("#forge:roe", "2x youkaishomecoming:tobiko_gunkan")
    sushi_with_kelp("minecraft:seagrass", '2x youkaishomecoming:seagrass_gunkan')
    sushi_with_kelp("youkaishomecoming:nattou", '2x youkaishomecoming:nattou_gunkan')
    sushi_with_kelp("youkaishomecoming:kabayaki", '2x youkaishomecoming:lorelei_nigiri')
    sushi_with_kelp('youkaishomecoming:tamagoyaki', "2x youkaishomecoming:egg_nigiri")
    sushi_with_kelp("#oceanic_delight:squid_tentacles", "2x culturaldelights:calamari_roll")
    sushi_with_kelp("youkaishomecoming:flesh", "2x youkaishomecoming:flesh_roll")
    sushi_with_kelp("#forge:shrimps", "2x oceanic_delight:shrimp_roll")

    sushi_roll("minecraft:dried_kelp", "minecraft:dried_kelp", ["#forge:cucumber", "#culturaldelights:avocados"], "culturaldelights:midori_roll")
    sushi_roll("minecraft:dried_kelp", "minecraft:dried_kelp", ["#forge:cooked_chicken", "minecraft:beetroot"], "culturaldelights:chicken_roll")
    sushi_roll("minecraft:dried_kelp", "minecraft:dried_kelp", ["minecraft:carrot"], "farmersdelight:kelp_roll")
    sushi_roll("minecraft:dried_kelp", "#forge:sea_pickles", ["#forge:tentacles"], "oceanic_delight:sea_pickle_roll")
    sushi_roll("silentsdelight:sculk_sensor_tendril", "silentsdelight:sculk_sensor_tendril", ["minecraft:carrot"], "silentsdelight:sculk_sensor_tendril_roll")
})