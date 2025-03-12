ServerEvents.recipes(e => {
    e.recipes.kubejs.shapeless("createdelightcore:bronze_block", "9x createdelightcore:bronze_ingot")
    .id("createdelightcore:bronze_block_from_bronze_ingot")
    e.recipes.kubejs.shapeless("9x createdelightcore:bronze_ingot", "createdelightcore:bronze_block")
    .id("createdelightcore:bronze_ingot_from_bronze_block")
    e.recipes.kubejs.shapeless("9x createdelightcore:bronze_nugget", "createdelightcore:bronze_ingot")
    .id("createdelightcore:bronze_nugget_from_bronze_ingot")
    e.recipes.kubejs.shapeless("createdelightcore:bronze_ingot", "9x createdelightcore:bronze_nugget")
    .id("createdelightcore:bronze_ingot_from_bronze_nugget")

})