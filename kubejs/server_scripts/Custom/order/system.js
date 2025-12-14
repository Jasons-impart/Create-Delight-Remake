let Order = global.Order
ServerEvents.tick(e => {    
    if (e.server.getLevel("minecraft:overworld").dayTime() % 12000 == 0) {
        let count = Utils.random.nextInt(0, 4)
        for (let i = 0; i < count; i++)
            Order.addOrderToAuction()
    }
})

ItemEvents.rightClicked("createdelight:unopened_order", e => {
    e.player.getItemInHand(e.hand).shrink(1)

    let ret = Order.create(e.player)
    while (ret.entries.length == 0) {
        ret = Order.create(e.player)
    }
    e.player.give(Item.of("createdelight:order", 1, { createdelightOrderInfo: ret }))
})