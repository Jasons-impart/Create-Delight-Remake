ServerEvents.recipes(e => {
    const { createmetallurgy, create, minecraft, vintageimprovements, kubejs } = e.recipes

    remove_recipes_id(e, [
        "fluidlogistics:multi_fluid_tank",
        "fluidlogistics:horizontal_multi_fluid_tank",
        "fluidlogistics:mechanical_fluid_gun"
    ])

    e.replaceInput({id: "fluidlogistics:copper_basin"}, "minecraft:copper_ingot", "create:copper_sheet")
    e.replaceInput({id: "fluidlogistics:fluid_pump"}, "create:cogwheel", "create:fluid_pipe")
    e.replaceInput({id: "fluidlogistics:fluid_transporter"}, "create:brass_ingot", "create:brass_sheet")
    e.replaceInput({id: "fluidlogistics:mechanical_crafting/infinite_fluid_tank"}, "minecraft:netherite_ingot", "northstar:martian_steel")
    e.replaceInput({id: "fluidlogistics:mechanical_crafting/infinite_fluid_tank"}, "create:railway_casing", "createdelight:space_casing")

    kubejs.shaped("fluidlogistics:mechanical_fluid_gun", [
        "AAB",
        "AC ",
        "DE "
    ], {
        A: "create:copper_sheet",
        B: "create:spout",
        C: "#forge:spring/between_500_2_1000",
        D: "create_sa:hydraulic_engine",
        E: "create:copper_casing"
    }).id("createdelight:mechanical_fluid_gun")
})