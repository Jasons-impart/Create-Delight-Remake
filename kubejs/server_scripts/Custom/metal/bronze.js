ServerEvents.recipes(e => {
    e.recipes.kubejs.shapeless("createdelight:bronze_block", "9x createdelight:bronze_ingot")
    .id("createdelight:bronze_block_from_bronze_ingot")
    e.recipes.kubejs.shapeless("9x createdelight:bronze_ingot", "createdelight:bronze_block")
    .id("createdelight:bronze_ingot_from_bronze_block")
    e.recipes.kubejs.shapeless("9x createdelight:bronze_nugget", "createdelight:bronze_ingot")
    .id("createdelight:bronze_nugget_from_bronze_ingot")
    e.recipes.kubejs.shapeless("createdelight:bronze_ingot", "9x createdelight:bronze_nugget")
    .id("createdelight:bronze_ingot_from_bronze_nugget")

})