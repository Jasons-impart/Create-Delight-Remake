// Unified structure chest loot balancing.
// Jar-verified chest tables in this pass:
// - idas_forge-1.12.1+1.20.1.jar -> data/idas/loot_tables/chests (140 tables)
// - integrated_villages-1.3.0+1.20.1-forge.jar -> data/integrated_villages/loot_tables/chests (151 tables)
// - Northstar-0.5.4+1.20.1.jar -> data/northstar/loot_tables/chests (3 tables)
//
// Goals:
// 1) Make IDAS chest loot richer.
// 2) Align integrated village special chests with the same progression.
// 3) Add themed crops to integrated village living/farming chests.
// 4) Add space-tech flavor to Northstar and matching IDAS space loot.

function buildChestTables(namespace, groups) {
    const tables = []
    Object.keys(groups).forEach(root => {
        groups[root].forEach(entry => {
            tables.push(`${namespace}/chests/${root}/${entry}`)
        })
    })
    return tables
}

function buildMirroredChestTables(namespace, themes) {
    const tablesByTheme = {}
    Object.keys(themes).forEach(theme => {
        const themeTables = []
        themes[theme].suffixes.forEach(suffix => {
            themeTables.push(`${namespace}/chests/${theme}/${theme}${suffix}`)
        })
        tablesByTheme[theme] = themeTables
    })
    return tablesByTheme
}

function flattenTableGroups(groups) {
    const tables = []
    Object.keys(groups).forEach(key => {
        groups[key].forEach(tableId => {
            tables.push(tableId)
        })
    })
    return tables
}

function hasKey(id, keys) {
    return keys.some(key => id.indexOf(key) !== -1)
}

function collectTablesWithKeys(tableIds, keys) {
    return tableIds.filter(tableId => hasKey(tableId, keys))
}

function combinePools() {
    const combined = []
    let sourcePoolList
    let sourceIndex
    let poolIndex
    for (sourceIndex = 0; sourceIndex < arguments.length; sourceIndex++) {
        sourcePoolList = arguments[sourceIndex] || []
        for (poolIndex = 0; poolIndex < sourcePoolList.length; poolIndex++) {
            combined.push(sourcePoolList[poolIndex])
        }
    }
    return combined
}

function toLootTableId(id) {
    if (id.indexOf(":") !== -1) return id
    const splitIndex = id.indexOf("/")
    if (splitIndex === -1) return id
    return id.substring(0, splitIndex) + ":" + id.substring(splitIndex + 1)
}

