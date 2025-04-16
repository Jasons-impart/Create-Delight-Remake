ServerEvents.recipes(e => {
    const {create, createdieselgenerators, vintageimprovements, createaddition} = e.recipes
    create.crushing(["12x createdieselgenerators:wood_chip",
        Item.of("createdieselgenerators:wood_chip", 4).withChance(0.5),
        Item.of("farmersdelight:tree_bark", 1).withChance(0.75)],
    "#minecraft:logs")
    .id("createdelight:crushing/logs")
    createdieselgenerators.basin_fermenting(["farmersdelight:rich_soil"], ["farmersdelight:organic_compost", Fluid.water(100), "#forge:mushrooms"])
    .processingTime(600)
    .id("createdelight:basin_fermenting/rich_soil")
    createdieselgenerators.basin_fermenting(["mynethersdelight:resurgent_soil"], ["mynethersdelight:letios_compost", Fluid.lava(100), ["minecraft:warped_fungus", "minecraft:crimson_fungus"]])
    .processingTime(600)
    .heatRequirement("heated")
    .id("createdelight:basin_fermenting/resurgent_soil")

    create.filling("createdelight:fuel_hotcream", ["mynethersdelight:powder_cannon", Fluid.of("createdelight:fuel_mixtures", 50)])
    .id("createdelight:filling/fuel_hotcream")
    vintageimprovements.polishing("createdelight:needle", "#forge:rods/iron")
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