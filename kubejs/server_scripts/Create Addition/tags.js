ServerEvents.tags("item", e => {
    e.add("forge:wires/electric", [
        "createaddition:electrum_wire",
        "createaddition:gold_wire",
        "vintageimprovements:silver_wire"
    ])
    e.add("forge:rods/electric", [
        "createaddition:electrum_rod",
        "createaddition:gold_rod",
        "vintageimprovements:silver_rod"
    ])
    e.add("forge:ingots/electric", [
        "createaddition:electrum_ingot",
        "minecraft:gold_ingot",
        "iceandfire:silver_ingot"
    ])
    e.add("curios:bracelet", [
        'createaddition:electrum_amulet'
    ])
})
ServerEvents.tags("fluid", e => {
    e.removeAllTagsFrom("createaddition:seed_oil")
})
ServerEvents.tags("block", e => {
    e.add("minecraft:mineable/pickaxe", [
        'createaddition:electrum_block',
        'createaddition:superconducting_connector'
    ])
    e.add("minecraft:needs_iron_tool", [
        'createaddition:electrum_block',
        'createaddition:superconducting_connector'
    ])
})