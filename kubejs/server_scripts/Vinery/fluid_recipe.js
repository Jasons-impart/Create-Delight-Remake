ServerEvents.recipes(e => {
    let vinery_fluid_list = [
        "apple_juice",
        "mead",
        "apple_cider",
        "apple_wine",
        "mellohi_wine",
        "glowing_wine",
        "solaris_wine",
        "noir_wine",
        "red_wine",
        "strad_wine",
        "cherry_wine",
        "cristel_wine",
        "creepers_crush",
        "kelp_cider",
        "lilitu_wine",
        "jo_special_mixture",
        "eiswein",
        "aegis_wine",
        "bolvar_wine",
        "chorus_wine",
        "villagers_fright",
        "clark_wine",
        "magnetic_wine",
        "stal_wine",
        "chenet_wine",
        "bottle_mojang_noir",
        "jellie_wine",
        "blazewine_pinot",
        "netherite_nectar",
        "ghastly_grenache",
        "lava_fizz",
        "nether_fizz"
    ]
    e.forEachRecipe({ type: "vinery:wine_fermentation" }, r => {
        /**
         * @type {Internal.FermentationBarrelRecipe}
         */
        let recipe = r.getOriginalRecipe()
        let res = recipe.getResultItem(null)
        let resFluid = Fluid.of(`createdelight:${res.id.toString().split(":")[1]}`, 250)
        e.recipes.create.filling(res, ["vinery:wine_bottle", resFluid])
            .id(`createdelight:filling/${res.id.toString().split(":")[1]}`)
        e.recipes.create.emptying(["vinery:wine_bottle", resFluid], res)
            .id(`createdelight:emptying/${res.id.toString().split(":")[1]}`)
        if (res.is("vinery:bottle_mojang_noir") || res.is("vinery:jellie_wine") || res.is("vinery:apple_wine"))
            return
        let fluid = recipe.getJuiceType().split("_")
        let fluidId = ""
        let prefix = fluid[0]
        if (fluid[1] == "general") {
            prefix = "doaddonfluids:" + fluid[0]
            fluidId = prefix + "_grapejuice"
        }
        else if (fluid[1] == "warped" || fluid[1] == "crimson") {
            prefix = "doaddonfluids:" + fluid[1]
            fluidId = prefix + "_grapejuice"
        }
        else if (fluid[0] == "apple") {
            fluidId = "createdelight:apple_juice"
        }
        else if (fluid[1]) {
            prefix = `${fluid[1]}_${prefix}`
            prefix = "doaddonfluids:" + prefix
            fluidId = prefix + "_grapejuice"
        }
        let ingrs = [Fluid.of(fluidId, recipe.getJuiceAmount() * 10)]

        recipe.ingredients.forEach(i => {
            i.stacks.forEach(ingr => {
                if (ingr.is("minecraft:honey_bottle"))
                    ingrs.push(Fluid.of("create:honey", 250))
                else if (ingr.is("minecraft:lava_bucket"))
                    ingrs.push(Fluid.lava(1000))
                else if (!Fluid.of(`createdelight:${ingr.id.split(":")[1]}`).empty)
                    ingrs.push(Fluid.of(`createdelight:${ingr.id.split(":")[1]}`, 250))
                else
                    ingrs.push(Ingredient.of(ingr))
            })
        })
        e.recipes.createdieselgenerators.basin_fermenting(
            resFluid, ingrs)
            .id(`createdelight:basin_fermenting/${res.id.toString().split(":")[1]}`)
        // console.log(`res: ${recipe.getResultItem(null).id}`)
        // console.log(`ingr: ${recipe.ingredients.get(0).stacks.toString()}`)
    })
    e.recipes.create.compacting("vinery:apple_mash", "minecraft:apple")
        .id("vinery:compacting/apple_mash")
    e.recipes.create.compacting(Fluid.of("createdelight:apple_juice", 250), "vinery:apple_mash")
        .id("createdelight:compacting/apple_juice")
        e.recipes.create.filling("vinery:apple_juice", ["vinery:wine_bottle", Fluid.of("createdelight:apple_juice", 250)])
        .id("vinery:filling/apple_juice")
        e.recipes.create.emptying(["vinery:wine_bottle", Fluid.of("createdelight:apple_juice", 250)], "vinery:apple_juice")
        .id("vinery:emptying/apple_juice")
})