ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "cosmopolitan:general/wafer",
        "cosmopolitan:create/pressing/wafer_cone",
        "cosmopolitan:farmersdelight/frying/potato_pancakes_from_deep_frying"
    ])
    const {kubejs, create} = e.recipes
    kubejs.shapeless("cosmopolitan:wafer", [
        "farmersdelight:wheat_dough",
        "ratatouille:cocoa_powder"
    ]).id("cosmopolitan:general/wafer")
    e.replaceInput({mod: "cosmopolitan"}, "#forge:crops/wheat", "#forge:flour")
    e.replaceOutput({mod: "cosmopolitan"}, "cosmopolitan:chorus_fruit_popsicle", "ends_delight:chorus_fruit_popsicle")
    create.filling("cosmopolitan:cream_bun", ["#forge:bread", Fluid.of("cosmopolitan:cream", 250)])
    .id("cosmopolitan:filling/cream_bun")
    create.deploying("cosmopolitan:cream_bun", ["#forge:bread", "#forge:cream"])
    .id("cosmopolitan:deploying/cream_bun")
    create.mixing("cosmopolitan:gulime", [
        Fluid.of("createdelightcore:slime", 270),
        FluidIngredients("forge:honey", 250),
        "minecraft:pumpkin"
    ])
    .id("cosmopolitan:mixing/gulime")
    create.filling("cosmopolitan:cream", ["minecraft:bowl", Fluid.of("cosmopolitan:cream", 250)])
    .id("cosmopolitan:filling/cream")
    create.filling("cosmopolitan:cream_bucket", ["minecraft:bucket", Fluid.of("cosmopolitan:cream", 1000)])
    .id("cosmopolitan:filling/cream_bucket")
    create.mixing(Fluid.of("cosmopolitan:berry_syrup", 250), [
        "4x #forge:berries",
        Fluid.of("createcafe:melted_sugar", 500)
    ]).heated().id("cosmopolitan:mixing/cream_bucket")
})