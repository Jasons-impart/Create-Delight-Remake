ServerEvents.tags("item", e => {
    e.add("forge:wires/electric", [
        'createaddition:electrum_wire',
        'createaddition:gold_wire'
    ])
    e.add("forge:rods/electric", [
        'createaddition:electrum_rod',
        'createaddition:gold_rod'
    ])
    e.add("forge:ingots/electric", [
        'createaddition:electrum_ingot',
        'minecraft:gold_ingot'
    ])
})