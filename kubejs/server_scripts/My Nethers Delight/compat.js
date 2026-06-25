ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "mynethersdelight:cutting/ghasmati",
        "mynethersdelight:cutting/minced_strider"
    ])
    cutting(e, "mynethersdelight:ghasta", [
        "mynethersdelight:ghasmati",
        Item.of("mynethersdelight:ghasmati").withChance(0.05)
    ])
    cutting(e, "mynethersdelight:strider_slice", [
        "2x mynethersdelight:minced_strider",
        "minecraft:string",
        Item.of("minecraft:string", 2).withChance(0.5)
    ])
})

BlockEvents.rightClicked(e => {
    const { player, block } = e;
    if (player.mainHandItem.hasTag("forge:tools/knives")) {
        if (block.id === "mynethersdelight:bread_loaf_block") {
            let prop = block.properties
            let bites = parseInt(prop.get("bites"))
            if (bites != 4) {
                prop.put("bites", (bites + 1).toString())
                block.set(block.id, prop)
            }
            else
                block.set("air")
            block.popItem("bakeries:sliced_toast")
            e.cancel()
        }
        else if (block.id === "mynethersdelight:bread_loaf_block") {
            let prop = block.properties
            let servings = parseInt(prop.get("servings"))
            if (servings != 0) {
                prop.put("servings", (servings - 1).toString())
                block.set(block.id, prop)
            }
            else
                block.set("air")
            block.popItem("bakeries:sliced_toast")
            e.cancel()
        }
    }
})