const IDAS_CHEST_GROUPS = {
    "abandonedhouse": [
        "abandonedhouse",
        "abandonedhouse_create",
        "abandonedhouse_library",
    ],
    "ancient_mines": [
        "minesbasic",
        "minescreate",
        "mineshall",
    ],
    "ancient_portal": [
        "ancient_portal_nether",
        "ancient_portal_overworld",
    ],
    "ancient_statue": [
        "ancient_statue_jungle",
        "ancient_statue_treasure_desert",
        "ancient_statue_treasure_jungle",
        "ancient_statue_treasure_plains",
    ],
    "apothecary_abode": [
        "apothecary_abode",
        "apothecary_abode_books",
    ],
    "archmages_tower": [
        "archmages_tower",
        "archmages_tower_library",
        "archmages_tower_treasure",
    ],
    "bazaar": [
        "bazaar",
        "bazaar_food",
        "bazaar_tools",
    ],
    "bearclaw_inn": [
        "bearclaw_inn_bedroom",
        "bearclaw_inn_food",
    ],
    "beekeepers_house": [
        "beekeepers_bedroom",
        "beekeepers_food",
        "beekeepers_tools",
    ],
    "botanist": [
        "botanist",
        "botanist_bedroom",
        "botanist_food",
    ],
    "brickhouse": [
        "brickhouse",
        "brickhouse_library",
        "brickhouse_windmill",
    ],
    "castle": [
        "castle",
        "castle_bedroom",
        "castle_food",
        "castle_library",
        "castle_throne",
    ],
    "collectors_museum": [
        "museum_basic",
        "museum_bedroom",
        "museum_farm",
        "museum_food",
        "museum_jail",
        "museum_library",
        "museum_space",
        "museum_treasure",
    ],
    "cottage": [
        "cottage",
    ],
    "desert_pyramid": [
        "desert_pyramid",
        "desert_pyramid_library",
        "desert_pyramid_surface",
        "desert_pyramid_tomb",
        "desert_pyramid_tools",
        "desert_pyramid_treasure",
    ],
    "dig_site": [
        "dig_site",
        "dig_site_desert",
        "dig_site_tools",
        "dig_site_treasure",
    ],
    "dread_citadel": [
        "dread_citadel",
        "dread_citadel_library",
        "dread_citadel_throne",
    ],
    "enchantingtower": [
        "enchantingtower_basic",
        "enchantingtower_basic_ars",
        "enchantingtower_library",
        "enchantingtower_top",
        "enchantingtower_top_ars",
    ],
    "farmhouse": [
        "farmhouse",
        "farmhouse_bedroom",
        "farmhouse_food",
        "farmhouse_mill",
    ],
    "fishermans_lodge": [
        "fishermans_lodge",
        "fishermans_lodge_tools",
    ],
    "frozen_crypt": [
        "frozen_crypt",
    ],
    "haunted_manor": [
        "haunted_manor",
        "haunted_manor_library",
        "haunted_manor_tools",
        "haunted_manor_treasure",
        "if_haunted_manor",
    ],
    "hermits_hollow": [
        "hollow_bedroom",
        "hollow_food",
    ],
    "hunters_cabin": [
        "hunters_cabin",
        "hunters_cabin_library",
        "hunters_cabin_tools",
    ],
    "labyrinth": [
        "if_labyrinth_tomb",
        "labyrinth",
        "labyrinth_croc",
        "labyrinth_library",
        "labyrinth_tomb",
        "labyrinth_treasure",
    ],
    "mason_house": [
        "mason_house",
        "mason_house_bedroom",
        "mason_house_food",
    ],
    "necromancers_spire": [
        "necromancers_spire",
    ],
    "nexus": [
        "nexus",
    ],
    "pillager_camp": [
        "pillager_camp",
    ],
    "pillager_fortress": [
        "pillager_basic",
        "pillager_bedroom",
        "pillager_jail",
        "pillager_library",
    ],
    "redhorn_guild": [
        "redhorn_guild",
        "redhorn_guild_bedroom",
        "redhorn_guild_tools",
    ],
    "ruined_church": [
        "ruined_church",
    ],
    "ruined_fort": [
        "ruined_fort",
    ],
    "ruins_of_the_deep": [
        "ruins_basic",
        "ruins_bedroom",
        "ruins_create",
        "ruins_food",
        "ruins_library",
        "ruins_ocean",
        "ruins_tools",
        "ruins_treasure",
    ],
    "sirens_cove": [
        "sirens_cove",
    ],
    "sunken_ship": [
        "sunken_ship_supply",
        "sunken_ship_treasure",
    ],
    "the_log": [
        "the_log",
        "the_log_tools",
    ],
    "tinkers_citadel": [
        "tinkers_citadel",
        "tinkers_citadel_bedroom",
        "tinkers_citadel_create",
        "tinkers_citadel_library",
        "tinkers_citadel_tools",
        "tinkers_citadel_vault",
    ],
    "tinkers_workshop": [
        "tinkers_workshop",
        "tinkers_workshop_basic",
        "tinkers_workshop_bedroom",
        "tinkers_workshop_tools",
        "tinkers_workshop_vault",
    ],
    "train_ruins": [
        "train_ruins",
        "train_ruins_bedroom",
        "train_ruins_create",
    ],
    "tree_of_wisdom": [
        "tree_of_wisdom",
    ],
    "treetop_tavern": [
        "treetop_tavern",
        "treetop_tavern_bedroom",
        "treetop_tavern_food",
        "treetop_tavern_tools",
    ],
    "windswept_shrine": [
        "windswept_shrine",
    ],
    "winter_wagon": [
        "winter_wagon",
        "winter_wagon_tools",
    ],
    "witches_treestump": [
        "witches_treestump",
    ],
    "wizardtower": [
        "wizardtower_basic",
        "wizardtower_library",
        "wizardtower_top",
    ],
}

