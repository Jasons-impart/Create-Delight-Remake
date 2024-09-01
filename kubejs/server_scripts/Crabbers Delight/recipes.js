ServerEvents.recipes(e => {
    remove_recipes_output(e, [
        "crabbersdelight:raw_squid_tentacles",
        "crabbersdelight:raw_glow_squid_tentacles"
    ])
    remove_recipes_input(e, [
        "crabbersdelight:raw_squid_tentacles",
        "crabbersdelight:raw_glow_squid_tentacles"
    ])
    e.replaceInput({ id: "crabbersdelight:squid_kebob" }, "crabbersdelight:cooked_squid_tentacles", "culturaldelights:cooked_calamari")
    package_item(e, "culturaldelights:squid", "crabbersdelight:squid_barrel", 9)
})