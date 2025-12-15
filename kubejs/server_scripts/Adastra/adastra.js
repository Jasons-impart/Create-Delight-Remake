ServerEvents.recipes(e => {
    // 移除配方：ad_astra
    remove_recipes_type(e, [
        "ad_astra:refining",
        "ad_astra:cryo_freezing",
        "ad_astra:nasa_workbench",
        "ad_astra:compressing",
        "ad_astra:alloying",
    ])
    remove_recipes_output(e, [
        "ad_astra:compressor",
        "ad_astra:coal_generator",
        "ad_astra:cable_duct",
        "ad_astra:ostrum_fluid_pipe",
        "ad_astra:desh_cable",
        "ad_astra:steel_cable",
        "ad_astra:desh_fluid_pipe",
        "ad_astra:fluid_pipe_duct",
        "ad_astra:water_pump",
        "ad_astra:nasa_workbench",
        "ad_astra:wrench",
        "ad_astra:steel_plate"
    ])
    remove_recipes_id(e, [
        "ad_astra:fuel_refinery",
        "ad_astra:cryo_freezer",
        "ad_astra_giselle_addon:crafting/gravity_normalizer",
        "ad_astra_giselle_addon:crafting/automation_nasa_workbench",
        "ad_astra:steel_block",
        "ad_astra:etrionic_blast_furnace",
        "ad_astra:oxygen_loading/oxygen_from_oxygen_loading_water",
        "ad_astra:steel_ingot_from_steel_block"
    ])
    e.replaceInput({ id: "ad_astra:oxygen_distributor" }, "ad_astra:oxygen_loader", "createdelight:electrolyzer")
    e.replaceInput({id: "ad_astra:etrionic_capacitor"}, "minecraft:diamond", "createaddition:capacitor")
    // 新增配方：霜原木
    e.recipes.kubejs.shapeless("ad_astra:glacian_log", [
        "#minecraft:logs",
        "ad_astra:ice_shard"
    ])
    // 新增配方：霜原树叶
    e.recipes.kubejs.shapeless("ad_astra:glacian_leaves", [
        "#minecraft:leaves",
        "ad_astra:ice_shard"
    ])
    // 替换配方：喷气式航天服
    e.recipes.kubejs.shaped("ad_astra:jet_suit", [
        "ABA",
        "CDC",
        "EFE"
    ], {
        A: "#forge:plates/calorite",
        B: "create_sa:brass_jetpack_chestplate",
        C: "ad_astra:calorite_tank",
        D: "ad_astra:netherite_space_suit",
        E: 'ad_astra:etrionic_capacitor',
        F: "ad_astra:calorite_engine"
    })
        .id("ad_astra:jet_suit")
    //替换配方：氧气罐
    e.recipes.kubejs.shaped("ad_astra:gas_tank", [
        "ABA",
        "ACA",
        "AAA"
    ], {
        A: "#forge:plates/steel",
        B: "#forge:rods/iron",
        C: "create:fluid_tank"
    }).id("ad_astra:gas_tank")
    //替换配方：引擎框架
    e.recipes.kubejs.shaped("ad_astra:engine_frame", [
        "AAA",
        "ABA",
        "AAA"
    ], {
        A: "#forge:rods/iron",
        B: "create:precision_mechanism"
    }).id("ad_astra:engine_frame")
    //替换配方：引擎风扇
    e.recipes.kubejs.shaped("ad_astra:fan", [
        " A ",
        "ABA",
        " A "
    ], {
        A: "#forge:plates/steel",
        B: "create:propeller"
    }).id("ad_astra:fan")
    //替换配方：充能器
    e.recipes.kubejs.shaped("ad_astra:energizer", [
        "ABA",
        "ACA",
        "ADA"
    ], {
        A: "ad_astra:ostrum_plate",
        B: "create:depot",
        C: 'ad_astra:etrionic_capacitor',
        D: "createaddition:modular_accumulator"
    }).id("ad_astra:energizer")
    //石墨
    e.recipes.kubejs.shapeless(
        'createmetallurgy:graphite',
        [
            "8x #minecraft:coals",
            "minecraft:clay_ball"
        ]
    ).id("createmetallurgy:crafting/materials/graphite")
    //替换配方：氧气装载机
    e.recipes.kubejs.shaped('createdelight:electrolyzer', [
        "AAA",
        "BCB",
        "ADA"
    ], {
        A: "#forge:plates/steel",
        B: "ad_astra:gas_tank",
        C: '#forge:graphite',
        D: "createaddition:modular_accumulator"
    }).id("ad_astra:oxygen_loader")
    // 混合燃料
    e.recipes.create.mixing(
        Fluid.of("createdelight:fuel_mixtures", 100),
        [
            Fluid.of("createdieselgenerators:gasoline", 50),
            Fluid.of("createdieselgenerators:diesel", 50)
        ]
    ).id("ad_astra:recipes/fuel_mixtures")
    e.recipes.create.mixing(
        Fluid.of("createdelight:fuel_mixtures", 200),
        [
            Fluid.of("createdieselgenerators:gasoline", 50),
            Fluid.of("createdieselgenerators:biodiesel", 75)
        ]
    ).id("ad_astra:sub_recipes/fuel_mixtures")
    // 电子核心
    e.recipes.kubejs.shaped(
        "3x ad_astra:etrionic_core", [
        "AAA",
        "BBB",
        "AAA"
    ], {
        A: "createaddition:zinc_sheet",
        B: "createaddition:electrum_sheet"
    }
    ).id("ad_astra:crafting/etrionic_core")
    e.recipes.kubejs.shaped(
        "3x ad_astra:etrionic_core",
        [
            " A ",
            " B ",
            " A "
        ],{
            A: 'create_new_age:overcharged_iron_sheet',
            B: 'create_new_age:overcharged_golden_sheet'
        }
    ).id("ad_astra:shapeless/etrionic_core")
    // 电容器
    e.recipes.kubejs.shaped(
        "ad_astra:etrionic_capacitor", [
        "ABA",
        "BCB",
        "DBD"
    ], {
        A: "minecraft:redstone",
        B: "#forge:plates/steel",
        C: "ad_astra:etrionic_core",
        D: "minecraft:diamond"
    }
    ).id("ad_astra:etrionic_capacitor")
    // 太阳能面板
    e.replaceInput({ id: "ad_astra:photovoltaic_etrium_cell" }, "minecraft:diamond", "ad_astra:etrionic_core")
    // 太阳能
    e.recipes.kubejs.shaped(
        "ad_astra:solar_panel", [
        "AAA",
        "BCB",
        "CDC"
    ], {
        A: "ad_astra:photovoltaic_etrium_cell",
        B: "#forge:plates/steel",
        C: "#forge:plates/desh",
        D: "ad_astra:etrionic_core"
    }
    ).id("ad_astra:solar_panel")
    e.recipes.kubejs.shaped(
        "ad_astra_giselle_addon:oxygen_can", [
        " A ",
        "BCB",
        "BDB"
    ], {
        A: "#forge:rods/steel",
        B: "#forge:plates/steel",
        C: 'ad_astra:large_gas_tank',
        D: "ad_astra:oxygen_gear"
    }
    ).id("ad_astra_giselle_addon:crafting/oxygen_can")
    e.recipes.vintageimprovements.pressurizing(Fluid.of("ad_astra:cryo_fuel", 100), [Fluid.of("ad_astra:hydrogen", 250), Fluid.of("netherexp:ectoplasm", 250)])
    .secondaryFluidInput(0)
    .id("ad_astra:pressurizing/cryo_fuel")
    e.recipes.create.crushing(Item.of("ad_astra:aeronos_mushroom").withChance(0.2), "#ad_astra:aeronos_caps")
    .id("ad_astra:crushing/aeronos_mushroom")
    e.recipes.create.crushing(Item.of("ad_astra:strophar_mushroom").withChance(0.2), "#ad_astra:strophar_caps")
    .id("ad_astra:crushing/strophar_mushroom")
    e.recipes.create.mixing(Fluid.of("createdelight:ice_lubricating_oil", 500), [Fluid.of("createdelight:lubricating_oil", 250), "ad_astra:ice_shard"])
    .heatRequirement("frozen")
    .id("createdelight:mixing/ice_lubricating_oil")
    e.recipes.create.mixing(Fluid.of("createdelight:ice_lubricating_oil", 500), [Fluid.of("createdelight:lubricating_oil", 250), Fluid.of("createdelight:ice_dragon_blood", 25)])
    .id("createdelight:mixing/ice_lubricating_oil_from_ice_dragon_blood")
})
