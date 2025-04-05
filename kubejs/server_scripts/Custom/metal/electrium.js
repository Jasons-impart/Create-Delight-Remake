ServerEvents.recipes(e => {
    
    e.recipes.kubejs.shapeless("createdelightcore:electrum_block", "9x createaddition:electrum_ingot")
    .id("createdelightcore:electrum_block_from_electrum_ingot")
    e.recipes.kubejs.shapeless("9x createaddition:electrum_ingot", "createdelightcore:electrum_block")
    .id("createdelightcore:electrum_ingot_from_electrum_block")
    
})