// Note: "shepard" matches the jar's actual file names.
const INTEGRATED_VILLAGE_THEMES = {
    "airship_village": {
        suffixes: ["", "_bedroom", "_blacksmith", "_cartographer", "_cleric", "_create", "_farmhouse", "_fletcher", "_kitchen", "_leatherworker", "_library", "_mason", "_shepard", "_treasure"],
        crops: ["createcafe:coffee_beans", "create_bic_bit:sunflower_seeds", "supplementaries:flax_seeds"],
    },
    "cabin_village": {
        suffixes: ["", "_bedroom", "_blacksmith", "_cartographer", "_cleric", "_farmhouse", "_fisherman", "_fletcher", "_kitchen", "_leatherworker", "_library", "_mason", "_shepard"],
        crops: ["vintagedelight:oat_seeds", "minecraft:pumpkin_seeds", "minecraft:beetroot_seeds"],
    },
    "clockwork_village": {
        suffixes: ["", "_bedroom", "_blacksmith", "_cartographer", "_cleric", "_farmhouse", "_fisherman", "_fletcher", "_kitchen", "_leatherworker", "_library", "_mason", "_shepard"],
        crops: ["create_bic_bit:sunflower_seeds", "frycooks_delight:canola_seeds", "minecraft:wheat_seeds"],
    },
    "kutcha_village": {
        suffixes: ["", "_bedroom", "_blacksmith", "_cartographer", "_cleric", "_farmhouse", "_fisherman", "_fletcher", "_kitchen", "_leatherworker", "_library", "_mason", "_shepard"],
        crops: ["festival_delicacies:garlic_chive_seeds", "festival_delicacies:eggplant_seeds", "culturaldelights:cucumber_seeds"],
    },
    "marketstead_village": {
        suffixes: ["", "_bedroom", "_blacksmith", "_butcher", "_cleric", "_create", "_farmhouse", "_fisherman", "_fletcher", "_kitchen", "_leatherworker", "_library", "_mason", "_tomb"],
        crops: ["farmersdelight:cabbage_seeds", "farmersdelight:tomato_seeds", "corn_delight:corn_seeds"],
    },
    "mediterranean_village": {
        suffixes: ["", "_bedroom", "_blacksmith", "_butcher", "_create", "_farmhouse", "_kitchen", "_library", "_shepard", "_treasure"],
        crops: ["vinery:red_grape_seeds", "vinery:white_grape_seeds", "culturaldelights:avocado_pit"],
    },
    "minka_village": {
        suffixes: ["", "_bedroom", "_blacksmith", "_cartographer", "_cleric", "_farmhouse", "_fisherman", "_fletcher", "_kitchen", "_library", "_treasure"],
        crops: ["createdelight:adzuki_beans_seed", "festival_delicacies:chinese_cabbage_seeds", "festival_delicacies:fennel_seeds"],
    },
    "mossy_mounds": {
        suffixes: ["", "_bedroom", "_blacksmith", "_cartographer", "_cleric", "_farmhouse", "_fisherman", "_fletcher", "_kitchen", "_leatherworker", "_library", "_mason", "_shepard", "_treasure"],
        crops: ["supplementaries:flax_seeds", "collectorsreap:pomegranate_seeds", "collectorsreap:lime_seeds"],
    },
    "oasis_village": {
        suffixes: ["", "_bedroom", "_blacksmith", "_cartographer", "_cleric", "_farmhouse", "_kitchen", "_leatherworker", "_library", "_mason", "_shepard"],
        crops: ["createcafe:cassava_seeds", "collectorsreap:lime_seeds", "culturaldelights:cucumber_seeds"],
    },
    "pirate_village": {
        suffixes: ["", "_bedroom", "_blacksmith", "_cartographer", "_cleric", "_create", "_farmhouse", "_kitchen", "_leatherworker", "_library", "_mason", "_shepard", "_treasure"],
        crops: ["corn_delight:corn_seeds", "frycooks_delight:canola_seeds", "minecraft:melon_seeds"],
    },
    "swamp_village": {
        suffixes: ["", "_armorer", "_bedroom", "_blacksmith", "_butcher", "_cleric", "_create", "_farmhouse", "_fisherman", "_fletcher", "_kitchen", "_leatherworker", "_library", "_mason", "_tomb"],
        crops: ["culturaldelights:eggplant_seeds", "festival_delicacies:fennel_seeds", "neapolitan:strawberry_pips"],
    },
    "tavern_village": {
        suffixes: ["", "_bedroom", "_blacksmith", "_butcher", "_create", "_farmhouse", "_kitchen", "_library", "_shepard", "_treasure"],
        crops: ["frycooks_delight:canola_seeds", "vintagedelight:cucumber_seeds", "farmersdelight:rice_panicle"],
    },
}

