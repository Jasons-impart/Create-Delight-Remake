ServerEvents.recipes(e => {
    const { createmetallurgy, create, minecraft, vintageimprovements, kubejs } = e.recipes

    e.replaceInput(
        { id: "create_integrated_farming:crafting/roost" },
        "minecraft:bamboo",
        "#collectorsreap:dart_shooters"
    )

    kubejs.shapeless(
        'create_integrated_farming:roost',
        [
            "farmersdelight:bamboo_basket",
            "minecraft:wheat"
        ]
    ).id("createdelight:shapeless/roost")
})
