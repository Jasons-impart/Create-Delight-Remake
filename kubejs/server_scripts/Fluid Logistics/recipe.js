ServerEvents.recipes(e => {
    remove_recipes_id(e, [
        "fluidlogistics:multi_fluid_tank",
        "fluidlogistics:horizontal_multi_fluid_tank"
    ])
    e.replaceInput({ id: "fluidlogistics:fluid_packager" }, "minecraft:copper_ingot", "create:copper_sheet")
})