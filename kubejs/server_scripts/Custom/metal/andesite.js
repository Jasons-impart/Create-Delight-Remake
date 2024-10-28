ServerEvents.recipes(e => {
    e.recipes.kubejs.shapeless("9x createdelight:andesite_alloy_nugget", "create:andesite_alloy")
    .id("createdelight:andesite_alloy_nugget_from_andesite_alloy")
    e.recipes.kubejs.shapeless("create:andesite_alloy", "9x createdelight:andesite_alloy_nugget")
    .id("createdelight:andesite_alloy_from_andesite_alloy_nugget")
})