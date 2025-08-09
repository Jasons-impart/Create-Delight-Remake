ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "create_new_age:thorium_multiplication"
    ])
    //核反应堆材料
    let iner_1 = "create_new_age:incomplete_casing"
    e.recipes.create.sequenced_assembly("create_new_age:reactor_casing", "ad_astra:steel_plating", [
        e.recipes.create.deploying(iner_1, [iner_1, "createmetallurgy:graphite"]),
        e.recipes.create.deploying(iner_1, [iner_1, "alexscaves:polymer_plate"]),
        e.recipes.create.pressing(iner_1, iner_1)
    ])
    .loops(1)
    .transitionalItem(iner_1)
    .id("create_new_age:reactor/reactor_casing")
    
    //钍再生减少水的消耗
    e.recipes.create.mixing("2x create_new_age:thorium", [
        Fluid.water(500),
        "minecraft:stone",
        "minecraft:clay",
        "create_new_age:thorium"
    ])
    .id("create_new_age:thorium_multiplication")
    e.recipes.vintageimprovements.pressurizing("create_new_age:radioactive_thorium", [
        Fluid.of("createdelightcore:nuclear_waste", 1000),
        "create_new_age:thorium"
    ])
    .superheated()
    .id("create_new_age:pressurizing/radioactive_thorium")
    e.recipes.vintageimprovements.vacuumizing("alexscaves:unrefined_waste", Fluid.of("createdelightcore:nuclear_waste", 500))
    .superheated()
    .id("alexscaves:vacuumizing/unrefined_waste")
})

ServerEvents.tags("minecraft:block", e => {
    e.add("create_new_age:stops_radiation",
        "mbd2:reactor",
        "mbd2:reactor_vent")
})