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
    function sushi(input, output) {
        e.recipes.create.deploying(output, ["createdelight:empty_riceball", input])
            .id(`createdelight:deploying/sushi/${output.split(":")[1]}`)
    }
    /**
     * 
     * @param {InputItem_} input 
     * @param {OutputItem_} output 
     */
    function gunkan(input, output) {
        let iner = "createdelight:incomplete_gunkan"
        e.recipes.create.sequenced_assembly(output, "createdelight:empty_riceball", [
            e.recipes.create.deploying(iner, [iner, input]),
            e.recipes.create.deploying(iner, [iner, "minecraft:dried_kelp"])
        ])
            .transitionalItem(iner)
            .loops(1)
            .id(`createdelight:sequenced_assembly/gunkan/${output.split(":")[1]}`)
    }
    /**
     * 
     * @param {InputItem_} input 
     * @param {OutputItem_} output 
     */
    function nigiri(input, output) {
        let iner = "createdelight:incomplete_nigiri"
        e.recipes.create.sequenced_assembly(output, "createdelight:empty_riceball", [
            e.recipes.create.deploying(iner, [iner, input]),
            e.recipes.create.deploying(iner, [iner, "minecraft:dried_kelp"])
        ])
            .transitionalItem(iner)
            .loops(1)
            .id(`createdelight:sequenced_assembly/nigiri/${output.split(":")[1]}`)
    }
    /**
     * 
     * @param {InputItem_} ingredient 
     * @param {OutputItem_} output 
     */
    function hosomaki(ingredient, output) {
        let iner = "createdelight:incomplete_hosomaki"
        e.recipes.create.sequenced_assembly(output, "minecraft:dried_kelp", [
                e.recipes.create.deploying(iner, [iner, ingredient]),
                e.recipes.create.filling(iner, [iner, Fluid.of("youkaishomecoming:soy_sauce", 250)]),
                e.recipes.create.deploying(iner, [iner, "createdelight:empty_riceball"])
            ]
        )
            .transitionalItem(iner)
            .loops(1)
            .id(`createdelight:sequenced_assembly/hosomaki/${output.split(":")[1]}`)
    }
    /**
     * 
     * @param {InputItem_} ingredients 
     * @param {OutputItem_} output 
     */
    function futomaki(ingredients, output) {
        let iner = "createdelight:incomplete_futomaki"
        let recipes = []
        ingredients.forEach(ingredient => {
            recipes.push(e.recipes.create.deploying(iner, [iner, ingredient]))
        })
        recipes.push(e.recipes.create.filling(iner, [iner, Fluid.of("youkaishomecoming:soy_sauce", 250)]))
        recipes.push(e.recipes.create.deploying(iner, [iner, "createdelight:empty_riceball"]))
        recipes.push(e.recipes.create.deploying(iner, [iner, "createdelight:empty_riceball"]))
        // recipes.push(e.recipes.create.deploying(iner, [iner, base]))
        e.recipes.create.sequenced_assembly(output, "minecraft:dried_kelp", recipes)
            .transitionalItem(iner)
            .loops(1)
            .id(`createdelight:sequenced_assembly/futomaki/${output.split(":")[1]}`)
    }

    e.replaceInput({}, "farmersdelight:cooked_rice", "createdelight:empty_riceball")
    e.recipes.kubejs.shapeless("createdelight:empty_riceball", "farmersdelight:cooked_rice")
        .replaceIngredient({ item: "farmersdelight:cooked_rice" }, "minecraft:bowl")
        .id("createdelight:empty_riceball_from_cooked_rice")
    e.recipes.kubejs.shapeless("farmersdelight:cooked_rice", ["createdelight:empty_riceball", "minecraft:bowl"])
        .id("createdelight:cooked_rice_from_empty_riceball")
    e.recipes.minecraft.smoking("createdelight:empty_riceball", "farmersdelight:rice")
        .id("createdelight:empty_riceball_from_rice")
    e.recipes.farmersdelight.cutting(
        "alexscaves:deep_sea_sushi_roll",
        "#forge:tools/knives",
        "3x createdelight:deep_sea_sushi_roll_slice"
    ).id("farmersdelight:cutting/deep_sea_sushi_roll_slice")

    cutting_roll("culturaldelights:midori_roll", "culturaldelights:midori_roll_slice")
    cutting_roll("culturaldelights:chicken_roll", "culturaldelights:chicken_roll_slice")
    cutting_roll("farmersdelight:kelp_roll", "farmersdelight:kelp_roll_slice")
    cutting_roll("silentsdelight:sculk_sensor_tendril_roll", "silentsdelight:sculk_sensor_tendril_roll_slice")
    cutting_roll("oceanic_delight:sea_pickle_roll", "oceanic_delight:sea_pickle_roll_slice")
    cutting_roll("youkaishomecoming:tekka_maki", "youkaishomecoming:tekka_maki_slice")
    cutting_roll("youkaishomecoming:kappa_maki", "youkaishomecoming:kappa_maki_slice")
    cutting_roll("youkaishomecoming:shinnko_maki", "youkaishomecoming:shinnko_maki_slice")
    cutting_roll("youkaishomecoming:salmon_futomaki", "youkaishomecoming:salmon_futomaki_slice")
    cutting_roll("youkaishomecoming:egg_futomaki", "youkaishomecoming:egg_futomaki_slice")
    cutting_roll('youkaishomecoming:rainbow_futomaki', "youkaishomecoming:rainbow_futomaki_slice")
    cutting_roll("alexscaves:deep_sea_sushi_roll", "createdelight:deep_sea_sushi_roll_slice")
    cutting_roll('youkaishomecoming:california_roll', "youkaishomecoming:california_roll_slice")
    cutting_roll('youkaishomecoming:volcano_roll', "youkaishomecoming:volcano_roll_slice")
    cutting_roll('youkaishomecoming:roe_california_roll', "youkaishomecoming:roe_california_roll_slice")
    cutting_roll('youkaishomecoming:salmon_lover_roll', "youkaishomecoming:salmon_lover_roll_slice")
    cutting_roll("youkaishomecoming:rainbow_roll", "youkaishomecoming:rainbow_roll_slice")

    sushi("crabbersdelight:pufferfish_slice", "2x culturaldelights:pufferfish_roll")
    sushi("crabbersdelight:cooked_pufferfish_slice", "2x createdelight:fugu_roll")
    sushi("farmersdelight:salmon_slice", "2x farmersdelight:salmon_roll")
    sushi("farmersdelight:cod_slice", "2x farmersdelight:cod_roll")
    sushi("#forge:raw_clam", "2x collectorsreap:clam_roll")
    sushi("cavedelight:raw_trilocaris_slice", "2x cavedelight:trilocaris_roll")
    sushi("#forge:raw_fishes/tuna", "2x youkaishomecoming:tuna_nigiri")
    sushi("youkaishomecoming:otoro", "2x youkaishomecoming:otoro_nigiri")
    sushi("#forge:tropical", "2x culturaldelights:tropical_roll")
    sushi("alexscaves:radgill", "2x createdelight:radgill_sushi")

    gunkan("collectorsreap:uni", "2x collectorsreap:uni_roll")
    gunkan("#forge:roe", "2x youkaishomecoming:tobiko_gunkan")
    gunkan("minecraft:seagrass", '2x youkaishomecoming:seagrass_gunkan')
    gunkan("youkaishomecoming:nattou", '2x youkaishomecoming:nattou_gunkan')

    nigiri("youkaishomecoming:kabayaki", '2x youkaishomecoming:lorelei_nigiri')
    nigiri('youkaishomecoming:tamagoyaki', "2x youkaishomecoming:egg_nigiri")
    nigiri("#oceanic_delight:squid_tentacles", "2x culturaldelights:calamari_roll")
    nigiri("youkaishomecoming:flesh", "2x youkaishomecoming:flesh_roll")
    nigiri("#forge:shrimps", "2x oceanic_delight:shrimp_roll")

    hosomaki("minecraft:carrot", "farmersdelight:kelp_roll")
    hosomaki("silentsdelight:sculk_sensor_tendril", "silentsdelight:sculk_sensor_tendril_roll")
    hosomaki('#forge:raw_fishes/tuna', 'youkaishomecoming:tekka_maki')
    hosomaki('youkaishomecoming:cucumber_slice', 'youkaishomecoming:kappa_maki')
    hosomaki('minecraft:beetroot', 'youkaishomecoming:shinnko_maki')

    futomaki(['culturaldelights:cut_avocado', 'culturaldelights:cut_avocado', 'youkaishomecoming:cucumber_slice', 'youkaishomecoming:cucumber_slice'], "culturaldelights:midori_roll")
    futomaki(["#forge:cooked_chicken", "#forge:cooked_chicken", ["minecraft:beetroot", "minecraft:carrot"], ["minecraft:beetroot", "minecraft:carrot"]], "culturaldelights:chicken_roll")
    futomaki(["#forge:sea_pickles", "#forge:sea_pickles", '#oceanic_delight:squid_tentacles', '#oceanic_delight:squid_tentacles'], "oceanic_delight:sea_pickle_roll")
    futomaki(["#forge:raw_fishes/salmon", "youkaishomecoming:imitation_crab", ["minecraft:beetroot", "minecraft:carrot"], "youkaishomecoming:cucumber_slice"], 'youkaishomecoming:salmon_futomaki')
    futomaki(['youkaishomecoming:tamagoyaki_slice', 'youkaishomecoming:tamagoyaki_slice', 'youkaishomecoming:tamagoyaki_slice'], 'youkaishomecoming:egg_futomaki')
    futomaki(["youkaishomecoming:imitation_crab", "#forge:raw_fishes/salmon", ["minecraft:beetroot", "minecraft:carrot"], 'youkaishomecoming:tamagoyaki_slice', "youkaishomecoming:cucumber_slice"], 'youkaishomecoming:rainbow_futomaki')
    futomaki(['alexscaves:tripodfish', 'alexscaves:sea_pig', 'alexscaves:lanternfish', 'youkaishomecoming:cucumber_slice'], 'alexscaves:deep_sea_sushi_roll')
    {
        let iner = "createdelight:incomplete_california"
        e.recipes.create.sequenced_assembly('youkaishomecoming:california_roll', 'createdelight:empty_riceball', [
            e.recipes.create.deploying(iner, [iner, 'createdelight:empty_riceball']),
            e.recipes.create.deploying(iner, [iner, 'minecraft:dried_kelp']),
            e.recipes.create.filling(iner, [iner, Fluid.of("create_bic_bit:mayonnaise", 250)]),
            e.recipes.create.deploying(iner, [iner, 'youkaishomecoming:imitation_crab']),
            e.recipes.create.deploying(iner, [iner, 'youkaishomecoming:tamagoyaki_slice']),
            e.recipes.create.deploying(iner, [iner, 'youkaishomecoming:cucumber_slice'])
        ])
            .transitionalItem(iner)
            .loops(1)
            .id("youkaishomecoming:sequenced_assembly/california_roll")
    }
    e.recipes.create.deploying(
        'youkaishomecoming:roe_california_roll',
        [
            'youkaishomecoming:california_roll',
            "#forge:roe"
        ]
    ).id("youkaishomecoming:deploying/roe_california_roll")
    {
        let iner = "youkaishomecoming:california_roll"
        e.recipes.create.sequenced_assembly('youkaishomecoming:volcano_roll', iner, [
            e.recipes.create.filling(iner, [iner, Fluid.of("youkaishomecoming:soy_sauce", 250)]),
            e.recipes.create.deploying(iner, [iner, '#forge:raw_fishes/tuna']),
            e.recipes.create.deploying(iner, [iner, 'youkaishomecoming:otoro']),
            e.recipes.create.deploying(iner, [iner, '#forge:raw_fishes/tuna']),
        ])
            .transitionalItem(iner)
            .loops(1)
            .id("youkaishomecoming:sequenced_assembly/volcano_roll")
    }
    {
        let iner = "youkaishomecoming:roe_california_roll"
        e.recipes.create.sequenced_assembly('youkaishomecoming:rainbow_roll', iner, [
            e.recipes.create.deploying(iner, [iner, '#forge:raw_fishes/salmon']),
            e.recipes.create.deploying(iner, [iner, '#forge:raw_fishes/cod']),
            e.recipes.create.deploying(iner, [iner, '#forge:raw_fishes/tuna']),
        ])
            .transitionalItem(iner)
            .loops(1)
            .id("youkaishomecoming:sequenced_assembly/rainbow_roll")
    }
    {
        let iner = "youkaishomecoming:roe_california_roll"
        e.recipes.create.sequenced_assembly('youkaishomecoming:salmon_lover_roll', iner, [
            e.recipes.create.deploying(iner, [iner, '#forge:raw_fishes/salmon']),
            e.recipes.create.deploying(iner, [iner, '#forge:raw_fishes/salmon']),
            e.recipes.create.deploying(iner, [iner, '#forge:raw_fishes/salmon'])
        ])
            .transitionalItem(iner)
            .loops(1)
            .id("youkaishomecoming:sequenced_assembly/salmon_lover_roll")
    }
})