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

    cutting_roll(e, "culturaldelights:midori_roll", "culturaldelights:midori_roll_slice")
    cutting_roll(e, "culturaldelights:chicken_roll", "culturaldelights:chicken_roll_slice")
    cutting_roll(e, "farmersdelight:kelp_roll", "farmersdelight:kelp_roll_slice")
    cutting_roll(e, "silentsdelight:sculk_sensor_tendril_roll", "silentsdelight:sculk_sensor_tendril_roll_slice")
    cutting_roll(e, "oceanic_delight:sea_pickle_roll", "oceanic_delight:sea_pickle_roll_slice")
    cutting_roll(e, "oceanic_delight:fish_egg_roll", "oceanic_delight:fish_egg_roll_slice")
})