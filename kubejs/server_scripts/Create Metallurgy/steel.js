ServerEvents.recipes(e => {
    metal_production_line(e, [
        'createmetallurgy:steel_block',
        'createmetallurgy:steel_ingot',
        'ad_astra:steel_nugget',
        'ad_astra:steel_plate',
        "createmetallurgy:molten_steel"
    ], "heated", 100)
    e.recipes.createmetallurgy.melting(
        Fluid.of("createmetallurgy:molten_steel", 10),
        "#forge:nuggets/steel",
        "heated",
        50
    ).id("createmetallurgy:melting/steel_nugget_2")
})