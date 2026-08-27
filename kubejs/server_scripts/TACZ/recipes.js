ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "tacz:gunpowder",
        "tacz:gun_smith_table",
        "tacz:target"
    ])
    // 军械师枪包改用 CurseForge 官方包，包内配方（枪械工作台合成与工作台方块配方）全部在此移除，
    // 由本目录与《Kinetic Pixel》的 createdelight:* 配方接管
    remove_recipes_mod(e, ["applied_armorer", "create_armorer"])
    e.recipes.kubejs.shaped(
        'tacz:target',
        [
            "AAA",
            "ABA",
            "AAA"
        ], {
            A: "minecraft:iron_ingot",
            B: 'dummmmmmy:target_dummy'
        }
    ).id("createdelight:target")
})
