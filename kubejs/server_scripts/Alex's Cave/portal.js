BlockEvents.rightClicked(e => {
    const {player, block} = e
    if(player.mainHandItem.id == "create_new_age:overcharged_diamond" && block.id == "create_new_age:magnetite_block") {
        player.swing()
    } 
    if(player.mainHandItem.id == "alexscaves:sulfur_dust" && block.id == "alexscaves:sulfur") {
        player.swing()
    } 
    if(player.mainHandItem.id == "minecraft:bone" && block.id == "create:limestone") {
        player.swing()
    } 
    if(player.mainHandItem.id == "art_of_forging:shards_of_malice" && block.id == "minecraft:packed_mud") {
        player.swing()
    } else {
        return 0
    }
})