ServerEvents.tags("item", e => {
    e.add("forge:iron_series", [
        "minecraft:raw_iron",
        "create:crushed_raw_iron",
        "create:iron_sheet",
        "minecraft:iron_ingot",
        "minecraft:deepslate_iron_ore",
        "minecraft:iron_ore"
    ])
})
ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "createbigcannons:compacting/forge_nethersteel_nugget"
    ])
})