const NORTHSTAR_CHEST_TABLES = [
    "northstar:chests/lunar_base_chest",
    "northstar:chests/martian_base_chest",
    "northstar:chests/martian_base_seed_chest",
]

const INTEGRATED_STRONGHOLD_TABLES = [
    "integrated_stronghold/chests/armory",
    "integrated_stronghold/chests/bedroom",
    "integrated_stronghold/chests/brewing",
    "integrated_stronghold/chests/crypt",
    "integrated_stronghold/chests/dining_hall",
    "integrated_stronghold/chests/enchanting",
    "integrated_stronghold/chests/farm",
    "integrated_stronghold/chests/grand_library",
    "integrated_stronghold/chests/intersection",
    "integrated_stronghold/chests/maze",
    "integrated_stronghold/chests/mine",
    "integrated_stronghold/chests/nether_portal",
    "integrated_stronghold/chests/prison",
    "integrated_stronghold/chests/sanctorum",
    "integrated_stronghold/chests/secret_lab",
    "integrated_stronghold/chests/storage",
    "integrated_stronghold/chests/stronghold",
    "integrated_stronghold/chests/torture_chamber",
    "integrated_stronghold/chests/treasure",
]

const KAISYN_TABLES = [
    "kaisyn/outpost/common/armory",
    "kaisyn/outpost/common/food",
    "kaisyn/outpost/exclusives/outpost_beach_barrel",
    "kaisyn/outpost/exclusives/outpost_mediterranean_barrel",
    "kaisyn/outpost/exclusives/outpost_rustic_barrel",
    "kaisyn/village/exclusives/village_classic_blacksmith",
    "kaisyn/village/exclusives/village_mediterranean_house",
    "kaisyn/village/exclusives/village_piglin_barrel",
    "kaisyn/village/exclusives/village_piglin_house",
    "kaisyn/village/exclusives/village_wandering_trader_hut",
    "kaisyn/village/village_badlands_house",
    "kaisyn/village/village_jungle_house",
    "kaisyn/village/village_mushroom_house",
    "kaisyn/village/village_swamp_house",
]

const IDAS_CHEST_TABLES = buildChestTables("idas", IDAS_CHEST_GROUPS)
const INTEGRATED_VILLAGE_TABLES_BY_THEME = buildMirroredChestTables("integrated_villages", INTEGRATED_VILLAGE_THEMES)
const INTEGRATED_VILLAGE_TABLES = flattenTableGroups(INTEGRATED_VILLAGE_TABLES_BY_THEME)
const INTEGRATED_VILLAGE_BONUS_TABLES = collectTablesWithKeys(INTEGRATED_VILLAGE_TABLES, ["_treasure", "_tomb"])
const IDAS_SPACE_TABLES = ["idas/chests/collectors_museum/museum_space"]

const HIGH_TIER_KEYS = [
    "treasure", "throne", "tomb", "crypt", "dungeon", "citadel", "stronghold",
    "sanctorum", "secret_lab", "maze", "torture", "prison", "armory", "nether_portal",
]

const MID_TIER_KEYS = [
    "library", "blacksmith", "create", "castle", "mines", "temple", "ruins", "tower",
]

