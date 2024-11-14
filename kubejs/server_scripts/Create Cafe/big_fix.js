ServerEvents.recipes(e => {
    remove_recipes_output(e, [
        "createcafe:oreo_dough"
    ])
    const {create} = e.recipes
    create.mixing("createcafe:oreo_dough", [
        "create:wheat_flour",
        "ratatouille:cocoa_powder",
        Fluid.water(250)
    ])
    .id("createcafe:mixing/oreo_dough_mixing")
})