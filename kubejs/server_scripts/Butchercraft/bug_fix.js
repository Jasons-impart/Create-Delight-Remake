ServerEvents.recipes(event => {
    event.shapeless(
        "supplementaries:soap",
        [
            "minecraft:water_bucket",
            "4x supplementaries:ash",
            "butchercraft:lard",
        ]
    ).id("supplementaries:soap");
    event.recipes.create.sequenced_assembly(
        "2x farmersdelight:ham",
        "butchercraft:pork_roast",
        [
            event.recipes.create.deploying("butchercraft:pork_roast", ["butchercraft:pork_roast", "minecraft:bone"]),
            event.recipes.create.deploying("butchercraft:pork_roast", ["butchercraft:pork_roast", "minecraft:bone"]),
            event.recipes.create.cutting("butchercraft:pork_roast", "butchercraft:pork_roast")
        ]
    ).transitionalItem("butchercraft:pork_roast").loops(1)
        .id("butchercraft:crafting_ham");
    event.recipes.create.emptying(
        [
            Fluid.of("butchercraft:blood_fluid").withAmount(250),
            "minecraft:glass_bottle",
        ],
        [
            "butchercraft:blood_fluid_bottle",
        ]
    ).id("butchercraft:blood_bottle_2");
    event.recipes.create.filling(
        "butchercraft:blood_fluid_bottle",
        [
            "minecraft:glass_bottle",
            Fluid.of("butchercraft:blood_fluid").withAmount(250),
        ]
    ).id("butchercraft:blood_bottle_3");
});
