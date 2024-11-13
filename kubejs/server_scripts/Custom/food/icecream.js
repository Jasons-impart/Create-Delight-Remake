ServerEvents.recipes(e => {
    const {create} = e.recipes
    /**
     * 
     * @param {Internal.RecipesEventJS} e 
     * @param {InputItem_} ingredient 
     * @param {Internal.FluidStackJS_} outputFluidIcecrem 
     * @param {Internal.FluidStackJS_} outputFluidMilkshake
     * @param {Internal.ItemStack_} icecream 
     * @param {Internal.ItemStack_} milkshake 
     */
    function make_ice_cream(e, ingredient, outputFluidIcecream, outputFluidMilkshake, icecream, milkshake) {
        e.recipes.create.mixing(Fluid.of(outputFluidIcecream, 250), [
            ingredient, 
            Fluid.of("minecraft:milk", 250), 
            Fluid.of("createcafe:melted_sugar", 125), 
            "youkaishomecoming:ice_cube"])
        .id(`createdelight:mixing/${outputFluidIcecream.split(":")[1]}`)
        e.recipes.create.mixing(Fluid.of(outputFluidMilkshake, 750), [
            Fluid.of(outputFluidIcecream, 250),
            Fluid.of("minecraft:milk", 500)
        ])
        .id(`createdelight:mixing/${outputFluidMilkshake.split(":")[1]}`)

        e.recipes.create.filling(icecream, [
            "minecraft:bowl",
            Fluid.of(outputFluidIcecream, 250)
        ])
        .id(`createdelight:filling/${icecream.split(":")[1]}`)
        e.recipes.create.emptying(
            [Fluid.of(outputFluidIcecream, 250), "minecraft:bowl"], 
            icecream
        )
        .id(`createdelight:emptying/${outputFluidIcecream.split(":")[1]}`)

        e.recipes.create.filling(milkshake, [
            "minecraft:glass_bottle",
            Fluid.of(outputFluidMilkshake, 250)
        ])
        .id(`createdelight:filling/${milkshake.split(":")[1]}`)
        e.recipes.create.emptying(
            [Fluid.of(outputFluidMilkshake, 250), "minecraft:glass_bottle"], 
            milkshake
        )
        .id(`createdelight:emptying/${outputFluidMilkshake.split(":")[1]}`)
    }
    make_ice_cream(e, "create:bar_of_chocolate", "createdelight:chocolate_ice_cream", "createdelight:chocolate_milkshake", "neapolitan:chocolate_ice_cream", "neapolitan:chocolate_milkshake")
    make_ice_cream(e, "neapolitan:roasted_adzuki_beans", "createdelight:adzuki_ice_cream", "createdelight:adzuki_milkshake", "neapolitan:adzuki_ice_cream", "neapolitan:adzuki_milkshake")
    make_ice_cream(e, "neapolitan:dried_vanilla_pods", "createdelight:vanilla_ice_cream", "createdelight:vanilla_milkshake", "neapolitan:vanilla_ice_cream", "neapolitan:vanilla_milkshake")
    make_ice_cream(e, "#forge:fruits/banana", "createdelight:banana_ice_cream", "createdelight:banana_milkshake", "neapolitan:banana_ice_cream", "neapolitan:banana_milkshake")
    make_ice_cream(e, "neapolitan:strawberries", "createdelight:strawberry_ice_cream", "createdelight:strawberry_milkshake", "neapolitan:strawberry_ice_cream", "neapolitan:strawberry_milkshake")
    make_ice_cream(e, "neapolitan:mint_leaves", "createdelight:mint_ice_cream", "createdelight:mint_milkshake", "neapolitan:mint_ice_cream", "neapolitan:mint_milkshake")
    let iner_1 = "minecraft:bowl"
    create.sequenced_assembly("neapolitan:neapolitan_ice_cream",
        iner_1,
        [
            create.filling(iner_1, [iner_1, Fluid.of("createdelight:chocolate_ice_cream", 100)]),
            create.filling(iner_1, [iner_1, Fluid.of("createdelight:vanilla_ice_cream", 100)]),
            create.filling(iner_1, [iner_1, Fluid.of("createdelight:strawberry_ice_cream", 100)])
        ]
    )
    .loops(1)
    .transitionalItem(iner_1)
    .id("createdelight:sequenced_assembly/neapolitan_ice_cream")
})