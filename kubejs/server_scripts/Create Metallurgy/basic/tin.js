ServerEvents.tags("item", e => {
    e.add("balm:ingots", "createdelight:tin_ingot")
    e.add("forge:ingots/tin", "createdelight:tin_ingot")
    e.add("forge:ingots", "createdelight:tin_ingot")
    e.add("balm:nuggets", "createdelight:tin_nugget")
    e.add("forge:nuggets/tin", "createdelight:tin_nugget")
    e.add("forge:nuggets", "createdelight:tin_nugget")
    e.add("forge:raw_materials/tin", "createdelight:raw_tin")
    e.add("forge:raw_materials", "createdelight:raw_tin")
})
ServerEvents.tags("block", e => {
    e.add("c:ores", [
        "createdelight:tin_ore",
        "createdelight:deepslate_tin_ore"
    ])
    e.add("forge:ores", [
        "createdelight:tin_ore",
        "createdelight:deepslate_tin_ore"
    ])
    e.add("forge:ores/tin", [
        "createdelight:tin_ore",
        "createdelight:deepslate_tin_ore"
    ])
    e.add("forge:ores_in_ground/stone", "createdelight:tin_ore")
    e.add("forge:ores_in_ground/deepslate", "createdelight:tin_ore")
    e.add("forge:ore_rates/dense", [
        "createdelight:tin_ore",
        "createdelight:deepslate_tin_ore"
    ])
    e.add("forge:storage_blocks/tin", "createdelight:tin_block")
    e.add("forge:storage_blocks/raw_tin", "createdelight:raw_tin_block")
    e.add("forge:storage_blocks", [
        "createdelight:tin_block",
        "createdelight:raw_tin_block"
    ])
    e.add("minecraft:overworld_carver_replaceables", [
        "createdelight:tin_ore",
        "createdelight:deepslate_tin_ore",
        "createdelight:raw_tin_block"
    ])
})
ServerEvents.recipes(e => {
    package_item(e, "createdelight:raw_tin", "createdelight:raw_tin_block", 9)
    metal_production_line(e, [
        "createdelight:tin_block",
        "createdelight:tin_ingot",
        "createdelight:tin_nugget",
        "vintageimprovements:tin_sheet",
        "createdelight:molten_tin"
    ], "heated", 40)
    blast_and_smelting(e, "createdelight:tin_ore", "createdelight:tin_ingot", 0.1, 100)
    blast_and_smelting(e, "createdelight:deepslate_tin_ore", "createdelight:tin_ingot", 0.7, 100)
    blast_and_smelting(e, "createdelight:raw_tin", "createdelight:tin_ingot", 0.7, 100)
    blast_and_smelting(e, "create:crushed_raw_tin", "createdelight:tin_ingot", 0.7, 100)
    blast_and_smelting(e, "createdelight:raw_tin_block", "createdelight:tin_block", 6.3, 900)
    crushing_ore(e, "createdelight:tin_ore", "create:crushed_raw_tin", 5, "minecraft:cobblestone")
    crushing_ore(e, "createdelight:deepslate_tin_ore", "create:crushed_raw_tin", 7, "minecraft:cobbled_deepslate")
    e.recipes.create.crushing(
        [
            "9x create:crushed_raw_tin",
            Item.of("9x create:experience_nugget").withChance(0.75)
        ],
        "createdelight:raw_tin_block"
    ).id("createdelight:crushing/raw_tin_block")
    e.recipes.create.splashing(
        [
            "9x createdelight:tin_nugget",
            Item.of("minecraft:glowstone_dust").withChance(0.5)
        ], "create:crushed_raw_tin"
    ).id("createdelight:splashing/crushed_raw_tin")
    e.recipes.create.milling(
        [
            "createdelight:dirty_tin_dust",
            Item.of("createdelight:dirty_tin_dust").withChance(0.25)
        ], "create:crushed_raw_tin"
    ).id("createmetallurgy:milling/crushed_raw_tin")
    e.recipes.create.splashing(
        [
            "createdelight:tin_dust",
            Item.of("minecraft:glowstone_dust").withChance(0.5)
        ], "createdelight:dirty_tin_dust"
    ).id("createdelight:splashing/dirty_tin_dust")
    e.recipes.createmetallurgy.melting(
        Fluid.of("createdelight:molten_tin", 90),
        "createdelight:dirty_tin_dust",
        "heated",
        20
    ).id("createmetallurgy:melting/dirty_tin_dust")
    e.recipes.createmetallurgy.melting(
        Fluid.of("createdelight:molten_tin", 120),
        "createdelight:tin_dust",
        "heated",
        20
    ).id("createmetallurgy:melting/tin_dust")

    
    metal_production_line_5(e, 
        [
            "createdelight:dirty_tin_dust",
            "createdelight:tin_dust",
            "create:crushed_raw_tin",
            "createdelight:raw_tin",
            "createdelight:tin_nugget"
        ]
    )

})