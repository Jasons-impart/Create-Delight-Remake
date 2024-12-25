ServerEvents.recipes(e => {
    //基础电机
    let iner = "createaddition:electric_motor"
    e.recipes.create.sequenced_assembly("create_new_age:basic_motor", "createaddition:electric_motor",
        [
            e.recipes.create.deploying(iner, [iner, "#ad_astra:steel_plates"]),
            e.recipes.create.deploying(iner, [iner, "vintageimprovements:steel_rod"])
        ]
    )
        .loops(4)
        .transitionalItem(iner)
        .id("create_new_age:shaped/basic_motor")
    //电机，电机扩展
    e.recipes.create.mechanical_crafting("create_new_age:advanced_motor_extension", [
        "AAAAA",
        "BCDCE",
        "AAAAA"
    ],
    {
        A: "ad_astra:steel_plate",
        B: "alexscaves:block_of_scarlet_neodymium",
        C: "create_new_age:copper_circuit",
        D: "create_new_age:reinforced_motor",
        E: "alexscaves:block_of_azure_neodymium"
    })
    .id("create_new_age:advanced_motor_extension")
})