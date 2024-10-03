ServerEvents.recipes(e => {
    /**
     * @param { InputItem_ } input
     * @param { OutputItem_ } output
     * @param { number } time
     */
    function deep_frying(output, input, time) {
        if (input[0] == "#") {
            e.custom({
                type: "casualness_delight:deep_frying",
                ingredient: { tag: input.slice(1) },
                cookingtime: time,
                result: output,
            }).id(`casualness_delight:deep_frying/${output.split(":")[1]}`);
            e.recipes.create
                .mixing(output, ["butchercraft:lard", input])
                .heated()
                .id(
                    `casualness_delight:mix_animal_frying/${
                        output.split(":")[1]
                    }`
                );
            e.recipes.create
                .mixing(output, [
                    Fluid.of("createdieselgenerators:plant_oil", 50),
                    input,
                ])
                .heated()
                .id(
                    `casualness_delight:mix_plant_frying/${
                        output.split(":")[1]
                    }`
                );
        } else {
            e.custom({
                type: "casualness_delight:deep_frying",
                ingredient: { item: input },
                cookingtime: time,
                result: output,
            }).id(`casualness_delight:deep_frying/${output.split(":")[1]}`);
            e.recipes.create
                .mixing(output, ["butchercraft:lard", input])
                .heated()
                .id(
                    `casualness_delight:mix_animal_frying/${
                        output.split(":")[1]
                    }`
                );
            e.recipes.create
                .mixing(output, [
                    Fluid.of("createdieselgenerators:plant_oil", 50),
                    input,
                ])
                .heated()
                .id(
                    `casualness_delight:mix_plant_frying/${
                        output.split(":")[1]
                    }`
                );
        }
    }
    remove_recipes_type(e, ["frycooks_delight:frying"]);
    remove_recipes_id(e, [
        "farmersdelight:cooking/canola_oil",
        "frycooks_delight:canola_crate",
        "frycooks_delight:canola",
        "frycooks_delight:lard",
        "frycooks_delight:lard_block",
    ]);

    package_item(
        e,
        "frycooks_delight:canola",
        "frycooks_delight:canola_crate",
        9
    );
    deep_frying("frycooks_delight:fried_potato", "minecraft:potato", 100);
    deep_frying(
        "frycooks_delight:plain_donut",
        "farmersdelight:wheat_dough",
        100
    );
    deep_frying(
        "frycooks_delight:fried_onion_ring",
        "some_assembly_required:sliced_onion",
        100
    );
    e.replaceInput(
        { id: "culturaldelights:smelting/smoked_tomato" },
        "farmersdelight:tomato",
        "some_assembly_required:tomato_slices"
    );
    e.recipes.create
        .compacting(
            Fluid.of("createdieselgenerators:plant_oil", 500),
            "2x frycooks_delight:canola_seeds"
        )
        .id("createdieselgenerators:compacting/plant_oil_from_canola_seeds");
    e.recipes.create
        .compacting(
            Fluid.of("createdieselgenerators:plant_oil", 500),
            "2x vintagedelight:roasted_peanut"
        )
        .id("createdieselgenerators:compacting/plant_oil_from_peanut");
    e.recipes.ratatouille
        .threshing(
            [
                "2x frycooks_delight:canola_seeds",
                Item.of("2x frycooks_delight:canola_seeds").withChance(0.5),
            ],
            "frycooks_delight:canola"
        )
        .id("ratatouille:threshing/canola_seeds");
});
