ServerEvents.recipes(e => {
    e.recipes.kubejs.shapeless("createdelightcore:tin_block", "9x createdelightcore:tin_ingot")
    .id("createdelightcore:tin_block_from_tin_ingot")
    e.recipes.kubejs.shapeless("9x createdelightcore:tin_ingot", "createdelightcore:tin_block")
    .id("createdelightcore:tin_ingot_from_tin_block")
    e.recipes.kubejs.shapeless("9x createdelightcore:tin_nugget", "createdelightcore:tin_ingot")
    .id("createdelightcore:tin_nugget_from_tin_ingot")
    e.recipes.kubejs.shapeless("createdelightcore:tin_ingot", "9x createdelightcore:tin_nugget")
    .id("createdelightcore:tin_ingot_from_tin_nugget")
    e.recipes.kubejs.shapeless("createdelightcore:raw_tin_block", "9x createdelightcore:raw_tin")
    .id("createdelightcore:raw_tin_block_from_raw_tin")
    e.recipes.kubejs.shapeless("9x createdelightcore:raw_tin", "createdelightcore:raw_tin_block")
    .id("createdelightcore:raw_tin_from_raw_tin_block")
    e.recipes.minecraft.blasting("createdelightcore:tin_ingot", "createdelightcore:raw_tin")
    e.recipes.minecraft.smelting("createdelightcore:tin_ingot", "createdelightcore:raw_tin")
    e.recipes.minecraft.blasting("createdelightcore:tin_block", "createdelightcore:raw_tin_block")
    e.recipes.minecraft.smelting("createdelightcore:tin_block", "createdelightcore:raw_tin_block")
})