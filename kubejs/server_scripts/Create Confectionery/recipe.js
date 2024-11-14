ServerEvents.recipes(e => {
    const {create} = e.recipes
    create.mixing("4x create_confectionery:candy_cane", [
        Fluid.water(250),
        "4x minecraft:sugar",
        "neapolitan:mint_leaves"
    ])
})