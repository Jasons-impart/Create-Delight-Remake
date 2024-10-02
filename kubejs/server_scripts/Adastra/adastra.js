ServerEvents.recipes(event => {
    const { create, vintageimprovements, minecraft } = event.recipes;
    // 移除配方：ad_astra
    remove_recipes_type(
        event,
        [
            "ad_astra:refining",
            "ad_astra:cryo_freezing",
            "ad_astra:nasa_workbench",
        ]
    );
    remove_recipes_output(
        event,
        [
            "ad_astra:compressor",
            "ad_astra:coal_generator",
            "ad_astra:cable_duct",
            "ad_astra:fluid_pipe_duct",
            "ad_astra:desh_fluid_pipe",
            "ad_astra:ostrum_fluid_pipe",
            "ad_astra:desh_cable",
            "ad_astra:steel_cable",
            "ad_astra:water_pump",
            "ad_astra:nasa_workbench",
            "ad_astra:wrench",
            "ad_astra:steel_plate",
        ]
    );
    remove_recipes_id(
        event,
        [
            "ad_astra:fuel_refinery",
            "ad_astra:cryo_freezer",
            "ad_astra_giselle_addon:crafting/gravity_normalizer",
            "ad_astra_giselle_addon:crafting/automation_nasa_workbench",
            "ad_astra:steel_block",
            "ad_astra:etrionic_blast_furnace",
        ]
    );
    event.replaceInput(
        { id: "ad_astra:oxygen_distributor" },
        "ad_astra:oxygen_loader",
        "createdelight:electrolyzer"
    );

    // 新增配方：霜原木
    
    minecraft.crafting_shapeless(
        "ad_astra:glacian_log",
        [
            "#minecraft:logs",
            "ad_astra:ice_shard",
        ]
    );
    // 新增配方：霜原树叶
    minecraft.crafting_shapeless(
        "ad_astra:glacian_leaves",
        [
            "#minecraft:leaves",
            "ad_astra:ice_shard",
        ]
    );
    // 替换配方：喷气式航天服
    minecraft.crafting_shaped(
        "ad_astra:jet_suit",
        [
            "ABA",
            "CDC",
            "EFE",
        ],
        {
            A: "#forge:plates/calorite",
            B: "create_sa:brass_jetpack_chestplate",
            C: "ad_astra:calorite_tank",
            D: "ad_astra:netherite_space_suit",
            E: "ad_astra:etrionic_capacitor",
            F: "ad_astra:calorite_engine",
        }
    ).id("ad_astra:jet_suit");

    // 替换配方：氧气罐
    minecraft.crafting_shaped(
        "ad_astra:gas_tank",
        [
            "ABA",
            "ACA",
            "AAA",
        ],
        {
            A: "#forge:plates/steel",
            B: "#forge:rods/iron",
            C: "create:fluid_tank",
        }
    ).id("ad_astra:gas_tank");
    // 替换配方：引擎框架
    minecraft.crafting_shaped(
        "ad_astra:engine_frame",
        [
            "AAA",
            "ABA",
            "AAA",
        ],
        {
            A: "#forge:rods/iron",
            B: "create:precision_mechanism",
        }
    ).id("ad_astra:engine_frame");
    // 替换配方：引擎风扇
    minecraft.crafting_shaped(
        "ad_astra:fan",
        [
            " A ",
            "ABA",
            " A ",
        ],
        {
            A: "#forge:plates/steel",
            B: "create:propeller",
        }
    ).id("ad_astra:fan");
    // 替换配方：充能器
    minecraft.crafting_shaped(
        "ad_astra:energizer",
        [
            "ABA",
            "ACA",
            "ADA",
        ],
        {
            A: "ad_astra:ostrum_plate",
            B: "create:depot",
            C: "ad_astra:etrionic_capacitor",
            D: "createaddition:modular_accumulator",
        }
    ).id("ad_astra:energizer");
    // 石墨
    minecraft.crafting_shapeless(
        "createmetallurgy:graphite",
        [
            "8x #minecraft:coals",
            "minecraft:clay_ball",
        ]
    ).id("createmetallurgy:graphite");
    // 替换配方：氧气装载机
    minecraft.crafting_shaped(
        "createdelight:electrolyzer",
        [
            "AAA",
            "BCB",
            "ADA",
        ],
        {
            A: "#forge:plates/steel",
            B: "ad_astra:gas_tank",
            C: "#forge:graphite",
            D: "createaddition:modular_accumulator"
        }
    ).id("ad_astra:oxygen_loader");
    // 混合燃料
    create.mixing(
        Fluid.of("createdelight:fuel_mixtures", 10),
        [
            Fluid.of("createdieselgenerators:gasoline", 10),
            Fluid.of("createdieselgenerators:diesel", 10),
        ]
    ).id("ad_astra:recipes/fuel_mixtures");
    create.mixing(
        Fluid.of("createdelight:fuel_mixtures", 20),
        [
            Fluid.of("createdieselgenerators:gasoline", 20),
            Fluid.of("createdieselgenerators:biodiesel", 30),
        ]
    ).id("ad_astra:sub_recipes/fuel_mixtures");
    // 电子核心
    minecraft.crafting_shaped(
        "3x ad_astra:etrionic_core",
        [
            "AAA",
            "BBB",
            "AAA",
        ],
        {
            A: "#forge:plates/zinc",
            B: "#forge:plates/electrum",
        }
    ).id("ad_astra:crafting/etrionic_core");
    // 电容器
    minecraft.crafting_shaped(
        "ad_astra:etrionic_capacitor",
        [
            "ABA",
            "BCB",
            "DBD",
        ],
        {
            A: "minecraft:redstone",
            B: "#forge:plates/steel",
            C: "ad_astra:etrionic_core",
            D: "#forge:gems/diamond",
        }
    ).id("ad_astra:etrionic_capacitor");
    // 太阳能面板
    event.replaceInput(
        { id: "ad_astra:photovoltaic_etrium_cell" },
        "minecraft:diamond",
        "ad_astra:etrionic_core"
    );
    // 太阳能
    minecraft.crafting_shaped(
        "ad_astra:solar_panel",
        [
            "AAA",
            "BCB",
            "CDC",
        ],
        {
            A: "ad_astra:photovoltaic_etrium_cell",
            B: "#forge:plates/steel",
            C: "#forge:plates/desh",
            D: "ad_astra:etrionic_core",
        }
    ).id("ad_astra:solar_panel");
    minecraft.crafting_shaped(
        "ad_astra_giselle_addon:oxygen_can",
        [
            " A ",
            "BCB",
            "BDB",
        ],
        {
            A: "#forge:rods/steel",
            B: "#forge:plates/steel",
            C: "ad_astra:large_gas_tank",
            D: "ad_astra:oxygen_gear",
        }
    ).id("ad_astra_giselle_addon:crafting/oxygen_can");
});
