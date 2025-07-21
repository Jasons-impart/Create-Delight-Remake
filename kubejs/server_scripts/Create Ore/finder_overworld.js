const $OreVeinGenerator = Java.loadClass("com.tom.createores.OreVeinGenerator")
const $OreVeinAtlasItem = Java.loadClass("com.tom.createores.item.OreVeinAtlasItem")

ItemEvents.rightClicked("createdelight:prospector", e => {
    const { player, level } = e 
    if (player.cooldowns.isOnCooldown(e.item.item))
        return
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
    let blockPosition = player.blockPosition()
    let {first : pos, second : info} = $OreVeinGenerator.getPicker(level).locate(
        blockPosition,
        level,
        MAX_SEARCH_DIST_IN_BLOCK,
        (vein) => excludedVein.indexOf(vein.getId()) == -1
    )
    let distance = Math.floor(Math.sqrt(
        Math.pow(blockPosition.x - pos.x, 2)
        + Math.pow(blockPosition.z - pos.z, 2)
    ))
    let direction = getDirection(
        Math.floor(blockPosition.x / BLOCK_SIZE),
        Math.floor(blockPosition.z / BLOCK_SIZE),
        Math.floor(pos.x / BLOCK_SIZE),
        Math.floor(pos.z / BLOCK_SIZE)
    )
    let message = Component.translate("message.createdelight.nearest_vein")
                .append(info.getName().color(Color.YELLOW))
    if (direction == 'Same Point') {
        message = message
        .append(Component.translate("message.createdelight.underfoot"))
    } else {
        message = message
        .append(Component.translate("message.createdelight.at", direction, distance))
    }
    player.swing()
    player.addItemCooldown(e.item.item, 60)
    player.setStatusMessage(message)
})
