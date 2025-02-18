ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "crabbersdelight:lanternfish_from_barrel",
        "crabbersdelight:lanternfish_barrel"

    ])
    remove_recipes_output(e, [
        "crabbersdelight:raw_squid_tentacles",
        "crabbersdelight:raw_glow_squid_tentacles"
    ])
    remove_recipes_input(e, [
        "crabbersdelight:raw_squid_tentacles",
        "crabbersdelight:raw_glow_squid_tentacles"
    ])
    e.replaceInput({ id: "crabbersdelight:squid_kebob" }, "crabbersdelight:cooked_squid_tentacles", "culturaldelights:cooked_calamari")
    e.replaceInput({id: "crabbersdelight:coral_crunch"}, "farmersdelight:milk_bottle", "#forge:milk/milk_bottle")
    package_item(e, "culturaldelights:squid", "crabbersdelight:squid_barrel", 9)
    package_item(e, "culturaldelights:glow_squid", "crabbersdelight:glow_squid_barrel", 9)
})