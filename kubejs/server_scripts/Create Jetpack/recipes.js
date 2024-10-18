ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "create_jetpack:jetpack",
        "create_jetpack:netherite_jetpack"
    ])
    e.recipes.create.mechanical_crafting("create_jetpack:jetpack", [
        " ABA ",
        "ACDCA",
        "AEFGA",
        " HIH "
    ],
    {
        A: "create:brass_sheet",
        B: "create:shaft",
        C: "create_sa:steam_engine",
        D: "create:copper_backtank",
        E: "create_sa:large_fueling_tank",
        F: "create_sa:brass_jetpack_chestplate",
        G: "create_sa:large_filling_tank",
        H: "ad_astra:fan",
        I: "minecraft:elytra"
    })
    .id("create_jetpack:jetpack")
    e.recipes.create.mechanical_crafting("create_jetpack:netherite_jetpack", [
        " ABA ",
        "ACDCA",
        "AEFGA",
        " HIH "
    ],
    {
        A: "create:brass_sheet",
        B: "create:shaft",
        C: "create_sa:steam_engine",
        D: "create:netherite_backtank",
        E: "create_sa:large_fueling_tank",
        F: "create_sa:brass_jetpack_chestplate",
        G: "create_sa:large_filling_tank",
        H: "ad_astra:fan",
        I: "minecraft:elytra"
    })
    .id("create_jetpack:netherite_jetpack")
})