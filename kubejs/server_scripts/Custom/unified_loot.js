// Unified structure/village loot balancing.
// Goals:
// 1) Make IDAS chest loot richer.
// 2) Make dungeon-like loot tables closer to IDAS style
//    (integrated stronghold / kaisyn outpost included).
// 3) Add theme-matching crops to integrated villages.

const IDAS_CHEST_TABLES = [
    "idas/chests/abandonedhouse/abandonedhouse",
    "idas/chests/abandonedhouse/abandonedhouse_create",
    "idas/chests/abandonedhouse/abandonedhouse_library",
    "idas/chests/ancient_mines/minesbasic",
    "idas/chests/ancient_mines/minescreate",
    "idas/chests/ancient_mines/mineshall",
    "idas/chests/ancient_portal/ancient_portal_nether",
    "idas/chests/ancient_portal/ancient_portal_overworld",
    "idas/chests/ancient_statue/ancient_statue_jungle",
    "idas/chests/ancient_statue/ancient_statue_treasure_desert",
    "idas/chests/ancient_statue/ancient_statue_treasure_jungle",
    "idas/chests/ancient_statue/ancient_statue_treasure_plains",
    "idas/chests/apothecary_abode/apothecary_abode",
    "idas/chests/apothecary_abode/apothecary_abode_books",
    "idas/chests/archmages_tower/archmages_tower",
    "idas/chests/archmages_tower/archmages_tower_library",
    "idas/chests/archmages_tower/archmages_tower_treasure",
    "idas/chests/bazaar/bazaar",
    "idas/chests/bazaar/bazaar_food",
    "idas/chests/bazaar/bazaar_tools",
    "idas/chests/bearclaw_inn/bearclaw_inn_bedroom",
    "idas/chests/bearclaw_inn/bearclaw_inn_food",
    "idas/chests/beekeepers_house/beekeepers_bedroom",
    "idas/chests/beekeepers_house/beekeepers_food",
    "idas/chests/beekeepers_house/beekeepers_tools",
    "idas/chests/botanist/botanist",
    "idas/chests/botanist/botanist_bedroom",
    "idas/chests/botanist/botanist_food",
    "idas/chests/brickhouse/brickhouse",
    "idas/chests/brickhouse/brickhouse_library",
    "idas/chests/brickhouse/brickhouse_windmill",
    "idas/chests/castle/castle",
    "idas/chests/castle/castle_bedroom",
    "idas/chests/castle/castle_food",
    "idas/chests/castle/castle_library",
    "idas/chests/castle/castle_throne",
    "idas/chests/collectors_museum/museum_basic",
    "idas/chests/collectors_museum/museum_bedroom",
    "idas/chests/collectors_museum/museum_farm",
    "idas/chests/collectors_museum/museum_food",
    "idas/chests/collectors_museum/museum_jail",
    "idas/chests/collectors_museum/museum_library",
    "idas/chests/collectors_museum/museum_space",
    "idas/chests/collectors_museum/museum_treasure",
    "idas/chests/cottage/cottage",
    "idas/chests/desert_pyramid/desert_pyramid",
    "idas/chests/desert_pyramid/desert_pyramid_library",
    "idas/chests/desert_pyramid/desert_pyramid_surface",
    "idas/chests/desert_pyramid/desert_pyramid_tomb",
    "idas/chests/desert_pyramid/desert_pyramid_tools",
    "idas/chests/desert_pyramid/desert_pyramid_treasure",
    "idas/chests/dig_site/dig_site",
    "idas/chests/dig_site/dig_site_desert",
    "idas/chests/dig_site/dig_site_tools",
    "idas/chests/dig_site/dig_site_treasure",
    "idas/chests/dread_citadel/dread_citadel",
    "idas/chests/dread_citadel/dread_citadel_library",
    "idas/chests/dread_citadel/dread_citadel_throne",
    "idas/chests/enchantingtower/enchantingtower_basic",
    "idas/chests/enchantingtower/enchantingtower_basic_ars",
    "idas/chests/enchantingtower/enchantingtower_library",
    "idas/chests/enchantingtower/enchantingtower_top",
    "idas/chests/enchantingtower/enchantingtower_top_ars",
    "idas/chests/farmhouse/farmhouse",
    "idas/chests/farmhouse/farmhouse_bedroom",
    "idas/chests/farmhouse/farmhouse_food",
    "idas/chests/farmhouse/farmhouse_mill",
    "idas/chests/fishermans_lodge/fishermans_lodge",
    "idas/chests/fishermans_lodge/fishermans_lodge_tools",
    "idas/chests/frozen_crypt/frozen_crypt",
    "idas/chests/haunted_manor/haunted_manor",
    "idas/chests/haunted_manor/haunted_manor_library",
    "idas/chests/haunted_manor/haunted_manor_tools",
    "idas/chests/haunted_manor/haunted_manor_treasure",
    "idas/chests/haunted_manor/if_haunted_manor",
    "idas/chests/hermits_hollow/hollow_bedroom",
    "idas/chests/hermits_hollow/hollow_food",
    "idas/chests/hunters_cabin/hunters_cabin",
    "idas/chests/hunters_cabin/hunters_cabin_library",
    "idas/chests/hunters_cabin/hunters_cabin_tools",
    "idas/chests/labyrinth/if_labyrinth_tomb",
    "idas/chests/labyrinth/labyrinth",
    "idas/chests/labyrinth/labyrinth_croc",
    "idas/chests/labyrinth/labyrinth_library",
    "idas/chests/labyrinth/labyrinth_tomb",
    "idas/chests/labyrinth/labyrinth_treasure",
    "idas/chests/mason_house/mason_house",
    "idas/chests/mason_house/mason_house_bedroom",
    "idas/chests/mason_house/mason_house_food",
    "idas/chests/necromancers_spire/necromancers_spire",
    "idas/chests/nexus/nexus",
    "idas/chests/pillager_camp/pillager_camp",
    "idas/chests/pillager_fortress/pillager_basic",
    "idas/chests/pillager_fortress/pillager_bedroom",
    "idas/chests/pillager_fortress/pillager_jail",
    "idas/chests/pillager_fortress/pillager_library",
    "idas/chests/redhorn_guild/redhorn_guild",
    "idas/chests/redhorn_guild/redhorn_guild_bedroom",
    "idas/chests/redhorn_guild/redhorn_guild_tools",
    "idas/chests/ruined_church/ruined_church",
    "idas/chests/ruined_fort/ruined_fort",
    "idas/chests/ruins_of_the_deep/ruins_basic",
    "idas/chests/ruins_of_the_deep/ruins_bedroom",
    "idas/chests/ruins_of_the_deep/ruins_create",
    "idas/chests/ruins_of_the_deep/ruins_food",
    "idas/chests/ruins_of_the_deep/ruins_library",
    "idas/chests/ruins_of_the_deep/ruins_ocean",
    "idas/chests/ruins_of_the_deep/ruins_tools",
    "idas/chests/ruins_of_the_deep/ruins_treasure",
    "idas/chests/sirens_cove/sirens_cove",
    "idas/chests/sunken_ship/sunken_ship_supply",
    "idas/chests/sunken_ship/sunken_ship_treasure",
    "idas/chests/the_log/the_log",
    "idas/chests/the_log/the_log_tools",
    "idas/chests/tinkers_citadel/tinkers_citadel",
    "idas/chests/tinkers_citadel/tinkers_citadel_bedroom",
    "idas/chests/tinkers_citadel/tinkers_citadel_create",
    "idas/chests/tinkers_citadel/tinkers_citadel_library",
    "idas/chests/tinkers_citadel/tinkers_citadel_tools",
    "idas/chests/tinkers_citadel/tinkers_citadel_vault",
    "idas/chests/tinkers_workshop/tinkers_workshop",
    "idas/chests/tinkers_workshop/tinkers_workshop_basic",
    "idas/chests/tinkers_workshop/tinkers_workshop_bedroom",
    "idas/chests/tinkers_workshop/tinkers_workshop_tools",
    "idas/chests/tinkers_workshop/tinkers_workshop_vault",
    "idas/chests/train_ruins/train_ruins",
    "idas/chests/train_ruins/train_ruins_bedroom",
    "idas/chests/train_ruins/train_ruins_create",
    "idas/chests/tree_of_wisdom/tree_of_wisdom",
    "idas/chests/treetop_tavern/treetop_tavern",
    "idas/chests/treetop_tavern/treetop_tavern_bedroom",
    "idas/chests/treetop_tavern/treetop_tavern_food",
    "idas/chests/treetop_tavern/treetop_tavern_tools",
    "idas/chests/windswept_shrine/windswept_shrine",
    "idas/chests/winter_wagon/winter_wagon",
    "idas/chests/winter_wagon/winter_wagon_tools",
    "idas/chests/witches_treestump/witches_treestump",
    "idas/chests/wizardtower/wizardtower_basic",
    "idas/chests/wizardtower/wizardtower_library",
    "idas/chests/wizardtower/wizardtower_top",
]

