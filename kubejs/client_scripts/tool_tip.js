let tooltips = [
    ["cgm:workbench", "§l§4请不要拿出来, 会崩溃!!!", "§l§4Please don't take it out, it will collapse!!!"],
    ["vinery:cherry_boat", "§l§4请不要拿出来, 会崩溃!!!", "§l§4Please don't take it out, it will collapse!!!"],
    ["vinery:cherry_chest_boat", "§l§4请不要拿出来, 会崩溃!!!", "§l§4Please don't take it out, it will collapse!!!"],
    ["vinery:grapevine_stem", "§l§4请不要拿出来, 会崩溃!!!", "§l§4Please don't take it out, it will collapse!!!"],
    ["nethervinery:obsidian_stem", "§l§4请不要拿出来, 会崩溃!!!", "§l§4Please don't take it out, it will collapse!!!"],
    ["alloyed:steel_ingot", "§6可以在有工作盆铸造盖的工作盆里采用超级加热合成熔融钢!!", "§6Super heated synthetic molten steel can be used in a working basin with a working basin casting lid!!"],
    ["brewinandchewin:keg", "§e周围放置营火以增加温度,放置冰块以降低温度", "§ePlace a campfire around to increase the temperature and ice cubes to lower the temperature"],
    ["createdieselgenerators:oil_barrel", "§6可以防止燃料爆炸", "§6Can prevent fuel explosion"],
    ["createdelight:raw_steel_ingot", "§6注入岩浆后锤炼进行纯化", "§6Inject magma and press it for purification"],
    ["ratatouille:frozen_block", "§b可冷却周围一格以内的物品", "§bCools down items within one block of the area"],
    ['createdieselgenerators:distillation_controller', "§a每个储罐都需要一个", "§aOne is needed for each tank"],
    ['farmersdelight:ham', "§4目前只能通过用刀杀死疣猪兽来获得,或人工制作一个", "§4Currently it can only be obtained by killing a hoglin with a knife, or crafting one"],
    ['vintageimprovements:belt_grinder', "§aRPM≤16为低转速,§616≤RPM≤64为中转速,§4RPM≥64为高转速", "§aRPM≤16 is low rotational speed,§616≤ RPM≤64 is medium rotational speed and §4RPM≥64 is high rotational speed"]
]
tooltips.forEach (([key, zh_cn, en_us]) => {
    // 添加 key
    ItemEvents.tooltip (e => {
        e.add(key, Text.translate(key))
    })

    // 添加简体中文本地化
    ClientEvents.lang ("zh_cn", e => {
        e.add(key, zh_cn)
    })

    // 添加英文本地化
    ClientEvents.lang ("en_us", e => {
        e.add(key, en_us)
    })
})