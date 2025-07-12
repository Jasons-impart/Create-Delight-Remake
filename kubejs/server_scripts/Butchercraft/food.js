ServerEvents.recipes(e => {

    //九转大肠
    let iner = "butchercraft:cooked_tripe" 
    e.recipes.create.sequenced_assembly("createdelight:braised_intestines_in_brown_sauce", "butchercraft:cooked_tripe",[
        e.recipes.create.cutting(iner, iner),
        e.recipes.create.deploying(iner, [iner, "festival_delicacies:greenonion"]),
        e.recipes.create.deploying(iner, [iner, "butchercraft:lard"]),
        e.recipes.create.filling(iner, [iner, Fluid.of("createdelight:vinegar", 250)]),
        e.recipes.create.deploying(iner, [iner, "minecraft:bowl"])
    ])
        .transitionalItem(iner)
        .loops(1)
        .id("createdelight:braised_intestines_in_brown_sauce")
    e.recipes.farmersdelight.cooking(
        [
            "butchercraft:cooked_tripe",
            "festival_delicacies:greenonion",
            "butchercraft:lard",
            'vintagedelight:vinegar_bottle'
        ], "createdelight:braised_intestines_in_brown_sauce",
        1.0, 200, "bowl"
    ).id("createdelight:cooking/braised_intestines_in_brown_sauce")
    //开水白菜
    e.recipes.create.mixing("createdelight:boiling_water_cabbage",[
        "festival_delicacies:chinese_cabbage", 
        "minecraft:bowl",
        "vintagedelight:salt_dust", 
        Fluid.of("minecraft:water", 500), 
    ])
        .heated()
        .id("createdelight:boiling_water_cabbage")
    e.recipes.farmersdelight.cooking([
        "festival_delicacies:chinese_cabbage", 
        "vintagedelight:salt_dust",
        "minecraft:water_bucket"
    ], "createdelight:boiling_water_cabbage", 1.0, 200, "bowl").id("createdelight:cooking/boiling_water_cabbage")
})
