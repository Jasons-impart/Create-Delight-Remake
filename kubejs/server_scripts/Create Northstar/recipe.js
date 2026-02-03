ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "northstar:compacting/carbon_from_biofuel",
        "northstar:mixing/titanium1",
        "northstar:mixing/titanium2",
        "northstar:sequenced_assembly/titanium",
        "northstar:crushing/limestone",
        "northstar:crushing/sand",
        "northstar:crushing/basalt",
        "northstar:mixing/brine",
        "northstar:compacting/brine_to_salt",
        "northstar:compacting/martian_steel_ingot"
    ])
    remove_recipes_output(e, [
        "northstar:circuit",
        "northstar:advanced_circuit",
        "northstar:targeting_computer",
        "northstar:electrolysis_machine",
        "northstar:solar_panel",
        "northstar:circuit_engraver",
        "northstar:titanium_block"
    ])
    const { create, vintageimprovements, create_new_age, createmetallurgy } = e.recipes
    e.remove({ type: "northstar:electrolysis" })
    e.remove({ type: "northstar:engraving" })
    e.remove({ output: "northstar:titanium_ingot", type: "blasting"})
    e.remove({ output: "northstar:titanium_ingot", type: "smelting"})
    e.replaceInput({
        output: [
            "northstar:jet_engine",
            "northstar:rocket_combustion_chamber",
            "northstar:interplanetary_navigator",
            "northstar:rocket_controls",
            "northstar:rocket_station",
            "northstar:atmospheric_concentrator"
        ]
    }, "northstar:titanium_sheet", "createdelight:steel_sheet") //TODO: 移除AD后替换
    e.replaceInput({
        output: [
            "northstar:interplanetary_navigator",
            "northstar:rocket_station",
        ]
    }, "northstar:titanium_ingot", "createmetallurgy:steel_ingot")
    e.replaceInput("*", "northstar:hardened_precision_mechanism", "create_sa:heat_engine")
    e.replaceOutput({ id: "northstar:splashing/crushed_raw_tungsten" }, "minecraft:quartz", "minecraft:gold_nugget")
    e.replaceOutput("*", "northstar:raw_titanium_ore", "createdelight:crushed_raw_titanium")

    create_new_age.energising("northstar:raw_glowstone_ore", "northstar:enriched_glowstone_ore", 10000)
        .id("northstar:energising/enriched_glowstone_ore")

    create.crushing(Item.of("northstar:rutile_concentrate").withChance(0.1),
        [["northstar:moon_sand", "northstar:mars_sand"]])
        .id("northstar:crushing/rutile_concentrate_from_sand")
    vintageimprovements.vacuumizing(Fluid.of("northstar:titanium_tetrachloride", 250), [
        Fluid.of("northstar:chlorine", 25),
        Fluid.of("northstar:carbon", 250),
        "northstar:rutile_concentrate",
    ])
        .secondaryFluidInput(0)
        .superheated()
        .id("northstar:vacuumizing/titanium_tetrachloride")
    vintageimprovements.vacuumizing(["createdelight:titanium_dust", "vintagedelight:salt_dust"], [
        Fluid.of("northstar:titanium_tetrachloride", 500),
        Fluid.of("northstar:sodium", 50)
    ])
        .superheated()
        .id("northstar:vacuumizing/titanium_ingot")


    {
        let iner = "northstar:unfinished_circuit"
        create.sequenced_assembly("northstar:circuit", "alexscaves:polymer_plate", [
            create.deploying(iner, [iner, "northstar:polished_amethyst"]),
            create.deploying(iner, [iner, "create:copper_sheet"]),
            create.deploying(iner, [iner, "ae2:logic_processor"]),
            vintageimprovements.laser_cutting(iner, iner)
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("northstar:sequenced_assembly/circuit")
    }
    {
        let iner = "northstar:unfinished_advanced_circuit"
        create.sequenced_assembly("northstar:advanced_circuit", "northstar:circuit", [
            create.deploying(iner, [iner, "northstar:polished_lunar_sapphire"]),
            create.deploying(iner, [iner, "northstar:martian_steel_sheet"]),
            create.deploying(iner, [iner, "ae2omnicells:omni_link_processor"]),
            vintageimprovements.laser_cutting(iner, iner)
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("northstar:sequenced_assembly/advanced_circuit")
    }
    {
        let iner = "northstar:unfinished_targeting_computer"
        create.sequenced_assembly("northstar:targeting_computer", "createdelight:steel_sheet", [
            create.deploying(iner, [iner, "northstar:polished_diamond"]),
            create.deploying(iner, [iner, "northstar:circuit"]),
            create.deploying(iner, [iner, "create_sa:heat_engine"]),
            vintageimprovements.laser_cutting(iner, iner)
        ])
            .loops(1)
            .transitionalItem(iner)
            .id("northstar:sequenced_assembly/targeting_computer")
    }
    metal_production_line(e, [
        "northstar:titanium_block",
        "northstar:titanium_ingot",
        "northstar:titanium_nugget",
        "northstar:titanium_sheet",
        "createdelightcore:molten_titanium"
    ], "heated", 100)

    metal_production_line_5(e, [
        "createdelight:dirty_titanium_dust",
        "createdelight:titanium_dust",
        "createdelight:crushed_raw_titanium",
        "northstar:raw_titanium_ore",
        "northstar:titanium_nugget",
        "northstar:titanium_ingot"
    ])

    metal_production_line_3(e, [
        "northstar:martian_steel_block",
        "northstar:martian_steel",
        "northstar:martian_steel_sheet",
        "createdelightcore:molten_martian_steel"
    ], "heated", 100)


    createmetallurgy.melting(Fluid.of("createdelightcore:molten_titanium", 90), "createdelight:titanium_dust")
        .heatRequirement("heated")
        .processingTime(30)
        .id("createmetallurgy:melting/molten_titanium_from_titanium_dust")
    createmetallurgy.melting([Fluid.of("createdelightcore:molten_titanium", 90), Fluid.of("createmetallurgy:molten_slag", 30)], "createdelight:dirty_titanium_dust")
        .heatRequirement("heated")
        .processingTime(40)
        .id("createmetallurgy:melting/molten_titanium_from_dirty_titanium_dust")
    createmetallurgy.melting([Fluid.of("createdelightcore:molten_titanium", 90), Fluid.of("createmetallurgy:molten_slag", 45)], "#forge:raw_materials/titanium")
        .heatRequirement("heated")
        .processingTime(40)
        .id("createmetallurgy:melting/molten_titanium_from_raw_titanium")

    createmetallurgy.alloying(Fluid.of("createdelightcore:molten_martian_steel", 180), [
        Fluid.of("createdelightcore:molten_titanium", 90),
        "northstar:raw_martian_iron_ore"
    ])
    .heatRequirement("superheated")
    .processingTime(100)
    .id("createmetallurgy:alloying/martian_steel")
})
