ServerEvents.recipes(e => {
    const { create, vintageimprovements, kubejs } = e.recipes

    remove_recipes_id(e, [
        "create_mob_spawners:empty_soul_catcher",
        "create_mob_spawners:mechanical_crafting/mechanical_spawner",
        "create_mob_spawners:spawning/long_regeneration_lingering",
        "create_mob_spawners:spawning/long_regeneration_regular",
        "create_mob_spawners:spawning/long_regeneration_splash",
        "create_mob_spawners:spawning/regeneration_lingering",
        "create_mob_spawners:spawning/regeneration_regular",
        "create_mob_spawners:spawning/regeneration_splash",
        "create_mob_spawners:spawning/strong_regeneration_lingering",
        "create_mob_spawners:spawning/strong_regeneration_regular",
        "create_mob_spawners:spawning/strong_regeneration_splash"
    ])

    kubejs.shaped("create_mob_spawners:empty_soul_catcher", [
        "ABA",
        "CDC",
        "AEA"
    ], {
        A: "vintageimprovements:bronze_sheet",
        B: "minecraft:shulker_shell",
        C: "create:precision_mechanism",
        D: "alexscaves:amber_monolith",
        E: "createdelight:refined_genetic_seed"
    }).id("createdelight:empty_soul_catcher")

    create.mechanical_crafting("create_mob_spawners:mechanical_spawner", [
        "ABCBA",
        "DEFED",
        "DEGED",
        "DEHED",
        "ABCBA"
    ], {
        A: "vintageimprovements:bronze_sheet",
        B: "create:brass_casing",
        C: "create:shaft",
        D: "minecraft:chain",
        E: "createdelightcore:bronze_ingot",
        F: "minecraft:end_crystal",
        G: "alexscaves:amber_monolith",
        H: "createdelight:pure_genetic_seed"
    }).id("createdelight:mechanical_crafting/mechanical_spawner")

    let inferiorGeneticSeedInput = []
    for (let index = 0; index < 8; index++) {
        inferiorGeneticSeedInput.push("createaddition:biomass")
    }
    inferiorGeneticSeedInput.push("ae2:singularity")
    vintageimprovements.vacuumizing(
        "16x createdelight:inferior_genetic_seed",
        inferiorGeneticSeedInput.concat(Fluid.of("netherexp:ectoplasm", 250))
    ).id("createdelight:vacuumizing/inferior_genetic_seed")

    const seedUpgrades = [
        ["inferior", "normal", 1, 0.70, 250],
        ["normal", "refined", 3, 0.75, 300],
        ["refined", "pure", 8, 0.82, 400]
    ]
    seedUpgrades.forEach(([inputTier, outputTier, lifeMatter, chance, ectoplasm]) => {
        create.mixing(
            [Item.of(`createdelight:${outputTier}_genetic_seed`).withChance(chance)],
            [
                `createdelight:${inputTier}_genetic_seed`,
                `${lifeMatter}x #createdelightcore:life_matter`,
                Fluid.of("netherexp:ectoplasm", ectoplasm)
            ]
        ).heated().id(`createdelight:mixing/${outputTier}_genetic_seed`)
    })

    create.mixing("createdelight:flawless_genetic_seed", [
        "createdelight:pure_genetic_seed",
        "12x #createdelightcore:life_matter",
        Fluid.of("create_dragons_plus:dragon_breath", 250),
        Fluid.of("netherexp:ectoplasm", 500)
    ]).superheated().id("createdelight:mixing/flawless_genetic_seed")

    const gradeStats = {
        inferior: { amount: 250, ticks: 160 },
        normal: { amount: 200, ticks: 140 },
        refined: { amount: 150, ticks: 120 },
        pure: { amount: 125, ticks: 100 },
        flawless: { amount: 100, ticks: 80 }
    }

    const cultureLineages = [
        {
            grade: "inferior", lineage: "livestock", marker: "minecraft:wheat", color: "#78A95A",
            entities: [
                "minecraft:chicken", "minecraft:cow", "minecraft:pig", "minecraft:rabbit", "minecraft:sheep"
            ]
        },
        {
            grade: "inferior", lineage: "wildlife", marker: "minecraft:sweet_berries", color: "#9CB66B",
            entities: [
                "minecraft:bee", "minecraft:fox", "minecraft:horse", "minecraft:panda", "minecraft:parrot",
                "minecraft:wolf", "alexsmobs:gazelle", "alexsmobs:roadrunner", "alexsmobs:raccoon", "alexsmobs:crow"
            ]
        },
        {
            grade: "normal", lineage: "surface_hostile", marker: "minecraft:gunpowder", color: "#6E8A5A",
            entities: [
                "minecraft:cave_spider", "minecraft:creeper", "minecraft:silverfish",
                "minecraft:slime", "minecraft:spider", "minecraft:witch"
            ]
        },
        {
            grade: "normal", lineage: "undead", marker: "minecraft:bone", color: "#8A8A78",
            entities: [
                "minecraft:drowned", "minecraft:husk", "minecraft:phantom",
                "minecraft:skeleton", "minecraft:stray", "minecraft:zombie"
            ]
        },
        {
            grade: "normal", lineage: "aquatic", marker: "minecraft:prismarine_shard", color: "#4E9FB8",
            entities: [
                "alexsmobs:catfish", "alexsmobs:flying_fish", "alexsmobs:frilled_shark", "alexsmobs:lobster",
                "alexsmobs:mantis_shrimp", "alexscaves:lanternfish", "alexscaves:radgill", "alexscaves:sea_pig"
            ]
        },
        {
            grade: "refined", lineage: "nether", marker: "minecraft:blaze_powder", color: "#D6653A",
            entities: [
                "minecraft:blaze", "minecraft:ghast", "minecraft:magma_cube", "minecraft:piglin",
                "minecraft:wither_skeleton", "minecraft:zombified_piglin",
                "alexsmobs:crimson_mosquito", "alexsmobs:soul_vulture"
            ]
        },
        {
            grade: "refined", lineage: "end", marker: "minecraft:chorus_fruit", color: "#8B62C8",
            entities: [
                "minecraft:enderman", "minecraft:endermite", "alexsmobs:cosmic_cod",
                "alexsmobs:endergrade", "alexsmobs:enderiophage", "alexsmobs:mimicube", "alexsmobs:spectre"
            ]
        },
        {
            grade: "refined", lineage: "cave", marker: "minecraft:glow_berries", color: "#B08A56",
            entities: [
                "alexscaves:ferrouslime", "alexscaves:gammaroach", "alexscaves:gloomoth", "alexscaves:notor",
                "alexscaves:subterranodon", "alexscaves:trilocaris", "alexscaves:vallumraptor", "alexscaves:vesper"
            ]
        },
        {
            grade: "pure", lineage: "rare", marker: "minecraft:emerald", color: "#63B7D6",
            entities: [
                "minecraft:evoker", "minecraft:guardian", "minecraft:shulker", "minecraft:vindicator"
            ]
        },
        {
            grade: "pure", lineage: "anomaly", marker: "alexscaves:uranium_shard", color: "#58C1A5",
            entities: [
                "alexscaves:brainiac", "alexscaves:caniac", "alexscaves:deep_one", "alexscaves:deep_one_knight",
                "alexscaves:gumbeeper", "alexscaves:nucleeper", "alexscaves:teletor", "alexscaves:underzealot"
            ]
        },
        {
            grade: "pure", lineage: "cataclysm", marker: "cataclysm:black_steel_ingot", color: "#B65A70",
            entities: [
                "cataclysm:deepling", "cataclysm:deepling_angler", "cataclysm:draugr", "cataclysm:endermaptera",
                "cataclysm:ignited_berserker", "cataclysm:ignited_revenant", "cataclysm:koboleton", "cataclysm:urchinkin"
            ]
        },
        {
            grade: "flawless", lineage: "rare", marker: "minecraft:emerald", color: "#9BE5FF",
            entities: [
                "minecraft:evoker", "minecraft:guardian", "minecraft:shulker", "minecraft:vindicator"
            ]
        },
        {
            grade: "flawless", lineage: "anomaly", marker: "alexscaves:uranium_shard", color: "#83F0D0",
            entities: [
                "alexscaves:brainiac", "alexscaves:caniac", "alexscaves:deep_one", "alexscaves:deep_one_knight",
                "alexscaves:gumbeeper", "alexscaves:nucleeper", "alexscaves:teletor", "alexscaves:underzealot"
            ]
        },
        {
            grade: "flawless", lineage: "cataclysm", marker: "cataclysm:black_steel_ingot", color: "#F08BA5",
            entities: [
                "cataclysm:deepling", "cataclysm:deepling_angler", "cataclysm:draugr", "cataclysm:endermaptera",
                "cataclysm:ignited_berserker", "cataclysm:ignited_revenant", "cataclysm:koboleton", "cataclysm:urchinkin"
            ]
        }
    ]

    cultureLineages.forEach(culture => {
        const variant = `${culture.grade}/${culture.lineage}`
        const recipeName = `${culture.grade}_${culture.lineage}_genetic_culture`
        const stats = gradeStats[culture.grade]
        const cultureNbt = {
            Variant: variant,
            Grade: culture.grade,
            Lineage: culture.lineage,
            Color: culture.color,
            Name: `fluid.createdelight.${recipeName}`
        }

        create.mixing(Fluid.of("createdelightcore:genetic_culture", 1000, cultureNbt), [
            `createdelight:${culture.grade}_genetic_seed`,
            culture.marker,
            Fluid.of("netherexp:ectoplasm", 250)
        ]).heated().id(`createdelight:mixing/${recipeName}`)

        e.custom({
            type: "create_mob_spawners:spawning",
            input: {
                amount: stats.amount,
                fluid: "createdelightcore:genetic_culture",
                nbt: cultureNbt
            },
            particle_color: culture.color,
            spawn_ticks_at_max_speed: stats.ticks,
            additional_spawn_attempts: 0,
            spawnable_entity_whitelist: culture.entities
        }).id(`createdelight:spawning/${recipeName}`)
    })
})
