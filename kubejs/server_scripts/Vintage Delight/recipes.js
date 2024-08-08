ServerEvents.recipes(e => {
    // 盐
    e.recipes.create.mixing(
        'vintagedelight:salt_dust',
        Fluid.of("water", 250)
    )
    .heated()
    .id("ratatouille:salt")
    e.recipes.kubejs.shapeless(
        '4x vintagedelight:salt_dust',
        'vintagedelight:salt_bucket'
    ).id("vintagedelight:salt_bucket_to_salt")
})