const INTEGRATED_VILLAGE_TABLES = [
    "integrated_villages/chests/airship_village/airship_village",
    "integrated_villages/chests/airship_village/airship_village_bedroom",
    "integrated_villages/chests/airship_village/airship_village_blacksmith",
    "integrated_villages/chests/airship_village/airship_village_cartographer",
    "integrated_villages/chests/airship_village/airship_village_cleric",
    "integrated_villages/chests/airship_village/airship_village_create",
    "integrated_villages/chests/airship_village/airship_village_farmhouse",
    "integrated_villages/chests/airship_village/airship_village_fletcher",
    "integrated_villages/chests/airship_village/airship_village_kitchen",
    "integrated_villages/chests/airship_village/airship_village_leatherworker",
    "integrated_villages/chests/airship_village/airship_village_library",
    "integrated_villages/chests/airship_village/airship_village_mason",
    "integrated_villages/chests/airship_village/airship_village_shepard",
    "integrated_villages/chests/airship_village/airship_village_treasure",
    "integrated_villages/chests/cabin_village/cabin_village",
    "integrated_villages/chests/cabin_village/cabin_village_bedroom",
    "integrated_villages/chests/cabin_village/cabin_village_blacksmith",
    "integrated_villages/chests/cabin_village/cabin_village_cartographer",
    "integrated_villages/chests/cabin_village/cabin_village_cleric",
    "integrated_villages/chests/cabin_village/cabin_village_farmhouse",
    "integrated_villages/chests/cabin_village/cabin_village_fisherman",
    "integrated_villages/chests/cabin_village/cabin_village_fletcher",
    "integrated_villages/chests/cabin_village/cabin_village_kitchen",
    "integrated_villages/chests/cabin_village/cabin_village_leatherworker",
    "integrated_villages/chests/cabin_village/cabin_village_library",
    "integrated_villages/chests/cabin_village/cabin_village_mason",
    "integrated_villages/chests/cabin_village/cabin_village_shepard",
    "integrated_villages/chests/clockwork_village/clockwork_village",
    "integrated_villages/chests/clockwork_village/clockwork_village_bedroom",
    "integrated_villages/chests/clockwork_village/clockwork_village_blacksmith",
    "integrated_villages/chests/clockwork_village/clockwork_village_cartographer",
    "integrated_villages/chests/clockwork_village/clockwork_village_cleric",
    "integrated_villages/chests/clockwork_village/clockwork_village_farmhouse",
    "integrated_villages/chests/clockwork_village/clockwork_village_fisherman",
    "integrated_villages/chests/clockwork_village/clockwork_village_fletcher",
    "integrated_villages/chests/clockwork_village/clockwork_village_kitchen",
    "integrated_villages/chests/clockwork_village/clockwork_village_leatherworker",
    "integrated_villages/chests/clockwork_village/clockwork_village_library",
    "integrated_villages/chests/clockwork_village/clockwork_village_mason",
    "integrated_villages/chests/clockwork_village/clockwork_village_shepard",
    "integrated_villages/chests/kutcha_village/kutcha_village",
    "integrated_villages/chests/kutcha_village/kutcha_village_bedroom",
    "integrated_villages/chests/kutcha_village/kutcha_village_blacksmith",
    "integrated_villages/chests/kutcha_village/kutcha_village_cartographer",
    "integrated_villages/chests/kutcha_village/kutcha_village_cleric",
    "integrated_villages/chests/kutcha_village/kutcha_village_farmhouse",
    "integrated_villages/chests/kutcha_village/kutcha_village_fisherman",
    "integrated_villages/chests/kutcha_village/kutcha_village_fletcher",
    "integrated_villages/chests/kutcha_village/kutcha_village_kitchen",
    "integrated_villages/chests/kutcha_village/kutcha_village_leatherworker",
    "integrated_villages/chests/kutcha_village/kutcha_village_library",
    "integrated_villages/chests/kutcha_village/kutcha_village_mason",
    "integrated_villages/chests/kutcha_village/kutcha_village_shepard",
    "integrated_villages/chests/marketstead_village/marketstead_village",
    "integrated_villages/chests/marketstead_village/marketstead_village_bedroom",
    "integrated_villages/chests/marketstead_village/marketstead_village_blacksmith",
    "integrated_villages/chests/marketstead_village/marketstead_village_butcher",
    "integrated_villages/chests/marketstead_village/marketstead_village_cleric",
    "integrated_villages/chests/marketstead_village/marketstead_village_create",
    "integrated_villages/chests/marketstead_village/marketstead_village_farmhouse",
    "integrated_villages/chests/marketstead_village/marketstead_village_fisherman",
    "integrated_villages/chests/marketstead_village/marketstead_village_fletcher",
    "integrated_villages/chests/marketstead_village/marketstead_village_kitchen",
    "integrated_villages/chests/marketstead_village/marketstead_village_leatherworker",
    "integrated_villages/chests/marketstead_village/marketstead_village_library",
    "integrated_villages/chests/marketstead_village/marketstead_village_mason",
    "integrated_villages/chests/marketstead_village/marketstead_village_tomb",
    "integrated_villages/chests/mediterranean_village/mediterranean_village",
    "integrated_villages/chests/mediterranean_village/mediterranean_village_bedroom",
    "integrated_villages/chests/mediterranean_village/mediterranean_village_blacksmith",
    "integrated_villages/chests/mediterranean_village/mediterranean_village_butcher",
    "integrated_villages/chests/mediterranean_village/mediterranean_village_create",
    "integrated_villages/chests/mediterranean_village/mediterranean_village_farmhouse",
    "integrated_villages/chests/mediterranean_village/mediterranean_village_kitchen",
    "integrated_villages/chests/mediterranean_village/mediterranean_village_library",
    "integrated_villages/chests/mediterranean_village/mediterranean_village_shepard",
    "integrated_villages/chests/mediterranean_village/mediterranean_village_treasure",
    "integrated_villages/chests/minka_village/minka_village",
    "integrated_villages/chests/minka_village/minka_village_bedroom",
    "integrated_villages/chests/minka_village/minka_village_blacksmith",
    "integrated_villages/chests/minka_village/minka_village_cartographer",
    "integrated_villages/chests/minka_village/minka_village_cleric",
    "integrated_villages/chests/minka_village/minka_village_farmhouse",
    "integrated_villages/chests/minka_village/minka_village_fisherman",
    "integrated_villages/chests/minka_village/minka_village_fletcher",
    "integrated_villages/chests/minka_village/minka_village_kitchen",
    "integrated_villages/chests/minka_village/minka_village_library",
    "integrated_villages/chests/minka_village/minka_village_treasure",
    "integrated_villages/chests/mossy_mounds/mossy_mounds",
    "integrated_villages/chests/mossy_mounds/mossy_mounds_bedroom",
    "integrated_villages/chests/mossy_mounds/mossy_mounds_blacksmith",
    "integrated_villages/chests/mossy_mounds/mossy_mounds_cartographer",
    "integrated_villages/chests/mossy_mounds/mossy_mounds_cleric",
    "integrated_villages/chests/mossy_mounds/mossy_mounds_farmhouse",
    "integrated_villages/chests/mossy_mounds/mossy_mounds_fisherman",
    "integrated_villages/chests/mossy_mounds/mossy_mounds_fletcher",
    "integrated_villages/chests/mossy_mounds/mossy_mounds_kitchen",
    "integrated_villages/chests/mossy_mounds/mossy_mounds_leatherworker",
    "integrated_villages/chests/mossy_mounds/mossy_mounds_library",
    "integrated_villages/chests/mossy_mounds/mossy_mounds_mason",
    "integrated_villages/chests/mossy_mounds/mossy_mounds_shepard",
    "integrated_villages/chests/mossy_mounds/mossy_mounds_treasure",
    "integrated_villages/chests/oasis_village/oasis_village",
    "integrated_villages/chests/oasis_village/oasis_village_bedroom",
    "integrated_villages/chests/oasis_village/oasis_village_blacksmith",
    "integrated_villages/chests/oasis_village/oasis_village_cartographer",
    "integrated_villages/chests/oasis_village/oasis_village_cleric",
    "integrated_villages/chests/oasis_village/oasis_village_farmhouse",
    "integrated_villages/chests/oasis_village/oasis_village_kitchen",
    "integrated_villages/chests/oasis_village/oasis_village_leatherworker",
    "integrated_villages/chests/oasis_village/oasis_village_library",
    "integrated_villages/chests/oasis_village/oasis_village_mason",
    "integrated_villages/chests/oasis_village/oasis_village_shepard",
    "integrated_villages/chests/pirate_village/pirate_village",
    "integrated_villages/chests/pirate_village/pirate_village_bedroom",
    "integrated_villages/chests/pirate_village/pirate_village_blacksmith",
    "integrated_villages/chests/pirate_village/pirate_village_cartographer",
    "integrated_villages/chests/pirate_village/pirate_village_cleric",
    "integrated_villages/chests/pirate_village/pirate_village_create",
    "integrated_villages/chests/pirate_village/pirate_village_farmhouse",
    "integrated_villages/chests/pirate_village/pirate_village_kitchen",
    "integrated_villages/chests/pirate_village/pirate_village_leatherworker",
    "integrated_villages/chests/pirate_village/pirate_village_library",
    "integrated_villages/chests/pirate_village/pirate_village_mason",
    "integrated_villages/chests/pirate_village/pirate_village_shepard",
    "integrated_villages/chests/pirate_village/pirate_village_treasure",
    "integrated_villages/chests/swamp_village/swamp_village",
    "integrated_villages/chests/swamp_village/swamp_village_armorer",
    "integrated_villages/chests/swamp_village/swamp_village_bedroom",
    "integrated_villages/chests/swamp_village/swamp_village_blacksmith",
    "integrated_villages/chests/swamp_village/swamp_village_butcher",
    "integrated_villages/chests/swamp_village/swamp_village_cleric",
    "integrated_villages/chests/swamp_village/swamp_village_create",
    "integrated_villages/chests/swamp_village/swamp_village_farmhouse",
    "integrated_villages/chests/swamp_village/swamp_village_fisherman",
    "integrated_villages/chests/swamp_village/swamp_village_fletcher",
    "integrated_villages/chests/swamp_village/swamp_village_kitchen",
    "integrated_villages/chests/swamp_village/swamp_village_leatherworker",
    "integrated_villages/chests/swamp_village/swamp_village_library",
    "integrated_villages/chests/swamp_village/swamp_village_mason",
    "integrated_villages/chests/swamp_village/swamp_village_tomb",
    "integrated_villages/chests/tavern_village/tavern_village",
    "integrated_villages/chests/tavern_village/tavern_village_bedroom",
    "integrated_villages/chests/tavern_village/tavern_village_blacksmith",
    "integrated_villages/chests/tavern_village/tavern_village_butcher",
    "integrated_villages/chests/tavern_village/tavern_village_create",
    "integrated_villages/chests/tavern_village/tavern_village_farmhouse",
    "integrated_villages/chests/tavern_village/tavern_village_kitchen",
    "integrated_villages/chests/tavern_village/tavern_village_library",
    "integrated_villages/chests/tavern_village/tavern_village_shepard",
    "integrated_villages/chests/tavern_village/tavern_village_treasure",
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

const NORTHSTAR_CHEST_TABLES = [
    "northstar:chests/lunar_base_chest",
    "northstar:chests/martian_base_chest",
    "northstar:chests/martian_base_seed_chest",
]

const SPACE_STRUCTURE_TABLES = [
    "idas/chests/collectors_museum/museum_space",
    "northstar:chests/lunar_base_chest",
    "northstar:chests/martian_base_chest",
    "northstar:chests/martian_base_seed_chest",
]

const HIGH_TIER_KEYS = [
    "treasure", "throne", "tomb", "crypt", "dungeon", "citadel", "stronghold",
    "sanctorum", "secret_lab", "maze", "torture", "prison", "armory", "nether_portal"
]

const MID_TIER_KEYS = [
    "library", "blacksmith", "create", "castle", "mines", "temple", "ruins", "tower"
]

function hasKey(id, keys) {
    return keys.some(key => id.indexOf(key) !== -1)
}

function addIdasStyleWealth(modifier, tier) {
    // Baseline wealth boost
    // In this pack economy: iron_coin < copper_coin
    modifier.addLoot("createdelightcore:iron_coin").randomChance(0.40)
    modifier.addLoot("createdelightcore:copper_coin").randomChance(0.18)
    modifier.addLoot("minecraft:emerald").randomChance(0.20)

    if (tier >= 2) {
        modifier.addLoot("createdelightcore:gold_coin").randomChance(0.10)
        modifier.addLoot("minecraft:diamond").randomChance(0.06)
    }
    if (tier >= 3) {
        modifier.addLoot("createdelightcore:emerald_coin").randomChance(0.035)
    }
}

function addCreateTechLoot(modifier, tier, tableId) {
    // Common Create supplies
    modifier.addLoot("create:andesite_alloy").randomChance(0.28)
    modifier.addLoot("create:electron_tube").randomChance(0.14)
    modifier.addLoot("createaddition:copper_wire").randomChance(0.16)
    modifier.addLoot("createaddition:iron_rod").randomChance(0.14)
    modifier.addLoot("create_new_age:copper_circuit").randomChance(0.08)

    if (tier >= 2) {
        modifier.addLoot("create:brass_ingot").randomChance(0.14)
        modifier.addLoot("create:precision_mechanism").randomChance(0.06)
        modifier.addLoot("createaddition:electrum_ingot").randomChance(0.08)
        modifier.addLoot("createaddition:capacitor").randomChance(0.07)
        modifier.addLoot("createdieselgenerators:engine_piston").randomChance(0.06)
        modifier.addLoot("create_new_age:blank_circuit").randomChance(0.05)
    }

    if (tier >= 3) {
        modifier.addLoot("create:precision_mechanism").randomChance(0.10)
        modifier.addLoot("create_sa:heat_engine").randomChance(0.045)
        modifier.addLoot("northstar:circuit").randomChance(0.05)
        modifier.addLoot("createaddition:superconducting_connector").randomChance(0.028)
        modifier.addLoot("create_new_age:overcharged_iron").randomChance(0.03)
    }

    // Contextual extras
    if (tableId.indexOf("library") !== -1) {
        modifier.addLoot("create:schematic").randomChance(0.12)
    }
    if (
        tableId.indexOf("tools") !== -1 ||
        tableId.indexOf("blacksmith") !== -1 ||
        tableId.indexOf("armory") !== -1
    ) {
        modifier.addLoot("create:wrench").randomChance(0.10)
    }
}

function addNorthstarSpaceFlavor(modifier, tableId) {
    modifier.addLoot("northstar:liquid_oxygen_bucket").randomChance(0.20)
    modifier.addLoot("northstar:lunar_sapphire_shard").randomChance(0.25)
    modifier.addLoot("northstar:circuit").randomChance(0.18)
    modifier.addLoot("northstar:titanium_nugget").randomChance(0.22)

    if (tableId.indexOf("martian_base") !== -1) {
        modifier.addLoot("northstar:martian_steel").randomChance(0.20)
        modifier.addLoot("northstar:advanced_circuit").randomChance(0.08)
    }

    if (tableId.indexOf("seed_chest") !== -1) {
        modifier.addLoot("northstar:dormant_martian_seed").randomChance(0.30)
        modifier.addLoot("northstar:dormant_martian_sapling").randomChance(0.18)
        modifier.addLoot("northstar:martian_strawberry").randomChance(0.26)
    }
}

function tierForTable(id) {
    if (hasKey(id, HIGH_TIER_KEYS)) return 3
    if (hasKey(id, MID_TIER_KEYS)) return 2
    return 1
}

function applyVillageThemeCrops(event, tableId, crops) {
    // Farming/living chests get higher crop chances
    const isAgricultural = (
        tableId.indexOf("farmhouse") !== -1 ||
        tableId.indexOf("kitchen") !== -1 ||
        tableId.indexOf("food") !== -1 ||
        tableId.indexOf("village") !== -1
    )

    let modifier = event.addLootTableModifier(tableId)
    crops.forEach((crop, index) => {
        const chance = isAgricultural ? (0.18 - index * 0.02) : (0.10 - index * 0.015)
        if (chance > 0.02) {
            modifier.addLoot(crop).randomChance(chance)
        }
    })
}

const VILLAGE_THEME_CROPS = {
    "airship_village": ["createcafe:coffee_beans", "create_bic_bit:sunflower_seeds", "supplementaries:flax_seeds"],
    "cabin_village": ["vintagedelight:oat_seeds", "minecraft:pumpkin_seeds", "minecraft:beetroot_seeds"],
    "clockwork_village": ["create_bic_bit:sunflower_seeds", "frycooks_delight:canola_seeds", "minecraft:wheat_seeds"],
    "kutcha_village": ["festival_delicacies:garlic_chive_seeds", "festival_delicacies:eggplant_seeds", "culturaldelights:cucumber_seeds"],
    "marketstead_village": ["farmersdelight:cabbage_seeds", "farmersdelight:tomato_seeds", "corn_delight:corn_seeds"],
    "mediterranean_village": ["vinery:red_grape_seeds", "vinery:white_grape_seeds", "culturaldelights:avocado_pit"],
    "minka_village": ["createdelight:adzuki_beans_seed", "festival_delicacies:chinese_cabbage_seeds", "festival_delicacies:fennel_seeds"],
    "mossy_mounds": ["supplementaries:flax_seeds", "collectorsreap:pomegranate_seeds", "collectorsreap:lime_seeds"],
    "oasis_village": ["createcafe:cassava_seeds", "collectorsreap:lime_seeds", "culturaldelights:cucumber_seeds"],
    "pirate_village": ["corn_delight:corn_seeds", "frycooks_delight:canola_seeds", "minecraft:melon_seeds"],
    "swamp_village": ["culturaldelights:eggplant_seeds", "festival_delicacies:fennel_seeds", "neapolitan:strawberry_pips"],
    "tavern_village": ["frycooks_delight:canola_seeds", "vintagedelight:cucumber_seeds", "farmersdelight:rice"]
}

LootJS.modifiers(event => {
    // 1) IDAS richness boost
    IDAS_CHEST_TABLES.forEach(id => {
        let modifier = event.addLootTableModifier(id)
        const tier = tierForTable(id)
        addIdasStyleWealth(modifier, tier)
        addCreateTechLoot(modifier, tier, id)
    })

    // 2) Dungeon/outpost tables tuned toward IDAS style
    //    (integrated stronghold and kaisyn outpost)
    INTEGRATED_STRONGHOLD_TABLES.forEach(id => {
        let modifier = event.addLootTableModifier(id)
        const tier = Math.max(2, tierForTable(id))
        addIdasStyleWealth(modifier, tier)
        addCreateTechLoot(modifier, tier, id)
    })

    KAISYN_TABLES
        .filter(id => id.indexOf("/outpost/") !== -1)
        .forEach(id => {
            let modifier = event.addLootTableModifier(id)
            addIdasStyleWealth(modifier, 2)
            modifier.addLoot("minecraft:crossbow").randomChance(0.06)
        })

    // 3) Add theme crops for integrated villages
    Object.keys(VILLAGE_THEME_CROPS).forEach(theme => {
        INTEGRATED_VILLAGE_TABLES
            .filter(id => id.indexOf(`/chests/${theme}/`) !== -1)
            .forEach(id => applyVillageThemeCrops(event, id, VILLAGE_THEME_CROPS[theme]))
    })

    // Extra boost for higher-tier village chests
    INTEGRATED_VILLAGE_TABLES
        .filter(id => id.indexOf("_treasure") !== -1 || id.indexOf("_tomb") !== -1)
        .forEach(id => {
            let modifier = event.addLootTableModifier(id)
            addIdasStyleWealth(modifier, 2)
            addCreateTechLoot(modifier, 2, id)
        })

    // 4) Space structure tuning (Northstar baseline, applied to other space tables too)
    NORTHSTAR_CHEST_TABLES.forEach(id => {
        let modifier = event.addLootTableModifier(id)
        addIdasStyleWealth(modifier, 2)
        addCreateTechLoot(modifier, 2, id)
        addNorthstarSpaceFlavor(modifier, id)
    })

    SPACE_STRUCTURE_TABLES
        .filter(id => id.indexOf("northstar:") === -1)
        .forEach(id => {
            let modifier = event.addLootTableModifier(id)
            addNorthstarSpaceFlavor(modifier, id)
        })
})
