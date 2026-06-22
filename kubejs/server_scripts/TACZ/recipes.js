ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "tacz:gunpowder",
        "tacz:gun_smith_table",
        "tacz:target",
        "applied_armorer:worckbench_applied_armorer"
    ])
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
