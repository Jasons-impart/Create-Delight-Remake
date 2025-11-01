ServerEvents.recipes(e => {
    e.forEachRecipe({ type: "vinery:wine_fermentation" }, r => {
        /**
         * @type {Internal.FermentationBarrelRecipe}
         */
        let recipe = r.getOriginalRecipe()
        let res = recipe.getResultItem(null)
        let resFluid = Fluid.of(`createdelight:${res.id.toString().split(":")[1]}`, 1000)
        let resFluid_250 = Fluid.of(`createdelight:${res.id.toString().split(":")[1]}`, 250)
        e.recipes.create.filling(res, ["vinery:wine_bottle", resFluid_250])
            .id(`createdelight:filling/${res.id.toString().split(":")[1]}`)
        e.recipes.create.emptying(["vinery:wine_bottle", resFluid_250], res)
            .id(`createdelight:emptying/${res.id.toString().split(":")[1]}`)
        pouring(e, res, resFluid.id, "vinery:wine_bottle")
        let fluid = recipe.getJuiceType().split("_")
        let fluidId = ""
        let prefix = fluid[0]
        if (fluid[1] == "general") {
            prefix = "createdelightcore:" + fluid[0]
            fluidId = prefix + "_grapejuice"
        }
        else if (fluid[1] == "warped" || fluid[1] == "crimson") {
            prefix = "createdelightcore:" + fluid[1]
            fluidId = prefix + "_grapejuice"
        }
        else if (fluid[0] == "apple") {
            fluidId = "createdelight:apple_juice"
        }
        else if (fluid[1]) {
            prefix = `${fluid[1]}_${prefix}`
            prefix = "createdelightcore:" + prefix
            fluidId = prefix + "_grapejuice"
        }
        let ingrs = [Fluid.of(fluidId, 1000)]
        let originIngrs = []
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
                originIngrs.push(Ingredient.of(ingr))
            })
        })
        brewinandchewin_fermenting(e, resFluid, originIngrs, Fluid.of(fluidId, 1000))
        .id(`brewinandchewin:fermenting/${res.id.toString().split(":")[1]}`)
        r.remove()
        if (res.is("vinery:bottle_mojang_noir") || res.is("vinery:jellie_wine") || res.is("vinery:apple_wine"))
            return
        fermenting(e, resFluid, ingrs)
        // console.log(`res: ${recipe.getResultItem(null).id}`)
        // console.log(`ingr: ${recipe.ingredients.get(0).stacks.toString()}`)
    })
    e.recipes.create.pressing("vinery:apple_mash", "minecraft:apple")
        .id("vinery:pressing/apple_mash")
    e.recipes.create.compacting(Fluid.of("createdelight:apple_juice", 250), "vinery:apple_mash")
        .id("createdelight:compacting/apple_juice")
    e.recipes.create.filling("vinery:apple_juice", ["vinery:wine_bottle", Fluid.of("createdelight:apple_juice", 250)])
        .id("vinery:filling/apple_juice")
    e.recipes.create.emptying(["vinery:wine_bottle", Fluid.of("createdelight:apple_juice", 250)], "vinery:apple_juice")
        .id("vinery:emptying/apple_juice")
    pouring(e, 'vinery:apple_juice', "createdelight:apple_juice", "vinery:wine_bottle", 250)
})