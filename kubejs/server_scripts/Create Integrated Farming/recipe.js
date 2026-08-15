ServerEvents.recipes(e => {
    const { createmetallurgy, create, minecraft, vintageimprovements, kubejs } = e.recipes

    remove_recipes_id(e,[
        "create_integrated_farming:crafting/vacuum_harvester"
    ])

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

    kubejs.shaped(
        'create_integrated_farming:vacuum_harvester',
        [
            "ABA",
            "ECE",
            "ADA"
        ], {
        A: "create:brass_sheet",
        B: "create:mechanical_harvester",
        C: "create:nozzle",
        D: "create:encased_fan",
        E: "createdelight:steel_sheet"
    }
    ).id("createdelight:crafting/vacuum_harvester")
})