function normalizeRolls(rolls) {
    if (Array.isArray(rolls)) {
        const minRolls = Math.max(0, Math.floor(rolls[0] || 0))
        const rawMaxRolls = rolls[1] == null ? minRolls : Math.floor(rolls[1])
        const maxRolls = Math.max(minRolls, rawMaxRolls)
        return [minRolls, maxRolls]
    }

    const fixedRolls = Math.max(0, Math.floor(rolls || 0))
    return [fixedRolls, fixedRolls]
}

function normalizeCountSpec(countSpec) {
    if (Array.isArray(countSpec)) {
        let minCount = Math.max(1, Math.floor(countSpec[0] || 1))
        let rawMaxCount = countSpec[1] == null ? minCount : Math.floor(countSpec[1])
        let maxCount = Math.max(minCount, rawMaxCount)
        if (minCount === maxCount) return minCount
        return [minCount, maxCount]
    }

    let fixedCount = Math.max(1, Math.floor(countSpec || 1))
    return fixedCount
}

function countSpecsMatch(leftCountSpec, rightCountSpec) {
    if (Array.isArray(leftCountSpec) && Array.isArray(rightCountSpec)) {
        return leftCountSpec[0] === rightCountSpec[0] && leftCountSpec[1] === rightCountSpec[1]
    }

    return leftCountSpec === rightCountSpec
}

function buildWeightedItems(entries) {
    let mergedEntries = []
    let weightedItems = []
    let entryIndex
    let mergedKeyIndex
    let sourceEntry
    let sourceItemId
    let sourceWeightValue
    let sourceCountSpec
    let mergedEntry
    let pooledEntry
    let pooledItemCountSpec
    let entryWasMerged
    let lootEntry
    let countFunctionJson

    for (entryIndex = 0; entryIndex < entries.length; entryIndex++) {
        sourceEntry = entries[entryIndex]
        sourceItemId = sourceEntry[0]
        sourceWeightValue = Math.max(0, Math.round(sourceEntry[1] || 0))
        sourceCountSpec = normalizeCountSpec(sourceEntry[2] || 1)
        if (!sourceItemId || sourceWeightValue <= 0) {
            continue
        }

        entryWasMerged = false
        for (mergedKeyIndex = 0; mergedKeyIndex < mergedEntries.length; mergedKeyIndex++) {
            mergedEntry = mergedEntries[mergedKeyIndex]
            if (
                mergedEntry.itemId === sourceItemId &&
                countSpecsMatch(mergedEntry.countSpec, sourceCountSpec)
            ) {
                mergedEntry.weight += sourceWeightValue
                entryWasMerged = true
                break
            }
        }

        if (!entryWasMerged) {
            mergedEntries.push({
                itemId: sourceItemId,
                countSpec: sourceCountSpec,
                weight: sourceWeightValue,
            })
        }
    }

    for (mergedKeyIndex = 0; mergedKeyIndex < mergedEntries.length; mergedKeyIndex++) {
        pooledEntry = mergedEntries[mergedKeyIndex]
        pooledItemCountSpec = pooledEntry.countSpec

        try {
            if (Array.isArray(pooledItemCountSpec)) {
                lootEntry = LootEntry.of(Item.of(pooledEntry.itemId)).withWeight(pooledEntry.weight)
                countFunctionJson = {
                    "function": "minecraft:set_count",
                    "count": {
                        "type": "minecraft:uniform",
                        "min": pooledItemCountSpec[0],
                        "max": pooledItemCountSpec[1],
                    },
                    "add": false,
                }
                lootEntry.customFunction(countFunctionJson)
            } else {
                lootEntry = LootEntry.of(Item.of(pooledEntry.itemId, pooledItemCountSpec)).withWeight(pooledEntry.weight)
            }

            weightedItems.push(lootEntry)
        } catch (error) {
            console.warn(`[unified_loot] skipped invalid pooled item '${pooledEntry.itemId}': ${error}`)
        }
    }

    return weightedItems
}

