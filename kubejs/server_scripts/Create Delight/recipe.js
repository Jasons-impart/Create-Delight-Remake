ServerEvents.recipes(e => {
    const {vintageimprovements, kubejs, create} = e.recipes

    kubejs.shaped("createdelight:copper_coil", [
        "ABA",
        "BCB",
        "ABA"
    ],
    {
        A: "createaddition:copper_wire",
        B: "create:copper_sheet",
        C: "createdelightcore:steel_casing"
    })
    .id("createdelight:copper_coil")

    {
        let iner = "createdelightcore:steel_casing"
        create.sequenced_assembly("createdelight:copper_coil", iner, [
            create.deploying(iner, [iner, "createaddition:copper_wire"]),
            create.deploying(iner, [iner, "create:copper_sheet"])
        ])
            .loops(2)
            .transitionalItem(iner)
            .id("createdelight:sequenced_assembly/copper_coil_casing")
    }

    //深层锡矿石因未知原因没有粉碎轮配方，补充粉碎配方
    create.crushing(["create:crushed_raw_tin",
        Item.of("create:crushed_raw_tin").withChance(0.75),
        Item.of("create:experience_nugget").withChance(0.75)
    ],
        "createdelightcore:deepslate_tin_ore")
        .id("create:crushing/crushed_deepslate_tin_ore")
        
    kubejs.shapeless("createdelightcore:phantom_compost", [
        "2x vintagedelight:organic_mash",
        "ad_astra:moon_sand",
        "ad_astra:cheese",
        ["ad_astra:cheese", "farmersdelight:straw"],
        "4x minecraft:bone_meal"
    ])
    .id("createdelightcore:phantom_compost_from_organic_mash")
    kubejs.shapeless("createdelightcore:phantom_compost", [
        "ad_astra:moon_sand",
        "2x minecraft:rotten_flesh",
        "2x ad_astra:cheese",
        "4x minecraft:bone_meal"
    ])
    .id("createdelightcore:phantom_compost")
    fermenting(e, "createdelightcore:luna_soil", [
        "createdelightcore:phantom_compost", 
        ["ad_astra:strophar_mushroom", "ad_astra:aeronos_mushroom"], 
        Fluid.of("netherexp:ectoplasm", 100)], 600)
    kubejs.shaped("createdelight:quality_absorber", [
        "ABA",
        "ACA",
        "AAA"
    ], {
        A: "#forge:plates/bronze",
        B: "lightmanscurrency:trading_core",
        C: "create:rose_quartz"
    })
    .id("createdelight:quality_absorber")
    cutting(e, "createdelightcore:fire_lily_cluster", [["iceandfire:fire_lily", 4]])
    cutting(e, "createdelightcore:frost_lily_cluster", [["iceandfire:frost_lily", 4]])
    cutting(e, "createdelightcore:lightning_lily_cluster", [["iceandfire:lightning_lily", 4]])
})