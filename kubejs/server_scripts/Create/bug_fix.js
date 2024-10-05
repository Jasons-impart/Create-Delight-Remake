BlockEvents.rightClicked("alexsmobs:capsid", e => {
    const { block, player, level } = e
    if( block.entityData["Items"][0]["id"] == "create:minecart_contraption" && player.mainHandItem.id == "create:minecart_contraption"){
        e.cancel()
    }
    if( block.entityData["Items"][0]["id"].search("present") != -1 && player.mainHandItem.id.search("present") != -1 ){
        e.cancel()
    }
})
ServerEvents.tags("block", e => {
    e.remove("create:safe_nbt", [
        "create:clipboard"
    ])
})