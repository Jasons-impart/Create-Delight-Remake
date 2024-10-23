ServerEvents.recipes(e => {
    const {createmetallurgy} = e.recipes
    e.forEachRecipe({input: "#forge:dusts", type: "createmetallurgy:melting"}, recipe => {
        let output = recipe.json.get("results").getAsJsonArray().get(0).getAsJsonObject().get("fluid").getAsString()
        let processingTime = recipe.json.get("processingTime").getAsInt()
        let heatRequirement = recipe.json.get("heatRequirement").getAsString()
        let id = recipe.getId()
        e.remove({id: id})
        createmetallurgy.melting(Fluid.of(output, 120), recipe.getOriginalRecipeIngredients(), processingTime, heatRequirement)
        .id(id)
    })
    createmetallurgy.melting(Fluid.of("createdelight:molten_desh", 120), "createdelight:desh_dust")
        .heatRequirement("heated")
        .id("createmetallurgy:melting/molten_desh_from_desh_dust")
    createmetallurgy.melting(Fluid.of("createdelight:molten_ostrum", 120), "createdelight:ostrum_dust")
        .heatRequirement("heated")
        .id("createmetallurgy:melting/molten_ostrum_from_ostrum_dust")
    createmetallurgy.melting(Fluid.of("createdelight:molten_calorite", 120), "createdelight:calorite_dust")
        .heatRequirement("heated")
        .id("createmetallurgy:melting/molten_calorite_from_calorite_dust")
    
})