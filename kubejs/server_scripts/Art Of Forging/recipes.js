ServerEvents.recipes(e => {
    const { kubejs, create, createmetallurgy, create_new_age, createaddition, vintageimprovements } = e.recipes
    remove_recipes_id(e, [
        "tetra:murasama_scroll",
        "tetra:crucible_scroll",
        "tetra:katana_scroll",
        "tetra:thousand_cold_night_scroll",
        "art_of_forging:forged_steel_from_blasting_alloy",
        "art_of_forging:resonant_alloy",
        "art_of_forging:vobrivium_ingot",
        "art_of_forging:demonic_axe",
        "art_of_forging:demonic_blade",
        "art_of_forging:demonic_flail",
        "art_of_forging:endsteel_ingot",
        "art_of_forging:rending_scissor_purple",
        "art_of_forging:rending_scissor_red",
        "art_of_forging:rending_scissor_complete",
        "art_of_forging:mark_of_the_architect",
        "art_of_forging:enigmatic_construct",
        "art_of_forging:sigil_of_eden",
        "art_of_forging:life_fiber"
    ])
    kubejs.shaped(
        Item.of('tetra:scroll_rolled', '{BlockEntityTag:{data:[{details:"otherworldly",glyphs:[I;6,7,13,15],intricate:0b,key:"sword/katana/murasama_blade",material:2,ribbon:"c52323",schematics:["tetra:sword/katana/murasama_blade"]}]}}'),
        [
            ["", "create:electron_tube", ""],
            [
                "ad_astra:etrionic_core",
                Item.of('tetra:scroll_rolled', '{BlockEntityTag:{data:[{details:"art_of_forging",glyphs:[I;5,10,13,2],intricate:0b,key:"sword/katana/katana_blade",material:2,ribbon:"dbff10",schematics:["tetra:sword/katana/katana_blade","tetra:sword/tsuba_guard"]}]}}').strongNBT(),
                "ad_astra:etrionic_capacitor"],
            ["", "vintageimprovements:redstone_module", ""]
        ]
    ).id("tetra:murasama_scroll")
    kubejs.shaped(
        Item.of('tetra:scroll_rolled', '{BlockEntityTag:{data:[{details:"art_of_forging",glyphs:[I;8,7,9,2],intricate:0b,key:"tetra/crucible_blade",material:2,ribbon:"ff1e00",schematics:["tetra:sword/crucible_blade"]}]}}'),
        [
            " A ",
            "BCB",
            " D "
        ],
        {
            A: "art_of_forging:dragon_soul",
            B: "art_of_forging:forged_steel_ingot",
            C: "createdelight:otherworld_note",
            D: "minecraft:beacon"
        }
    )
        .id("tetra:crucible_scroll")

    e.replaceInput({ mod: "tetra" }, "minecraft:writable_book", "createdelight:otherworld_note")
    e.replaceInput([{ id: "art_of_forging:forged_platform" }, { id: "art_of_forging:forged_pillar" }], "art_of_forging:forged_steel_ingot", "createdelight:forged_steel_sheet")

    kubejs.shaped("art_of_forging:enigmatic_construct", [
        " A ",
        "ABA",
        " A "
    ], {
        A: "art_of_forging:encoded_canister",
        B: "art_of_forging:dragon_soul"
    })

    kubejs.shaped(
        Item.of('tetra:scroll_rolled', '{BlockEntityTag:{data:[{details:"art_of_forging",glyphs:[I;5,10,13,2],intricate:0b,key:"sword/katana/katana_blade",material:2,ribbon:"dbff10",schematics:["tetra:sword/katana/katana_blade","tetra:sword/tsuba_guard"]}]}}'), [
        ["", "#tetra:swords", ""],
        ["#forge:plates/iron", "createdelight:otherworld_note", "#forge:rods/iron"],
        ["", "#forge:ingots/iron", ""]
    ])
        .id("tetra:katana_scroll")

    kubejs.shaped(
        Item.of('tetra:scroll_rolled', '{BlockEntityTag:{data:[{details:"otherworldly",glyphs:[I;7,8,14,13],intricate:1b,key:"sword/thousand_cold_nights",material:2,ribbon:"5c7c80",schematics:["tetra:sword/katana/murasama_blade","tetra:sword/thousand_cold_nights"]}]}}'), [
        " A ",
        "BCB",
        " B "
    ],
        {
            A: "createdelight:demonic_codex",
            B: "art_of_forging:shards_of_malice",
            C: Item.of('tetra:scroll_rolled', '{BlockEntityTag:{data:[{details:"art_of_forging",glyphs:[I;5,10,13,2],intricate:0b,key:"sword/katana/katana_blade",material:2,ribbon:"dbff10",schematics:["tetra:sword/katana/katana_blade","tetra:sword/tsuba_guard"]}]}}').strongNBT()
        })
        .id("tetra:thousand_cold_night_scroll")

    metal_production_line_3(e,
        ["createdelightcore:forged_steel_block", "art_of_forging:forged_steel_ingot", "createdelight:forged_steel_sheet", "createdelightcore:molten_forged_steel"], "superheated", 160)
    kubejs.shapeless("createdelightcore:forged_steel_block", "9x art_of_forging:forged_steel_ingot")
        .id("art_of_forging:forged_steel_ingot_from_forged_steel_block")
    kubejs.shapeless("9x art_of_forging:forged_steel_ingot", "createdelightcore:forged_steel_block")
        .id("art_of_forging:forged_steel_block")
    createmetallurgy.alloying(Fluid.of("createdelightcore:molten_forged_steel", 360), [
        "tetra:metal_scrap",
        "tetra:metal_scrap",
        "tetra:metal_scrap",
        "tetra:metal_scrap",
        Fluid.of("createdelight:spent_liquor", 250),
        Fluid.of("createmetallurgy:molten_netherite", 30)
    ])
        .heatRequirement("superheated")
        .id("art_of_forging:alloying/molten_forged_steel")
    create.pressing("createdelight:forged_steel_sheet", "art_of_forging:forged_steel_ingot")
        .id("art_of_forging:pressing/forged_steel_sheet")
    {
        let iner = "art_of_forging:forged_steel_ingot"
        create.sequenced_assembly("dreadsteel:dreadsteel_ingot", "art_of_forging:forged_steel_ingot", [
            create.deploying(iner, [iner, "iceandfire:dread_shard"]),
            create.filling(iner, [iner, Fluid.of("createdelightcore:molten_fire_steel", 90)]),
            create.deploying(iner, [iner, "art_of_forging:fragment_of_eden"]),
            create.filling(iner, [iner, Fluid.of("createdelightcore:molten_ice_steel", 90)]),
            create.deploying(iner, [iner, "createdelight:dread_heart"]),
            create.filling(iner, [iner, Fluid.of("createdelightcore:molten_lightning_steel", 90)])
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("dreadsteel:sequenced_assembly/dreadsteel_ingot")
    }
    {
        let iner = "art_of_forging:forged_steel_ingot"
        create.sequenced_assembly("art_of_forging:vobrivium_ingot", "art_of_forging:forged_steel_ingot", [
            create.deploying(iner, [iner, "art_of_forging:vobrite_crystal"]),
            create_new_age.energising(iner, iner, 20000)
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("art_of_forging:sequenced_assembly/vobrivium_ingot")
    }
    create_new_age.energising("art_of_forging:vobrite_crystal", "2x art_of_forging:vobrite_crystal", 2000000)
        .id("art_of_forging:energising/vobrite_crystal")

    {
        let iner = "art_of_forging:vobrivium_ingot"
        create.sequenced_assembly("art_of_forging:endsteel_ingot", "art_of_forging:vobrivium_ingot", [
            create.deploying(iner, [iner, "art_of_forging:fragment_of_eden"]),
            create.filling(iner, [iner, Fluid.of("create_central_kitchen:dragon_breath", 250)]),
            create.deploying(iner, [iner, "art_of_forging:heart_of_ender"]),
            create.filling(iner, [iner, Fluid.of("create_central_kitchen:dragon_breath", 250)]),
            vintageimprovements.hammering(iner, iner)
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("art_of_forging:sequenced_assembly/endsteel_ingot")
    }

    vintageimprovements.vacuumizing(Fluid.of("createdelight:malice_solution", 1000), [
        Fluid.of("netherexp:ectoplasm", 1000),
        "art_of_forging:shards_of_malice",
        "art_of_forging:soul_ember"
    ])
        .id("art_of_forging:vacuumizing/malice_solution")

    {
        let iner = "art_of_forging:ancient_blade"
        create.sequenced_assembly("art_of_forging:demonic_blade", "art_of_forging:ancient_blade", [
            create.deploying(iner, [iner, "art_of_forging:shards_of_malice"]),
            create.deploying(iner, [iner, "art_of_forging:fragment_of_eden"]),
            create.filling(iner, [iner, Fluid.of("createdelight:malice_solution", 1000)]),
            vintageimprovements.hammering(iner, iner)
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("art_of_forging:sequenced_assembly/demonic_blade")
    }
    {
        let iner = "art_of_forging:ancient_axe"
        create.sequenced_assembly("art_of_forging:demonic_axe", "art_of_forging:ancient_axe", [
            create.deploying(iner, [iner, "art_of_forging:shards_of_malice"]),
            create.deploying(iner, [iner, "art_of_forging:fragment_of_eden"]),
            create.filling(iner, [iner, Fluid.of("createdelight:malice_solution", 1000)]),
            vintageimprovements.hammering(iner, iner)
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("art_of_forging:sequenced_assembly/demonic_axe")
    }
    {
        let iner = "art_of_forging:ancient_flail"
        create.sequenced_assembly("art_of_forging:demonic_flail", "art_of_forging:ancient_flail", [
            create.deploying(iner, [iner, "art_of_forging:shards_of_malice"]),
            create.deploying(iner, [iner, "art_of_forging:fragment_of_eden"]),
            create.filling(iner, [iner, Fluid.of("createdelight:malice_solution", 1000)]),
            vintageimprovements.hammering(iner, iner),
            create.deploying(iner, [iner, "iceandfire:chain"])

        ])
            .loops(1)
            .transitionalItem(iner)
            .id("art_of_forging:sequenced_assembly/demonic_flail")
    }
    {
        let iner = "art_of_forging:shards_of_malice"
        create.sequenced_assembly("art_of_forging:sigil_of_eden", "art_of_forging:shards_of_malice", [
            create.deploying(iner, [iner, "art_of_forging:soul_ember"]),
            create.deploying(iner, [iner, "art_of_forging:fragment_of_eden"]),
            create.filling(iner, [iner, Fluid.of("createdelight:malice_solution", 250)]),
            create.pressing(iner, iner)
        ])
            .loops(4)
            .transitionalItem(iner)
            .id("art_of_forging:sequenced_assembly/sigil_of_eden")
    }
    vintageimprovements.vacuumizing("2x art_of_forging:life_fiber", [
        Fluid.of("create:potion", 1000, { Bottle: "REGULAR", Potion: "minecraft:healing" }),
        "tetra:dragon_sinew",
        "tetra:dragon_sinew",
        "protection_pixel:reinforcedfiber"
    ])

    kubejs.shaped("art_of_forging:rending_scissor_red", [
        " AB",
        " CA",
        "D  "
    ], {
        A: "create:polished_rose_quartz",
        B: "art_of_forging:life_fiber",
        C: "farmersdelight:diamond_knife",
        D: "minecraft:blaze_rod"
    })
        .id("art_of_forging:rending_scissor_red")

    kubejs.shaped("art_of_forging:rending_scissor_purple", [
        " AB",
        " CA",
        "D  "
    ], {
        A: "createutilities:polished_amethyst",
        B: "art_of_forging:life_fiber",
        C: "farmersdelight:diamond_knife",
        D: "minecraft:blaze_rod"
    })
        .id("art_of_forging:rending_scissor_purple")

    {
        let iner = "netherexp:banshee_rod"
        create.sequenced_assembly("art_of_forging:rending_scissor_complete", "netherexp:banshee_rod", [
            create.deploying(iner, [iner, "art_of_forging:rending_scissor_red"]),
            create.deploying(iner, [iner, "art_of_forging:rending_scissor_purple"]),
            vintageimprovements.hammering(iner, iner)
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("art_of_forging:sequenced_assembly/rending_scissor_complete")
    }
    {
        let iner = "createaddition:electrum_ingot"
        create.sequenced_assembly("vvaddon:mine_ingot", "createaddition:electrum_ingot", [
            create.deploying(iner, [iner, "ae2:charged_certus_quartz_crystal"]),
            create.deploying(iner, [iner, "createdelight:bleak_electron_tube"]),
            create.deploying(iner, [iner, "createaddition:capacitor"]),
            create_new_age.energising(iner, iner, 100000),
            create.filling(iner, [iner, Fluid.of("createdelight:sky_solution", 1000)])
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("art_of_forging:sequenced_assembly/mine_ingot")
    }
    kubejs.shaped(Item.of('tetra:scroll_rolled',
        '{BlockEntityTag:{data:[{glyphs:[1.0d,1.0d,4.0d,5.0d],intricate:1.0d,key:"bow/stave/remembrance_stave",material:1.0d,ribbon:"c10000",schematics:["tetra:bow/stave/remembrance_stave"]}]}}'),
        [
            ["alexscaves:dreadbow"],
            [Item.of('tetra:scroll_rolled', '{BlockEntityTag:{data:[{details:"art_of_forging",glyphs:[I;8,1,9,5],intricate:0b,key:"bow/stave/dreadnought_stave",material:1,ribbon:"f3b31f",schematics:["tetra:bow/stave/dreadnought_stave","tetra:bow/stave/dreadnought_cross_stave"]}]}}').strongNBT()],
            ["iceandfire:dragonbone_bow"]
        ]
    ).id("art_of_forging:remembrance_shave")
    kubejs.shaped(Item.of('tetra:scroll_rolled',
        '{BlockEntityTag:{data:[{details:"art_of_forging",glyphs:[I;15,13,12,14],intricate:0b,key:"bow/string/compound_string",material:1,ribbon:"19e588",schematics:["tetra:bow/string/compound_string","tetra:crossbow/string/compound_cross_string"]}]}}'),
        [
            ["alexscaves:shadow_silk",
                "art_of_forging:life_fiber",
                "protection_pixel:reinforcedfiber"],
            ["minecraft:air",
                "createdelight:otherworld_note",
                "minecraft:air"],
            ["#iceandfire:scales/dragon",
                "#mynethersdelight:hoglin_hide",
                "alexscaves:tough_hide"]
        ])
    {
        let iner = "createdelight:forged_steel_sheet"
        create.sequenced_assembly("art_of_forging:encoded_canister", iner, [
            vintageimprovements.curving(iner, iner)
                .head("art_of_forging:encoded_canister"),
            create.deploying(iner, [iner, "megacells:printed_accumulation_processor"]),
            create.deploying(iner, [iner, "megacells:printed_accumulation_processor"]),
            create.deploying(iner, [iner, "#forge:dusts/redstone"]),
            create.deploying(iner, [iner, "createdelight:forged_steel_sheet"]),
            create.pressing(iner, iner)
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("art_of_forging:encoded_canister")
    }
})
