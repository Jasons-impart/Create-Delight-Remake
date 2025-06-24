ServerEvents.recipes(e => {
    e.remove({ type: "createaddition:liquid_burning" })
    e.remove({ id: "createaddition:rolling/straw" })
    remove_recipes_id(e, [
        "createaddition:liquid_burning/gasoline",
        "createaddition:liquid_burning/biodiesel",
        "createaddition:liquid_burning/ethanol",
        "createaddition:liquid_burning/diesel",
        "createaddition:liquid_burning/plantoil",
        "createaddition:liquid_burning/biofuel",
        "createaddition:liquid_burning/lava",
        "createaddition:liquid_burning/crude_oil",
    ])
})
