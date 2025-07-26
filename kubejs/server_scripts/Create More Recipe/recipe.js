ServerEvents.recipes(e => {
    const {create, kubejs} = e.recipes
    remove_recipes_output(e, [
        "cmr:frozen_cake_base",
        "cmr:frozen_cake"
    ])
    create.compacting("4x cmr:frozen_cake_base", [
        Fluid.of("createdelight:cake_batter", 1000),
        "2x minecraft:snowball"
    ])
    // .heatRequirement("frozen")
    // .heatRequirement("cooled")
    .id("cmr:compacting/frozen_cake_base")
    create.filling("cmr:frozen_cake", ["cmr:frozen_cake_base", Fluid.of("netherexp:ectoplasm", 250)])
    .id("cmr:filling/frozen_cake")
    kubejs.shaped("2x cmr:empty_snowman_cooler", [
        " A ",
        "ABA",
        " A "
    ], {
        A: "#forge:plates/cast_iron",
        B: "minecraft:snow_block"
    }).id("cmr:empty_snowman_cooler_from_cast_iron")
})