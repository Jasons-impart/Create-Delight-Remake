const VINERY_SKIP_BASIN_FERMENTING = [
    "vinery:bottle_mojang_noir",
    "vinery:jellie_wine",
    "vinery:apple_wine"
]

function id_path(id) {
    return String(id).split(":")[1]
}

function vinery_juice_fluid_id(juiceType) {
    const [grape, variant] = String(juiceType).split("_")

    if (grape == "apple")
        return "createdelight:apple_juice"
    if (variant == "general")
        return `createdelightcore:${grape}_grapejuice`
    if (variant == "warped" || variant == "crimson")
        return `createdelightcore:${variant}_grapejuice`
    if (variant)
        return `createdelightcore:${variant}_${grape}_grapejuice`

    return null
}

function vinery_fluid_ingredient(item) {
    if (item.is("minecraft:honey_bottle"))
        return Fluid.of("create:honey", 250)
    if (item.is("minecraft:lava_bucket"))
        return Fluid.lava(1000)

    const fluid = Fluid.of(`createdelight:${id_path(item.id)}`, 250)
    return fluid.empty ? Ingredient.of(item) : fluid
}

ServerEvents.recipes(e => {
    e.forEachRecipe({ type: "vinery:wine_fermentation" }, r => {
        /**
         * @type {Internal.FermentationBarrelRecipe}
         */
        const recipe = r.getOriginalRecipe()
        const res = recipe.getResultItem(null)
        const resPath = id_path(res.id)
        const resFluidId = `createdelight:${resPath}`
        const resFluid = Fluid.of(resFluidId, 1000)
        const resFluid_250 = Fluid.of(resFluidId, 250)
        e.recipes.create.filling(res, ["vinery:wine_bottle", resFluid_250])
            .id(`createdelight:filling/${resPath}`)
        e.recipes.create.emptying(["vinery:wine_bottle", resFluid_250], res)
            .id(`createdelight:emptying/${resPath}`)
        pouring(e, res, resFluid.id, "vinery:wine_bottle")

        const fluidId = vinery_juice_fluid_id(recipe.getJuiceType())
        if (!fluidId) {
            console.warn(`[Create Delight] Unknown Vinery juice type ${recipe.getJuiceType()} for ${res.id}; skip generated fermentation replacement`)
            return
        }

        const ingrs = [Fluid.of(fluidId, 1000)]
        const originIngrs = []
        recipe.ingredients.forEach(i => {
            i.stacks.forEach(ingr => {
                ingrs.push(vinery_fluid_ingredient(ingr))
                originIngrs.push(Ingredient.of(ingr))
            })
        })
        brewinandchewin_fermenting(e, resFluid, originIngrs, Fluid.of(fluidId, 1000))
            .id(`createdelight:fermenting/${resPath}`)
        r.remove()
        if (VINERY_SKIP_BASIN_FERMENTING.some(id => res.is(id)))
            return
        fermenting(e, resFluid, ingrs)
        // console.log(`res: ${recipe.getResultItem(null).id}`)
        // console.log(`ingr: ${recipe.ingredients.get(0).stacks.toString()}`)
    })
    e.recipes.create.pressing("2x vinery:apple_mash", "minecraft:apple")
        .id("createdelight:pressing/apple_mash")
    e.recipes.create.compacting(Fluid.of("createdelight:apple_juice", 250), "vinery:apple_mash")
        .id("createdelight:compacting/apple_juice")
    e.recipes.create.filling("vinery:apple_juice", ["vinery:wine_bottle", Fluid.of("createdelight:apple_juice", 250)])
        .id("createdelight:filling/apple_juice")
    e.recipes.create.emptying(["vinery:wine_bottle", Fluid.of("createdelight:apple_juice", 250)], "vinery:apple_juice")
        .id("createdelight:emptying/apple_juice")
    pouring(e, 'vinery:apple_juice', "createdelight:apple_juice", "vinery:wine_bottle", 250)
})
