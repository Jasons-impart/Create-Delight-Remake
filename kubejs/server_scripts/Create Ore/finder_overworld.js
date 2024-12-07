const $OreVeinGenerator = Java.loadClass("com.tom.createores.OreVeinGenerator")
const $OreVeinAtlasItem = Java.loadClass("com.tom.createores.item.OreVeinAtlasItem")

ItemEvents.rightClicked("createdelight:prospector", e => {
    const { player, level } = e 
    const MAX_SEARCH_DIST_IN_BLOCK = 16 // 最大搜索距离
    const BLOCK_SIZE = 16 // 区块大小

    let excludedVein = []
    player.inventory.allItems.forEach(item => {
        if (item.id == "createoreexcavation:vein_atlas" && item.nbt != null) {
            let exclude = item.nbt[$OreVeinAtlasItem.EXCLUDE]
            // console.log(exclude)
            exclude.forEach(tag => {
                excludedVein.push(tag.getAsString())
            })
        }
    })
    // console.log(excludedVein.toLocaleString())
    let {pos, info} = $OreVeinGenerator.getPicker(level).locate(
        blockPosition,
        level,
        MAX_SEARCH_DIST_IN_BLOCK,
        (vein) => !excludedVein.includes(vein.getId())
    )
    let distance = Math.floor(Math.sqrt(
        (blockPosition.x - pos.x) ** 2
        + (blockPosition.z - pos.z) ** 2
    ))
    let direction = getDirection(
        Math.floor(blockPosition.x / BLOCK_SIZE),
        Math.floor(blockPosition.z / BLOCK_SIZE),
        Math.floor(pos.x / BLOCK_SIZE),
        Math.floor(pos.z / BLOCK_SIZE)
    )
    message = Component.literal("最近的矿脉是")
                .append(info.getName().color(Color.YELLOW))
    if (direction == 'Same Point') {
        message = message.append(", §2就在你脚下")
    } else {
        message = message.append(", 位于")
            .append(direction.color(Color.YELLOW))
            .append(`方§e${distance}§r米`)
    }
    player.swing()
    player.setStatusMessage(message)
})
