ServerEvents.tags("block", e => {
    Ingredient.of([
        "@vintagedelight",
        "@culturaldelights",
        "@fruitsdelight",
        "@collectorsreap",
        "@neapolitan",
        "@mynethersdelight",
        "@oceanic_delight",
        "@frycooks_delight",
        "@corn_delight"
    ]).stacks.forEach(item => {
        if ((item.id.endsWith("_crate") || item.id.endsWith("_bag")) && item.block) {
            e.add("quality_food:quality_blocks", item.id)
        }
    })
    e.add("createdelight:quality_crops",
        "#minecraft:crops",
        "farmersrespite:tea_bush",
        "farmersrespite:small_tea_bush",
        "neapolitan:vanilla_vine",
        "neapolitan:strawberry_bush",
        "neapolitan:small_banana_frond",
        "neapolitan:banana_frond",
        "neapolitan:large_banana_frond",
        "neapolitan:mint"
    )
})