ItemEvents.tooltip(e => {
    e.addAdvancedToAll((item, advanced, text) => {
        let comp = Component.empty()
        let added = false
        /**@type {Internal.Stream<Internal.TagKey<Internal.Item>>} */
        let tags = item.getTags()
        tags.filter(tag => tag.location().toString().startsWith("createdelight:order"))
            .forEach(tag => {
                let type = tag.location().path.split("/")[1]
                comp.append(Text.translate("tooltip.createdelight.order.entries." + type))
                .append('-')
                .append(Text.translate("tooltip.createdelight.order.tier." + global.Order.getFoodOrderProperty(item, type)))
                .append(' ')
                added = true
            })
        if (added)
            text.add(comp)
    })
    e.addAdvanced("minecraft:paper", (item, advanced, text) => {
        let comp = Component.empty()
        /**
         * Item.of('minecraft:paper', '{createdelightOrderInfo:{entries:[{count:70.0d,id:"food",minQuality:0.0d},{count:77.0d,id:"food",minQuality:0.0d}],type:"food"}}')
         */
        
        /**
         * @type {{count: number, id: string, minQuality: number}[]}
         */
        let entries = item.nbt.createdelightOrderInfo.entries
        let type = item.nbt.createdelightOrderInfo.type
        
        text.add(Text.translate("tooltip.createdelight.order.customer." + type))
        entries.forEach(value => {
            let tmp = Text.translate("tooltip.craetedelight.order.entrie", 
                Text.translate("tooltip.createdelight.order.entries." + value.id),
                parseInt(value.count),
                 Text.translate("tooltip.createdelight.order.tier." + value.minQuality))
            text.add(tmp)
        })
    })
})