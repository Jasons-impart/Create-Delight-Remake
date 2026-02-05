//添加tetra:pale_steel_needle
StartupEvents.registry('item', event => {
    event.create('tetra:pale_steel_needle')
    //注册tetra命名空间下的pale_steel_needle物品
        .displayName('pale_steel_needle')
        //注册名称
        .maxStackSize(64)
        //设置最大堆叠数量
        .texture('tetra:item/module/modles/pale_steel_needle/pale_steel_needle')
        //设置模型
})