function addLootPools(event, tableId, poolConfigs) {
    if (!poolConfigs || poolConfigs.length === 0) return

    let normalizedTableId = toLootTableId(tableId)
    let modifier = null
    let appliedPoolCount = 0
    let poolIndex
    let currentPoolConfig
    let currentRollRange
    let currentWeightedItems
    let currentPoolName

    for (poolIndex = 0; poolIndex < poolConfigs.length; poolIndex++) {
        currentPoolConfig = poolConfigs[poolIndex]
        if (!currentPoolConfig || !currentPoolConfig.entries || currentPoolConfig.entries.length === 0) {
            continue
        }

        currentRollRange = normalizeRolls(currentPoolConfig.rolls)
        if (currentRollRange[1] <= 0) {
            continue
        }

        currentWeightedItems = buildWeightedItems(currentPoolConfig.entries)
        currentPoolName = currentPoolConfig.name || "unnamed"
        if (currentWeightedItems.length === 0) {
            console.warn(`[unified_loot] skipped empty pool '${currentPoolName}' for ${normalizedTableId}`)
            continue
        }

        if (modifier == null) {
            modifier = event.addLootTableModifier(normalizedTableId)
        }

        modifier.pool((function(rollRangeValue, weightedItemsValue) {
            return function(groupedPool) {
                groupedPool.rolls(rollRangeValue)
                groupedPool.addWeightedLoot(weightedItemsValue)
            }
        })(currentRollRange, currentWeightedItems))

        appliedPoolCount += 1
        console.info(
            `[unified_loot] pool applied: ${normalizedTableId}, pool=${currentPoolName}, entries=${currentWeightedItems.length}, rolls=${currentRollRange[0]}-${currentRollRange[1]}`
        )
    }

    if (appliedPoolCount === 0) {
        console.warn(`[unified_loot] no valid pools for ${normalizedTableId}`)
    }
}

function buildTechPools(tableId, tier) {
    const techPools = [
        {
            name: "tech_salvage",
            rolls: [1, 2],
            entries: [
                ["create:andesite_alloy", 28, [1, 6]],
                ["create:electron_tube", 14, [1, 3]],
                ["createaddition:copper_wire", 16, [1, 5]],
                ["createaddition:iron_rod", 14, [1, 4]],
            ],
        },
    ]

    if (tier >= 2) {
        const componentPool = {
            name: "tech_components",
            rolls: [0, 1],
            entries: [
                ["create:brass_ingot", 14, [1, 4]],
                ["createaddition:electrum_ingot", 8, [1, 3]],
                ["createaddition:capacitor", 7, [1, 2]],
                ["createdieselgenerators:engine_piston", 6, [1, 2]],
                ["create_new_age:overcharged_iron", 3, [1, 2]]
            ],
        }

        if (tier === 2) {
            componentPool.entries.push(["create:precision_mechanism", 6])
        }

        techPools.push(componentPool)
    }

    if (tier >= 3) {
        techPools.push({
            name: "tech_relic",
            rolls: [0, 1],
            entries: [
                ["create:precision_mechanism", 10],
                ["create_sa:heat_engine", 5],
                ["northstar:circuit", 5],
                ["createaddition:superconducting_connector", 3],
            ],
        })
    }

    const contextualEntries = []
    if (tableId.indexOf("library") !== -1) {
        contextualEntries.push(["create:schematic", 12])
    }
    if (
        tableId.indexOf("tools") !== -1 ||
        tableId.indexOf("blacksmith") !== -1 ||
        tableId.indexOf("armory") !== -1
    ) {
        contextualEntries.push(["create:wrench", 10])
    }

    if (contextualEntries.length > 0) {
        techPools.push({
            name: "tech_context",
            rolls: [0, 1],
            entries: contextualEntries,
        })
    }

    return techPools
}

