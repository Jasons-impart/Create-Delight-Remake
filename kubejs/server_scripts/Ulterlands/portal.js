ServerEvents.recipes(e => {
    // 替换配方：裂隙图腾
    e.shaped(Item.of("ulterlands:ulterlands_dimension"), [
        " A ",
        " B ",
        " C "
    ], {
        A: "minecraft:oxidized_copper",
        B: "minecraft:amethyst_shard",
        C: "minecraft:netherite_ingot"
    })
        .id("ulterlands:recipe_rift_totem")
    // 替换配方：B12黑曜石
    e.shaped("ulterlands:obsidian_b_12", [
        "ABA",
        "CDC",
        "ACA"
    ], {
        A: "#minecraft:coals",
        B: "aether:zanite_gemstone",
        C: "alloyed:steel_ingot",
        D: "minecraft:obsidian"
    })
        .id("ulterlands:recipe_ob_12")
})
