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
    package_item(e, "culturaldelights:glow_squid", "crabbersdelight:glow_squid_barrel", 9)
    cutting(e, "crabbersdelight:clam", [
        ["crabbersdelight:clam"],
        ["crabbersdelight:pearl", 5, 0.5]
    ])
    cutting(e, "minecraft:pufferfish", [
        ["crabbersdelight:pufferfish_slice", 2],
        ["minecraft:bone_meal"]
    ])
    cutting(e, "minecraft:tropical_fish", [
        ["crabbersdelight:tropical_fish_slice", 2],
        ["minecraft:bone_meal"]
    ])
    cutting(e, "crabbersdelight:cooked_tropical_fish", [
        ["crabbersdelight:cooked_tropical_fish_slice", 2],
        ["minecraft:bone_meal"]
    ])
})