function buildNorthstarSpacePools(tableId) {
    const spacePools = [
        {
            name: "space_core",
            rolls: [1, 2],
            entries: [
                ["northstar:liquid_oxygen_bucket", 20],
                ["northstar:lunar_sapphire_shard", 25],
                ["northstar:circuit", 18],
                ["northstar:titanium_nugget", 22, [2, 6]],
            ],
        },
    ]

    if (tableId.indexOf("martian_base") !== -1) {
        spacePools.push({
            name: "space_martian_tech",
            rolls: [0, 1],
            entries: [
                ["northstar:martian_steel", 20],
                ["northstar:advanced_circuit", 8],
            ],
        })
    }

    if (tableId.indexOf("seed_chest") !== -1) {
        spacePools.push({
            name: "space_biology",
            rolls: [1, 2],
            entries: [
                ["northstar:dormant_martian_seed", 30],
                ["northstar:dormant_martian_sapling", 18],
                ["northstar:martian_strawberry", 26],
            ],
        })
    }

    return spacePools
}

function tierForTable(id) {
    if (hasKey(id, HIGH_TIER_KEYS)) return 3
    if (hasKey(id, MID_TIER_KEYS)) return 2
    return 1
}

function buildVillageCropPools(tableId, crops) {
    const isAgricultural = (
        tableId.indexOf("farmhouse") !== -1 ||
        tableId.indexOf("kitchen") !== -1 ||
        tableId.indexOf("food") !== -1
    )

    const themeCropEntries = []
    crops.forEach((crop, index) => {
        const themeCropWeight = isAgricultural ? (24 - index * 3) : (14 - index * 2)
        if (themeCropWeight > 3) {
            themeCropEntries.push([crop, themeCropWeight])
        }
    })

    return [
        {
            name: "village_theme_crops",
            rolls: isAgricultural ? [1, 2] : [1, 1],
            entries: themeCropEntries,
        },
    ]
}

function applyIdasLoot(event) {
    IDAS_CHEST_TABLES.forEach(id => {
        const tier = tierForTable(id)
        addLootPools(event, id, buildTechPools(id, tier))
    })
}

function applyIntegratedVillageLoot(event) {
    let integratedCropTableCount = 0

    Object.keys(INTEGRATED_VILLAGE_TABLES_BY_THEME).forEach(theme => {
        const crops = INTEGRATED_VILLAGE_THEMES[theme].crops
        INTEGRATED_VILLAGE_TABLES_BY_THEME[theme].forEach(id => {
            addLootPools(event, id, buildVillageCropPools(id, crops))
            integratedCropTableCount += 1
        })
    })

    INTEGRATED_VILLAGE_BONUS_TABLES.forEach(id => {
        addLootPools(event, id, buildTechPools(id, 2))
    })

    console.info(`[unified_loot] integrated village crop tables updated: ${integratedCropTableCount}`)
}

function applyNorthstarLoot(event) {
    NORTHSTAR_CHEST_TABLES.forEach(id => {
        addLootPools(event, id, combinePools(
            buildTechPools(id, 2),
            buildNorthstarSpacePools(id)
        ))
    })

    IDAS_SPACE_TABLES.forEach(id => {
        addLootPools(event, id, buildNorthstarSpacePools(id))
    })
}

function applyLegacyDungeonLoot(event) {
    // Existing extra targets kept to preserve prior unified-loot behavior.
    INTEGRATED_STRONGHOLD_TABLES.forEach(id => {
        const tier = Math.max(2, tierForTable(id))
        addLootPools(event, id, buildTechPools(id, tier))
    })

    KAISYN_TABLES
        .filter(id => id.indexOf("/outpost/") !== -1)
        .forEach(id => {
            addLootPools(event, id, combinePools(
                [
                {
                    name: "outpost_armament",
                    rolls: [1, 1],
                    entries: [
                        ["minecraft:arrow", 30, 8],
                        ["minecraft:string", 18, 3],
                        ["minecraft:iron_nugget", 12, 4],
                        ["minecraft:crossbow", 2],
                    ],
                },
                ]
            ))
        })
}

LootJS.modifiers(event => {
    console.info(
        `[unified_loot] verified chest tables: idas=${IDAS_CHEST_TABLES.length}, integrated_villages=${INTEGRATED_VILLAGE_TABLES.length}, northstar=${NORTHSTAR_CHEST_TABLES.length}`
    )

    applyIdasLoot(event)
    applyIntegratedVillageLoot(event)
    applyNorthstarLoot(event)
    applyLegacyDungeonLoot(event)
})
