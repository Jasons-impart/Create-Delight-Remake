ServerEvents.tags("minecraft:block", e => {
    e.removeAll("northstar:tier_1_heat_resistance")
    e.removeAll("northstar:tier_2_heat_resistance")
    e.removeAll("northstar:tier_3_heat_resistance")
    e.add("northstar:tier_1_heat_resistance",
        [
            'northstar:tungsten_block',
            'northstar:tungsten_sheetmetal',
            'northstar:tungsten_plating',
            'northstar:tungsten_pillar'])
    e.add("northstar:tier_2_heat_resistance",
        [
            'northstar:titanium_sheetmetal',
            'northstar:titanium_plating',
            'northstar:titanium_pillar'])
    e.add("northstar:tier_3_heat_resistance",
        [
            'northstar:martian_steel_sheetmetal',
            'northstar:martian_steel_plating',
            'northstar:martian_steel_pillar',
            'northstar:martian_steel_blue_lamp',
            'northstar:martian_steel_lamp',
            'northstar:martian_steel_large_plating'])
})

ServerEvents.tags("minecraft:item", e => {
    e.add("northstar:heat_resistant",
        [
            'minecraft:netherite_helmet',
            'minecraft:netherite_chestplate',
            'minecraft:netherite_boots',
            'create_jetpack:netherite_jetpack',
            'create_sa:netherite_jetpack_chestplate',
            'iceandfire:dragonsteel_ice_helmet',
            'iceandfire:dragonsteel_ice_chestplate',
            'iceandfire:dragonsteel_ice_leggings',
            'iceandfire:dragonsteel_ice_boots'])
    e.add("northstar:insulating",
        [
            'iceandfire:dragonsteel_fire_helmet',
            'iceandfire:dragonsteel_fire_chestplate',
            'iceandfire:dragonsteel_fire_leggings',
            'iceandfire:dragonsteel_fire_boots'])
})

const europanAbyssalEntities = [
    "alexscaves:deep_one",
    "alexscaves:deep_one_knight",
    "alexscaves:deep_one_mage",
    "alexscaves:gossamer_worm",
    "alexscaves:hullbreaker",
    "alexscaves:lanternfish",
    "alexscaves:mine_guardian",
    "alexscaves:sea_pig",
    "alexscaves:tripodfish",
    "minecraft:dolphin",
    "minecraft:squid"
]

const cataclysmDeeplingEntities = [
    "cataclysm:deepling",
    "cataclysm:deepling_brute",
    "cataclysm:deepling_angler",
    "cataclysm:deepling_priest",
    "cataclysm:deepling_warlock"
]

const lunarFarsideEntities = [
    "minecraft:bat",
    "minecraft:warden",
    "alexscaves:gloomoth",
    "alexscaves:underzealot",
    "alexscaves:corrodent",
    "alexscaves:vesper",
    "alexscaves:watcher",
    "alexscaves:forsaken"
]

const cataclysmLunarFactoryEntities = [
    "cataclysm:the_harbinger",
    "cataclysm:the_prowler",
    "cataclysm:the_watcher"
]

const cataclysmMartianBlacksmithEntities = [
    "cataclysm:netherite_ministrosity",
    "cataclysm:netherite_monstrosity"
]

const cataclysmMercuryArenaEntities = [
    "cataclysm:ignis",
    "cataclysm:ignited_revenant",
    "minecraft:blaze"
]

const cataclysmVenusPyramidEntities = [
    "cataclysm:koboleton",
    "cataclysm:wadjet",
    "cataclysm:kobolediator",
    "cataclysm:ancient_remnant"
]

const cataclysmEuropanPrisonEntities = [
    "cataclysm:aptrgangr",
    "cataclysm:draugr",
    "cataclysm:elite_draugr",
    "cataclysm:royal_draugr",
    "cataclysm:maledictus"
]

const cataclysmEuropanLeviathanEntities = [
    "cataclysm:the_leviathan"
]

ServerEvents.tags("entity_type", e => {
    e.add("northstar:can_survive_cold",
        "#createdelight:can_survive_northstar"
    )
    e.add("northstar:can_survive_cold", europanAbyssalEntities)
    e.add("northstar:can_survive_cold", cataclysmDeeplingEntities)
    e.add("northstar:can_survive_cold", lunarFarsideEntities)
    e.add("northstar:can_survive_cold", cataclysmLunarFactoryEntities)
    e.add("northstar:can_survive_cold", cataclysmMartianBlacksmithEntities)
    e.add("northstar:can_survive_cold", cataclysmMercuryArenaEntities)
    e.add("northstar:can_survive_cold", cataclysmEuropanPrisonEntities)
    e.add("northstar:can_survive_cold", cataclysmEuropanLeviathanEntities)
    e.add("northstar:can_survive_heat",
        "#createdelight:can_survive_northstar"
    )
    e.add("northstar:can_survive_heat", cataclysmMercuryArenaEntities)
    e.add("northstar:can_survive_heat", cataclysmVenusPyramidEntities)
    e.add("northstar:doesnt_require_oxygen",
        "#createdelight:can_survive_northstar"
    )
    e.add("northstar:doesnt_require_oxygen", europanAbyssalEntities)
    e.add("northstar:doesnt_require_oxygen", cataclysmDeeplingEntities)
    e.add("northstar:doesnt_require_oxygen", lunarFarsideEntities)
    e.add("northstar:doesnt_require_oxygen", cataclysmLunarFactoryEntities)
    e.add("northstar:doesnt_require_oxygen", cataclysmMartianBlacksmithEntities)
    e.add("northstar:doesnt_require_oxygen", cataclysmMercuryArenaEntities)
    e.add("northstar:doesnt_require_oxygen", cataclysmVenusPyramidEntities)
    e.add("northstar:doesnt_require_oxygen", cataclysmEuropanPrisonEntities)
    e.add("northstar:doesnt_require_oxygen", cataclysmEuropanLeviathanEntities)
    e.add("createdelight:can_survive_northstar", [
        "iceandfire:mob_skull",
        "iceandfire:cyclops",
        "minecraft:sheep",     
        "minecraft:chicken",
        "iceandfire:gorgon",
        "iceandfire:deathworm",
        "iceandfire:cockatrice",
        "iceandfire:myrmex_egg",
        "iceandfire:myrmex_queen",
        "iceandfire:myrmex_royal",
        "iceandfire:myrmex_sentinel",
        "iceandfire:myrmex_soldier",
        "iceandfire:myrmex_swarmer",
        "iceandfire:myrmex_worker",
        "iceandfire:dragon_egg",
        "iceandfire:dragon_skull",
        "iceandfire:fire_dragon",
        "iceandfire:ice_dragon",
        "iceandfire:lightning_dragon",
        "iceandfire:stymphalian_bird",
        "iceandfire:amphithere",
        "iceandfire:hydra",
        "iceandfire:lightning_dragon",
        "alexsmobs:cosmic_cod",
        "alexscaves:teletor",
        "alexscaves:magnetron",
        "alexscaves:boundroid",
        "alexscaves:boundroid_winch",
        "alexscaves:ferrouslime",
        "alexscaves:notor",
        "alexscaves:nucleeper",
        "alexscaves:radgill",
        "alexscaves:brainiac",
        "alexscaves:raycat",
        "alexscaves:gammaroach",
        "alexscaves:tremorzilla"
    ])
})
