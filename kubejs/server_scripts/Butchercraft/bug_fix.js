ServerEvents.recipes(e => {
    e.recipes.minecraft.crafting_shapeless(
        "supplementaries:soap",
        [
            Item.of("minecraft:water_bucket"),
            "4x supplementaries:ash",
            "butchercraft:lard"
        ]
    ).id("supplementaries:soap")
    // e.recipes.create.sequenced_assembly("2x farmersdelight:ham", "butchercraft:pork_roast", [
    //     e.recipes.create.deploying("butchercraft:pork_roast", ["butchercraft:pork_roast", "minecraft:bone"]),
    //     e.recipes.create.deploying("butchercraft:pork_roast", ["butchercraft:pork_roast", "minecraft:bone"]),
    //     e.recipes.create.cutting("butchercraft:pork_roast", "butchercraft:pork_roast")
    // ]
    // )
    //     .transitionalItem("butchercraft:pork_roast")
    //     .loops(1)
    //     .id("butchercraft:crafting_ham")
    e.recipes.create.emptying([
        Fluid.of("butchercraft:blood_fluid").withAmount(250),
        "minecraft:glass_bottle"
    ]
        , ["butchercraft:blood_fluid_bottle"])
        .id("butchercraft:blood_bottle_2")
    e.recipes.create.filling(
        "butchercraft:blood_fluid_bottle",
        [
            "minecraft:glass_bottle",
            Fluid.of("butchercraft:blood_fluid").withAmount(250)
        ])
})
