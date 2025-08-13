ServerEvents.recipes(event => {
    const item_replace_map = global.item_replace_map
    // console.log("azdev: ")
    // console.log(item_replace_map)
    Object.keys(item_replace_map).forEach(to_item => {
        // console.log("azdev: to_item: " + to_item)
        const from_items = item_replace_map[to_item]
        // console.log("azdev: from_items: ")
        // console.log(from_items)
        from_items.forEach(from_item => {
            event.replaceInput({input: from_item}, from_item, to_item)
            event.replaceOutput({output: from_item}, from_item, to_item)
        })
    })
})

ServerEvents.tags('minecraft:item', event => {
    const item_replace_map = global.item_replace_map
    Object.keys(item_replace_map).forEach(to_item => {
        const from_items = item_replace_map[to_item]
        // console.log("azdev: from_items: ")
        // console.log(from_items)
        // console.log(toString(from_items))
        from_items.forEach(from_item => {
            // console.log("azdev: from_item: " + from_item)
            let tags = Item.of(from_item).getTags().toList()
            // console.log(tags)
            if (tags.length > 0) {
                tags.forEach(tag => {
                    // console.log("azdev: ")
                    // console.log(tag)
                    // console.log(tag.location())
                    event.add(tag.location(), to_item)
                })
                event.removeAllTagsFrom(from_item)
            }
        })
    })
})