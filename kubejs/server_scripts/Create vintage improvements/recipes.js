ServerEvents.recipes(e => {
    e.replaceInput({ mod: "vintageimprovements" }, "vintageimprovements:iron_spring", "#forge:spring/between_500_2_1000")
    e.replaceInput({ id: "vintageimprovements:pressurizing/sulfur_dioxide"}, "vintageimprovements:sulfur", "alexscaves:sulfur_dust")
    e.recipes.kubejs.shaped(
        "create_enchantment_industry:printer", [
        "ABA",
        " C ",
        " D "
    ], {
        A: "#forge:spring/below_500",
        B: "create:copper_casing",
        C: "minecraft:dried_kelp",
        D: "#createbigcannons:sheet_iron"
    }).id("create_enchantment_industry:crafting/printer")
})
