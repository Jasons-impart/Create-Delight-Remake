ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "createbigcannons:cutting/spring_wire_iron"
    ])
    e.recipes.minecraft.crafting_shaped(
        'createbigcannons:basin_foundry_lid', [
            "   ",
            " A ",
            "BBB"
        ], {
            A:"createbigcannons:cast_iron_ingot",
            B:"alloyed:steel_sheet"
        }
    )
    .id("createbigcannons:basin_foundry_lid")
    e.custom({
        "type": "createbigcannons:melting",
        "heatRequirement": "superheated",
        "ingredients": [
          {
            "tag": "forge:iron_series"
          },
          {
            "tag":"minecraft:coals"
          }
        ],
        "processingTime": 180,
        "results": [
          {
            "amount": 90,
            "fluid": "createbigcannons:molten_steel"
          }
        ]
    })
    .id("createdelight:recipes/steel")
})