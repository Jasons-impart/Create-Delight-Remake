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
})