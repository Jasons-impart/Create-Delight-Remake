ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "protection_pixel:plagueloot",
        "protection_pixel:lancerloot",
        "protection_pixel:hammerloot",
        "protection_pixel:closedloot",
        "protection_pixel:bloodprisonerloot",
        "protection_pixel:hunterloot",
        "protection_pixel:breakerloot",
        "protection_pixel:prismloot",
        "protection_pixel:workerloot",
        "protection_pixel:magneticloot",
        "protection_pixel:pioneerloot",
        "protection_pixel:hellsnakeloot",
        "protection_pixel:slingshotloot",
        "protection_pixel:anchorpointloot",
        "protection_pixel:buoyancyloot",
        "protection_pixel:alloyplate"
    ])
    e.recipes.create.cutting(
        '2x protection_pixel:smallnetheritesheet',
        "#forge:plates/netherite"
    ).id("protection_pixel:smallnetheritesheetloot")
    e.recipes.create.mechanical_crafting("protection_pixel:plague_helmet",
        [
            " ABA ",
            "CDEDC",
            " FGF ",
            "  H  "
        ],
        {
            A: "create:brass_sheet",
            B: "create_sa:steam_engine",
            C: "createmetallurgy:steel_ingot",
            D: "ad_astra:fan",
            E: "create_sa:brass_helmet",
            F: "ad_astra:steel_nugget",
            G: "minecraft:glass_pane",
            H: "create:brass_ingot"
        }
    )
    .id("protection_pixel:plagueloot")
    e.recipes.create.mechanical_crafting("protection_pixel:lancer_helmet", 
        [
            "  A  ",
            " BCB ",
            "DEFED",
            " AGA "
        ],
        {
            A: "create:brass_ingot",
            B: "create:brass_sheet",
            C: "create_sa:hydraulic_engine",
            D: "createmetallurgy:steel_ingot",
            E: "minecraft:glass_pane",
            F: "create_sa:brass_helmet",
            G: "ad_astra:steel_plate"
        }
    )
    .id("protection_pixel:lancerloot")
    e.recipes.create.mechanical_crafting("protection_pixel:hammer_helmet",
        [
            " ABA ",
            "BABAB",
            "ACDCA",
            "BCECB"
        ],
        {
            A:"create:brass_sheet",
            B:"create:brass_ingot",
            C:"ad_astra:steel_plate",
            D:"create_sa:brass_helmet",
            E:"minecraft:glass_pane"
        }
    )
    .id("protection_pixel:hammerloot")
    e.recipes.create.mechanical_crafting("protection_pixel:closed_helmet",
        [
            " ABA ",
            " CCC ",
            "DCECD",
            " FGF "
        ],
        {
            A: "ad_astra:steel_plate",
            B: "create_sa:hydraulic_engine",
            C: "minecraft:glass_pane",
            D: "createmetallurgy:steel_ingot",
            E: "create_sa:brass_helmet",
            F: "create:brass_ingot",
            G: "create:brass_sheet"
        }
    )
    .id("protection_pixel:closedloot")
    e.recipes.create.mechanical_crafting("protection_pixel:bloodprisoner_helmet",
        [
            " ABA ",
            "ACDCA",
            "EFGFE"
        ],
        {
            A: "createmetallurgy:steel_ingot",
            B: "create_sa:hydraulic_engine",
            C: "create:brass_ingot",
            D: "minecraft:glass_pane",
            E: "create:fluid_pipe",
            F: "ad_astra:steel_plate",
            G: "create:fluid_valve"
        }
    )
    .id("protection_pixel:bloodprisonerloot")
    e.recipes.create.mechanical_crafting("protection_pixel:hunter_helmet",
        [
            "AB BA",
            " BCB ",
            " DEC ",
            " FAF ",
        ],
        {
            A: "create:brass_ingot",
            B: "minecraft:amethyst_shard",
            C: "create:brass_sheet",
            D: "vintageimprovements:laser_item",
            E: "create_sa:brass_helmet",
            F: "ad_astra:steel_plate"
        }
    )
    .id("protection_pixel:hunterloot")
    e.recipes.create.mechanical_crafting("protection_pixel:breaker_chestplate", 
        [
            "ABCBA",
            "DEFED",
            "GHGHG",
            " G G "
        ],
        {
            A: "create:cogwheel",
            B: "create:brass_sheet",
            C: "create_sa:hydraulic_engine",
            D: "createmetallurgy:steel_ingot",
            E: "#forge:spring/between_500_2_1000",
            F: "create_sa:brass_exoskeleton_chestplate",
            G: "create:brass_sheet",
            H: "create:mechanical_piston"
        }
    )
    .id("protection_pixel:breakerloot")
    e.recipes.create.mechanical_crafting("protection_pixel:wingsofprism_chestplate",
        [
            "ABCBA",
            "DEFED",
            "AGHGA",
            "A   A"
        ],
        {
            A: "create:brass_sheet",
            B: "create:large_cogwheel",
            C: "create_sa:hydraulic_engine",
            D: "createmetallurgy:steel_ingot",
            E: "#forge:spring/between_500_2_1000",
            F: "create_sa:brass_exoskeleton_chestplate",
            G: "create:gantry_shaft",
            H: "vintageimprovements:laser_item"
        }
    )
    .id("protection_pixel:prismloot")
    e.recipes.create.mechanical_crafting("protection_pixel:workerhornet_chestplate",
        [
            " A A ",
            "BCDCB",
            "EFGFE",
            "HIBIH"
        ],
        {
            A: "create:cogwheel",
            B: "create:brass_ingot",
            C: "protection_pixel:emptywatertank",
            D: "create_sa:hydraulic_engine",
            E: "createmetallurgy:steel_ingot",
            F: "#forge:spring/between_500_2_1000",
            G: "create_sa:brass_exoskeleton_chestplate",
            H: "ad_astra:steel_plate",
            I: "create:brass_hand"
        }
    )
    .id("protection_pixel:workerloot")
    e.recipes.create.mechanical_crafting("protection_pixel:magneticstorm_chestplate",
        [
            "ABCBA",
            "DEFED",
            "GHIHG",
            "A   A"
        ],
        {
            A: "create:brass_ingot",
            B: "create:brass_sheet",
            C: "createaddition:tesla_coil",
            D: "createmetallurgy:steel_ingot",
            E: "minecraft:netherite_scrap",
            F: "create_sa:brass_exoskeleton_chestplate",
            G: "minecraft:redstone",
            H: "createaddition:electrum_sheet",
            I: "createaddition:capacitor"
        }
    )
    .id("protection_pixel:magneticloot")
    e.recipes.create.mechanical_crafting("protection_pixel:pioneer_chestplate",
        [
            " A A ",
            "BCDCB",
            "EBFBE",
            "GHBHG"
        ],
        {
            A: "create:brass_sheet",
            B: "create:brass_ingot",
            C: "create_sa:hydraulic_engine",
            D: "create:electron_tube",
            E: "#forge:spring/between_500_2_1000",
            F: "create_sa:brass_exoskeleton_chestplate",
            G: "create_sa:brass_pickaxe",
            H: "createmetallurgy:steel_ingot"
        }
    )
    .id("protection_pixel:pioneerloot")
    e.recipes.create.mechanical_crafting("protection_pixel:hellsnake_chestplate",
        [
            "ABABA",
            "DAEAD",
            "FGCGF"
        ],
        {
            A: "create:brass_ingot",
            B: "create:fluid_pipe",
            C: "create_sa:flamethrower",
            D: "create:cogwheel",
            E: "create_sa:brass_exoskeleton_chestplate",
            F: "ad_astra:fan",
            G: "create:mechanical_pump"
        }
    )
    .id("protection_pixel:hellsnakeloot")
    e.recipes.create.mechanical_crafting("protection_pixel:slingshot_leggings",
        [
            " A A ",
            "ABCBA",
            "DBEBD",
            "AF FA"
        ],
        {
            A: "create:brass_sheet",
            B: "#forge:spring/between_500_2_1000",
            C: "protection_pixel:leggingslining",
            D: "create:brass_ingot",
            E: "create_sa:brass_leggings",
            F: "createmetallurgy:steel_ingot"
        }
    )
    .id("protection_pixel:slingshotloot")
    e.recipes.create.mechanical_crafting("protection_pixel:anchorpoint_leggings",
        [
            " ABA ",
            "ACDCA",
            "EFGFE",
            "AH HA"
        ],
        {
            A: "create:brass_sheet",
            B: "create_sa:hydraulic_engine",
            C: "create:cogwheel",
            D: "protection_pixel:leggingslining",
            E: "createmetallurgy:steel_ingot",
            F: "#forge:spring/between_500_2_1000",
            G: "create_sa:brass_leggings",
            H: "create:brass_ingot"
        }
    )
    .id("protection_pixel:anchorpointloot")
    e.recipes.create.mechanical_crafting("protection_pixel:buoyancy_leggings", 
        [
            " ABA ",
            "CDEDC",
            "AFGFA",
            "AH HA"
        ],
        {
            A: "create:brass_sheet",
            B: "create_sa:hydraulic_engine",
            C: "create:fluid_pipe",
            D: "createmetallurgy:steel_ingot",
            E: "protection_pixel:leggingslining",
            F: "ad_astra:fan",
            G: "create_sa:brass_leggings",
            H: "create:brass_ingot"
        }
    
    ).id("protection_pixel:buoyancyloot")
    e.findRecipes({mod: "protection_pixel", output: "#protection_pixel:alloy"}).forEach(recipe => {
        let result = recipe.originalRecipeResult
        let ingredient = recipe.json.getAsJsonObject("ingredient").get("item").getAsString()
        let transitionalItem = recipe.json.getAsJsonObject("transitionalItem").get("item").getAsString()
        let id = recipe.getId()
        e.remove({id: id})
        e.recipes.create.sequenced_assembly(result, ingredient,
            [
                e.recipes.create.filling(ingredient, [ingredient, Fluid.of("createmetallurgy:molten_steel").withAmount(250)]),
                e.recipes.vintageimprovements.hammering(ingredient, ingredient),
                e.recipes.create.deploying(ingredient, [ingredient, "create:sturdy_sheet"]),
                e.recipes.create.deploying(ingredient, [ingredient, "createmetallurgy:tungsten_sheet"]),
                e.recipes.create.deploying(ingredient, [ingredient, "create:precision_mechanism"]),
                e.recipes.create.deploying(ingredient, [ingredient, "protection_pixel:smallnetheritesheet"])
            ]
        )
        .transitionalItem(transitionalItem)
        .loops(1)
        .id(id)
    })
    e.replaceInput({mod: "protection_pixel", output: "#curios:motorinterface"}, 
        "minecraft:iron_ingot",
        "createmetallurgy:steel_ingot"
    )
    e.replaceInput({mod: "protection_pixel", output: "#curios:motorinterface"}, 
        "create:propeller",
        "ad_astra:fan"
    )
    let iner_1 = "ad_astra:steel_plate"
    e.recipes.create.sequenced_assembly("protection_pixel:alloyarmorplate", iner_1, [
        e.recipes.create.deploying(iner_1, [iner_1, "protection_pixel:smallnetheritesheet"]),
        e.recipes.create.deploying(iner_1, [iner_1, "ad_astra:steel_plate"]),
        e.recipes.vintageimprovements.hammering(iner_1, iner_1)
    ])
    .loops(1)
    .transitionalItem("protection_pixel:incompletealloyarmorplate")
    .id("protection_pixel:alloyplate")
})