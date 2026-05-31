ServerEvents.tags("minecraft:block", e => {
    e.add("minecraft:dirt", ['createdelightcore:luna_soil', 'createdelightcore:phantom_compost'])
    e.add("minecraft:mushroom_grow_block", ['createdelightcore:luna_soil', 'createdelightcore:phantom_compost'])
    e.add("createdelightcore:phantom_compost_activators",[
        'createdelightcore:luna_soil',
        'createdelightcore:luna_soil_farmland',
        'createdelightcore:phantom_compost',
        'createdelightcore:fire_lily_cluster',
        'iceandfire:fire_lily',
        'createdelightcore:frost_lily_cluster',
        'iceandfire:frost_lily',
        'createdelightcore:lightning_lily_cluster',
        'iceandfire:lightning_lily',
    ])
})

ServerEvents.tags("minecraft:item", e => {
    // 锻造钢锭 - 添加到 forge:ingots 标签
    e.add("forge:ingots", ['createdelight:forged_steel_ingot'])
    e.add("forge:ingots/forged_steel", ['createdelight:forged_steel_ingot'])
    // 锻造钢板 - 添加到 forge:plates 标签
    e.add("forge:plates", ['createdelight:forged_steel_sheet'])
    e.add("forge:plates/forged_steel", ['createdelight:forged_steel_sheet'])
})
