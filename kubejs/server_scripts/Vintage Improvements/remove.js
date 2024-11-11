ServerEvents.recipes(e => {
    const {vintageimprovements} = e.recipes
    e.remove({output: '#vintageimprovements:small_springs'})
    remove_recipes_id(e, [
        "vintageimprovements:pressurizing/sulfur_trioxide"
    ])
    vintageimprovements.pressurizing(
        Fluid.of("vintageimprovements:sulfur_trioxide", 1000),
    [
        Fluid.of("vintageimprovements:sulfur_dioxide", 1000),
        "vintageimprovements:vanadium_nugget"
    ])
    .secondaryFluidOutput(0)
    .superheated()
    .id("vintageimprovements:pressurizing/sulfur_trioxide")
    
})