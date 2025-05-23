ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "createoreexcavation:vein_finder"
    ])
    e.recipes.create.mechanical_crafting(
        "createoreexcavation:extractor", [
        "ABCBA",
        "BDEDB",
        "FGHGB",
        "BIIIB",
        "ABBBA"
    ], {
        A: "createmetallurgy:steel_block",
        B: "ad_astra:steel_plate",
        C: "create:mechanical_pump",
        D: "create:electron_tube",
        E: "create:hose_pulley",
        F: "create:brass_casing",
        G: "create_sa:hydraulic_engine",
        H: "create:mechanical_drill",
        I: "create:sturdy_sheet"
    }
    ).id("createoreexcavation:extractor")
    e.recipes.create.mechanical_crafting(
        "createoreexcavation:drilling_machine", [
        "ABCBA",
        "BDEDB",
        "FGHGJ",
        "BIIIB",
        "ABBBA"
    ], {
        A: "createmetallurgy:steel_block",
        B: "ad_astra:steel_plate",
        C: "create:mechanical_pump",
        D: "create:electron_tube",
        E: "create:spout",
        F: "create:brass_casing",
        G: "create_sa:steam_engine",
        H: "create:mechanical_drill",
        I: "create:sturdy_sheet",
        J: "create:brass_tunnel"
    }
    ).id("createoreexcavation:drilling_machine")
    e.recipes.kubejs.shaped("createdelight:prospector", [
        "ABA",
        "ACA",
        "AAA"
    ],
    {
        A: "createmetallurgy:steel_ingot",
        B: "createdelight:prospector_core",
        C: "minecraft:tinted_glass"
    }).id("createdelight:shaped/prospector")
    e.recipes.kubejs.shaped(
        'createdelight:prospector_core',
        [
            "AAA",
            "ABA",
            "AAA"
        ], {
            A: 'createutilities:polished_amethyst',
            B: 'minecraft:ender_eye'
        }
    ).id("createdelight:shaped/prospector_core")
    //主世界金属矿簇
    e.recipes.create.crushing([
        Item.of("create:crushed_raw_copper").withChance(0.75),
        Item.of("create:crushed_raw_tin").withChance(0.75),
        Item.of("minecraft:coal").withChance(0.6),
        Item.of("create:crushed_raw_iron").withChance(0.5),
        Item.of("create:crushed_raw_zinc").withChance(0.5),
        Item.of("minecraft:redstone", 4).withChance(0.3)
    ],
        ["createdelight:overworld_metal_ore_cluster"])
        .id("create:crushing/crushed_raw_ore_from_overworld_metal_ore_cluster")

    e.recipes.vintageimprovements.vibrating([
        Item.of("createoreexcavation:raw_redstone").withChance(0.75),
        Item.of("minecraft:raw_iron").withChance(0.6),
        Item.of("create:raw_zinc").withChance(0.6),
        Item.of("minecraft:coal").withChance(0.5),
        Item.of("minecraft:raw_copper").withChance(0.25),
        Item.of("createdelightcore:raw_tin").withChance(0.25)
    ],
    ["createdelight:overworld_metal_ore_cluster"])
    .id("vintageimprovements:vibrating/raw_ore_from_overworld_metal_ore_cluster")

    //主世界金属矿簇产机械动力含矿石
    e.recipes.vintageimprovements.vacuumizing([
        Item.of("4x create:veridium").withChance(0.5),
        Item.of("4x create:asurine").withChance(0.5),
        Item.of("4x create:crimsite").withChance(0.5),
        Item.of("4x create:scoria").withChance(0.25),
        Item.of("4x create:ochrum").withChance(0.2),
    ],
    [
        "createdelight:overworld_metal_ore_cluster",
        "ae2:matter_ball"
    ])
    .id("vintageimprovements:vacuumizing/overworld_metal_ore_cluster")

    //主世界贵金属矿簇
    e.recipes.create.crushing([
        Item.of("create:crushed_raw_silver").withChance(0.5),
        Item.of("create:crushed_raw_gold").withChance(0.5),
        Item.of("minecraft:lapis_lazuli", 4).withChance(0.4),
        Item.of("minecraft:emerald").withChance(0.2),
        Item.of("minecraft:diamond").withChance(0.1)
    ],
        ["createdelight:overworld_noble_metal_ore_cluster"])
        .id("create:crushing/crushed_raw_ore_from_overworld_noble_metal_ore_cluster")

    e.recipes.vintageimprovements.vibrating([
        
        Item.of("createoreexcavation:raw_diamond").withChance(0.2),
        Item.of("createoreexcavation:raw_emerald").withChance(0.3),
        Item.of("minecraft:lapis_lazuli", 4).withChance(0.4),
        Item.of("iceandfire:raw_silver").withChance(0.25),
        Item.of("minecraft:raw_gold").withChance(0.25)
    ],
    ["createdelight:overworld_noble_metal_ore_cluster"])
    .id("vintageimprovements:vibrating/raw_ore_from_overworld_noble_metal_ore_cluster")
    
    //下界矿簇
    e.recipes.create.crushing([
        Item.of("minecraft:quartz").withChance(0.75),
        Item.of("minecraft:gold_nugget", 3).withChance(0.5),
        Item.of("createmetallurgy:crushed_raw_wolframite").withChance(0.3),
        Item.of("minecraft:netherite_scrap").withChance(0.05)
    ],
        ["createdelight:nether_ore_cluster"])
        .id("create:crushing/crushed_raw_ore_from_nether_ore_cluster")
    e.recipes.vintageimprovements.vibrating([
        Item.of("createmetallurgy:raw_wolframite").withChance(0.5),
        Item.of("minecraft:ancient_debris").withChance(0.3),
        Item.of("minecraft:quartz").withChance(0.25),
        Item.of("minecraft:gold_nugget", 3).withChance(0.25)
    ],
        ["createdelight:nether_ore_cluster"])
        .id("vintageimprovements:vibrating/raw_ore_from_nether_ore_cluster")
    
    //月球矿簇
    e.recipes.create.crushing([
        Item.of("create:crushed_raw_iron"),
        Item.of("createdelight:crushed_raw_desh").withChance(0.25)
    ],
        ["createdelight:moon_ore_cluster"])
        .id("create:crushing/crushed_raw_ore_from_moon_ore_cluster")
    e.recipes.vintageimprovements.vibrating([
        Item.of("ad_astra:raw_desh").withChance(0.5),
        Item.of("minecraft:raw_iron").withChance(0.5),
        Item.of("ad_astra:cheese").withChance(0.4)
    ],
        ["createdelight:moon_ore_cluster"])
        .id("vintageimprovements:vibrating/raw_ore_from_moon_ore_cluster")
    
    //火星矿簇
    e.recipes.create.crushing([
        Item.of("create:crushed_raw_iron"),
        Item.of("createdelight:crushed_raw_ostrum").withChance(0.25)
    ],
        ["createdelight:mars_ore_cluster"])
        .id("create:crushing/crushed_raw_ore_from_mars_ore_cluster")
    e.recipes.vintageimprovements.vibrating([
        Item.of("ad_astra:raw_ostrum").withChance(0.5),
        Item.of("minecraft:raw_iron").withChance(0.5)
    ],
        ["createdelight:mars_ore_cluster"])
        .id("vintageimprovements:vibrating/raw_ore_from_mars_ore_cluster")
    
    //火星宝石矿簇
    e.recipes.create.crushing([
        Item.of("minecraft:diamond").withChance(0.2)
    ],
        ["createdelight:mars_gemstone_cluster"])
        .id("create:crushing/crushed_raw_ore_from_mars_gemstone_cluster")
    e.recipes.vintageimprovements.vibrating([
        Item.of("createoreexcavation:raw_diamond").withChance(0.4)
    ],
        ["createdelight:mars_gemstone_cluster"])
        .id("vintageimprovements:vibrating/raw_ore_from_mars_gemstone_cluster")
    
    //金星矿簇
    e.recipes.create.crushing([
        Item.of("minecraft:coal"),
        Item.of("create:crushed_raw_gold").withChance(0.6),
        Item.of("minecraft:diamond").withChance(0.2),
        Item.of("createdelight:crushed_raw_calorite").withChance(0.25)
    ],
        ["createdelight:venus_ore_cluster"])
        .id("create:crushing/crushed_raw_ore_from_venus_ore_cluster")
    e.recipes.vintageimprovements.vibrating([
        Item.of("minecraft:coal"),
        Item.of("minecraft:raw_gold").withChance(0.6),
        Item.of("createoreexcavation:raw_diamond").withChance(0.4),
        Item.of("ad_astra:raw_calorite").withChance(0.5)
    ],
        ["createdelight:venus_ore_cluster"])
        .id("vintageimprovements:vibrating/raw_ore_from_venus_ore_cluster")
    
    //水星矿簇
    e.recipes.create.crushing([
        Item.of("create:crushed_raw_iron", 3)
    ],
        ["createdelight:mercury_ore_cluster"])
        .id("create:crushing/crushed_raw_ore_from_mercury_ore_cluster")
    e.recipes.vintageimprovements.vibrating([
        Item.of("minecraft:raw_iron", 3)
    ],
        ["createdelight:mercury_ore_cluster"])
        .id("vintageimprovements:vibrating/raw_ore_from_mercury_ore_cluster")
    
    //霜原星矿簇
    e.recipes.create.crushing([
        Item.of("minecraft:coal"),
        Item.of("create:crushed_raw_iron", 2),
        Item.of("create:crushed_raw_copper", 3),
        Item.of("minecraft:lapis_lazuli", 6)
    ],
        ["createdelight:glacio_ore_cluster"])
        .id("create:crushing/crushed_raw_ore_from_glacio_ore_cluster")
    e.recipes.vintageimprovements.vibrating([
        Item.of("minecraft:coal"),
        Item.of("minecraft:raw_iron", 2),
        Item.of("minecraft:raw_copper", 3),
        Item.of("minecraft:lapis_lazuli", 6)
    ],
        ["createdelight:glacio_ore_cluster"])
        .id("vintageimprovements:vibrating/raw_ore_from_glacio_ore_cluster")
    
})
