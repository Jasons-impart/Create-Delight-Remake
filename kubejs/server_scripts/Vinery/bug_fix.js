ServerEvents.recipes(e => {
    let logs = [
        ['vinery:apple_log', 'minecraft:stripped_oak_log'],
        ['vinery:apple_wood', 'minecraft:stripped_oak_wood'],
        ['vinery:dark_cherry_log', 'vinery:stripped_dark_cherry_log'],
        ['vinery:dark_cherry_wood', 'vinery:stripped_dark_cherry_wood']
    ]
    logs.forEach(log => {
        e.recipes.create.cutting(
            log[1],
            log[0]
        ).id("create:cutting/" + log[0].split(":")[1])
        e.custom({
            type: "farmersdelight:cutting",
            ingredients: [{item: log[0]}],
            result: [
                {item: log[1]},
                {item: "farmersdelight:tree_bark"}
            ],
            sound: "minecraft:item.axe.strip",
            tool: {
                type: "farmersdelight:tool_action",
                action: "axe_strip"
            }
        }).id("farmersdelight:cutting/" + log[0].split(":")[1])
    });
})
BlockEvents.rightClicked('vinery:fermentation_barrel', e => {
    e.cancel()
})