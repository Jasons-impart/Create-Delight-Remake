BlockEvents.rightClicked("bakeries:paper_cup", e => {
    const {player, hand, block} = e
    if (player.getItemInHand(hand).is("createdelight:cake_batter_bucket")) {
        let prop = block.properties
        
        let fill = prop.get("fill")
        // player.tell(fill)
        if (parseInt(prop.get("pile")) == 4 && fill == "false") {
            prop.put("fill", "true")
            block.set(block.id, prop)
            player.setItemInHand(hand, "minecraft:bucket")
            e.cancel()
        }
    }
})
BlockEvents.rightClicked("bakeries:soak_coffee_cut_cake_base", e => {
    const {player, hand, block, server} = e
    if (player.getItemInHand(hand).is("ratatouille:cocoa_powder")) {
        let prop = block.properties
        let stage = prop.get("stage")
        if (stage == 3) {
            player.swing()
            if(!player.isCreative()){
                player.mainHandItem.count--
            }
            server.scheduleInTicks(1, func => {
                block.set('bakeries:tiramisu')
            })
            e.cancel()
        }
    }
})