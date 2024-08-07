ServerEvents.recipes(e => {
    e.recipes.create.mixing("refinedstorage:quartz_enriched_iron", [
        "minecraft:quartz",
        "minecraft:iron_ingot"
    ])
        .heated()
    e.recipes.create.sequenced_assembly("refinedstorage:machine_casing", "#forge:stone", [
        e.recipes.create.deploying("#forge:stone", ["#forge:stone", "refinedstorage:quartz_enriched_iron"])
    ])
        .transitionalItem("#forge:stone")
        .loops(8)
        .id("refinedstorage:machine_casing")
})
