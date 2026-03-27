ServerEvents.tags("minecraft:block", e => {
    e.add("minecraft:dirt", ['createdelightcore:luna_soil', 'createdelightcore:phantom_compost'])
    e.add("minecraft:mushroom_grow_block", ['createdelightcore:luna_soil', 'createdelightcore:phantom_compost'])
})

ServerEvents.tags("minecraft:item", e => {
    // 锻造钢板 - 添加到 forge:plates 标签
    e.add("forge:plates", ['createdelight:forged_steel_sheet'])
})