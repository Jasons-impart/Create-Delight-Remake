ServerEvents.recipes(e => {
    const {create, createdieselgenerators} = e.recipes
    create.crushing(["12x createdieselgenerators:wood_chip",
        Item.of("createdieselgenerators:wood_chip", 4).withChance(0.5),
        Item.of("farmersdelight:tree_bark", 1).withChance(0.75)],
    "#minecraft:logs")
    .id("createdelight:crushing/logs")
    createdieselgenerators.basin_fermenting(["farmersdelight:rich_soil"], ["farmersdelight:organic_compost", Fluid.water(100), "#forge:mushrooms"])
    .processingTime(600)
    .id("createdelight:basin_fermenting/rich_soil")
    createdieselgenerators.basin_fermenting(["mynethersdelight:resurgent_soil"], ["mynethersdelight:letios_compost", Fluid.lava(100), "#minecraft:candles"])
    .processingTime(600)
    .heatRequirement("heated")
    .id("createdelight:basin_fermenting/resurgent_soil")
})