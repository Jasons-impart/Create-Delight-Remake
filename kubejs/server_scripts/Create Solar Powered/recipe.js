ServerEvents.recipes(e => {
    const { createmetallurgy, create, minecraft, vintageimprovements, kubejs } = e.recipes

    remove_recipes_id(e, [
        "createsolar:sculk_panel",
        "createsolar:growth_lamp"
    ])

    e.replaceInput({id: "createsolar:solar_panel"}, "minecraft:amethyst_shard", "northstar:lunar_sapphire_shard")
    e.replaceInput({id: "createsolar:solar_panel"}, "create:brass_sheet", "northstar:martian_steel_sheet")

    kubejs.shaped("createsolar:sculk_panel", [
        "BAB",
        "DCD",
        "FEF"
    ], {
        A: "minecraft:daylight_detector",
        B: "minecraft:echo_shard",
        C: "minecraft:sculk_catalyst",
        D: "create:electron_tube",
        E: "minecraft:bucket",
        F: "minecraft:deepslate"
    }).id("createdelight:sculk_panel")
})