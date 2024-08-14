ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "createaddition:compacting/cake_base",
        "createaddition:smoking/cake_base_baked",
        "createaddition:compacting/seed_oil",
        "createaddition:mixing/bioethanol",
        "createaddition:crafting/capacitor_2",
        "createaddition:crafting/capacitor_1",
        "createaddition:rolling/brass_ingot",
        "createaddition:crafting/accumulator_conversion",
        "createaddition:crafting/large_connector_gold",
        "createaddition:crafting/modular_accumulator_gold"
    ])
    remove_recipes_input(e, [
        "createaddition:cake_base_baked"
    ])
    // 电容合成
    e.recipes.minecraft.crafting_shaped("createaddition:capacitor", [
            " A ",
            " B ",
            " C "
        ], {
            A:'create:copper_sheet',
            B:'createaddition:zinc_sheet',
            C:'createaddition:copper_rod'
        }
    ).id("createaddition:crafting/capacitor")
    // 连接器合成
    e.recipes.kubejs.shapeless(
        "2x createaddition:large_connector",
        [
            "#forge:rods/electric",
            "create:andesite_alloy",
            "create:andesite_alloy",
            "forge:slimeballs"
        ]
    ).id("createaddition:crafting/large_connector_electrum")
    // 电池合成
    let iner = 'createdelight:incompleted_modular_accumulator'
    e.recipes.create.sequenced_assembly('createaddition:modular_accumulator', 'create:brass_sheet', [
        e.recipes.create.deploying(iner, [iner, '#forge:wires/electric']),
        e.recipes.create.deploying(iner, [iner, 'createaddition:capacitor'])
    ])
    .transitionalItem(iner)
    .loops(6)
    .id("createaddition:crafting/modular_accumulator_electrum")
})