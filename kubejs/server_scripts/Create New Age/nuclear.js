ServerEvents.recipes(e => {
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
    
})