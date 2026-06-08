ServerEvents.recipes(e => {
    const { createmetallurgy, create, minecraft, vintageimprovements, kubejs } = e.recipes

    remove_recipes_id(e, [
        "fluidlogistics:multi_fluid_tank",
        "fluidlogistics:horizontal_multi_fluid_tank",
        "fluidlogistics:mechanical_fluid_gun",
        "fluidlogistics:faucet",
        "fluidlogistics:fluid_transporter",
        "fluidlogistics:multi_fluid_access_port_h",
        "fluidlogistics:multi_fluid_access_port"
    ])

    e.replaceInput({id: "fluidlogistics:copper_basin"}, "minecraft:copper_ingot", "create:copper_sheet")
    e.replaceInput({id: "fluidlogistics:fluid_pump"}, "create:cogwheel", "create:fluid_pipe")
    e.replaceInput({id: "fluidlogistics:fluid_transporter"}, "create:brass_ingot", "create:brass_sheet")
    e.replaceInput({id: "fluidlogistics:mechanical_crafting/infinite_fluid_tank"}, "minecraft:netherite_ingot", "northstar:martian_steel_sheet")
    e.replaceInput({id: "fluidlogistics:mechanical_crafting/infinite_fluid_tank"}, "create:railway_casing", "ae2:spatial_io_port")
    e.replaceInput({id: "fluidlogistics:mechanical_crafting/infinite_fluid_tank"}, "create:sturdy_sheet", "createdelight:space_casing")
    e.replaceInput({id: "fluidlogistics:smart_faucet"}, "minecraft:copper_ingot", "fluidlogistics:faucet")

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

    kubejs.shaped("2x fluidlogistics:faucet", [
        " A ",
        "BCB",
        " D "
    ], {
        A: "create:copper_valve_handle",
        B: "create:copper_sheet",
        C: "#forge:spring/below_500",
        D: "minecraft:dried_kelp",
    }).id("createdelight:faucet")

    kubejs.shaped("fluidlogistics:fluid_transporter", [
        " A ",
        "BCB",
        " A "
    ], {
        A: "create:brass_funnel",
        B: "create:mechanical_pump",
        C: "create_sa:hydraulic_engine"
    }).id("createdelight:fluid_transporter")

    let tank = Ingredient.of([
        "fluidlogistics:multi_fluid_tank",
        "fluidlogistics:horizontal_multi_fluid_tank"
    ])
    kubejs.shaped("fluidlogistics:multi_fluid_access_port", [
        " A ",
        "BCB",
        " B "
    ], {
        A: "create:copper_sheet",
        B: "create:smart_fluid_pipe",
        C: tank
    }).id("createdelight:multi_fluid_access_port")
})