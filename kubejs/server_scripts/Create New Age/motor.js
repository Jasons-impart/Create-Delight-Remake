ServerEvents.recipes(e => {
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