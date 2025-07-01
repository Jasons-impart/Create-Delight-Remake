BlockEvents.rightClicked("bakeries:paper_cup", e => {
    const {player, hand, block} = e
    if (player.getItemInHand(hand).is("createdelight:cake_batter_bucket")) {
        let prop = block.properties
        
        let fill = prop.get("fill")
        player.tell(fill)
        if (parseInt(prop.get("pile")) == 4 && fill == "false") {
            prop.put("fill", "true")
            block.set(block.id, prop)
            player.setItemInHand(hand, "minecraft:bucket")
            e.cancel()
        }
    }
})