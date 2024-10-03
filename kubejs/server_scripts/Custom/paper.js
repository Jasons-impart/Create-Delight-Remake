ServerEvents.tags("item", e => {
    e.add("forge:papers_raw_material", [
        'farmersdelight:tree_bark',
        'farmersdelight:straw',
        'createdieselgenerators:wood_chip'
    ])
})
ServerEvents.recipes(e => {
    //竹子制作纸张
    e.replaceInput({id: "minecraft:paper"}, "minecraft:sugar_cane", 'minecraft:bamboo')
    //待发酵的纸浆
    e.recipes.create.mixing(
        Fluid.of("createdelight:unfermented_paper_pulp", 1000), 
        [
            'minecraft:bamboo',
            Fluid.of("minecraft:water", 1000)
        ]).heated().id("create:mixing/unfermented_paper_pulp")
    e.recipes.create.mixing(
        Fluid.of("createdelight:unfermented_paper_pulp", 500),
        [
            "#forge:papers_raw_material",
            Fluid.of("minecraft:water", 500)
        ]).id("create:mixing/unfermented_paper_pulp/papers_raw_material")
    //纸浆
    e.custom({
        "type": "createdieselgenerators:basin_fermenting",
        "ingredients": [
          {
            "fluid": "createdelight:unfermented_paper_pulp",
            "amount": 1000
          }
        ],
        "processingTime": 200,
        "results": [
          {
            "fluid": "createdelight:paper_pulp",
            "amount": 1000
          }
        ]
      })
        .id("vintageimprovements:turning/paper_pulp")
    //未完成的纸
    e.recipes.vintageimprovements.vacuumizing(
        [
            "createdelight:incomplete_paper",
            Fluid.of("minecraft:water", 50)
        ],
        Fluid.of("createdelight:paper_pulp", 50)
    ).secondaryFluidOutput(0).heated().id("create:vacuumizing/incomplete_paper")
    //纸
    e.recipes.create.pressing(
        "minecraft:paper",
        "createdelight:incomplete_paper"
    ).id("create:pressing/paper")

})