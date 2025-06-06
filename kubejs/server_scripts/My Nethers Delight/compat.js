ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "mynethersdelight:cutting/ghasmati",
        "mynethersdelight:cutting/minced_strider"
    ])
    cutting_2(e, "mynethersdelight:ghasta", [
        ["mynethersdelight:ghasmati"],
        ["mynethersdelight:ghasmati", 1, 0.05]
    ])
    cutting_2(e, "mynethersdelight:strider_slice", [
        ["mynethersdelight:minced_strider", 2],
        ["minecraft:string"],
        ["minecraft:string", 2, 0.5]
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
