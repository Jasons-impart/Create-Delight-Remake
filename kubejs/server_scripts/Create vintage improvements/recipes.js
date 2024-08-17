ServerEvents.recipes(e => {
    e.recipes.kubejs.shaped(
        "vintageimprovements:vibrating_table", [
            "ABA",
            "ACA"
        ], {
            A: "#forge:spring/between_500_2_1000",
            B: "#minecraft:wooden_slabs",
            C: "create:mechanical_piston"
        }
    ).id("vintageimprovements:craft/vibrating_table")
    e.recipes.kubejs.shapeless(
        "create:weighted_ejector",
        [
            "#forge:spring/between_500_2_1000",
            "create:depot",
            "create:cogwheel"
        ]
    ).id("create:crafting/kinetics/weighted_ejector")
    e.recipes.kubejs.shapeless(
        "3x create:portable_storage_interface",
        [
            "#forge:spring/blow_500",
            "create:andesite_casing",
            "create:chute"
        ]
    ).id("create:crafting/kinetics/portable_storage_interface")
    e.recipes.kubejs.shapeless(
        "create:portable_fluid_interface",
        [
            "#forge:spring/blow_500",
            "create:copper_casing",
            "create:chute"
        ]
    ).id("create:crafting/kinetics/portable_fluid_interface")
    e.recipes.kubejs.shaped(
        "create:spout", [
            "ABA",
            " C "
        ], {
            A: "#forge:spring/blow_500",
            B: "create:copper_casing",
            C: "minecraft:dried_kelp"
        }
    ).id("create:crafting/kinetics/spout")
    e.recipes.kubejs.shaped(
        "create_enchantment_industry:printer", [
            "ABA",
            " C ",
            " D "
        ], {
            A: "#forge:spring/blow_500",
            B: "create:copper_casing",
            C: "minecraft:dried_kelp",
            D: "#createbigcannons:sheet_iron"
        }
    ).id("create_enchantment_industry:crafting/printer")
    
    e.recipes.kubejs.shaped(
        "3x create:steam_engine", [
            " A ",
            " B ",
            "DC "
        ], {
            A: "create:shaft",
            B: "#forge:spring/between_500_2_1000",
            C: "minecraft:copper_block",
            D: "create_sa:steam_engine"
        }
    ).id("create:crafting/kinetics/steam_engine")
    e.recipes.kubejs.shaped(
        "create:steam_whistle", [
            " A ",
            " B ",
            " C "
        ], {
            A: "create:golden_sheet",
            B: "#forge:spring/blow_500",
            C: "minecraft:copper_ingot"
        }
    ).id("create:crafting/kinetics/steam_whistle")
    e.recipes.kubejs.shaped(
        "create:mechanical_arm", [
            "AAB",
            "AC ",
            "DE "
        ], {
            A: "create:brass_sheet",
            B: "create:andesite_alloy",
            C: "#forge:spring/between_500_2_1000",
            D: "create:precision_mechanism",
            E: "create:brass_casing"
        }
    ).id("create:crafting/kinetics/mechanical_arm")
})