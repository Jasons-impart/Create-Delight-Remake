ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "createaddition:compacting/cake_base",
        "createaddition:smoking/cake_base_baked",
        "createaddition:compacting/seed_oil",
        "createaddition:mixing/bioethanol",
        "createaddition:crafting/capacitor_2",
        "createaddition:crafting/capacitor_1",
        "createaddition:crafting/accumulator_conversion",
        "createaddition:crafting/large_connector_gold",
        "createaddition:crafting/modular_accumulator_gold",
        "createaddition:compacting/biomass_pellet",
        "createaddition:crafting/biomass_pellet",
        "createaddition:crafting/biomass_pellet_block",
        "createaddition:mixing/electrum",
        "createaddition:mechanical_crafting/tesla_coil"
    ])
    remove_recipes_input(e, [
        "createaddition:cake_base_baked"
    ])
    // 电容合成
    e.recipes.minecraft.crafting_shaped("2x createaddition:capacitor", [
        " A ",
        " B ",
        " C "
    ], {
        A: "create:copper_sheet",
        B: "createaddition:zinc_sheet",
        C: "createaddition:copper_rod"
    }
    ).id("createaddition:crafting/capacitor")
    // 连接器合成
    e.recipes.kubejs.shapeless(
        "2x createaddition:large_connector",
        [
            "#forge:rods/electric",
            "create:andesite_alloy",
            "create:andesite_alloy",
            "#forge:slimeballs"
        ]
    ).id("createaddition:crafting/large_connector_electrum")
    // 电池合成
    let iner = 'createdelight:incompleted_modular_accumulator'
    e.recipes.create.sequenced_assembly("createaddition:modular_accumulator", "create:brass_sheet", [
        e.recipes.vintageimprovements.curving(iner, iner, 1),
        e.recipes.create.deploying(iner, [iner, "#forge:wires/electric"]),
        e.recipes.create.deploying(iner, [iner, "createaddition:capacitor"]),
        e.recipes.create.deploying(iner, [iner, "createaddition:capacitor"]),
        e.recipes.create.deploying(iner, [iner, "ad_astra:etrionic_core"]),
        e.recipes.create.deploying(iner, [iner, "create:brass_sheet"])
    ])
        .transitionalItem(iner)
        .loops(1)
        .id("createaddition:crafting/modular_accumulator_electrum")
    // 发电机
    let iner_3 = "createdelight:incomplete_alternator"
    e.recipes.create.sequenced_assembly("createaddition:alternator", "create:shaft", [
        e.recipes.create.deploying(iner_3, [iner_3, "ad_astra:steel_plate"]),
        e.recipes.create.deploying(iner_3, [iner_3, "createaddition:copper_spool"]),
        e.recipes.create.deploying(iner_3, [iner_3, "ad_astra:etrionic_core"]),
    ])
        .transitionalItem(iner_3)
        .loops(4)
        .id("createaddition:mechanical_crafting/alternator")
    // 电动机
    let iner_4 = "createdelight:incomplete_electric_motor"
    e.recipes.create.sequenced_assembly("createaddition:electric_motor", "create:shaft", [
        e.recipes.create.deploying(iner_4, [iner_4, "create:brass_sheet"]),
        e.recipes.create.deploying(iner_4, [iner_4, "createaddition:copper_spool"]),
        e.recipes.create.deploying(iner_4, [iner_4, "ad_astra:etrionic_core"]),
    ])
        .transitionalItem(iner_4)
        .loops(4)
        .id("createaddition:mechanical_crafting/electric_motor")
    // 移动式能量接口
    e.recipes.kubejs.shapeless(
        'createaddition:portable_energy_interface',
        [
            "#forge:spring/below_500",
            "create:brass_casing",
            "createaddition:copper_spool"
        ]
    ).id("createaddition:crafting/portable_energy_interface")

    e.recipes.kubejs.shapeless(
        "createaddition:superconducting_connector",
        [
            "ae2:singularity",
            "createaddition:large_connector",
            "vvaddon:mine_ingot"
        ]
    ).id("createaddition:crafting/superconducting_connector")
    e.recipes.createaddition.rolling(
        "vvaddon:mine_ingot",
        "2x createaddition:superconducting_wire"
    )
    .id("createaddition:rolling/superconducting_wire")
    e.recipes.kubejs.shaped(
        "createaddition:superconducting_spool",
        [
            " A ",
            "ABA",
            " A "
        ],
        {
            A: "createaddition:superconducting_wire",
            B: "createaddition:spool"
        }
    ).id("createaddition:crafting/superconducting_spool")

    e.recipes.vintageimprovements.turning("8x createaddition:spool", "#forge:ingots/iron")
    .id("createaddition:turning/spool")
})
