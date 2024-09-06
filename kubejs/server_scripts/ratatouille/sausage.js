ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "butchercraft:sausage_linked",
        "butchercraft:ground_beef_to_sausage",
        "butchercraft:sausage_to_block",
        "butchercraft:cooked_sausage_to_block",
        "mynethersdelight:crafting/hotdog"
    ])
    remove_recipes_output(e, [
        "butchercraft:sausage",
        "butchercraft:cooked_sausage",
        "mynethersdelight:hoglin_sausage",
        "mynethersdelight:roasted_sausage"
    ])
    e.replaceInput({ id: "mynethersdelight:crafting/breakfast_sampler" }, "mynethersdelight:roasted_sausage", "#forge:sausage/cooked")
    e.replaceInput({ id: "mynethersdelight:cooking/sausage_and_potatoes" }, "mynethersdelight:hoglin_sausage", "ratatouille:raw_sausage")
    e.replaceInput({ id: "mynethersdelight:crafting/hotdog" }, "mynethersdelight:roasted_sausage", "#forge:sausage/cooked")
    e.recipes.kubejs.shapeless(
        "mynethersdelight:hotdog",
        [
            "ratatouille:sausage",
            "#forge:bread"
        ]
    ).id("mynethersdelight:hotdog")
})
