ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "northstar:compacting/carbon_from_biofuel",
        "northstar:mixing/titanium1",
        "northstar:mixing/titanium2",
        "northstar:sequenced_assembly/titanium",
        "northstar:crushing/limestone",
        "northstar:crushing/sand",
        "northstar:crushing/basalt"
    ])
    remove_recipes_output(e, [
        "northstar:circuit",
        "northstar:advanced_circuit",
        "northstar:targeting_computer"
    ])
    const { create, vintageimprovements } = e.recipes
    e.replaceInput({
        output: [
            "northstar:jet_engine",
            "northstar:rocket_combustion_chamber",
            "northstar:interplanetary_navigator",
            "northstar:rocket_controls",
            "northstar:rocket_station",
            "northstar:atmospheric_concentrator"
        ]
    }, "northstar:titanium_sheet", "ad_astra:steel_plate") //TODO: 移除AD后替换
    e.replaceInput({
        output: [
            "northstar:interplanetary_navigator",
            "northstar:rocket_station",
        ]
    }, "northstar:titanium_ingot", "createmetallurgy:steel_ingot")
    e.replaceInput("*", "northstar:hardened_precision_mechanism", "create_sa:heat_engine")


    create.crushing(Item.of("northstar:rutile_concentrate").withChance(0.1),
     ["northstar:moon_sand", "northstar:mars_sand"])
    .id("northstar:crushing/rutile_concentrate_from_sand")
    vintageimprovements.vacuumizing(Fluid.of("northstar:titanium_tetrachloride", 250), [
        Fluid.of("northstar:chlorine", 25),
        Fluid.of("northstar:carbon", 250),
        "northstar:rutile_concentrate",
    ])
        .secondaryFluidInput(0)
        .superheated()
        .id("northstar:vacuumizing/titanium_tetrachloride")
    vintageimprovements.vacuumizing(["northstar:titanium_ingot", "vintagedelight:salt_dust"], [
        Fluid.of("northstar:titanium_tetrachloride", 500),
        Fluid.of("northstar:sodium", 50),
        "create:sturdy_sheet"
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
        create.sequenced_assembly("northstar:targeting_computer", "ad_astra:steel_plate", [
            create.deploying(iner, [iner, "northstar:polished_diamond"]),
            create.deploying(iner, [iner, "northstar:circuit"]),
            create.deploying(iner, [iner, "create_sa:heat_engine"]),
            vintageimprovements.laser_cutting(iner, iner)
        ])
        .loops(1)
        .transitionalItem(iner)
        .id("northstar:sequenced_assembly/targeting_computer")
    }
    
    
})
