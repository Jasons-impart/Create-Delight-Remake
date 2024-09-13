ServerEvents.recipes(e => {
    // 粗硅合成及其烧练
    e.recipes.create.mixing("4x createdelight:raw_silicon", [
        "minecraft:quartz",
        "3x #minecraft:coals"
    ])
        .heated()
        .id("ae2:raw_silicon")
    blast_and_smelting(e, "createdelight:raw_silicon", "ae2:silicon", 0.35, 100)
})