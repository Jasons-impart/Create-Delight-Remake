ServerEvents.recipes(e => {
    const { create, createdieselgenerators, vintageimprovements, kubejs, createaddition, minecraft } = e.recipes
    remove_recipes_output(e, [
        "create:dough",
        "farmersdelight:wheat_dough",
        "vintagedelight:oat_dough",
        "bakeries:sweet_dough",
        "bakeries:whole_wheat_dough",
        "bakeries:whole_wheat_flour",
        "bakeries:whole_wheat_flour_bag",
        "bakeries:salted_dough",
        "bakeries:pastry",
        "bakeries:cocoa_dough",
        "bakeries:cocoa_powder"
    ])
    e.replaceInput({}, "bakeries:butter_cube", "#forge:animal_oil")
    e.replaceInput({}, "bakeries:cheese_cube", "#forge:cheese")
    e.replaceInput({}, "bakeries:cocoa_dough", "createcafe:oreo_dough")
    e.replaceInput({ id: "bakeries:cheese_cocoa_toast_dough" }, "minecraft:cocoa_beans", "ratatouille:dried_cocoa_nibs")
    e.replaceOutput({}, "bakeries:salt", "vintagedelight:salt")
    e.replaceOutput({}, "bakeries:butter_cube", "createdelight:butter")
    /**
     * 
     * @param {InputItem_} item 
     * @param {number} count 
     * @param {number} chance 
     * @returns 
     */
    function multi_item(item, count) {
        let list = []
        for (let i = 0; i < count; i++) {
            list.push(Ingredient.of(item))
        }
        return list
    }
    //酵母
    create.filling("bakeries:bottle_yeast", ["minecraft:glass_bottle", Fluid.of("createdelight:yeast", 250)])
        .id("bakeries:filling/bottle_yeast")
    create.emptying(["minecraft:glass_bottle", Fluid.of("createdelight:yeast", 250)], "bakeries:bottle_yeast")
        .id("bakeries:emptying/bottle_yeast")
    createdieselgenerators.basin_fermenting(Fluid.of("createdelight:yeast", 50), ["#forge:flour", "minecraft:sugar", Fluid.water(250)])
        .processingTime(300)
        .id("bakeries:basin_fermenting/yeast")
    createdieselgenerators.basin_fermenting(Fluid.of("createdelight:yeast", 500), ["createdelight:dry_yeast", Fluid.water(500)].concat(multi_item("#forge:flour", 3)))
        .processingTime(300)
        .id("bakeries:basin_fermenting/yeast_2")
    vintageimprovements.vacuumizing([Fluid.water(200), "createdelight:dry_yeast"], Fluid.of("createdelight:yeast", 250))
        .secondaryFluidOutput(0)
        .id("createdelight:vacuumizing/dry_yeast")
    create.mixing(Fluid.of("createdelight:yeast", 250), [Fluid.water(200), "createdelight:dry_yeast"])
        .id("createdelight:mixing/yeast_fluid")

    //面团
    // createdieselgenerators.basin_fermenting(["16x bakeries:whole_wheat_dough", Item.of("create:wheat_flour", 16).withChance(0.25)], multi_item("createdelight:dry_yeast", 4).concat(multi_item("create:wheat_flour", 16)).concat(Fluid.water(800)))
    //     .processingTime(400)
    //     .id("bakeries:basin_fermenting/whole_wheat_dough")
    create.splashing("bakeries:whole_wheat_dough", "create:wheat_flour")
        .id("bakeries:splashing/whole_wheat_dough")
    createdieselgenerators.basin_fermenting(["16x create:dough", Item.of("bakeries:flour", 16).withChance(0.25)], multi_item("createdelight:dry_yeast", 4).concat(multi_item("bakeries:flour", 16)).concat(Fluid.water(800)))
        .processingTime(400)
        .id("create:basin_fermenting/dough")
    createdieselgenerators.basin_fermenting(["16x farmersdelight:wheat_dough", Item.of("bakeries:flour", 16).withChance(0.25)], multi_item("createdelight:dry_yeast", 4).concat(multi_item("bakeries:flour", 16)).concat(Fluid.of("createdelight:egg_yolk", 800)))
        .processingTime(400)
        .id("farmersdelight:basin_fermenting/wheat_dough")
    // createdieselgenerators.basin_fermenting(["16x vintagedelight:oat_dough", Item.of("vintagedelight:raw_oats", 16).withChance(0.25)], multi_item("createdelight:dry_yeast", 4).concat(multi_item("vintagedelight:raw_oats", 16)).concat(Fluid.of("createdelight:egg_yolk", 800)))
    //     .processingTime(400)
    //     .id("vintagedelight:basin_fermenting/oat_dough")
    // createdieselgenerators.basin_fermenting(["16x culturaldelights:corn_dough", Item.of("createdelight:corn_flour", 16).withChance(0.25)], multi_item("createdelight:dry_yeast", 4).concat(multi_item("createdelight:corn_flour", 16)).concat(Fluid.water(800)))
    //     .processingTime(400)
    //     .id("culturaldelights:basin_fermenting/corn_dough")
    create.mixing("bakeries:sweet_dough", ["farmersdelight:wheat_dough", "minecraft:sugar"])
        .id("bakeries:mixing/sweet_dough")
    cutting_3(e, "minecraft:cooked_porkchop", [["bakeries:meat_floss", 4]])

    minecraft.smelting("minecraft:bread", "bakeries:whole_wheat_dough")
        .id("bakeries:smelting/whole_wheat_dough")
    //酥皮
    kubejs.shaped("createdelight:puff_pastry",
        [
            " A",
            " B"
        ],
        {
            A: "#forge:animal_oil",
            B: "createdelight:oil_dough"
        }
    ).id("bakeries:puff_pastry")
    //面胚
    {
        let iner = "bakeries:sweet_dough"
        create.sequenced_assembly("6x bakeries:round_bread_dough", iner, [
            vintageimprovements.curving(iner, iner)
                .mode(2),
            create.cutting(iner, iner)
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("bakeries:sequenced_assembly/round_bread_dough")
    }
    vintageimprovements.curving("4x bakeries:bagel_dough", "bakeries:sweet_dough")
        .mode(1)
        .id("bakeries:curving/bagel_dough")

    vintageimprovements.curving("4x bakeries:whole_wheat_bagel_dough", "bakeries:whole_wheat_dough")
        .mode(1)
        .id("bakeries:curving/whole_wheat_bagel_dough")
    {
        let iner = "ratatouille:salty_dough"
        create.sequenced_assembly("4x bakeries:ciabatta_dough", iner, [
            vintageimprovements.curving(iner, iner)
                .mode(1),
            create.cutting(iner, iner)
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("bakeries:sequenced_assembly/ciabatta_dough")
    }
    vintageimprovements.curving("bakeries:country_bread_dough", "ratatouille:salty_dough")
        .mode(2)
        .id("bakeries:curving/country_bread_dough")
    createaddition.rolling("createdelight:puff_pastry", "4x bakeries:croissant_dough")
        .id("bakeries:rolling/croissant_dough")
    createaddition.rolling("ratatouille:salty_dough", "2x bakeries:baguette_dough")
        .id("bakeries:rolling/baguette_dough")
    create.deploying("bakeries:berry_bread_dough", ["bakeries:round_bread_dough", "minecraft:sweet_berries"])
        .id("bakeries:deploying/berry_bread_dough")
    //其他
    vintageimprovements.vacuumizing([Fluid.water(150), "bakeries:brown_sugar_cube"], Fluid.of("createdelight:unrefined_sugar", 200))
        .secondaryFluidOutput(0)
        .heated()
        .id("bakeries:vacuumizing/brown_sugar_cube")
})