ServerEvents.recipes(e => {
    const {create, createdieselgenerators, vintageimprovements, createaddition, createmetallurgy} = e.recipes
    e.replaceInput({id: "explorerscompass:explorers_compass"}, "minecraft:cracked_stone_bricks", "#forge:ingots/steel")
    fermenting(e,
        "farmersdelight:rich_soil", 
        [
            "farmersdelight:organic_compost",
            Fluid.water(100),
            "#forge:mushrooms"
        ], 600
    )
    fermenting(e,
        "mynethersdelight:resurgent_soil", 
        [
            "mynethersdelight:letios_compost",
            Fluid.lava(100),
            ["minecraft:warped_fungus", "minecraft:crimson_fungus"]
        ], 600, "heated"
    )

    create.filling(
        "createdelight:fuel_hotcream",
        [
            "mynethersdelight:powder_cannon",
            Fluid.of("createdelight:fuel_mixtures", 50)
        ]
    ).id("createdelight:filling/fuel_hotcream")
    // vintageimprovements.polishing("createdelight:needle", "#forge:rods/iron")
    createmetallurgy.grinding("createdelight:needle", "#forge:rods/iron")
    .id("createdelight:polishing/needle")
    {
        let iner = "alexscaves:polymer_plate"
        create.sequenced_assembly("createdelight:blood_collection_device", iner, [
            createaddition.rolling(iner, iner),
            create.deploying(iner, [iner, "createdelight:needle"])
        ])
        .loops(1)
        .transitionalItem(iner)
        .id("createdelight:sequenced_assembly/blood_collection_device")
    }
})