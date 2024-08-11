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
    // 腌制
    e.recipes.vintagedelight.fermenting(
        '5x festival_delicacies:preserved_meat',
        [
            "#forge:raw_pork",
            "#forge:raw_pork",
            "#forge:raw_pork",
            "#forge:raw_pork",
            "#forge:raw_pork",
            "#forge:salt"
        ], 5000
    )
})