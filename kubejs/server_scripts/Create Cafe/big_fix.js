ServerEvents.recipes(e => {
    remove_recipes_output(e, [
        "createcafe:oreo_dough"
    ])
    remove_recipes_id(e , [
        "createcafe:mixing/sugar_melting"
    ])
    const {create} = e.recipes
    create.mixing("createcafe:oreo_dough", [
        "bakeries:flour",
        "ratatouille:cocoa_powder",
        Fluid.water(250)
    ])
    .id("createcafe:mixing/oreo_dough_mixing")
})