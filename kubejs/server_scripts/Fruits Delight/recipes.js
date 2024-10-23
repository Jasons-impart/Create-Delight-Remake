ServerEvents.recipes(e => {
    e.replaceInput({ mod: "fruitsdelight", input: "minecraft:slime_ball" }, "minecraft:slime_ball", "#forge:gelatin")
    e.recipes.create.mixing(
        Fluid.of("fruitsdelight:kiwi_juice", 250),
        "2x fruitsdelight:kiwi"
    ).id("fruitsdelight:mixing/flowing_kiwi_juice")
})
