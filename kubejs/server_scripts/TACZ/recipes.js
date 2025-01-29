ServerEvents.recipes(e => {
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
    ).id("tacz:target")
})