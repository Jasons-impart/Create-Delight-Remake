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
    cutting(e, 'crabbersdelight:clam', [
        ['crabbersdelight:raw_clam_meat'],
        ['crabbersdelight:pearl', 3, 0.5]
    ])
    cutting(e, 'minecraft:pufferfish', [
        ['crabbersdelight:pufferfish_slice', 2],
        ["minecraft:bone_meal"]
    ])
    cutting(e, 'minecraft:tropical_fish', [
        ['crabbersdelight:tropical_fish_slice', 2],
        ["minecraft:bone_meal"]
    ])
    cutting(e, 'crabbersdelight:cooked_tropical_fish', [
        ['crabbersdelight:cooked_tropical_fish_slice', 2],
        ["minecraft:bone_meal"]
    ])
})